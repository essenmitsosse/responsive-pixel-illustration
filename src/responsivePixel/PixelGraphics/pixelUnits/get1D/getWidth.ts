export const getWidth = (Dimension) =>
	class Width extends Dimension {
		constructor(args) {
			super(true, true, args);
		}
	};

export type Width = ReturnType<typeof getWidth>;
