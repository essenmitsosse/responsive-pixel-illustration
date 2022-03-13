import type { InputDimension } from "../../types";

export const getWidth = (Dimension) =>
	class Width extends Dimension {
		constructor(args: InputDimension) {
			super(true, true, args);
		}
	};

export type Width = ReturnType<typeof getWidth>;
