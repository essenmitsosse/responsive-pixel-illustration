
import { createSingleCanvas } from './createSingleCanvas';
import { updateDocumentTitle } from './updateDocumentTitle';

class RenderEngine {
	queryString = {};

	constructor(args) {
		const { queryString } = this;

		const forceName = args.imageName || window.location.hash.substr(1);
		const currentSlide = !forceName && this.slides[queryString.slide || 0];
		const imageName = forceName || currentSlide.name || 'tantalos';

		const canvasRenderer = !currentSlide.staticImage
			&& createSingleCanvas(args.div);

		queryString.resizeable = true;
		this.defaultValues = { isServer: true };
		this.parent = queryString.admin || queryString.parent;

		if (args.ImageFunction) {
			const imageFunction = new args.ImageFunction(queryString, currentSlide);

			this.hover = imageFunction.hover;

			this.renderer = canvasRenderer({
				showInfos: false,
				slide: currentSlide,
				imageFunction,
				queryString,
				pixelSize: (
					args.pixelSize
					|| queryString.p
					|| currentSlide.p
					|| imageFunction.recommendedPixelSize
					|| 5
				)
				+ (queryString.pAdd || 0),
				sliderValues: this.sliderValues,
				defaultValues: this.defaultValues,
				init: this,
			});

			if (this.timerAnimation) {
				this.timerAnimation();
			}
		} else {
			throw new Error(`${imageName} was loaded but is not a function!`);
		}

		updateDocumentTitle(imageName, queryString);
		window.onkeydown = this.getShortcuts();

		if (currentSlide.timer || queryString.timer) {
			this.timerAnimation = this.getTimerAnimation(currentSlide.timer);
		}
	}

	addToQueryString(newObj, dontRefresh) {
		const q = this.queryString;
		let somethingChanged = false;

		Object.keys(newObj).forEach((key) => {
			if (q[key] !== newObj[key]) {
				somethingChanged = true;
			}

			q[key] = newObj[key];
		});

		if (!dontRefresh && somethingChanged) {
			this.refresh();
		}
	}

	refresh(event) {
		const newString = [];
		const q = this.queryString;

		if (event) { event.preventDefault(); }

		Object.keys(q).forEach((key) => {
			if (q[key] !== undefined) {
				newString.push(`${key}=${q[key]}`);
			}
		});

		window.location.search = newString.join('&');
	}

	nextSlide(next) {
		let { slide } = this.queryString;

		if (!slide) { slide = 0; }
		slide = slide * 1 + (next ? 1 : -1);

		if (slide > this.slides.length - 1) {
			slide = this.slides.length - 1;
		} else if (slide < 0) {
			slide = 0;
		}

		this.changeForceRedraw({ slide });
	}

	sliderChange(obj) {
		if (this.renderer) {
			this.renderer.redraw(obj);
		} else {
			Object.keys(obj).forEach((key) => {
				this.defaultValues[key] = obj[key];
			});
		}
	}


	makeFullScreen() {
		this.toggleResizability(false);
		this.renderer.redraw({ width: 1, height: 1 });
	}

	setupToggleResizabilityLinkButton(button) {
		this.toggleResizabilityButton = button;
		this.toggleResizability(!!this.queryString.resizeable);
	}

	toggleResizability(value) {
		this.queryString.resizeable = value === undefined
			? !this.queryString.resizeable
			: value;

		if (this.toggleResizabilityButton) {
			this.toggleResizabilityButton.innerHTML = `${this.queryString.resizeable ? 'scaleable' : 'not scaleable'}<span class='shortcut'>CTRL+S</span>`;
		}
	}

	getShortcuts() {
		return (event) => {
			const { keyCode } = event;

			if (event.ctrlKey) {
				console.log(1);
				if (keyCode === 83) { // CTRL + S // toggle scalability
					console.log(2);
					this.toggleResizability();
				} else if (keyCode === 70) { // CTRL + F // make Fullscreen
					this.makeFullScreen();
				} else if (keyCode === 67) { // CTRL + C // toggle Color sheme
					this.queryString.cs = (this.queryString.cs !== true) ? true : undefined;
					this.refresh();
				} else if (keyCode === 68) { // CTRL + D // toggle debugging
					this.queryString.debug = (this.queryString.debug !== true) ? true : undefined;
					this.refresh();
				} else if (keyCode === 187) { // CTRL + "+" // zoom In
					if (!this.queryString.p) { this.queryString.p = 5; }
					this.queryString.p = this.queryString.p * 1 + 1;
					this.refresh();
				} else if (keyCode === 189) { // CTRL + "-" // zoom Out
					if (!this.queryString.p) { this.queryString.p = 5; }
					this.queryString.p = this.queryString.p * 1 - 1;
					if (this.queryString.p < 1) { this.queryString.p = 1; }
					this.refresh();
				}
			} else if (event.altKey) {
				if (keyCode === 38) { // Arrow Keys Up/Down // Add Rows
					if (!this.queryString.panels) { this.queryString.panels = 1; }
					this.queryString.panels = this.queryString.panels * 1 + 1;
					this.refresh();
				} else if (keyCode === 40) {
					if (!this.queryString.panels) { this.queryString.panels = 1; }
					this.queryString.panels = this.queryString.panels * 1 - 1;
					if (this.queryString.panels < 1) { this.queryString.panels = 1; }
					this.refresh();
				} else if (keyCode === 39) { // Arrow Keys Left/Right // Next / Prev Image
					this.nextSlide(true);
				} else if (keyCode === 37) {
					this.nextSlide(false);
				}
			} else if (event.shiftKey) {
				if (keyCode === 49) {
					this.queryString.p = 11; this.refresh();
				} else if (keyCode === 222) { // Number Keys 1 — 9 // Set resolution
					this.queryString.p = 12; this.refresh();
				} else if (keyCode === 51) {
					this.queryString.p = 13; this.refresh();
				} else if (keyCode === 52) {
					this.queryString.p = 14; this.refresh();
				} else if (keyCode === 53) {
					this.queryString.p = 15; this.refresh();
				} else if (keyCode === 54) {
					this.queryString.p = 16; this.refresh();
				} else if (keyCode === 191) {
					this.queryString.p = 17; this.refresh();
				} else if (keyCode === 56) {
					this.queryString.p = 18; this.refresh();
				} else if (keyCode === 57) {
					this.queryString.p = 19; this.refresh();
				} else if (keyCode === 187) {
					this.queryString.p = 20; this.refresh();
				}
			} else if (!event.metaKey) {
				if (keyCode === 49) {
					this.queryString.p = 1; this.refresh();
				} else if (keyCode === 50) { // Number Keys 1 — 9 // Set resolution
					this.queryString.p = 2; this.refresh();
				} else if (keyCode === 51) {
					this.queryString.p = 3; this.refresh();
				} else if (keyCode === 52) {
					this.queryString.p = 4; this.refresh();
				} else if (keyCode === 53) {
					this.queryString.p = 5; this.refresh();
				} else if (keyCode === 54) {
					this.queryString.p = 6; this.refresh();
				} else if (keyCode === 55) {
					this.queryString.p = 7; this.refresh();
				} else if (keyCode === 56) {
					this.queryString.p = 8; this.refresh();
				} else if (keyCode === 57) {
					this.queryString.p = 9; this.refresh();
				} else if (keyCode === 48) {
					this.queryString.p = 10; this.refresh();
				}
			}
		};
	}

	getTimerAnimation() {
		const that = this;
		const fps = 20;

		const waitTimer = fps * 0.5; // how often per second should the chance be checked

		const animations = {
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
		};

		const keysAnimation = Object.keys(animations);

		const getFrame = () => {
			const renderObject = {
				isServer: true,
			};


			keysAnimation.forEach((key) => {
				const current = animations[key];
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
				} else if (current.waitTimer > 0) {
					current.waitTimer -= 1;
				} else {
					current.waitTimer = waitTimer;
					if (current.chance > Math.random()) {
						current.move = true;
					}
				}
			});

			setTimeout(getFrame, 1000 / fps);

			that.renderer.redraw(renderObject);
		};

		keysAnimation.forEach((key) => {
			const current = animations[key];
			current.chance = (waitTimer * current.chance) / fps;
			current.middleChance = waitTimer / (fps * current.duration);

			current.step = 1 / (fps * current.duration);

			current.pos = 0;
			current.forward = true;
			current.move = true;
			current.waitTimer = 0;
		});

		return getFrame;
	}

	slides = [
		{ name: 'graien', niceName: 'The Three Graeae' },
		{ name: 'tantalos', niceName: 'Tantalos' },
		{ name: 'teiresias', niceName: 'Teiresias' },
		{ name: 'brothers', niceName: 'Brothers' },
		{ name: 'zeus', niceName: 'Zeus' },
		{ name: 'argos', niceName: 'The Argos' },
		{ name: 'sphinx', niceName: 'The Sphinx' },
	];
}

export { RenderEngine };
