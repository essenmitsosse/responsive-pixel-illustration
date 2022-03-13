export const getHeight = (Dimension) =>
	class Height extends Dimension {
		axis = false;

		constructor(args) {
			super(false, true, args);
		}
	};

export type Height = ReturnType<typeof getHeight>;
