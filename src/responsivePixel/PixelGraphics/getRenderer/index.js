import { getRenderPixelToImage } from "./getRenderPixelToImage";
import { getDrawer } from "./getDrawer";

export const getRenderer = (options, pixelGraphics) => {
	const context = options.divCanvas.getContext("2d");
	const virtualCanvas = document.createElement("canvas");
	const virtualContext = virtualCanvas.getContext("2d");

	const drawer = getDrawer(pixelGraphics, options.imageFunction.renderList);
	const renderPixelToImage = getRenderPixelToImage(options.imageFunction.background);

	return {
		resize(args) {
			const countXFull = args.sizeX / args.pixelSize;
			const countYFull = args.sizeY / args.pixelSize;
			const countX = Math.round(Math.min(1, args.widthFactor || 1) * countXFull);
			const countY = Math.round(Math.min(1, args.heightFactor || 1) * countYFull);
			const image = countX && countY && virtualContext.createImageData(countX, countY);
			let drawing;
			const missingX = countXFull - countX;
			const missingY = countYFull - countY;

			if (image && countX > 0 && countY > 0) {
				// Resize Canvas to new Windows-Size
				virtualCanvas.width = countX;
				virtualCanvas.height = countY;

				/* eslint-disable-next-line no-param-reassign */
				options.divCanvas.width = args.sizeX;
				/* eslint-disable-next-line no-param-reassign */
				options.divCanvas.height = args.sizeY;

				// Disable Anti-Alaising
				context.mozImageSmoothingEnabled = false;
				context.oImageSmoothingEnabled = false;
				context.webkitImageSmoothingEnabled = false;
				context.msImageSmoothingEnabled = false;
				context.imageSmoothingEnabled = false;

				// Render the Image Data to the Pixel Array
				drawing = drawer(countX, countY).get;

				// Render the Pixel Array to the Image
				renderPixelToImage(countX, countY, drawing, image.data);

				// Place Image on the Context
				virtualContext.putImageData(image, 0, 0);

				// Draw and upscale Context on Canvas
				context.drawImage(
					virtualCanvas,
					Math.round(missingX / 2) * options.pixelSize,
					Math.round(missingY / 2) * options.pixelSize,
					countX * options.pixelSize,
					countY * options.pixelSize
				);
			}

			return [args.sizeX, args.sizeY];
		},
	};
};
