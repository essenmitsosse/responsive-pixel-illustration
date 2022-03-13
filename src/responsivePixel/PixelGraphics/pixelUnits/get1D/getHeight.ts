import type { InputDimension } from "../../types";

export const getHeight = (Dimension) =>
	class Height extends Dimension {
		axis = false;

		constructor(args: InputDimension) {
			super(false, true, args);
		}
	};

export type Height = ReturnType<typeof getHeight>;
