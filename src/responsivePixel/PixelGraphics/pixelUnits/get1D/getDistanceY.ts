import type { InputDimension } from "../../types";

export const getDistanceY = (Distance) =>
	class DistanceY extends Distance {
		axis = false;

		constructor(args: InputDimension) {
			super(false, args);
		}
	};
