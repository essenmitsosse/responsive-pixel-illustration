import type { InputDimension } from "../../types";

export const getDistanceX = (Distance) =>
	class DistanceX extends Distance {
		axis = true;

		constructor(args: InputDimension) {
			super(true, args);
		}
	};
