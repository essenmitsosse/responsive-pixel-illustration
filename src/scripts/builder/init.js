import { Builder } from "./builder.js";

export default function (init, slide, createSlider) {
	var builder = new Builder(init),
		hover = builder.hover,
		pushLinkList = builder.pushLinkList,
		width = pushLinkList({ main: true }),
		height = pushLinkList({ main: true, height: true }),
		squ = pushLinkList({ add: [width], max: height }),
		borderS = pushLinkList({ r: 0.05, a: -2, useSize: squ, min: 1 }),
		imgSX = pushLinkList([width, { r: -2, useSize: borderS }]),
		imgSY = pushLinkList([height, { r: -2, useSize: borderS }]),
		showPerson = slide.showPerson || init.showPerson,
		getPosition = (function () {
			var rFl = builder.basic.R,
				rIf = builder.basic.IF,
				rInt = builder.basic.GR,
				eyeLookVert = ["", "", "", "left", "right"],
				eyeLookHor = [
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
				],
				eyeLids = [
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
				],
				eyeBrow = [
					"",
					"",
					"",
					"raised",
					"low",
					"sceptical",
					"superSceptical",
					"angry",
					"sad",
				],
				mouthHeight = [
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
				],
				mouthWid = ["", "", "", "narrow"],
				mouthForm = ["", "", "", "sceptical", "grin", "D:"],
				legPos = [
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
				],
				teethPos = ["", "top", "bottom", "both", "full"],
				shoulderPos = [0, 0, 0, 0, 0, -90, -90, 180],
				ellbowPos = [0, 0, 0, 90, -90],
				views = [
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

			return function (args) {
				args.eye = {
					lookVert: eyeLookVert[rInt(0, eyeLookVert.length)],
					lookHor: eyeLookHor[rInt(0, eyeLookHor.length)],
					lids: eyeLids[rInt(0, eyeLids.length)],
					brow: eyeBrow[rInt(0, eyeBrow.length)],
				};

				args.mouth = {
					height: mouthHeight[rInt(0, mouthHeight.length)],
					width: mouthWid[rInt(0, mouthWid.length)] && "narrowSide",
					form: mouthForm[rInt(0, mouthForm.length)],
					teeth: teethPos[rInt(0, teethPos.length)],
					smirk: rIf(0.08),
				};

				args.shoulder = {
					left: rIf(0.8) && Math.pow(rFl(0, 1), 3),
					right: rIf(0.8) && Math.pow(rFl(0, 1), 3),
				};

				args.arm = {
					left:
						args.shoulder.left > 0.55
							? rFl(0, 0.5)
							: rIf(0.8)
								? rFl(0, 1) * 1.5 - 0.75
								: rFl(0, 1) * 0.5 - 0.25,
					right:
						args.shoulder.right > 0.55
							? rFl(0, 0.5)
							: rIf(0.8)
								? rFl(0, 1) * 1.5 - 0.75
								: rFl(0, 1) * 0.5 - 0.25,
				};

				args.finger = {
					left: rIf(0.1),
					right: rIf(0.1),
				};

				args.leg = {};
				args.leg[rIf(0.5) ? "right" : "left"] =
					legPos[rInt(0, legPos.length)];

				args.hatDown = rIf(0.02);

				// args.view = "backView";
				// args.view = "leftView";

				// args.shoulder = { right : 0,	left : 180 };
				// args.ellbow = 	{ right : -90,	left : -90 };
				// args.hand = 	{ right : 90,	left : 90 };
			};
		})(),
		getPanels = function () {
			var l = init.panelCount || 6,
				half = l / 2,
				list = [],
				args,
				drawArgs,
				sX = pushLinkList({}),
				sY = pushLinkList({}),
				square = pushLinkList({ add: [sX], max: sY }),
				innerSquare = pushLinkList({ r: 0.7, useSize: square }),
				SingleObject = showPerson ? builder.Person : builder.Tree,
				Tree1Family =
					!showPerson &&
					new builder.TreeFamily({
						color: builder.backgroundColor,
						secondColor: builder.backgroundColor.copy({
							next: true,
						}),
					}),
				Tree2Family =
					!showPerson &&
					new builder.TreeFamily({
						color: builder.backgroundColor,
						secondColor: builder.backgroundColor.copy({
							prev: true,
						}),
					});

			while (l--) {
				drawArgs = {};

				if (showPerson) {
					args = {};
					args.groundColor = builder.backgroundColor;
					args.groundShadowColor = builder.backgroundColor.copy({
						brAdd: -1,
					});

					getPosition(drawArgs);
					drawArgs.size = innerSquare;
				} else {
					args = l >= half ? Tree1Family : Tree2Family;
				}

				list.push({
					sX: sX,
					sY: sY,
					list: [
						{
							sX: square,
							cX: true,
							// list: ( new Person( args ) ).draw( drawArgs )
							list: new SingleObject(args).draw(
								drawArgs,
								0,
								square,
							),
						},
					],
				});
			}

			return list;
		},
		renderList = [
			{
				sX: imgSX,
				sY: imgSY,
				gutterX: borderS,
				gutterY: borderS,
				c: true,
				imgRatio: 1,
				panels: getPanels(),
			},
			init.cs === "true" && builder.colorScheme(),
		];

	if (showPerson && createSlider) {
		createSlider.number({
			niceName: "Person Count",
			valueName: "panelCount",
			defaultValue: 6,
			input: { min: 1, max: 20, step: 1 },
			forceRedraw: true,
		});
		createSlider.slider({
			niceName: "Headsize",
			valueName: "head-size",
			defaultValue: 0.5,
			input: { min: 0, max: 1, step: 0.01 },
		});
		createSlider.slider({
			niceName: "Body Width",
			valueName: "body-width",
			defaultValue: 0.5,
			input: { min: 0, max: 1, step: 0.01 },
		});
		createSlider.slider({
			niceName: "Body Height",
			valueName: "body-height",
			defaultValue: 0.75,
			input: { min: 0, max: 1, step: 0.01 },
		});
		createSlider.slider({
			niceName: "Arm Length",
			valueName: "arm-length",
			defaultValue: 0.5,
			input: { min: 0, max: 1, step: 0.01 },
		});
		createSlider.slider({
			niceName: "Leg Length",
			valueName: "leg-length",
			defaultValue: 0.5,
			input: { min: 0, max: 1, step: 0.01 },
		});
	}

	return {
		renderList: renderList,
		linkList: builder.linkList,
		background: builder.backgroundColor.get(),
		hover: hover.hover,
		hoverAlt: builder.hoverAlt,
		changeValueSetter: hover.ready,
	};
}
