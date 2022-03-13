import { getObj } from "./getObj";
import { PixelSetter } from "./PixelSetter";

const getSeed = (getRandom) => {
	const getSeed = getRandom().seed;
	let count = 0;
	const i = [];

	return {
		reset() {
			let l = count;
			while (l--) {
				i[l] = 0;
			}
		},
		get(j) {
			const seed = j || getSeed();
			const nr = (count += 1);

			return function () {
				return getRandom(seed + i[nr]++ || 0);
			};
		},
	};
};

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
