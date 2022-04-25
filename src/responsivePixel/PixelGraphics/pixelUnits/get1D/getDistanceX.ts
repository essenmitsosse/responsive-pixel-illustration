import type { Size } from "../../types";

export const getDistanceX = (Distance) =>
	class DistanceX extends Distance {
		axis = true;

		constructor(args: Size) {
			super(true, args);
		}
	};
