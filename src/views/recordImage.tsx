import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export const recordImage: Record<
	string,
	{ niceName: string; getImage: () => Promise<{ default: ImageFunction }> }
> = {
	argos: {
		niceName: "Argos",
		getImage: () => {
			return import("../responsivePixel/images/argos");
		},
	},
	brothers: {
		niceName: "Brothers",
		getImage: () => {
			return import("../responsivePixel/images/brothers");
		},
	},
	graien: {
		niceName: "Graien",
		getImage: () => {
			return import("../responsivePixel/images/graien");
		},
	},
	sphinx: {
		niceName: "Sphinx",
		getImage: () => {
			return import("../responsivePixel/images/sphinx");
		},
	},
	sparta: {
		niceName: "Sparta",
		getImage: () => {
			return import("../responsivePixel/images/sparta");
		},
	},
	tantalos: {
		niceName: "Tantalos",
		getImage: () => {
			return import("../responsivePixel/images/tantalos");
		},
	},
	teiresias: {
		niceName: "Teiresias",
		getImage: () => {
			return import("../responsivePixel/images/teiresias");
		},
	},
	stripes: {
		niceName: "Stripes",
		getImage: () => {
			return import("../responsivePixel/images/stripes");
		},
	},
};
export const listPairImage = Object.entries(recordImage);
