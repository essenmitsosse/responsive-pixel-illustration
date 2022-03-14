import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export const recordImage: Record<
	string, { niceName: string; getImage: () => Promise<{ default: ImageFunction; }>; }
> = {
	teiresias: {
		niceName: "Teiresias",
		getImage: () => {
			return import("../responsivePixel/scripts/teiresias");
		},
	},
	graien: {
		niceName: "Graien",
		getImage: () => {
			return import("../responsivePixel/scripts/graien");
		},
	},
};
export const listPairImage = Object.entries(recordImage);
