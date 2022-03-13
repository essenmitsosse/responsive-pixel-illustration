import { getObj } from "./getObj";

class DrawingTools {
	constructor(args) {
		const { pixelUnit, getRandom } = args;

		this.seed = (function (getRandom) {
			const getSeed = getRandom().seed;
			let count = 0;
			const i = [];

			return {
				reset() {
					let l = count;
					while (l--) {
						i[l] = 0;
					}
				},
				get(j) {
					const seed = j || getSeed();
					const nr = (count += 1);

					return function () {
						return getRandom(seed + i[nr]++ || 0);
					};
				},
			};
		})(getRandom);

		this.pixelSetter = (function () {
			let colorArray;
			const formSave = {};
			const getSet = function (color, zInd, id) {
				return function () {
					return colorArray.getSet(color, zInd, id);
				};
			};
			const getClear = function (id) {
				return function () {
					return colorArray.getClear(id);
				};
			};
			const getSetForRect = function (color, zInd, id) {
				return function () {
					return colorArray.getSetForRect(color, zInd, id);
				};
			};
			const getClearForRect = function (id) {
				return function () {
					return colorArray.getClearForRect(id);
				};
			};
			const getSave = function (name, isRect) {
				return function () {
					const thisSave = formSave[name] ? formSave[name] : (formSave[name] = {});
					const save = thisSave.save ? thisSave.save : (thisSave.save = []);
					const mask = thisSave.mask ? thisSave.mask : (thisSave.mask = []);

					return isRect
						? colorArray.getSaveForRect(save, mask)
						: function (x, y) {
								save.push([x, y]);

								if (!mask[x]) {
									mask[x] = [];
								}
								mask[x][y] = true;
						  };
				};
			};
			const getClearSave = function (name, isRect) {
				return function () {
					const thisSave = formSave[name];
					let save;
					let mask;

					if (thisSave) {
						save = thisSave.save;
						mask = thisSave.mask;

						return isRect ? colorArray.getClearSaveForRect(save, mask) : function () {};
					}
				};
			};
			const getColorMask = function (dimensions, push) {
				return colorArray.setMask(dimensions, push);
			};

			return {
				setArray(newArray) {
					const forms = formSave;
					let key;

					for (key in forms) {
						forms[key] = [];
					}

					colorArray = newArray;
				},

				setColorArray(color, clear, zInd, id, isRect, save) {
					return clear
						? isRect
							? save
								? getClearSave(save, isRect)
								: getClearForRect(id)
							: save
							? getClearSave(save, isRect)
							: getClear(id)
						: color
						? isRect
							? getSetForRect(color, zInd, id)
							: getSet(color, zInd, id)
						: save
						? getSave(save, isRect)
						: undefined;
				},

				setColorMask: getColorMask,

				getSave(name) {
					return formSave[name] ? formSave[name].save : false;
				},

				getMask(name) {
					return formSave[name] ? formSave[name].mask : false;
				},
			};
		})();

		this.init = function (width, height, pixelArray) {
			pixelUnit.init({
				width,
				height,
			});

			this.pixelSetter.setArray(pixelArray);
			this.seed.reset();
		};

		this.Obj = getObj(this, pixelUnit);
	}
}

export { DrawingTools };
