export const getAxis = (oneD) => {
	const createAxis = (Size, P) => function A(args) {
		this.pos = new P(args.pos);
		this.size = new Size(args.size);
		this.margin = args.margin ? new Size(args.margin) : false;
		this.toOtherSide = args.toOtherSide;
		this.fromOtherSide = args.fromOtherSide;
		this.center = args.center;
		if (args.min) {
			this.min = new Size(args.min);
		}
		if (this.center) {
			this.calcPos = this.fromOtherSide
				? this.getCalcPos.fromOtherCenter : this.getCalcPos.center;
		} else if (this.toOtherSide) {
			this.calcPos = this.fromOtherSide
				? this.getCalcPos.fromOtherToOther : this.getCalcPos.toOther;
		} else {
			this.calcPos = this.fromOtherSide
				? this.getCalcPos.fromOther : this.getCalcPos.normal;
		}
	};
	const createPos = (Distance) => function P(args) {
		this.pos = new Distance(args.pos);
		this.toOtherSide = args.toOtherSide;
		this.fromOtherSide = args.fromOtherSide;
		this.center = args.center;
		if (this.center) {
			this.calcPos = this.fromOtherSide
				? this.getCalcPos.fromOtherCenter : this.getCalcPos.center;
		} else if (this.toOtherSide) {
			this.calcPos = this.fromOtherSide
				? this.getCalcPos.fromOtherToOther : this.getCalcPos.toOther;
		} else {
			this.calcPos = this.fromOtherSide
				? this.getCalcPos.fromOther : this.getCalcPos.normal;
		}
	};

	function Axis() { }
	const AxisX = createAxis(oneD.Width, oneD.DistanceX);
	const AxisY = createAxis(oneD.Height, oneD.DistanceY);
	function Pos() { }
	const PosX = createPos(oneD.DistanceX);
	const PosY = createPos(oneD.DistanceY);
	Axis.prototype = {
		get getSize() { return this.realSize; },
		get getPos() { return this.realPos; },
		get getEnd() { return this.realPos + this.realSize; },
	};
	Axis.prototype.calc = function () {
		this.realSize = this.size.getReal()
			- (this.realMargin = this.margin ? this.margin.getReal() : 0) * 2;
		this.realPos = this.calcPos();
	};
	Axis.prototype.getCalcPos = {
		normal() { return this.pos.getReal() + this.realMargin; },
		toOther() { return this.pos.getReal() + this.realMargin - this.realSize; },
		center() { return this.pos.getReal() + Math.floor((this.dim - this.realSize) / 2); },
		fromOther() { return this.pos.fromOtherSide(this.realSize) - this.realMargin; },
		fromOtherToOther() { return this.pos.fromOtherSide(0) + this.realMargin; },
		fromOtherCenter() {
			return this.pos.fromOtherSide(this.realSize) - Math.floor((this.dim - this.realSize) / 2);
		},
	};
	AxisX.prototype = new Axis();
	AxisY.prototype = new Axis();
	Pos.prototype = new Axis();
	Pos.prototype.calc = function calc() {
		return this.calcPos();
	};
	Pos.prototype.getCalcPos = {
		normal() { return this.pos.getReal(); },
		toOther() { return this.pos.getReal() - 1; },
		center() { return this.pos.getReal() + Math.floor(this.dim / 2); },
		fromOther() { return this.pos.fromOtherSide(1); },
		fromOtherToOther() { return this.pos.fromOtherSide(0); },
		fromOtherCenter() { return this.pos.fromOtherSide(1) - Math.floor(this.dim / 2); },
	};
	PosX.prototype = new Pos();
	PosY.prototype = new Pos();
	return {
		X: AxisX,
		Y: AxisY,
		PosX,
		PosY,
		set(dimensions) {
			PosX.prototype.dim = dimensions.width;
			PosY.prototype.dim = dimensions.height;
			AxisX.prototype.dim = dimensions.width;
			AxisY.prototype.dim = dimensions.height;
		},
	};
};
