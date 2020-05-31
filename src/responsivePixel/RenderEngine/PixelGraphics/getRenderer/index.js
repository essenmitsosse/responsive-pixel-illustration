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
			const pixelSize = args.pixelSize || options.pixelSize;
			const countW = (Math.round((args.widthFactor || 1) * (w / pixelSize)));
			const countH = (Math.round((args.heightFactor || 1) * (h / pixelSize)));
			const image = countW && countH && virtaulContext.createImageData(countW, countH);
			let drawing;

			if (image && countW > 0 && countH > 0) {
				// Resize Canvas to new Windows-Size
				virtualCanvas.width = countW;
				virtualCanvas.height = countH;

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
					countW,
					countH,
				).get;

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

			return [w, h];
		},
	};
};
