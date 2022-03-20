import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export const recordImage: Record<
	string,
	{ niceName: string; getImage: () => Promise<{ default: ImageFunction }> }
> = {
	argos: {
		niceName: "Argos",
		getImage: () => {
			return import("../responsivePixel/scripts/argos");
		},
	},
	brothers: {
		niceName: "Brothers",
		getImage: () => {
			return import("../responsivePixel/scripts/brothers");
		},
	},
	graien: {
		niceName: "Graien",
		getImage: () => {
			return import("../responsivePixel/scripts/graien");
		},
	},
	sparta: {
		niceName: "Sparta",
		getImage: () => {
			return import("../responsivePixel/scripts/sparta");
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
