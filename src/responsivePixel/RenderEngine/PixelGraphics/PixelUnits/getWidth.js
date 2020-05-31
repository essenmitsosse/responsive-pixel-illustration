export const getWidth = (Dimension, context) => class Width extends Dimension {
		axis = true;

		constructor(args) {
			super();
			this.prepare(args, context);
		}
};
