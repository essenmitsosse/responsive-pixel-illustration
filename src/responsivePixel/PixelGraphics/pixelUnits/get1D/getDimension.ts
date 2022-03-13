import type { ContextInner } from ".";
import type { InputDimension } from "../../types";

export const getDimension = (contextInner: ContextInner, context) =>
	class Dimension {
		dimension: boolean;
		axis: boolean;
		contextInner = contextInner;
		context = context;
		debug = false;
		abs!: number;
		rele!: number;
		getRealDistance = this.getRealDistanceBasic;
		realPartCalculation?: () => number;

		constructor(axis: boolean, dimension: boolean, args: InputDimension) {
			this.axis = axis;
			this.dimension = dimension;

			if (typeof args === "object") {
				// is Object
				if (args.constructor === Array) {
					// is Array
					this.createAdder(args, true);
					return;
				}
				if ("getLinkedVariable" in args) {
					// Linked to Variable ( new style )
					this.realPartCalculation = args.getLinkedVariable;
					return;
				}
				if (args.getLength) {
					this.realPartCalculation = this.contextInner.getGetLengthCalculation(
						args.getLength[0],
						args.getLength[1]
					);
					return;
				}
				this.debug = !!args.debug;
				if ("a" in args && typeof args.a === "string") {
					this.context.variableListLink(args.a, this);
				}
				if (args.add) {
					this.createAdder(args.add);
				}
				if (args.useSize) {
					if (typeof args.useSize === "string") {
						this.context.variableListLink(args.useSize, (this.useVari = {}));
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
					this.realPartCalculation =
						args.min || args.max
							? this.contextInner.getGetRealDistanceWithMaxMinWrapper(
									args.max,
									args.min,
									this.dim
							  )
							: this.getRealDistance;
				}
				if (args.save) {
					this.realPartCalculation = this.getSaveDistance(
						this.context.variableListCreate(args.save)
					);
				}
				if (args.odd || args.even) {
					this.realPartCalculation = this.getOdd(args.odd || false);
				}
			} else {
				// Short Hand Variables
				if (typeof args === "number") {
					if (this.dimension) {
						// No calculation, just return Number
						this.simplify(args);
						return;
					}
					this.abs = args;
					this.rele = 0;
				} else if (typeof args === "string") {
					// Linked to Variable ( old style )
					this.context.variableListLink(args, this);
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
		}

		getSaveDistance(saver) {
			this.getRealForSave = this.realPartCalculation;
			return function saveDistance() {
				const real = this.getRealForSave();
				saver.set(real);
				return real;
			};
		}

		getOdd(isOdd) {
			this.getRealForOdd = this.realPartCalculation;
			return function odd() {
				const real = Math.round(this.getRealForOdd());
				if (real === 0) {
					return 0;
				}
				const realIsOdd = !(real % 2) === false;
				return realIsOdd === isOdd ? real : real + 1;
			};
		}

		getDefaults(r, a) {
			if (r === undefined && a === undefined && this.adder === undefined) {
				this.rele = 1;
				this.abs = 0;
				return true;
			}
			this.rele = r || 0;
			this.abs = a || 0;
			return false;
		}

		getQuick() {
			if (this.useSize) {
				return this.rele * this.useSize();
			}
			return this.rele * (this.dim ? this.width : this.height);
		}

		createAdder(add, onlyAdd) {
			const Size = this.contextInner.getSize(this.dim);
			this.adder = add.map((value) => new Size(value));
			this[onlyAdd ? "realPartCalculation" : "getRealDistance"] = onlyAdd
				? this.getRealDistanceWithCalcOnlyAdding
				: this.getRealDistanceWithCalc;
		}

		getReal() {
			return Math.round(this.realPartCalculation());
		}

		getRealUnrounded() {
			return this.realPartCalculation();
		}

		getRealDistanceBasic() {
			if (this.useVari) {
				return this.rele * this.useVari.abs + this.abs;
			}
			if (this.useSize) {
				return this.rele * this.useSize() + this.abs;
			}
			return this.rele * (this.dim ? this.width : this.height) + this.abs;
		}

		getRealDistanceWithCalc() {
			return this.getRealDistanceBasic() + this.getRealDistanceWithCalcOnlyAdding();
		}

		getRealDistanceWithCalcOnlyAdding() {
			let add = 0;
			this.adder.forEach((value) => {
				add += value.getReal();
			});
			return add;
		}

		getDim() {
			return this.dim ? this.width : this.height;
		}

		simplify(abs) {
			this.getReal = () => abs;
		}
	};

export type Dimension = ReturnType<typeof getDimension>;
