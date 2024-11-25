"use strict";
var InitPixel = function (args) {
	var queryString = this.getQueryString(),
		showcase = (this.showcase = true),
		forceName = args.imageName || window.location.hash.substr(1),
		slides = showcase ? this.showcaseSlides : this.slides,
		currentSlide = !forceName && slides[queryString.slide || 0],
		imageName = forceName || currentSlide.name || "tantalos",
		admin,
		sliders = queryString.sliders || currentSlide.sliders,
		socket = !showcase && window.io ? this.connectToIo() : false,
		div = args.div,
		canvasDataList = false, // change for multiple Canvases
		canvasRenderer =
			!currentSlide.staticImage &&
			this.createSingleCanvas(canvasDataList, div),
		callback,
		require = this.require[imageName],
		body = document.getElementsByTagName("body")[0],
		main = document.getElementById("main");

	this.defaultValues = { isServer: false };
	this.parent = queryString.admin || queryString.parent;

	if (currentSlide.resizeable) {
		queryString.resizeable = true;
	}

	// Admin
	if (queryString.admin || showcase || sliders) {
		admin = new window.Admin({
			body: body,
			showcase: showcase,
			admin: queryString.admin,
			sliders: sliders,
			slides: slides,
			pixel: this,
			socket: socket,
			hasRandom: currentSlide.hasRandom || false,
		});
	}

	callback = this.getCallback(
		canvasRenderer,
		queryString,
		imageName,
		socket,
		currentSlide,
		this.info(queryString),
	);

	if (currentSlide.staticImage) {
		this.getStaticImage(currentSlide, main);
	} else if (require) {
		this.loadMultipleScripts(callback, imageName, require);
	} else {
		this.loadScript(callback, imageName);
	}

	this.getDocumentTitle(imageName, queryString);
	window.onkeydown = this.getShortcuts(queryString);

	if (currentSlide.timer || queryString.timer) {
		this.timerAnimation = this.getTimerAnimation(currentSlide.timer);
	}
};

InitPixel.prototype.connectToIo = function () {
	var socket = (this.socket = window.io(
			window.location.protocol +
				"//" +
				window.location.host.split(":")[0],
		)),
		that = this;

	if (socket) {
		// get a unique Id for this socket
		socket.on("newId", function (data) {
			that.getNewId(data * 1, true);
		});

		socket.on("newValues", function (data, imageData) {
			that.addToQueryString(JSON.parse(data));
			that.receiveImageData(JSON.parse(imageData));
		});

		socket.on("redrawImage", function (imageData) {
			that.receiveImageData(JSON.parse(imageData));
		});

		socket.emit(
			"connected",
			JSON.stringify({
				name:
					"<span class='screensize'>" +
					window.screen.width +
					"/" +
					window.screen.height +
					"</span> " +
					navigator.platform,
				admin: that.queryString.admin,
			}),
		);

		return socket;
	} else {
		return false;
	}
};

InitPixel.prototype.getQueryString = function () {
	var list = {},
		vars = location.search.substr(1).split("&"),
		i = 0,
		l = vars.length,
		pair,
		convert = function (value) {
			if (value === "true") {
				value = true;
			} else if (value === "false") {
				value = false;
			} else {
				value = value * 1;
			}
			return value;
		};

	while (i < l) {
		pair = vars[i].split("=");
		if (pair[0]) {
			list[pair[0]] = convert(pair[1]);
		}
		i += 1;
	}

	// if( !list.slide ) { list.slide = "0"; }
	// else { list.slide = list.slide.toString(); }
	// if( !list.id ) { list.id = 666; }

	return (this.queryString = list);
};

// // If there is a List of Canvases, cycle through the list
// InitPixel.prototype.createMultipleCanvases = function ( canvasDataList, div ) {
// 	var canvasList = [],
// 		length = canvasDataList.length,
// 		i = length;

// 	while ( i -- ) {
// 		canvasList.push( this.createSingleCanvas( canvasDataList[ i ], div ) );
// 	}

// 	return function ( renderer ) {
// 		var i;

// 		i = length;

// 		while ( i -- ) {
// 			renderer.debug = i === 0;
// 			canvasList[ i ]( renderer );
// 		}
// 	};
// };

// Create a new Canvas, add it to the div and return it
InitPixel.prototype.createSingleCanvas = function (canvasData, div) {
	var canvas = document.createElement("canvas"),
		key;

	canvas.resize = true;
	canvas.keepalive = true;
	// canvas.style.position = "absolute";

	if (canvasData) {
		for (key in canvasData) {
			canvas.style[key] = canvasData[key];
		}
	}

	div.appendChild(canvas);

	return function (renderer) {
		return new window.PixelGraphics(renderer)(canvas);
	};
};

InitPixel.prototype.loadScript = function (callback, imageName) {
	var script = document.createElement("script"),
		head = document.getElementsByTagName("head")[0];

	script.type = "text/javascript";
	script.src = "scripts/" + imageName + ".js";

	script.onreadystatechange = callback;
	script.onload = callback;
	script.onerror = function () {
		throw imageName + " can not be loaded.";
	};

	head.appendChild(script);
};

InitPixel.prototype.loadMultipleScripts = function (
	callback,
	imageName,
	require,
) {
	var l = require.length,
		count = 0,
		loadFile = this.loadFile,
		head = document.getElementsByTagName("head")[0],
		loadNext = function () {
			if (count === l) {
				callback();
			} else {
				loadFile(require[count], head, loadNext);
				count += 1;
			}
		};

	loadNext();
};

InitPixel.prototype.loadFile = function (filePath, head, onLoadFunction) {
	var script = document.createElement("script");

	script.type = "text/javascript";
	script.src = filePath;

	script.onreadystatechange = onLoadFunction;
	script.onload = onLoadFunction;
	script.onerror = function () {
		throw filePath + " can not be loaded.";
	};

	head.appendChild(script);
};

// Create the Callback Function, when the script is loaded
InitPixel.prototype.getCallback = function (
	rendererInit,
	queryString,
	imageName,
	socket,
	currentSlide,
	info,
) {
	var that = this;
	return function callback() {
		var ImageFunction = window[imageName] || window.renderer, // use Function of the given imageName if it exists, else use the standard renderer
			imageFunction,
			renderObject;

		if (ImageFunction) {
			if (that.createSlider) {
				// that.createSlider.title( { title: "Image Size" } );
				// that.createSlider.slider( { niceName: "Width", valueName: "width", defaultValue: 1, input: { min: 0, max: 1, step: 0.02 } } );
				// that.createSlider.slider( { niceName: "Height", 	 valueName: "height", defaultValue: 1, input: { min: 0, max: 1, step: 0.02 } } );
			}

			imageFunction = new ImageFunction(
				queryString,
				currentSlide,
				that.createSlider,
			);

			that.hover = imageFunction.hover;

			renderObject = {
				showInfos: false,
				slide: currentSlide,
				imageFunction: imageFunction,
				queryString: queryString,
				pixelSize:
					(queryString.p || currentSlide.p || 7) * 1 +
					(queryString.pAdd ||
						imageFunction.recommendedPixelSize ||
						0) *
						1,
				socket: socket,
				sliderObject: that.sliderObject,
				sliderValues: that.sliderValues,
				info: info,
				defaultValues: that.defaultValues,
				init: that,
			};

			that.renderer = rendererInit(renderObject);

			if (that.timerAnimation) {
				that.timerAnimation();
			}
		} else {
			throw imageName + " was loaded but is not a function!";
		}
	};
};

InitPixel.prototype.info = function (options) {
	var logs = [],
		initString,
		d = document,
		body = d.getElementsByTagName("body")[0],
		info = d.createElement("div"),
		show = options.showInfos,
		swap = function () {
			if ((show = !show)) {
				body.appendChild(info);
			} else {
				body.removeChild(info);
			}
		},
		change = function (name, value) {
			logs[name] = value;
		};

	info.setAttribute("id", "infos");
	if (show) {
		body.appendChild(info);
	}

	document.onkeydown = function () {
		var k = event.keyCode;

		if (event.ctrlKey) {
			if (k === 73) {
				event.preventDefault();
				swap();
			}
		}
	};

	return {
		swap: swap,
		change: change,
		logInitTime: function (initTime) {
			initString = [
				"<span class='init' style='width:",
				initTime * 5,
				"px;'>",
				initTime,
				"ms<br>Init</span>",
			].join("");
		},
		logRenderTime: function (draw, fullDuration) {
			var what,
				lo = logs,
				render = fullDuration - draw,
				string = [];

			if (show) {
				change("Duration", fullDuration + "ms");
				change("fps", Math.floor(1000 / fullDuration) + "fps");
				change("Average-Time", "false");

				for (what in lo) {
					string.push(
						"<p><strong>",
						what,
						":</strong> ",
						lo[what],
						"</p>",
					);
				}

				string.push(
					"<p>",
					initString,
					"<span class='drawing' style='width:",
					draw * 5,
					"px;'>",
					draw,
					"ms<br>Drawing</span>",
					"<span style='width:",
					render * 5,
					"px;'>",
					render,
					"ms<br>Render</span>",
					"</p>",
				);

				info.innerHTML = string.join("");
			}
		},
	};
};

InitPixel.prototype.receiveImageData = function (imageData) {
	var d = this.defaultValues,
		key;

	if (this.renderer && this.renderer.redraw) {
		imageData.forceSliders = true;
		imageData.isServer = true;

		this.renderer.redraw(imageData);
	} else {
		for (key in imageData) {
			d[key] = imageData[key];
		}
	}
};

InitPixel.prototype.addToQueryString = function (newObj, dontRefresh) {
	var key,
		q = this.queryString,
		somethingChanged = false;

	for (key in newObj) {
		if (q[key] !== newObj[key]) {
			somethingChanged = true;
		}

		q[key] = newObj[key];
	}

	if (!dontRefresh && somethingChanged) {
		this.refresh();
	}
};

InitPixel.prototype.refresh = function (event) {
	var newString = [],
		key,
		q = this.queryString;

	if (event) {
		event.preventDefault();
	}

	for (key in q) {
		if (q[key] !== undefined) {
			newString.push(key + "=" + q[key]);
		}
	}

	if (this.socket) {
		this.socket.disconnect();
	}

	location.search = newString.join("&");
};

InitPixel.prototype.nextSlide = function (next) {
	var slide = this.queryString.slide;

	if (!slide) {
		slide = 0;
	}
	slide = slide * 1 + (next ? 1 : -1);

	if (slide > this.slides.length - 1) {
		slide = this.slides.length - 1;
	} else if (slide < 0) {
		slide = 0;
	}

	this.changeForceRedraw({ slide: slide });
};

InitPixel.prototype.getNewId = function (id, isServer) {
	this.changeForceRedraw(
		{ id: id || Math.floor(Math.random() * Math.pow(2, 32)) },
		isServer,
	);
};

InitPixel.prototype.seedNewId = function () {
	if (this.socket) {
		this.socket.emit("seedId");
	}
};

InitPixel.prototype.sliderChange = function (obj) {
	if (this.renderer) {
		this.renderer.redraw(obj);
	} else {
		for (var key in obj) {
			this.defaultValues[key] = obj[key];
		}
	}
};

InitPixel.prototype.changeForceRedraw = function (obj, isServer) {
	if (!isServer && this.socket) {
		if (this.parent) {
			this.socket.emit("updateValue", JSON.stringify(obj));
		} else {
			window.alert("Du bist Client, du kannst das nicht ändern.");
		}
	} else {
		if (
			!this.socket &&
			obj.slide &&
			obj.slide !== this.queryString.slide &&
			this.showcase
		) {
			this.queryString = {
				showcase: true,
				id: this.queryString.id,
				slide: obj.slide,
			};
			this.refresh();
		} else {
			this.addToQueryString(obj);
		}
	}
};

InitPixel.prototype.makeFullScreen = function () {
	this.toggleResizability(false);
	this.renderer.redraw({ width: 1, height: 1, forceSliders: true });
};

InitPixel.prototype.setupToggleResizabilityLinkButton = function (button) {
	this.toggleResizabilityButton = button;
	this.toggleResizability(this.queryString.resizeable ? true : false);
};

InitPixel.prototype.toggleResizability = function (value) {
	var resizeable = (this.queryString.resizeable =
		value === undefined ? !this.queryString.resizeable : value);

	if (this.toggleResizabilityButton) {
		this.toggleResizabilityButton.innerHTML =
			(resizeable ? "scaleable" : "not scaleable") +
			"<span class='shortcut'>CTRL+S</span>";
	}
};

InitPixel.prototype.getDocumentTitle = function (imageName, queryString) {
	var name = imageName;

	// add resizeable to the title
	if (queryString.resizeable) {
		name += " resizeable";
	}

	// Display the id for the Seedable Random Number Generator in the title;
	if (queryString.id) {
		name += " (" + queryString.id + ")";
	}

	// Display the imageName as the title
	document.title = name;
};

InitPixel.prototype.getShortcuts = function (q) {
	var that = this;

	return function (event) {
		var keyCode = event.keyCode;

		if (event.ctrlKey) {
			if (keyCode === 82) {
				// CTRL + R // new id
				that.getNewId();
			} else if (keyCode === 81) {
				// CTRL + Q // seed new id
				that.seedNewId();
			} else if (keyCode === 83) {
				// CTRL + S // toggle scalability
				that.toggleResizability();
			} else if (keyCode === 70) {
				// CTRL + F // make Fullscreen

				that.makeFullScreen();
			} else if (keyCode === 67) {
				// CTRL + C // toggle Color sheme

				q.cs = q.cs !== true ? true : undefined;
				that.refresh();
			} else if (keyCode === 68) {
				// CTRL + D // toggle debugging

				q.debug = q.debug !== true ? true : undefined;
				that.refresh();
			} else if (keyCode === 187) {
				// CTRL + "+" // zoom In
				if (!q.p) {
					q.p = 5;
				}
				q.p = q.p * 1 + 1;
				that.refresh();
			} else if (keyCode === 189) {
				// CTRL + "-" // zoom Out
				if (!q.p) {
					q.p = 5;
				}
				q.p = q.p * 1 - 1;
				if (q.p < 1) {
					q.p = 1;
				}
				that.refresh();
			}
		} else if (event.altKey) {
			if (keyCode === 38) {
				// Arrow Keys Up/Down // Add Rows
				if (!q.panels) {
					q.panels = 1;
				}
				q.panels = q.panels * 1 + 1;
				that.refresh();
			} else if (keyCode === 40) {
				if (!q.panels) {
					q.panels = 1;
				}
				q.panels = q.panels * 1 - 1;
				if (q.panels < 1) {
					q.panels = 1;
				}
				that.refresh();
			} else if (keyCode === 39) {
				// Arrow Keys Left/Right // Next / Prev Image
				that.nextSlide(true);
			} else if (keyCode === 37) {
				that.nextSlide(false);
			}
		}
		// else if ( event.shiftKey ) {
		// 	if ( keyCode === 49 ) { q.p = 11; that.refresh(); } // Number Keys 1 — 9 // Set resolution
		// 	else if ( keyCode === 222 ) { q.p = 12; that.refresh(); }
		// 	else if ( keyCode === 51 ) { q.p = 13; that.refresh(); }
		// 	else if ( keyCode === 52 ) { q.p = 14; that.refresh(); }
		// 	else if ( keyCode === 53 ) { q.p = 15; that.refresh(); }
		// 	else if ( keyCode === 54 ) { q.p = 16; that.refresh(); }
		// 	else if ( keyCode === 191 ) { q.p = 17; that.refresh(); }
		// 	else if ( keyCode === 56 ) { q.p = 18; that.refresh(); }
		// 	else if ( keyCode === 57 ) { q.p = 19; that.refresh(); }
		// 	else if ( keyCode === 187 ) { q.p = 20; that.refresh(); }
		// }

		// else if( !event.metaKey ) {
		// 	if ( keyCode === 49 ) { q.p = 1; that.refresh(); } // Number Keys 1 — 9 // Set resolution
		// 	else if ( keyCode === 50 ) { q.p = 2; that.refresh(); }
		// 	else if ( keyCode === 51 ) { q.p = 3; that.refresh(); }
		// 	else if ( keyCode === 52 ) { q.p = 4; that.refresh(); }
		// 	else if ( keyCode === 53 ) { q.p = 5; that.refresh(); }
		// 	else if ( keyCode === 54 ) { q.p = 6; that.refresh(); }
		// 	else if ( keyCode === 55 ) { q.p = 7; that.refresh(); }
		// 	else if ( keyCode === 56 ) { q.p = 8; that.refresh(); }
		// 	else if ( keyCode === 57 ) { q.p = 9; that.refresh(); }
		// 	else if ( keyCode === 48 ) { q.p = 10; that.refresh(); }
		// }
	};
};

// Displays
InitPixel.prototype.getStaticImage = function (args, main) {
	var imageList = args.staticImage,
		img = document.createElement("img"),
		width = window.innerWidth,
		l = imageList.length,
		count = 0,
		found = false;

	if (main) {
		main.setAttribute(
			"class",
			(main.getAttribute("class") || "") + " screenshot",
		);

		while (count < l) {
			if (imageList[count].width <= width) {
				if (imageList[count].max && imageList[count].max <= width) {
					found = false;
				} else {
					found = count;
				}
			}
			count += 1;
		}

		if (found !== false && imageList[found].url) {
			main.appendChild(img);
			img.setAttribute(
				"class",
				"screenshot " + (imageList[found].className || ""),
			);
			img.setAttribute("src", imageList[found].url);
		}

		if (args.color) {
			main.setAttribute("style", "background-color: " + args.color + ";");
		}
	}
	// this.list.setAttribute( "id", name );
};

InitPixel.prototype.getTimerAnimation = function () {
	var that = this,
		fps = 20,
		waitTimer = fps * 0.5, // how often per second should the chance be checked
		animations = {
			camera: { duration: 6, chance: 0.1 },
			side: { duration: 3, chance: 0.3 },
			a: { duration: 2, chance: 0.3 },
			b: { duration: 2, chance: 0.3 },
			c: { duration: 2, chance: 0.3 },
			d: { duration: 2, chance: 0.1 }, // eye open
			e: { duration: 2, chance: 0.1 }, // eye open
			f: { duration: 2, chance: 0.3 },
			g: { duration: 2, chance: 0.3 },
			h: { duration: 2, chance: 0.3 },
			k: { duration: 2, chance: 0.3 },
			l: { duration: 2, chance: 0.3 },
			m: { duration: 2, chance: 0.3 },
			n: { duration: 2, chance: 0.3 },
		},
		key,
		current,
		getFrame = function () {
			var renderObject = {
					isServer: true,
					forceSliders: true,
				},
				current,
				key;

			for (key in animations) {
				current = animations[key];
				if (current.move) {
					current.pos += current.step * (current.forward ? 1 : -1);
					if (current.pos > 1) {
						current.pos = 1;
						current.move = false;
						current.forward = false;
					} else if (current.pos < 0) {
						current.pos = 0;
						current.move = false;
						current.forward = true;
					}

					// randomly stopp in the middle
					if (current.waitTimer > 0) {
						current.waitTimer -= 1;
					} else {
						current.waitTimer = waitTimer;
						if (current.middleChance > Math.random()) {
							current.forward = !current.forward;
							current.move = false;
						}
					}

					renderObject[key] = current.pos;
				} else {
					if (current.waitTimer > 0) {
						current.waitTimer -= 1;
					} else {
						current.waitTimer = waitTimer;
						if (current.chance > Math.random()) {
							current.move = true;
						}
					}
				}
			}

			// console.log( animations.camera.pos );

			setTimeout(getFrame, 1000 / fps);

			that.renderer.redraw(renderObject);
		};

	for (key in animations) {
		current = animations[key];
		current.chance = (waitTimer * current.chance) / fps;
		current.middleChance = waitTimer / (fps * current.duration);

		current.step = 1 / (fps * current.duration);

		current.pos = 0;
		current.forward = true;
		current.move = true;
		current.waitTimer = 0;
	}

	return getFrame;
};

InitPixel.prototype.require = {
	persons_lessrandom: [
		"scripts/builder/builder.js",
		"scripts/builder/person-main.js",
		"scripts/builder/person-lowerBody.js",
		"scripts/builder/person-upperBody.js",
		"scripts/builder/person-arm.js",
		"scripts/builder/person-head.js",
		"scripts/builder/tree.js",
		"scripts/builder/comic.js",

		"scripts/builder/init.js",
	],

	panels: [
		"scripts/builder-old/builder.js",
		"scripts/builder-old/person-main.js",
		"scripts/builder-old/person-lowerBody.js",
		"scripts/builder-old/person-upperBody.js",
		"scripts/builder-old/person-arm.js",
		"scripts/builder-old/person-head.js",
		"scripts/builder-old/tree.js",
		"scripts/builder-old/comic.js",

		"scripts/builder-old/init-panels.js",
	],

	turnaround: [
		"scripts/betterBuilder/bb.js",
		"scripts/betterBuilder/rotation.js",
		"scripts/betterBuilder/person-main.js",
		"scripts/betterBuilder/person-head.js",
		"scripts/betterBuilder/person-upperBody.js",
		"scripts/betterBuilder/person-lowerBody.js",

		"scripts/betterBuilder/init.js",
	],

	table2: [
		"scripts/tableComic2/main.js",
		"scripts/tableComic2/strip.js",
		"scripts/tableComic2/stage.js",
		"scripts/tableComic2/actor.js",
		"scripts/tableComic2/actor-head.js",
		"scripts/tableComic2/actor-arm.js",
		"scripts/tableComic2/actor-legs.js",
		"scripts/tableComic2/accessoir.js",

		"scripts/tableComic2/tablecomic-1.js",
		"scripts/tableComic2/tablecomic-2.js",

		"scripts/tableComic2/init.js",
	],
};

InitPixel.prototype.showcaseSlides = [
	{
		name: "graien",
		niceName: "The Three Graeae",
		resizeable: true,
		unchangeable: true,
		sliders: true,
	},
	{ name: "tantalos", niceName: "Tantalos", resizeable: true },
	{ name: "teiresias", niceName: "Teiresias", resizeable: true },
	{ name: "brothers", niceName: "Brothers", resizeable: true },
	{ name: "zeus", niceName: "Zeus", resizeable: true },
	{ name: "argos", niceName: "The Argos", resizeable: true },
	{ name: "sphinx", niceName: "The Sphinx", resizeable: true },
	{ name: "letter", niceName: "Letter", unchangeable: true, both: true },
	{ name: "persons_lessrandom", niceName: "Trees", hasRandom: true },
	{
		name: "persons_lessrandom",
		niceName: "Persons",
		sliders: true,
		showPerson: true,
		hasRandom: true,
	},
	{
		name: "panels",
		niceName: "Panels",
		unchangeable: true,
		sliders: true,
		hasRandom: true,
	},
	{
		name: "turnaround",
		niceName: "Turnaround",
		unchangeable: true,
		sliders: true,
		hasRandom: true,
	},
	{
		name: "table2",
		niceName: "Comic 2",
		unchangeable: true,
		sliders: true,
		hasRandom: true,
	},
	{ name: "relativity", niceName: "Relativity", resizeable: true },
	{ name: "stripes", niceName: "Stripe", resizeable: true },
	{
		name: "landscape",
		niceName: "Landscape",
		resizeable: true,
		hasRandom: true,
	},
	{ name: "sparta", niceName: "Sparta", resizeable: true },
	{ name: "trex", niceName: "T-Rex", resizeable: true },
	{ name: "typo", niceName: "Typo", resizeable: true },
	{
		name: "random-distribution",
		niceName: "Random",
		hasRandom: true,
		resizeable: true,
	},
];
