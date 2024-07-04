/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Builder from "./builder";
const renderer = function (init) {
	init = init || {};

	const help = helper;
	const { getSmallerDim } = help;
	const { getBiggerDim } = help;
	const { mult } = help;
	const { sub } = help;
	const { margin } = help;

	const rows = init.rows || 3;
	const fields = init.vari || 1;
	const fieldsCount = 1 + (fields - 1) * 0.7;
	const cols = Math.floor((2 * rows) / fieldsCount) || 1;

	const builder = new Builder(init);

	const getRow = function (cols) {
		const all = [];

		while (cols--) {
			all.push({
				list: getCols(builder.Person, true, cols),
				x: mult(fieldsCount * cols, "personS"),
			});
		}

		return all;
	};

	var getCols = function (func, isCol, nr, nr2) {
		let i = 0;
		const max = isCol ? rows : fields;
		const list = [];
		let thisWid;
		let pos;
		let size;
		const dir = isCol ? "Y" : "X";
		const args = {};
		const { R } = builder.basic;
		const { IF } = builder.basic;
		const { GR } = builder.basic;

		const eyeLookVert = ["", "", "", "left", "right"];
		const eyeLookHor = [
			"",
			"",
			"",
			"",
			"",
			"up",
			"down",
			"up",
			"down",
			"verDown",
		];
		const eyeLids = [
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"halfClosed",
			"halfClosed",
			"halfClosed",
			"closed",
			"closed",
			"wink",
		];
		const eyeBrow = [
			"",
			"",
			"",
			"raised",
			"low",
			"sceptical",
			"superSceptical",
			"angry",
			"sad",
		];

		const mouthHeight = [
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"slight",
			"slight",
			"half",
			"full",
		];
		const mouthWid = ["", "", "", "narrow"];
		const mouthForm = ["", "", "", "sceptical", "grin", "D:"];

		const legPos = [
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"legRaise",
			// "kneeBend", "legHigh"
		];

		const teethPos = ["", "top", "bottom", "both", "full"];
		const shoulderPos = [0, 0, 0, 0, 0, -90, -90, 180];
		const ellbowPos = [0, 0, 0, 90, -90];

		const views = [
			"",
			"",
			"",
			"",
			"",
			"",
			"rightView",
			"leftView",
			"rightView",
			"leftView",
			"rightView",
			"leftView",
			"rightView",
			"leftView",
			"backView",
		];

		for (const attr in init) {
			args[attr] = init[attr];
		}

		while (i < max) {
			pos = { r: i * (!isCol ? 0.7 : 1), useSize: "personS" };

			if (!isCol) {
				// args.view = views[ Math.floor( Math.random() * views.length ) ];

				args.eye = {
					lookVert: eyeLookVert[GR(0, eyeLookVert.length)],
					lookHor: eyeLookHor[GR(0, eyeLookHor.length)],
					lids: eyeLids[GR(0, eyeLids.length)],
					brow: eyeBrow[GR(0, eyeBrow.length)],
				};

				args.mouth = {
					height: mouthHeight[GR(0, mouthHeight.length)],
					width: mouthWid[GR(0, mouthWid.length)] && "narrowSide",
					form: mouthForm[GR(0, mouthForm.length)],
					teeth: teethPos[GR(0, teethPos.length)],
					smirk: IF(0.08),
				};

				args.shoulder = {
					left: IF(0.8) && Math.pow(R(0, 1), 3),
					right: IF(0.8) && Math.pow(R(0, 1), 3),
				};

				args.arm = {
					left:
						args.shoulder.left > 0.55
							? R(0, 0.5)
							: IF(0.8)
								? R(0, 1) * 1.5 - 0.75
								: R(0, 1) * 0.5 - 0.25,
					right:
						args.shoulder.right > 0.55
							? R(0, 0.5)
							: IF(0.8)
								? R(0, 1) * 1.5 - 0.75
								: R(0, 1) * 0.5 - 0.25,
				};

				args.finger = {
					left: IF(0.1),
					right: IF(0.1),
				};

				args.leg = {};
				args.leg[IF(0.5) ? "right" : "left"] =
					legPos[GR(0, legPos.length)];

				args.hatDown = IF(0.02);

				if (init.demo && !init.pose) {
					args.eye = false;
					args.mouth = false;
					args.shoulder = false;
					args.arm = false;
					args.finger = false;
					args.leg = false;
					args.hatDown = false;
				}

				// args.view = "backView";
				// args.view = "leftView";

				// args.shoulder = { right : 0,	left : 180 };
				// args.ellbow = 	{ right : -90,	left : -90 };
				// args.hand = 	{ right : 90,	left : 90 };

				switch (i) {
					case 0:
						args.view = "";
						break;
					case 1:
						args.view = "leftView";
						break;
					case 2:
						args.view = "backView";
						break;
					case 3:
						args.view = "rightView";
						break;
				}

				args.size = "personInnerS";
			} else {
				args.groundShadowColor = builder.backgroundColor.copy({
					brAdd: -1,
				});
			}

			list.push(
				isCol
					? {
							y: pos,
							s: "personS",
							list: [
								{
									s: "personInnerS",
									c: true,
									list: getCols(new func(args), false, i, nr),
								},
							],
						}
					: { x: pos, list: func.draw(args) },
			);
			i += 1;
		}

		return list;
	};

	const colorChart3 = function (colors, info) {
		let i = info.colors;
		let j;
		const { steps } = info;
		const list = [];
		const s = 10;
		const ss = s;

		while (i--) {
			j = steps;
			while (j--) {
				list.push({
					s,
					x: i * ss,
					y: j * ss,
					fY: true,
					color: new colors(i, j).get(),
				});
			}
		}

		return { z: 1000000, list };
	};

	// person = new builder.Person(),

	const renderList = [
		{ sY: mult(rows, "personS"), cY: true, list: getRow(cols) },
		init.cs === "true" && builder.colorScheme(),

		// { color:builder.backgroundColorDark },
		// {
		// 	color:builder.backgroundColor,
		// 	mY:{r:.02},
		// 	list:[
		// 		{ sX:"third", list:[
		// 			{},
		// 			{ s:"personBigInnerS", x:mult(-.4, "personBigInnerS"), y:20, list:person.draw({ size:"personBigInnerS", }) },
		// 		] },
		// 		{ sX:"third", cX:true, list:[
		// 			{},
		// 			{ s:"personInnerS", cX:true, fY:true, y:10, list:person.draw({ size:"personInnerS", }) },
		// 		] },
		// 		{ sX:"third", fX:true, list:[
		// 			{},
		// 			{ s:"personSmalleInnerS", cX:true, fY:true, y:10, list:person.draw({ size:"personSmalleInnerS", }) },
		// 		] },
		// 	]
		// },

		// builder.test()
	];

	const variableList = {
		width: { r: 1 },
		height: { r: 1, height: true },
		squ: { a: "width", max: "height" },

		borderS: { a: 1, useSize: "squ" },

		imgSX: ["width", mult(-2, "borderS")],
		imgSY: ["height", mult(-2, "borderS")],

		imgSqu: getSmallerDim({ r: 1, useSize: ["imgSX", "imgSY"] }),

		personS: {
			r: 1 / rows,
			useSize: "imgSY",
			max: { r: 1 / (fieldsCount * cols), useSize: "imgSX" },
		},
		personM: { r: 0.05, useSize: "personS", min: 2 },
		personInnerS: margin("personS", "personM"),

		personBigInnerS: mult(2.5, "personInnerS"),
		personSmalleInnerS: mult(0.3, "personInnerS"),
		third: { r: 0.3333, useSize: "width", a: -5 },
	};

	const { joinVariableList } = builder;

	for (const attr in joinVariableList) {
		variableList[attr] = joinVariableList[attr];
	}

	return {
		renderList,
		variableList,
		background: builder.backgroundColor.get(),
	};
};
