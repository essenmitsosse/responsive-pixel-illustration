export const getDistanceY = (Distance, context) => class DistanceY extends Distance {
		axis = false;

		constructor(args) {
			super();
			this.prepare(args, context);
		}
};
