import { helper } from "../../renderengine/helper.js";

window.Builder = function (init) {
	var help = helper,
		getSmallerDim = help.getSmallerDim,
		getBiggerDim = help.getBiggerDim,
		mult = help.mult,
		sub = help.sub,
		margin = help.margin,
		initID = init.id ? init.id : Math.floor(Math.random() * 4294967296),
		random = help.random(initID),
		that = this,
		joinVariableList = {};

	this.help = help;

	this.getSmallerDim = getSmallerDim;
	this.getBiggerDim = getBiggerDim;
	this.mult = mult;
	this.sub = sub;
	this.margin = margin;

	this.IF = random.getIf;
	this.GR = random.getRandom;
	this.R = random.getRandomFloat;
	this.init = init;

	(this.colorInfo = {
		colors: 3,
		steps: 6,
	}),
		(this.Color.prototype.colors = this.buildColors(this.colorInfo));
	this.Color.prototype.Color = this.Color;

	this.backgroundColor = new this.Color(this.IF() ? 1 : 0, 5);
	this.backgroundShadowColor = this.backgroundColor.copy({ brAdd: -1 });

	this.objectCount = 0;

	this.Object.prototype.IF = this.IF;
	this.Object.prototype.GR = this.GR;
	this.Object.prototype.R = this.R;
	this.Object.prototype.mult = this.mult;
	this.Object.prototype.sub = this.sub;
	this.Object.prototype.margin = this.margin;
	this.Object.prototype.colorGen = this.colorGen;
	this.Object.prototype.Color = this.Color;
	this.Object.prototype.init = this.init;
	this.Object.prototype.vL = joinVariableList;
	this.Object.prototype.basic = this;

	return {
		Person: this.Person,
		Tree: this.Tree,
		basic: this,
		joinVariableList: joinVariableList,
		backgroundColor: this.backgroundColor,
		backgroundColorDark: this.backgroundColor.copy({
			nextColor: true,
			brSet: 0,
		}),
		Color: this.Color,
		colorInfo: this.colorInfo,
		colorScheme: this.colorScheme,
	};
};

Builder.prototype.buildColors = function (info) {
	var R = this.R,
		i = info.colors,
		colors = [],
		createColor = function () {
			var r = R(0, 200),
				g = R(0, 200),
				b = R(0, 200),
				br = Math.sqrt(
					0.241 * Math.pow(r, 2) +
						0.691 * Math.pow(g, 2) +
						0.068 * Math.pow(b, 2),
				),
				rgb = [r, g, b],
				steps = info.steps,
				maxBr = 255 / steps,
				startPos = Math.floor(br / maxBr),
				colorRange = [],
				i,
				fak;

			colorRange[startPos] = rgb;

			// DARKER COLORS
			i = startPos;
			fak = 1 / (i + 1);

			while (i--) {
				colorRange[i] = [
					r * fak * (i + 1) + 0 * (1 - fak * (i + 1)),
					g * fak * (i + 1) + 0 * (1 - fak * (i + 1)),
					b * fak * (i + 1) + 0 * (1 - fak * (i + 1)),
				];
			}

			// LIGHTER COLORS
			i = steps - startPos - 1;
			fak = 1 / (i + 1);

			while (i--) {
				colorRange[startPos + i + 1] = [
					r * (1 - fak * (i + 1)) + 255 * fak * (i + 1),
					g * (1 - fak * (i + 1)) + 255 * fak * (i + 1),
					b * (1 - fak * (i + 1)) + 255 * fak * (i + 1),
				];
			}

			colors.push(colorRange);
		};

	while (i--) {
		createColor();
	}

	return colors;
};

Builder.prototype.colorScheme = function () {
	var colors = this.Color,
		info = this.colorInfo,
		i = info.colors,
		j,
		steps = info.steps,
		list = [],
		s = 10,
		ss = s;

	while (i--) {
		j = steps;
		while (j--) {
			list.push({
				s: s,
				x: i * ss,
				y: j * ss,
				fY: true,
				color: new colors(i, j).get(),
			});
		}
	}

	return { z: 1000000, list: list };
};

Builder.prototype.Color = function (nr, br) {
	this.nr = nr;
	this.br = br;
};

Builder.prototype.Color.prototype.copy = function (args) {
	args = args || {};

	var color = new this.Color(
		args.nr !== undefined ? args.nr : this.nr,
		this.br,
	);

	if (args.nextColor) {
		color.nextColor();
	} else if (args.prevColor) {
		color.prevColor();
	}

	if (args.brSet !== undefined) {
		color.brightnessSet(args.brSet);
	} else if (args.brAdd) {
		color.brightnessAdd(args.brAdd);
	} else if (args.brContrast) {
		color.brightnessContrast(args.brContrast, args.min, args.max);
	}

	if (args.min && color.br < args.min) {
		color.br = args.min;
	}
	if (args.max && color.br > args.max) {
		color.br = args.max;
	}

	if (args.dontChange) {
		color.dontChange = true;
	}

	return color;
};

Builder.prototype.Color.prototype.nextColor = function () {
	this.nr += 1;
	if (this.nr > 2) {
		this.nr = 0;
	}
};

Builder.prototype.Color.prototype.prevColor = function () {
	this.nr -= 1;
	if (this.nr < 0) {
		this.nr = 2;
	}
};

Builder.prototype.Color.prototype.brightnessAdd = function (add) {
	this.br += add;

	if (this.br < 0) {
		this.br = 0;
	} else if (this.br > 5) {
		this.br = 5;
	}
};

Builder.prototype.Color.prototype.brightnessSet = function (set) {
	this.br = set;

	if (this.br < 0) {
		this.br = 0;
	} else if (this.br > 5) {
		this.br = 5;
	}
};

Builder.prototype.Color.prototype.brightnessContrast = function (
	add,
	min,
	max,
) {
	min = min || 0;
	max = max || 5;

	if (add < 0) {
		this.br += this.br + add < min ? -add : add;
	} else {
		this.br += this.br + add > max ? -add : add;
	}

	if (this.br < min) {
		this.br = min;
	} else if (this.br > max) {
		this.br = max;
	}
};

Builder.prototype.Color.prototype.getNormal = function () {
	if (!this.finalColor) {
		return (this.finalColor = this.colors[this.nr][this.br] || [
			200, 0, 155,
		]);
	}

	return this.finalColor;
};

Builder.prototype.Color.prototype.get =
	Builder.prototype.Color.prototype.getNormal;

Builder.prototype.Color.prototype.getBr = function () {
	return this.br;
};

Builder.prototype.getDark = function (darkness) {
	Builder.prototype.Color.prototype.get = function () {
		var br = this.dontChange ? this.br : this.br + darkness;

		if (br < 0) {
			br = 0;
		} else if (br > 5) {
			br = 5;
		}

		return (this.finalColor = this.colors[this.nr][br] || [200, 0, 155]);
	};
};

Builder.prototype.getNormalColor = function () {
	Builder.prototype.Color.prototype.get =
		Builder.prototype.Color.prototype.getNormal;
};

Builder.prototype.Object = function () {};
