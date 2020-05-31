import { getRenderer } from './getRenderer';
import { getPixelUnits } from './getPixelUnit';
import { DrawingTools } from './DrawingTools';
import { getGetRandom } from './getGetRandom';
import { joinObjects } from './joinObjects';
import { createVariableList } from './createVariableList';
import { getRedraw } from './getRedraw';

export class PixelGraphics {
	getRandom = getGetRandom()

	constructor(options) {
		this.pixelUnits = this.getPixelUnits(); // Initialize PixelUnits with Variables
		this.pixelUnits.setList(createVariableList(options.imageFunction.variableList || []));
		if (options.imageFunction.linkList) {
			this.prepareVariableList(options.imageFunction.linkList);
		}

		if (options.imageFunction.changeValueSetter) { options.imageFunction.changeValueSetter(); }

		return (canvas) => {
			const isParent = options.queryString.parent;
			const finalRenderer = getRenderer(
				canvas,
				options,
				this,
			);
			const { rescaleWindow } = finalRenderer;
			const resize = this.getResize(finalRenderer.resize);
			const redraw = getRedraw(options, resize, isParent);


			rescaleWindow();

			redraw(joinObjects(options.sliderValues, options.queryString, options.defaultValues));

			window.onresize = () => {
				rescaleWindow();
				resize();
			};

			// Make Canvas resizeable by mouse
			this.initUserInput(options, redraw, canvas, options.slide.unchangeable);

			return {
				resize,
				redraw,
			};
		};
	}

	getResize(render) {
		let currentW; let currentH;
		let needsToResize = false;
		let resizeBlock = false;

		const resize = (w, h) => {
			// var time = Date.now();

			// Render the actual image. This takes very long!
			this.canvasSize = render(
				w || currentW,
				h || currentH,
			);

			needsToResize = false;
		};

		const resetResizeBlock = () => {
			resizeBlock = false;
			if (needsToResize) { resize(currentW, currentH); }
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
	}

	initUserInput(options, redraw, canvas, unchangeable) {
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
					? { width: x, height: y }
					: {
						[alt ? 'c' : 'a']: x,
						[alt ? 'd' : 'b']: y,
					},
			);
		};

		const mouseMove = (event, size) => {
			if (queryString.resizeable || (!unchangeable && (size || hasSomethingToHover))) {
				changeImage(event, size || queryString.resizeable);
			}
		};

		const touchMove = (event) => {
			event.preventDefault();
			mouseMove(event.changedTouches[0], true);
		};

		canvas.addEventListener('mousemove', mouseMove, false);
		canvas.addEventListener('touchmove', touchMove, false);
	}

	prepareVariableList(vl) {
		if (vl.length === 0) { return; }
		const getLinkedVariable = (variable) => () => {
			if (!variable.calculated) {
				/* eslint-disable-next-line no-param-reassign */
				variable.calculated = true;
				/* eslint-disable-next-line no-param-reassign */
				variable.real = variable.s.getReal();
			}
			return variable.real;
		};

		vl.forEach((current) => {
			if (!current.s) {
				if (!current.autoUpdate) {
					/* eslint-disable-next-line no-param-reassign */
					current.autoUpdate = false;
					/* eslint-disable-next-line no-param-reassign */
					current.s = this.pixelUnits.createSize(current);
				} else {
					/* eslint-disable-next-line no-param-reassign */
					current.calculated = true;
				}
				/* eslint-disable-next-line no-param-reassign */
				current.getLinkedVariable = getLinkedVariable(current);
			}
		});

		this.pixelUnits.linkList((dimensions) => {
			vl.forEach((current) => {
				if (current.main) {
					/* eslint-disable-next-line no-param-reassign */
					current.calculated = true;
					/* eslint-disable-next-line no-param-reassign */
					current.real = dimensions[current.height ? 'height' : 'width'];
				} else {
					/* eslint-disable-next-line no-param-reassign */
					current.calculated = current.autoUpdate;
				}
			});
		});
	}

	getPixelUnits = getPixelUnits;

	DrawingTools = DrawingTools;
}
