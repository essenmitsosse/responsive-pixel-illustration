import { getObj } from "./getObj";
import { Seed } from "./Seed";
import { PixelSetter } from "./PixelSetter";
import { GetRandom } from "../getGetRandom";

const getDrawingTools = (pixelGraphics: { pixelUnit; getRandom: GetRandom }) => {
	const pixelUnit = pixelGraphics.pixelUnit;
	const seed = new Seed(pixelGraphics.getRandom);
	const pixelSetter = new PixelSetter();

	return {
		Obj: getObj(pixelSetter, seed, pixelGraphics.pixelUnit),
		init(width, height, pixelArray) {
			pixelUnit.init({
				width,
				height,
			});
			pixelSetter.init(pixelArray);
			seed.reset();
		},
	};
};

export { getDrawingTools };
