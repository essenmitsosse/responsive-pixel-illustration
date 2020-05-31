import { Renderer } from './Renderer';
import { getPixelUnits } from './getPixelUnits';
import { DrawingTools } from './DrawingTools';

const PixelGraphics = function (options) {
	const that = this;
	const pU = this.getPixelUnits(); // Initialize PixelUnits with Variables

	this.pixelUnits = pU;

	this.createVariableList(options.imageFunction.variableList || []);
	if (options.imageFunction.linkList) { this.prepareVariableList(options.imageFunction.linkList); }

	if (options.imageFunction.changeValueSetter) { options.imageFunction.changeValueSetter(); }

	return function (canvas) {
		const isParent = options.queryString.parent;
		const finalRenderer = new Renderer(
			canvas,
			options,
			that,
		);
		const { rescaleWindow } = finalRenderer;
		const resize = that.getResize(finalRenderer.resize);
		const redraw = that.getRedraw(options, resize, isParent);


		rescaleWindow();

		redraw(that.joinObjects(options.sliderValues, options.queryString, options.defaultValues));

		window.onresize = function () {
			rescaleWindow();
			resize();
		};

		// Make Canvas resizeable by mouse
		that.initUserInput(options, redraw, canvas, options.slide.unchangeable);

		return {
			resize,
			redraw,
		};
	};
};

PixelGraphics.prototype.getResize = function (render) {
	const that = this;
	let currentW; let currentH;
	let needsToResize = false;
	let resizeBlock = false;

	const resetResizeBlock = function () {
		resizeBlock = false;
		if (needsToResize) { resize(currentW, currentH); }
	};

	var resize = function (w, h) {
		// var time = Date.now();

		// Render the actual image. This takes very long!
		that.canvasSize = render(
			w || currentW,
			h || currentH,
		);

		needsToResize = false;
	};

	return function checkIfResizeShouldBeDone(w, h) {
		needsToResize = true;

		if (!resizeBlock) {
			resizeBlock = true;
			setTimeout(resetResizeBlock, 20);
			resize(w, h);
		}

		currentW = w || currentW;
		currentH = h || currentH;
	};
};

PixelGraphics.prototype.getRedraw = function redraw(options, resize) {
	const hoverEvent = options.imageFunction.hover;

	return function redraw(args) {
		options.init.addToQueryString(args, true);

		if (hoverEvent) { hoverEvent(args); }
		resize(args.width, args.height);
	};
};

PixelGraphics.prototype.initUserInput = function (options, redraw, canvas, unchangeable) {
	const { queryString } = options;
	const hasSomethingToHover = options.imageFunction.hover;
	const that = this;

	const changeImage = function changeImage(event, size) {
		let x; let
			y;

		if (event.target) {
			const domRect = event.target.getBoundingClientRect();
			x = (event.x || event.clientX) - domRect.x;
			y = (event.y || event.clientY) - domRect.y;
		} else {
			x = event.x || event.clientX;
			y = event.y || event.clientY;
		}

		const alt = event.altKey;

		x /= that.canvasSize[0];
		y /= that.canvasSize[1];

		redraw(
			size
				? { width: x, height: y, forceSliders: true }
				: alt
					? { c: x, d: y, forceSliders: true }
					: { a: x, b: y, forceSliders: true },
		);
	};

	const mouseMove = function (event, size) {
		if (queryString.resizeable || (!unchangeable && (size || hasSomethingToHover))) {
			changeImage(event, false && size || queryString.resizeable);
		}
	};

	const touchMove = function (event) {
		event.preventDefault();
		mouseMove(event.changedTouches[0], true);
	};

	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('touchmove', touchMove, false);

	if (!queryString.admin && queryString.tilt && window.DeviceOrientationEvent) {
		this.getOrientation(changeImage, redraw, options);
	}
};

PixelGraphics.prototype.getOrientation = function (changeImage, redraw, options) {
	const pause = function () {};
	let lastX = 0;
	let lastY = 0;
	let lastZ = 0;

	// debug = this.getDebug(),

	const tilt = function (event) {
		let changed = false;
		let x = event.alpha;
		let y = event.beta;
		let z = event.gamma;
		const obj = {
			forceSliders: true,
		};

		if ((x = Math.floor(x)) !== lastX) {
			lastX = x;
			changed = true;
		}
		if ((y = Math.floor(y)) !== lastY) {
			lastY = y;
			changed = true;
		}
		if ((z = Math.floor(z)) !== lastZ) {
			lastZ = z;
			changed = true;
		}

		if (changed) {
			if (x > 180) {
				x = (180 - x) + 360;
			} else {
				x = 180 - x;
			}

			x /= 360;
			y = (y + 90) / 180;
			z = (z + 180) / 360;

			x += 0.25;
			if (x > 1) { x -= 1; }
			if (x > 0.5) {
				x = (x - 0.5) * 2;
			} else {
				x = (0.5 - x) * 2;
			}

			z += 0.25;
			if (z > 1) { z -= 1; }
			if (z > 0.5) {
				z = (z - 0.5) * 2;
			} else {
				z = (0.5 - z) * 2;
			}

			if (names[0]) { obj[names[0]] = z; }
			if (names[1]) { obj[names[1]] = y; }
			if (names[2]) { obj[names[2]] = x; }

			redraw(obj);
			// debug( x, y, z, soften );
		}

		realTilt = pause;

		setTimeout(resetTilt, 100);
	};
	var resetTilt = function () { realTilt = tilt; };
	var realTilt = tilt;

	const { sliderValues } = options;
	let key;
	var names = [];

	for (key in sliderValues) {
		if (names.length < 4) {
			if (key !== 'width' && key !== 'height' && key !== 'panels') {
				names.push(key);
			}
		}
	}

	if (names.length > 0) {
		window.addEventListener('deviceorientation', realTilt, true);
	}
};

PixelGraphics.prototype.getDebug = function () {
	const info = document.createElement('div');
	const text = document.createElement('div');
	const center = document.createElement('div');
	const oriX = document.createElement('div');
	const oriY = document.createElement('div');
	const oriZ = document.createElement('div');
	const bonus = document.createElement('div');

	info.setAttribute('id', 'infoField');

	center.setAttribute('id', 'marker');
	center.setAttribute('class', 'center');
	info.appendChild(center);

	oriX.setAttribute('class', 'marker acc');
	oriX.innerHTML = 'x: rotation';
	info.appendChild(oriX);

	oriY.setAttribute('class', 'marker speed');
	oriY.innerHTML = 'y: back/forth';
	info.appendChild(oriY);

	oriZ.setAttribute('class', 'marker pos');
	oriZ.innerHTML = 'z: kippen';
	info.appendChild(oriZ);

	bonus.setAttribute('class', 'marker bonus');
	bonus.innerHTML = '.';
	info.appendChild(bonus);

	info.appendChild(text);
	text.innerHTML = 'init done.';

	document.getElementsByTagName('body')[0].appendChild(info);

	return function (x, y, z, a) {
		oriX.setAttribute('style', `left:${x * 100}%;`);
		oriY.setAttribute('style', `top:${y * 100}%;`);
		oriZ.setAttribute('style', `left:${z * 100}%; top:${z * 100}%;`);
		// bonus.setAttribute( "style", "left:" + Math.floor( test * 100 ) + "%;" );

		text.innerHTML = 			`X: ${x};</br>`
			+ `Y: ${y};</br>`
			+ `Z: ${z};</br>`
			+ `soften ${a}`;
	};
};

PixelGraphics.prototype.prepareVariableList = function (vl) {
	const { pixelUnits } = this;
	const vlLength = vl.length;
	const calculate = function (dimensions) {
		let i = 0;
		const vll = vlLength;
		let current;

		do {
			current = vl[i];
			if (current.main) {
				current.calculated = true;
				current.real = dimensions[current.height ? 'height' : 'width'];
			} else {
				current.calculated = current.autoUpdate;
			}
		} while ((i += 1) < vll);
	};

	if (vlLength > 0) {
		// Prepare
		(function (vl, vll) {
			let i = 0;
			let current;
			const getLinkedVariable = function (args) {
				return function () {
					if (!args.calculated) {
						args.calculated = true;
						return (args.real = args.s.getReal());
					}
					return args.real;
				};
			};

			do {
				current = vl[i];
				if (!current.s) {
					if (!current.autoUpdate) {
						current.autoUpdate = false;
						current.s = pixelUnits.createSize(current);
					} else {
						current.calculated = true;
					}
					current.getLinkedVariable = getLinkedVariable(current);
				}
			} while ((i += 1) < vll);
		}(vl, vlLength));

		pixelUnits.linkList(calculate);
	}
};

PixelGraphics.prototype.createVariableList = function (vl) {
	const { pixelUnits } = this;
	const newVL = {};
	let key;
	const updater = function () {
		let key;

		for (key in vl) {
			newVL[key].set();
		}
	};
	const link = function (name, vari) {
		if (newVL[name]) {
			newVL[name].link(vari);
		} else {
			newVL[name] = new DynamicVariable(name);
			newVL[name].link(vari);
		}
	};
	const creator = function (name) {
		if (newVL[name]) {

		} else {
			newVL[name] = new DynamicVariable(name);
		}

		return newVL[name];
	};
	const Variable = function (args, name) {
		if (args) {
			this.name = name;
			this.vari = pixelUnits.createSize(args);
			this.linkedP = [];
			this.l = 0;
		}
	};
	var DynamicVariable = function (name) {
		this.name = name;
		this.linkedP = [];
		this.l = 0;
	};

	Variable.prototype.set = function () {
		let value;
		let { l } = this;

		value = this.vari.getReal();

		while (l--) { this.linkedP[l].abs = value; }
	};

	Variable.prototype.link = function (p) {
		this.linkedP.push(p);
		this.l += 1;
	};

	DynamicVariable.prototype = new Variable();

	DynamicVariable.prototype.set = function (value) {
		let { l } = this;

		while (l--) { this.linkedP[l].abs = value; }
	};

	pixelUnits.setList(link, creator, updater);

	for (key in vl) {
		newVL[key] = new Variable(vl[key], key);
	}
};

PixelGraphics.prototype.globalResizer = (function () {
	const allCanvases = [];
	const resize = function () {
		let l = allCanvases.length;

		while (l--) {
			allCanvases[l]();
		}
	};

	window.onresize = resize;

	return function (pixelGraphicResizer) {
		allCanvases.push(pixelGraphicResizer);
	};
}());

PixelGraphics.prototype.getRandom = (function () {
	const m = 2147483647;
	const a = 16807;
	const c = 17;
	const z = 3;
	let i = 0;

	return function (seed) {
		let thisZ = seed || z;

		return {
			one() { return (thisZ = (a * thisZ + c) % m) / m; },
			count(c) { return Math.floor((thisZ = (a * thisZ + c) % m) / m * c); },
			seed() { return (thisZ = (a * thisZ + c) % m) + (i += 1); },
		};
	};
}());

PixelGraphics.prototype.joinObjects = function () {
	const l = arguments.length;
	let count = 0;
	const newObj = {};
	let key;
	let currentObj;

	while (count < l) {
		currentObj = arguments[count];

		for (key in currentObj) {
			newObj[key] = currentObj[key];
		}

		count += 1;
	}

	return newObj;
};

PixelGraphics.prototype.getPixelUnits = getPixelUnits;
PixelGraphics.prototype.DrawingTools = DrawingTools;

export { PixelGraphics };
