import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export const recordImage: Record<
	string,
	{ niceName: string; getImage: () => Promise<{ default: ImageFunction }> }
> = {
	graien: {
		niceName: "Graien",
		getImage: () => {
			return import("../responsivePixel/scripts/graien");
		},
	},
	brothers: {
		niceName: "Brothers",
		getImage: () => {
			return import("../responsivePixel/scripts/brothers");
		},
	},
	teiresias: {
		niceName: "Teiresias",
		getImage: () => {
			return import("../responsivePixel/scripts/teiresias");
		},
	},
};
export const listPairImage = Object.entries(recordImage);
