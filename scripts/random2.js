"use strict";
var renderer = function (args) {
	args = args || {};

	var help = helper,
		getSmallerDim = help.getSmallerDim,
		getBiggerDim = help.getBiggerDim,
		mult = help.mult,
		sub = help.sub,
		ranInt = help.getRandomInt,
		nr = args.i.toString(2),
		s = (function () {
			var s = [],
				i = 5;

			if (nr.length < i) {
				nr = new Array(i - nr.length + 1).join("0") + nr;
			}

			while (i--) {
				s[i] = nr[i] === "1" ? true : false;
			}

			return s;
		})(),
		basicColor = [
			(s[0] ? 59 : 0) +
				(s[1] ? 59 : 0) +
				(s[2] ? 50 : 0) +
				(s[3] ? 35 : 0) +
				(s[4] ? 20 : 0) +
				32,
			(s[2] ? 59 : 0) +
				(s[3] ? 59 : 0) +
				(s[4] ? 50 : 0) +
				(s[0] ? 35 : 0) +
				(s[1] ? 20 : 0) +
				32,
			(s[4] ? 59 : 0) +
				(s[0] ? 59 : 0) +
				(s[1] ? 50 : 0) +
				(s[2] ? 35 : 0) +
				(s[3] ? 20 : 0) +
				32,
		],
		c1 = s[1]
			? [
					(basicColor[0] + 255) / 2,
					(basicColor[1] + 255) / 2,
					(basicColor[2] + 255) / 2,
				]
			: [
					(basicColor[1] + 255) / 2,
					(basicColor[2] + 255) / 2,
					(basicColor[0] + 255) / 2,
				],
		c2 = basicColor,
		c3 = s[2]
			? [basicColor[0] * 0.5, basicColor[1] * 0.5, basicColor[2] * 0.5]
			: [basicColor[1] * 0.5, basicColor[2] * 0.5, basicColor[0] * 0.5],
		c4 = s[3]
			? [basicColor[0] * 0.2, basicColor[1] * 0.2, basicColor[2] * 0.2]
			: [basicColor[2] * 0.2, basicColor[0] * 0.2, basicColor[1] * 0.2],
		backgroundColor = c4,
		b1 = [255, 0, 0],
		b2 = [0, 255, 255],
		renderList = [
			{
				m: "borderS",
				list: [
					{
						color: s[4] ? c2 : c3,
						list: [
							s[0]
								? s[1]
									? { sY: { r: 0.5 } }
									: {
											list: [
												{ sY: { r: 0.33 } },
												{ sY: { r: 0.33 }, fY: true },
											],
										}
								: undefined,
							s[2]
								? s[3]
									? { sX: { r: 0.5 } }
									: {
											list: [
												{ sX: { r: 0.33 } },
												{ sX: { r: 0.33 }, fX: true },
											],
										}
								: undefined,
						],
					},

					s[1] || s[2] || s[3] || s[4]
						? {
								color: s[1] ? c3 : s[2] ? c3 : s[3] ? c1 : c2,
								list: [
									{
										weight: s[1] ? 2 : 7,
										points: [{}, { fY: true, fX: true }],
									},
									{
										weight: s[1] ? 2 : 7,
										points: [{ fY: true }, { fX: true }],
									},
								],
							}
						: undefined,

					s[2] && s[4]
						? {
								color: s[1] ? c4 : c3,
								m: { r: 0.25 },
								list: [
									{},
									s[3]
										? { color: c2, m: { r: 0.2 } }
										: undefined,
								],
							}
						: undefined,
				],
			}, // END images

			{
				color: s[0] ? c3 : s[2] ? c3 : s[3] ? c1 : c4,
				list: [
					{ sY: "borderS" },
					{ sY: "borderS", fY: true },
					{ sX: "borderS" },
					{ sX: "borderS", fX: true },
				],
			},

			// { fX:true, fY:true, color:backgroundColor },

			{ s: 1, color: s[0] ? b1 : b2 },
			{ s: 1, x: 1, color: s[1] ? b1 : b2 },
			{ s: 1, x: 2, color: s[2] ? b1 : b2 },
			{ s: 1, x: 3, color: s[3] ? b1 : b2 },
			{ s: 1, x: 4, color: s[4] ? b1 : b2 },

			{ s: 2, fY: true, color: c1 },
			{ s: 2, x: 2, fY: true, color: c2 },
			{ s: 2, x: 4, fY: true, color: c3 },
			{ s: 2, x: 6, fY: true, color: c4 },

			// { color:[0,0,0] },
			// { m:{r:.2}, list:[
			// 	{ s:{ r:.5 }, color:c1 },

			// 	{ s:{ r:.5 }, fY:true, color:c2 },
			// 	{ s:{ r:.5 }, fX:true, color:c3 },
			// 	{ s:{ r:.5 }, fY:true, fX:true, color:c4 },
			// ]}
		],
		variableList = {
			"width": { r: 1 },
			"height": { r: 1, height: true },
			"squ": { a: "width", max: "height" },

			"borderS": {
				r: s[0] || s[3] ? (s[0] && s[3] ? 0.2 : 0.1) : 0,
				useSize: "squ",
			},

			"imgSX": ["width", mult(-2, "borderS")],
			"imgSY": ["height", mult(-2, "borderS")],

			"imgSqu": getSmallerDim({ r: 1, useSize: ["imgSX", "imgSY"] }),
		};

	console.log(nr, s, backgroundColor);

	return {
		renderList: renderList,
		variableList: variableList,
		background: backgroundColor,
	};
};
