import { getObj } from "./getObj";
import { getSeed } from "./getSeed";
import { PixelSetter } from "./PixelSetter";

class DrawingTools {
	constructor(args) {
		this.pixelUnit = args.pixelUnit;
		this.seed = getSeed(args.getRandom);
		this.pixelSetter = new PixelSetter();
		this.Obj = getObj(this.pixelSetter, this.seed, args.pixelUnit);
	}

	public init(width, height, pixelArray) {
		this.pixelUnit.init({
			width,
			height,
		});
		this.pixelSetter.init(pixelArray);
		this.seed.reset();
	}
}

export { DrawingTools };
