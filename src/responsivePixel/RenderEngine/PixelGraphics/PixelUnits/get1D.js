import { getGetRealDistanceWithMaxMin } from './getGetRealDistanceWithMaxMin';

export const get1D = function getOneD(con) {
	function Dimension() { }
	function Distance() { }
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
				con.variableListLink(args.a, this);
			}
			if (args.add) {
				this.createAdder(args.add);
			}
			if (args.useSize) {
				if (typeof args.useSize === 'string') {
					con.variableListLink(args.useSize, this.useVari = {});
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
				this.realPartCalculation = this.saveDistance(con.variableListCreate(args.save));
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
				con.variableListLink(args, this);
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
		return () => Math.round(Math.sqrt(sizeX.getReal() ** 2 + sizeY.getReal() ** 2));
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
			if (args === undefined) {
				return 0;
			}
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
