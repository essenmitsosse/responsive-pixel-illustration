import { Axis } from "./Axis";

export const createAxis = (Size, P) =>
	class A extends Axis {
		constructor(args) {
			super();
			this.pos = new P(args.pos);
			this.size = new Size(args.size);
			this.margin = args.margin ? new Size(args.margin) : false;
			this.toOtherSide = args.toOtherSide;
			this.fromOtherSide = args.fromOtherSide;
			this.center = args.center;
			if (args.min) {
				this.min = new Size(args.min);
			}
			this.assignMethods();
		}
	};
