export const getDistanceY = (Distance) =>
	class DistanceY extends Distance {
		axis = false;

		constructor(args) {
			super(false, args);
		}
	};
