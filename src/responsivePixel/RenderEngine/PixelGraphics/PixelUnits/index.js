import { getGetRealDistanceWithMaxMin } from './getGetRealDistanceWithMaxMin';

export const PixelUnits = () => {
	const old = [];
	let variableListLink;
	let variableListCreate;
	let updateList;
	let calculateList;

	const get1D = function getOneD() {
		function Dimension() {}
		function Distance() {}
		function Width(args) { this.prepare(args); }
		function Height(args) { this.prepare(args); }
		function DistanceX(args) { this.prepare(args); }
		function DistanceY(args) { this.prepare(args); }

		// DIMENSIONS --- Width & Height
		Dimension.prototype.prepare = function (args) {
			const objType = typeof args;
			if (objType === 'object') { // is Object
				if (args.constructor === Array) { // is Array
					this.createAdder(args, true);
					return;
				}
				if (args.getLinkedVariable) { // Linked to Variable ( new style )
					this.realPartCalculation = args.getLinkedVariable;
					return;
				}
				if (args.getLength) {
					this.realPartCalculation = this.getGetLengthCalculation(
						args.getLength[0],
						args.getLength[1],
					);
					return;
				}
				this.debug = args.debug;
				if (typeof args.a === 'string') {
					variableListLink(args.a, this);
				}
				if (args.add) {
					this.createAdder(args.add);
				}
				if (args.useSize) {
					if (typeof args.useSize === 'string') {
						variableListLink(args.useSize, this.useVari = {});
					} else if (args.useSize.getLinkedVariable) {
						this.useSize = args.useSize.getLinkedVariable;
					} else {
						// errorAdd( "useSize must be a String" )
					}
				} else {
					this.dim = !args.height && (args.otherDim ? !this.axis : this.axis);
				}
				// Get gefaults and try to do quick version
				if (this.getDefaults(args.r, args.a) && !args.useSize && !args.add) {
					this.realPartCalculation = this.getQuick;
				} else {
					this.realPartCalculation = (args.min || args.max)
						? getGetRealDistanceWithMaxMin(args.max, args.min, (this.dim ? Width : Height))
						: this.getRealDistance;
				}
				if (args.save) {
					this.realPartCalculation = this.saveDistance(variableListCreate(args.save));
				}
				if (args.odd || args.even) {
					this.realPartCalculation = this.odd(args.odd || false);
				}
			} else { // Short Hand Variables
				if (objType === 'number') {
					if (this.dimension) { // No calculation, just return Number
						this.simplify(args);
						return;
					}
					this.abs = args;
					this.rele = 0;
				} else if (objType === 'string') { // Linked to Variable ( old style )
					variableListLink(args, this);
					this.rele = 0;
					this.realPartCalculation = this.getRealDistance;
					return;
				} else {
					this.dim = this.axis;
					if (this.getDefaults()) {
						this.realPartCalculation = this.getQuick;
						return;
					}
				}
				this.realPartCalculation = this.getRealDistance;
			}
		};
		Dimension.prototype.saveDistance = function (saver) {
			this.getRealForSave = this.realPartCalculation;
			return function () {
				const real = this.getRealForSave();
				saver.set(real);
				return real;
			};
		};
		Dimension.prototype.odd = function (isOdd) {
			this.getRealForOdd = this.realPartCalculation;
			return function () {
				const real = Math.round(this.getRealForOdd());
				if (real === 0) {
					return 0;
				}
				const realIsOdd = !(real % 2) === false;
				return (realIsOdd === isOdd
					? real
					: real + 1);
			};
		};
		Dimension.prototype.getDefaults = function (r, a) {
			if (r === undefined && a === undefined && this.adder === undefined) {
				this.rele = 1;
				this.abs = 0;
				return true;
			}
			this.rele = r || 0;
			this.abs = a || 0;
			return false;
		};
		Dimension.prototype.getQuick = function () {
			if (this.useSize) {
				return this.rele * this.useSize();
			}
			return this.rele * (this.dim ? this.width : this.height);
		};
		Dimension.prototype.createAdder = function (add, onlyAdd) {
			const Size = this.dim ? Height : Width;
			this.adder = add.map((value) => new Size(value));
			this[onlyAdd ? 'realPartCalculation' : 'getRealDistance'] = onlyAdd ? this.getRealDistanceWithCalcOnlyAdding : this.getRealDistanceWithCalc;
		};
		Dimension.prototype.getGetLengthCalculation = function (x, y) {
			const sizeX = new Width(x);
			const sizeY = new Width(y);
			return () => Math.round(
				Math.sqrt(sizeX.getReal() ** 2 + sizeY.getReal() ** 2),
			);
		};
		Dimension.prototype.getReal = function () {
			return Math.round(this.realPartCalculation());
		};
		Dimension.prototype.getRealUnrounded = function () {
			return this.realPartCalculation();
		};
		Dimension.prototype.getRealDistanceBasic = function () {
			if (this.useVari) {
				return this.rele * this.useVari.abs + this.abs;
			}
			if (this.useSize) {
				return this.rele * this.useSize() + this.abs;
			}
			return (this.rele * (this.dim ? this.width : this.height) + this.abs);
		};
		Dimension.prototype.getRealDistance = Dimension.prototype.getRealDistanceBasic;
		Dimension.prototype.getRealDistanceWithCalc = function () {
			return this.getRealDistanceBasic() + this.getRealDistanceWithCalcOnlyAdding();
		};
		Dimension.prototype.getRealDistanceWithCalcOnlyAdding = function () {
			let add = 0;
			this.adder.forEach((value) => { add += value.getReal(); });
			return add;
		};
		Dimension.prototype.getDim = function () { return this.dim ? this.width : this.height; };
		Dimension.prototype.dimension = true;
		Dimension.prototype.simplify = function (abs) {
			this.getReal = () => abs;
		};
		Width.prototype = new Dimension();
		Height.prototype = new Dimension();
		Width.prototype.axis = true;
		Height.prototype.axis = false;
		// DISTANCES --- PosX & PosY
		Distance.prototype = new Dimension();
		Distance.prototype.getDefaults = function (r, a) {
			if (r === undefined && a === undefined) {
				this.rele = 0;
				this.abs = 0;
				return true;
			}
			this.rele = r || 0;
			this.abs = a || 0;
			return false;
		};
		Distance.prototype.getQuick = function () {
			return 0;
		};
		Distance.prototype.dimension = false;
		DistanceX.prototype = new Distance();
		DistanceY.prototype = new Distance();
		DistanceX.prototype.axis = true;
		return {
			createSize: (args) => {
				if (args === undefined) { return 0; }
				return args.height ? new Height(args) : new Width(args);
			},
			Width,
			Height,
			DistanceX,
			DistanceY,
			set(dimensions) {
				const r = Math.round;
				const x = dimensions.posX || 0;
				const y = dimensions.posY || 0;
				const w = dimensions.width;
				const h = dimensions.height;
				const getRealPos = function (add) {
					const round = r;
					return add
						? function getRealPosAdd() { return round(this.realPartCalculation() + add); }
						: function getRealPosStatic() { return round(this.realPartCalculation()); };
				};
				const getFromOtherSide = function (add) {
					const round = r;
					const width = w;
					const height = h;
					return add
						? function fromOtherSideAdd(size) {
							return (this.axis ? width : height)
									+ add
									- round(this.realPartCalculation() + size);
						}
						: function fromOtherSide(size) {
							return (this.axis ? width : height)
									- round(this.realPartCalculation() + size);
						};
				};
				DistanceX.prototype.getReal = getRealPos(x);
				DistanceY.prototype.getReal = getRealPos(y);
				DistanceX.prototype.fromOtherSide = getFromOtherSide(x);
				DistanceY.prototype.fromOtherSide = getFromOtherSide(y);
				Dimension.prototype.width = w;
				Dimension.prototype.height = h;
			},
		};
	};

	const getAxis = (oneD) => {
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
		function Axis() {}
		const AxisX = createAxis(oneD.Width, oneD.DistanceX);
		const AxisY = createAxis(oneD.Height, oneD.DistanceY);
		function Pos() {}
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
			normal() 	{ return this.pos.getReal() + this.realMargin; },
			toOther() 	{ return this.pos.getReal() + this.realMargin - this.realSize; },
			center() 	{ return this.pos.getReal() + Math.floor((this.dim - this.realSize) / 2); },

			fromOther() 	{ return this.pos.fromOtherSide(this.realSize) - this.realMargin; },
			fromOtherToOther() 	{ return this.pos.fromOtherSide(0) + this.realMargin; },
			fromOtherCenter() 	{
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
			normal() 	{ return this.pos.getReal(); },
			toOther() 	{ return this.pos.getReal() - 1; },
			center() 	{ return this.pos.getReal() + Math.floor(this.dim / 2); },

			fromOther() 	{ return this.pos.fromOtherSide(1); },
			fromOtherToOther() 	{ return this.pos.fromOtherSide(0); },
			fromOtherCenter() 	{ return this.pos.fromOtherSide(1) - Math.floor(this.dim / 2); },
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

	const get2D = (Axis) => {
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
			/* eslint-disable-next-line no-param-reassign */
			if (args.sX === undefined) { args.sX = args.s; }
			/* eslint-disable-next-line no-param-reassign */
			if (args.sY === undefined) { args.sY = args.s; }

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
			return (
				this.x.realSize < 1
				|| (this.x.min && this.x.realSize < this.x.min.getReal()))
				|| (this.y.realSize < 1 || (this.y.min && this.y.realSize < this.y.min.getReal()));
		};

		return {
			Position,
			Dimensions,
		};
	};

	const oneD = get1D();
	const Axis = getAxis(oneD);
	const twoD = get2D(Axis);

	return {
		Position: twoD.Position,
		Dimensions: twoD.Dimensions,
		createSize: oneD.createSize,
		Width: oneD.Width,
		Height: oneD.Height,
		setList(args) {
			variableListLink = args.listLink;
			variableListCreate = args.listCreate;
			updateList = args.updater;
		},
		linkList(calc) {
			calculateList = calc;
		},
		init(dimensions) {
			oneD.set(dimensions);
			Axis.set(dimensions);
			if (calculateList) { calculateList(dimensions); }
			if (updateList) { updateList(); }
		},
		pop() {
			const o = old[old.length - 2];
			if (o) {
				oneD.set(o);
				Axis.set(o);
				old.pop();
			}
		},
		push(dimensions) {
			oneD.set(dimensions);
			Axis.set(dimensions);
			old.push(dimensions);
		},
	};
};
