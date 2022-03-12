export const getHeight = (Dimension, context) =>
	class Height extends Dimension {
		axis = false;

		constructor(args) {
			super();
			this.prepare(args, context);
		}
	};
