import { getRenderer } from './getRenderer';
import { PixelUnits } from './PixelUnits';
import { DrawingTools } from './DrawingTools';
import { getGetRandom } from './getGetRandom';
import { joinObjects } from './joinObjects';
import { getRedraw } from './getRedraw';
import { Variable } from './Variable';
import { VariableDynamic } from './VariableDynamic';

export class PixelGraphics {
	getRandom = getGetRandom()

	constructor(options) {
		this.pixelUnits = new PixelUnits(); // Initialize PixelUnits with Variables
		this.pixelUnits.setList(this.createVariableList(options.imageFunction.variableList || []));
		if (options.imageFunction.linkList) {
			this.prepareVariableList(options.imageFunction.linkList);
		}

		if (options.imageFunction.changeValueSetter) { options.imageFunction.changeValueSetter(); }

		const isParent = options.queryString.parent;
		const finalRenderer = getRenderer(
			options,
			this,
		);
		const resize = this.getResize(finalRenderer.resize);
		const redraw = getRedraw(options, resize, isParent);


		finalRenderer.rescaleWindow();

		redraw(joinObjects(options.sliderValues, options.queryString, options.defaultValues));

		window.onresize = () => {
			finalRenderer.rescaleWindow();
			resize();
		};

		// Make Canvas resizeable by mouse
		this.initUserInput(options, redraw, options.divCanvas);

		return {
			resize,
			redraw,
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
			if (needsToResize) {
				resize({
					widthFactor: currentW,
					heightFactor: currentH,
				});
			}
		};

		return function checkIfResizeShouldBeDone(args) {
			needsToResize = true;

			if (!resizeBlock) {
				resizeBlock = true;
				setTimeout(resetResizeBlock, 20);
				resize(args);
			}

			currentW = args.widthFactor || currentW;
			currentH = args.heightFactor || currentH;
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
					? { widthFactor: x, heightFactor: y }
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

	createVariableList(vl) {
		const newVL = Object.fromEntries(Object.keys(vl).map((key) => [
			key,
			new Variable(vl[key], key, this.pixelUnits),
		]));
		return {
			listLink: (name, vari) => {
				if (newVL[name]) {
					newVL[name].link(vari);
				} else {
					newVL[name] = new VariableDynamic(name);
					newVL[name].link(vari);
				}
			},
			listCreate: (name) => {
				if (!newVL[name]) {
					newVL[name] = new VariableDynamic(name);
				}
				return newVL[name];
			},
			updater: () => {
				Object.values(newVL).forEach((value) => value.set());
			},
		};
	}

	DrawingTools = DrawingTools;
}
