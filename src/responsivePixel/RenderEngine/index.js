import { PixelGraphics } from './PixelGraphics';

class RenderEngine {
	constructor(args) {
		this.renderer = new PixelGraphics({
			imageFunction: args.imageFunction,
			pixelSize:
				args.pixelSize
				|| args.imageFunction.recommendedPixelSize
				|| 5,
			divCanvas: args.divCanvas,
		});
	}
}

export { RenderEngine };
