
import { getRenderPixelToImage } from './getRenderPixelToImage';

const Renderer = function (canvas, options, pixelStarter) { // Render Engine to convert basic image into absolute Pixels
	const context = canvas.getContext('2d');
	const virtualCanvas = document.createElement('canvas');
	const virtaulContext = virtualCanvas.getContext('2d');
	const { pixelSize } = options;

	let w; let h;

	const drawer = this.getDrawer(
		pixelStarter,
		options.imageFunction.renderList,
	);

	const renderPixelToImage = getRenderPixelToImage(options.imageFunction.background);

	return {
		rescaleWindow() {
			w = canvas.offsetWidth;
			h = canvas.offsetHeight;
		},

		resize: function resize(widthFactor, heightFactor) {
			const	countW = (Math.round((widthFactor || 1) * w / pixelSize));
			const countH = (Math.round((heightFactor || 1) * h / pixelSize));
			const image = countW && countH && virtaulContext.createImageData(countW, countH);
			let drawing;
			let time = -1;

			if (image && countW > 0 && countH > 0) {
				// Resize Canvas to new Windows-Size
				virtualCanvas.width = countW;
				virtualCanvas.height = countH;


				canvas.width = w;
				canvas.height = h;

				// Disable Anti-Alaising
				context.mozImageSmoothingEnabled = false;
				context.oImageSmoothingEnabled = false;
				context.webkitImageSmoothingEnabled = false;
				context.msImageSmoothingEnabled = false;
				context.imageSmoothingEnabled = false;

				// Render the Image Data to the Pixel Array
				time = Date.now();

				drawing = drawer(
					countW,
					countH,
				).get;

				time = Date.now() - time;

				// Render the Pixel Array to the Image
				renderPixelToImage(
					countW,
					countH,
					drawing,
					image.data,
				);

				// Place Image on the Context
				virtaulContext.putImageData(
					image, 0, 0,
				);

				// Draw and upscale Context on Canvas
				context.drawImage(
					virtualCanvas,
					0,
					0,
					(countW) * pixelSize,
					(countH) * pixelSize,
				);
			}

			return [w, h, time];
		},
	};
};

Renderer.prototype.Color = function () {
	this.s = [];
};

Renderer.prototype.Color.prototype.draw = function (c, zInd, id) {
	let i = this.s.length - 1;
	const { s } = this;
	let oldZInd;

	if (
		i === -1
		|| (oldZInd = s[i].zInd) < zInd
	) {
		s.push({ id, c, zInd });
	} else if (oldZInd !== zInd) {
		do {
			if (s[i].zInd < zInd) {
				break;
			}
		} while (i--);

		s.splice(i + 1, 0, { id, c, zInd });
	}
};

Renderer.prototype.Color.prototype.clear = function (id) {
	const { s } = this;

	while (s.length > 0 && s[s.length - 1].id === id) {
		this.s.pop();
	}
};

Renderer.prototype.getPixelArray = function (width, height) {
	let countH;
	const colorArray = [];
	const { Color } = this;

	while (width--) {
		countH = height;
		colorArray[width] = [];
		while (countH--) {
			colorArray[width][countH] = new Color();
		}
	}

	return colorArray;
};

Renderer.prototype.createPixelArray = function (canvasWidth, canvasHeight) { // Create PixelArray
	const pixelArray = this.getPixelArray(canvasWidth, canvasHeight);
	let minX = 0;
	let minY = 0;
	let maxX = canvasWidth;
	let maxY = canvasHeight;

	return {
		setMask(dimensions, push) {
			const old = {
				posX: minX,
				width: maxX - minX,
				posY: minY,
				height: maxY - minY,
			};

			// TODO: Dont check if its the old values;

			maxX = (minX = dimensions.posX) + dimensions.width;
			maxY = (minY = dimensions.posY) + dimensions.height;

			if (!maxX || maxX > canvasWidth) { maxX = canvasWidth; }
			if (!maxY || maxY > canvasHeight) { maxY = canvasHeight; }
			if (!minX || minX < 0) { minX = 0; }
			if (!minY || minY < 0) { minY = 0; }

			if (push) {
				if (maxX > old.posX + old.width) { maxX = old.posX + old.width; }
				if (maxY > old.posY + old.height) { maxY = old.posY + old.height; }
				if (minX < old.posX) { minX = old.posX; }
				if (minY < old.posY) { minY = old.posY; }
			}

			return old;
		},

		getSet(color, zInd, id) {
			return function (x, y) {
				if (x >= minX && x < maxX && y >= minY && y < maxY) {
					pixelArray[x][y].draw(color, zInd, id);
				}
			};
		},

		getClear(id) {
			return function (x, y) {
				if (x >= minX && x < maxX && y >= minY && y < maxY) {
					pixelArray[x][y].clear(id);
				}
			};
		},

		getSetForRect(color, zInd, id) { // Set Color for Rectangle for better Performance
			const pA = pixelArray;
			return function (args) {
				const { posX } = args;
				const { posY } = args;
				const endX = args.width + posX;
				const endY = args.height + posY;
				let sizeX = endX > maxX ? maxX : endX;
				let sizeY;
				const sizeY_start = endY > maxY ? maxY : endY;
				const startX = posX < minX ? minX : posX;
				const startY = posY < minY ? minY : posY;
				let row;

				while ((sizeX -= 1) >= startX) {
					sizeY = sizeY_start;
					row = pA[sizeX];

					while ((sizeY -= 1) >= startY) {
						row[sizeY].draw(color, zInd, id);
					}
				}
			};
		},

		getClearForRect(id) {
			const pA = pixelArray;
			return function (args) {
				const endX = args.width + args.posX;
				const endY = args.height + args.posY;
				let sizeX = endX > maxX ? maxX : endX;
				let sizeY;
				const initSizeY = endY > maxY ? maxY : endY;
				const startX = args.posX < minX ? minX : args.posX;
				const startY = args.posY < minY ? minY : args.posY;
				let row;

				while ((sizeX -= 1) >= startX) {
					sizeY = initSizeY;
					row = pA[sizeX];
					while ((sizeY -= 1) >= startY) {
						row[sizeY].clear(id);
					}
				}
			};
		},

		getSaveForRect(save, mask) {
			return function (args) {
				const endX = args.width + args.posX;
				const endY = args.height + args.posY;
				let sizeX = endX > canvasWidth ? canvasWidth : endX;
				let sizeY;
				const initSizeY = endY > canvasHeight ? canvasHeight : endY;
				const startX = args.posX < 0 ? 0 : args.posX;
				const startY = args.posY < 0 ? 0 : args.posY;
				const s = save;
				let col;

				while ((sizeX -= 1) >= startX) {
					sizeY = initSizeY;

					col = mask[sizeX] || (mask[sizeX] = []);

					while ((sizeY -= 1) >= startY) {
						s.push([sizeX, sizeY]);
						col[sizeY] = true;
					}
				}
			};
		},

		getClearSaveForRect(save, mask) {
			return function (args) {
				const endX = args.width + args.posX;
				const endY = args.height + args.posY;
				let sizeX = endX > canvasWidth ? canvasWidth : endX;
				let sizeY;
				const initSizeY = endY > canvasHeight ? canvasHeight : endY;
				const startX = args.posX < 0 ? 0 : args.posX;
				const startY = args.posY < 0 ? 0 : args.posY;
				let col;

				while ((sizeX -= 1) >= startX) {
					sizeY = initSizeY;

					if ((col = mask[sizeX])) {
						while ((sizeY -= 1) >= startY) {
							if (col[sizeY]) {
								col[sizeY] = false;
							}
						}
					}
				}
			};
		},

		get: pixelArray,
	}; // Return prepared Color-Array, with default Color;
};

Renderer.prototype.getDrawer = function (pixelStarter, renderList) { // Initialize the drawingTool
	const that = this;
	const pixelUnit = pixelStarter.pixelUnits;
	const drawingTool = new pixelStarter.DrawingTools(pixelUnit, pixelStarter.getRandom);
	const canvasTool = new drawingTool.Obj().create({ list: renderList });

	return function drawer(countW, countH) {
		const pixelArray = that.createPixelArray(countW, countH);

		drawingTool.init(countW, countH, pixelArray);
		canvasTool.draw();

		return pixelArray;
	};
};

export { Renderer };
