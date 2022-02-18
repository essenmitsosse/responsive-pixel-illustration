export const getDistanceX = (Distance, context) =>
	class DistanceX extends Distance {
		axis = true;

		constructor(args) {
			super();
			this.prepare(args, context);
		}
	};
