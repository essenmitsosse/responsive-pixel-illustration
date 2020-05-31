import { getRenderPixelToImage } from './getRenderPixelToImage';
import { getDrawer } from './getDrawer';

export const getRenderer = (options, pixelStarter) => {
	const context = options.divCanvas.getContext('2d');
	const virtualCanvas = document.createElement('canvas');
	const virtaulContext = virtualCanvas.getContext('2d');

	let w; let h;

	const drawer = getDrawer(pixelStarter, options.imageFunction.renderList);
	const renderPixelToImage = getRenderPixelToImage(options.imageFunction.background);

	return {
		rescaleWindow() {
			w = options.divCanvas.offsetWidth;
			h = options.divCanvas.offsetHeight;
		},

		resize(args) {
			if (args.pixelSize !== undefined) {
				/* eslint-disable-next-line no-param-reassign */
				options.pixelSize = args.pixelSize;
			}
			const countXFull = w / options.pixelSize;
			const countYFull = h / options.pixelSize;
			const countX = (Math.round((args.widthFactor || 1) * countXFull));
			const countY = (Math.round((args.heightFactor || 1) * countYFull));
			const image = countX && countY && virtaulContext.createImageData(countX, countY);
			let drawing;
			const missingX = countXFull - countX;
			const missingY = countYFull - countY;

			if (image && countX > 0 && countY > 0) {
				// Resize Canvas to new Windows-Size
				virtualCanvas.width = countX;
				virtualCanvas.height = countY;

				/* eslint-disable-next-line no-param-reassign */
				options.divCanvas.width = w;
				/* eslint-disable-next-line no-param-reassign */
				options.divCanvas.height = h;

				// Disable Anti-Alaising
				context.mozImageSmoothingEnabled = false;
				context.oImageSmoothingEnabled = false;
				context.webkitImageSmoothingEnabled = false;
				context.msImageSmoothingEnabled = false;
				context.imageSmoothingEnabled = false;

				// Render the Image Data to the Pixel Array
				drawing = drawer(
					countX,
					countY,
				).get;

				// Render the Pixel Array to the Image
				renderPixelToImage(
					countX,
					countY,
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
					Math.round(missingX / 2) * options.pixelSize,
					Math.round(missingY / 2) * options.pixelSize,
					(countX) * options.pixelSize,
					(countY) * options.pixelSize,
				);
			}

			return [w, h];
		},
	};
};
