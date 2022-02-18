import { getGetRealDistanceWithMaxMin } from "./getGetRealDistanceWithMaxMin";
import { getDistance } from "./getDistance";
import { getWidth } from "./getWidth";
import { getHeight } from "./getHeight";
import { getDistanceX } from "./getDistanceX";
import { getDistanceY } from "./getDistanceY";
import { getDimension } from "./getDimension";

export const get1D = function getOneD(context) {
	const contextInner = {};

	const Dimension = getDimension(contextInner);
	const Distance = getDistance(Dimension);
	const Width = getWidth(Dimension, context);
	const Height = getHeight(Dimension, context);
	const DistanceX = getDistanceX(Distance, context);
	const DistanceY = getDistanceY(Distance, context);

	contextInner.getGetLengthCalculation = (x, y) => {
		const sizeX = new Width(x);
		const sizeY = new Width(y);
		return () => Math.round(Math.sqrt(sizeX.getReal() ** 2 + sizeY.getReal() ** 2));
	};

	contextInner.getGetRealDistanceWithMaxMinWrapper = (max, min, dim) =>
		getGetRealDistanceWithMaxMin(max, min, dim ? Width : Height);

	contextInner.getSize = (dim) => (dim ? Height : Width);

	return {
		createSize: function (args) {
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
			const getRealPos = (add) => {
				const round = r;
				return add
					? function getRealPosAdd() {
							return round(this.realPartCalculation() + add);
					  }
					: function getRealPosStatic() {
							return round(this.realPartCalculation());
					  };
			};
			const getFromOtherSide = (add) => {
				const round = r;
				const width = w;
				const height = h;
				return add
					? function fromOtherSideAdd(size) {
							return (
								(this.axis ? width : height) +
								add -
								round(this.realPartCalculation() + size)
							);
					  }
					: function fromOtherSide(size) {
							return (
								(this.axis ? width : height) -
								round(this.realPartCalculation() + size)
							);
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
