export const getDimension = (Axis) => class Dimensions {
	constructor(args, fromRight, fromBottom, rotate) {
		if (args.sX === undefined) {
			/* eslint-disable-next-line no-param-reassign */
			args.sX = args.s;
		}
		if (args.sY === undefined) {
			/* eslint-disable-next-line no-param-reassign */
			args.sY = args.s;
		}
		this.x = new Axis.X(rotate
			? {
				size: args.sY,
				pos: args.y,
				margin: args.mY || args.m,
				fromOtherSide: fromRight,
				toOtherSide: args.tY,
				min: args.minY,
				center: args.cY || args.c,
			}
			: {
				size: args.sX,
				pos: args.x,
				margin: args.mX || args.m,
				fromOtherSide: fromRight,
				toOtherSide: args.tX,
				min: args.minX,
				center: args.cX || args.c,
			});
		this.y = new Axis.Y(rotate ? {
			size: args.sX,
			pos: args.x,
			margin: args.mX || args.m,
			fromOtherSide: fromBottom,
			toOtherSide: args.tX,
			min: args.minX,
			center: args.cX || args.c,
		}
			: {
				size: args.sY,
				pos: args.y,
				margin: args.mY || args.m,
				fromOtherSide: fromBottom,
				toOtherSide: args.tY,
				min: args.minY,
				center: args.cY || args.c,
			});
	}

	calc() {
		this.x.calc();
		this.y.calc();
		return this;
	}

	checkMin() {
		return (this.x.realSize < 1
			|| (this.x.min && this.x.realSize < this.x.min.getReal()))
			|| (this.y.realSize < 1 || (this.y.min && this.y.realSize < this.y.min.getReal()));
	}

	get width() { return this.x.realSize; }

	get height() { return this.y.realSize; }

	get posX() { return this.x.realPos; }

	get posY() { return this.y.realPos; }

	get endX() { return this.x.realPos + this.x.realSize; }

	get endY() { return this.y.realPos + this.y.realSize; }
};
