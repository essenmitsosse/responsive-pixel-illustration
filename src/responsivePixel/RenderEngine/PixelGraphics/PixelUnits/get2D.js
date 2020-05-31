export const get2D = (Axis) => {
	const XAxis = Axis.X;
	const YAxis = Axis.Y;
	const Position = (args, reflectX, reflectY, rotate) => {
		const fromRight = (args.fX || false) !== reflectX;
		const fromBottom = (args.fY || false) !== reflectY;
		const x = new Axis.PosX(rotate
			? {
				pos: args.y,
				fromOtherSide: !fromBottom,
				toOtherSide: args.toTop,
				center: args.centerX || args.center,
			}
			: {
				pos: args.x,
				fromOtherSide: fromRight,
				toOtherSide: args.toLeft,
				center: args.centerY || args.center,
			});
		const y = new Axis.PosY(rotate
			? {
				pos: args.x,
				fromOtherSide: fromRight,
				toOtherSide: args.toLeft,
				center: args.centerX || args.center,
			}
			: {
				pos: args.y,
				fromOtherSide: fromBottom,
				toOtherSide: args.toTop,
				center: args.centerY || args.center,
			});
		return () => ({
			x: x.calc(),
			y: y.calc(),
		});
	};
	const Dimensions = function (args, fromRight, fromBottom, rotate) {
		if (args.sX === undefined) {
			/* eslint-disable-next-line no-param-reassign */
			args.sX = args.s;
		}
		if (args.sY === undefined) {
			/* eslint-disable-next-line no-param-reassign */
			args.sY = args.s;
		}
		this.x = new XAxis(rotate
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
		this.y = new YAxis(rotate ? {
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
	};
	Dimensions.prototype = {
		get width() { return this.x.realSize; },
		get height() { return this.y.realSize; },
		get posX() { return this.x.realPos; },
		get posY() { return this.y.realPos; },
		get endX() { return this.x.realPos + this.x.realSize; },
		get endY() { return this.y.realPos + this.y.realSize; },
	};
	Dimensions.prototype.calc = function () {
		this.x.calc();
		this.y.calc();
		return this;
	};
	Dimensions.prototype.checkMin = function () {
		return (this.x.realSize < 1
			|| (this.x.min && this.x.realSize < this.x.min.getReal()))
			|| (this.y.realSize < 1 || (this.y.min && this.y.realSize < this.y.min.getReal()));
	};
	return {
		Position,
		Dimensions,
	};
};
