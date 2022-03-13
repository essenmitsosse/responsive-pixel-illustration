export const getDistanceX = (Distance) =>
	class DistanceX extends Distance {
		axis = true;

		constructor(args) {
			super(true, args);
		}
	};
