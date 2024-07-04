/* global TableComic */

// BEGINN Actor /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Actor = function (args) {
	// Forms & Sizes
	this.ratio = args.ratio || 0.3;

	this.headSY_ = args.headSY_ || this.rFl(0.2, 0.3);

	// Colors
	this.color = args.color || [255, 255, 255];
	this.darkColor = [
		this.color[0] * 0.7,
		this.color[1] * 0.7,
		this.color[2] * 0.7,
	];
	this.detailColor = [
		this.darkColor[0] * 0.7,
		this.darkColor[1] * 0.7,
		this.darkColor[2] * 0.7,
	];

	// Assets
	this.head = new this.basic.Head({
		color: this.color,
		darkColor: this.darkColor,
		detailColor: this.detailColor,
	});

	this.body = new this.basic.Body({
		color: this.color,
		darkColor: this.darkColor,
		detailColor: this.detailColor,
		firstColor: args.firstColor,
		secondColor: args.secondColor,
		info: args.body || {},
		actor: this,
	});
};

TableComic.prototype.Actor.prototype.getSize = function (args) {
	// calculates this.sX & this.sY
	this.getSizeWithRatio(args.stageSX, args.stageSY);

	this.headSY = this.pushLinkList({ r: this.headSY_, useSize: this.sY });
	this.bodySY = this.pushLinkList([this.sY, { r: -1, useSize: this.headSY }]);
};

TableComic.prototype.Actor.prototype.getSizeHead = function (args) {
	// calculates this.sX & this.sY
	this.getSizeWithRatio(
		args.stageSX,
		args.stageSY,
		"sX",
		"headSY",
		this.ratio / this.headSY_,
	);

	this.bodySY = this.pushLinkList({
		r: (1 - this.headSY_) / this.headSY_,
		useSize: this.headSY,
	});
	this.sY = this.pushLinkList([this.bodySY, this.headSY]);
};

TableComic.prototype.Actor.prototype.draw = function (args) {
	const { info } = args;

	// Decide which size calculation method to use and use it.
	this.zoomToHead = info.zoomToHead;
	this[this.zoomToHead ? "getSizeHead" : "getSize"](args);

	// SX and headSize have automatically been generated; add additional properties
	this.sX.min = 3;
	this.sX.odd = true;

	this.headSY.a = 1;
	this.headSY.min = 4;

	// get x, y Position and rotiation
	this.getPosition(args);

	// Precalc the size of the body
	this.body.getSize({ sX: this.sX, sY: this.bodySY });

	// drag the actor deeper for sitting
	this.baseShift = this.pushLinkList(
		info.sitting
			? [{ r: -1, useSize: this.body.legSY }, this.body.legs.hipSY]
			: { a: 0 },
	);

	this.y = this.pushLinkList({ add: [this.y, this.baseShift] });

	// Turn Body
	this.side = this.pushLinkList({ r: 0, useSize: this.sX });

	// Lean Body
	this.lean = this.pushLinkList({ r: 0, useSize: this.side });
	this.torsoLean = this.pushLinkList({ r: 0.66, useSize: this.lean });

	// Check if there are hover changers and add them
	this.addHoverChange(args.info.body);

	return this.getObject([
		// Body
		this.body.draw({
			sX: this.sX,
			sY: this.bodySY,
			lean: this.torsoLean,
			info,
		}),

		// Head
		this.head.draw({
			sX: this.sX,
			sY: this.headSY,
			x: this.lean,
			info,
		}),
	]);
};
// END Actor \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Head /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Head = function (args) {
	// Forms and Sizes
	this.eyeAreaSY_ = this.rFl(0.2, 0.6);
	this.eyeAreaSX_ = this.rFl(0.4, 0.9);
	this.mouthAreaSX_ = this.rFl(0.6, 0.95);

	this.sX_ = this.rFl(0.8, 1.3);

	// Colors
	this.color = args.color;
	this.darkColor = args.darkColor;
	this.detailColor = args.detailColor;

	// Assets
	this.eyes = new this.basic.Eyes({
		color: this.color,
		darkColor: this.darkColor,
		detailColor: this.detailColor,
	});
	this.mouth = new this.basic.Mouth({
		color: this.color,
		darkColor: this.darkColor,
		detailColor: this.detailColor,
	});
};

TableComic.prototype.Head.prototype.draw = function (args) {
	const side = (args.info.body && args.info.body.side) || 0;
	const sX = this.pushLinkList({ r: this.sX_, useSize: args.sX, odd: true });
	const { sY } = args;

	const eyeAreaSX = this.pushLinkList({
		r: this.eyeAreaSX_,
		useSize: sX,
		min: 3,
		a: 1,
		max: sX,
		odd: true,
	});
	const eyeAreaSY = this.pushLinkList({
		r: this.eyeAreaSY_,
		useSize: sY,
		min: 1,
	});

	const eyeRestSX = this.pushLinkList([sX, { r: -1, useSize: eyeAreaSX }]);

	const mouthAreaSX = this.pushLinkList({
		r: this.mouthAreaSX_,
		useSize: sX,
		min: 1,
		odd: true,
	});
	const mouthAreaSY = this.pushLinkList({
		add: [args.sY, { r: -1, useSize: eyeAreaSY }, -2],
		min: 1,
	});

	const info = args.info || {};

	this.side = this.pushLinkList({ r: 0, useSize: args.sX });

	// Check if there are hover changers and add them
	this.addHoverChange({ side });

	return {
		sY,
		sX,
		cX: true,
		color: this.color,
		x: args.x,
		list: [
			{},

			// Eyes
			this.eyes.draw({
				sX: eyeAreaSX,
				sY: eyeAreaSY,
				eyeRestSX,
				info: info.eyes,
				left: info.eyeLeft,
				right: info.eyeRight,
				side,
			}),

			// Mouth
			this.mouth.draw({
				sX: mouthAreaSX,
				sY: mouthAreaSY,
				headSX: sX,
				info: info.mouth,
				side,
			}),
		],
	};
};
// END Head \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Eyes /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Eyes = function (args) {
	// Forms & Sizes
	this.eyeSX_ = this.rFl(0.5, 0.7);
	this.eyeSY_ = this.rFl(0.5, 0.7);

	this.roundInner = true;
	this.roundOuter = true;
	this.eyeBrow = this.rIf(0.5);

	// Colors
	this.color = args.color;
	this.darkColor = args.darkColor;
	this.detailColor = args.detailColor;

	// Assets
	this.eyeLeft = new this.basic.Eye({
		roundInner: this.roundInner,
		roundOuter: this.roundOuter,
		eyeBrow: this.eyeBrow,
		left: true,
		color: this.color,
		darkColor: this.darkColor,
		detailColor: this.detailColor,
	});
	this.eyeRight = new this.basic.Eye({
		roundInner: this.roundInner,
		roundOuter: this.roundOuter,
		eyeBrow: this.eyeBrow,
		color: this.color,
		darkColor: this.darkColor,
		detailColor: this.detailColor,
	});
};

TableComic.prototype.Eyes.prototype.draw = function (args) {
	const maxEyesSX = this.pushLinkList([args.sX, -1]);
	const maxEyesCombinedSX = this.pushLinkList({
		r: this.eyeSX_,
		a: 2,
		useSize: maxEyesSX,
		max: maxEyesSX,
	});
	const eyeSY = this.pushLinkList({
		r: this.eyeSY_,
		useSize: args.sY,
		min: 1,
	});

	let eyeLeftSX;
	let eyeRightSX;
	let x;

	// if ( side < 0 ) {
	// 	eyeLeftSX = 	this.pushLinkList( { r: -side / 2 + 0.5, useSize:maxEyesCombinedSX, min:1 } );
	// 	eyeRightSX = 	this.pushLinkList( [ maxEyesCombinedSX, { r: -1, useSize: eyeLeftSX } ] );
	// } else {
	// 	if ( side === 0 ) {
	// 		eyeRightSX = eyeLeftSX = this.pushLinkList( { r: 0.5, useSize:maxEyesCombinedSX, min:1 } );
	// 	} else {
	// 		eyeRightSX = 	this.pushLinkList( { r: side / 2 + 0.5, useSize:maxEyesCombinedSX, min:1 } );
	// 		eyeLeftSX = 	this.pushLinkList( [ maxEyesCombinedSX, { r: -1, useSize: eyeRightSX } ] );
	// 	}
	// }

	this.side = this.pushLinkList({ r: 0, useSize: maxEyesCombinedSX });
	eyeLeftSX = this.pushLinkList({
		r: 0.5,
		useSize: maxEyesCombinedSX,
		add: [{ r: 0.5, useSize: this.side }],
	});
	eyeRightSX = this.pushLinkList([
		maxEyesCombinedSX,
		{ r: -1, useSize: eyeLeftSX },
	]);

	this.sideRestSX = this.pushLinkList({ r: 0, useSize: args.eyeRestSX });

	x = this.pushLinkList({
		add: [
			{ r: 0.5, useSize: args.eyeRestSX },
			{ r: 0.5, useSize: this.sideRestSX },
		],
	});

	// Check if there are hover changers and add them
	this.addHoverChange({
		side: args.side,
		sideRestSX: args.side,
	});

	return {
		x,
		// fX: side < 0,
		sX: args.sX,
		sY: args.sY,
		list: [
			this.eyeLeft.draw({
				sX: eyeLeftSX,
				sY: eyeSY,
				info: args.info || args.left,
				// away: side > 0 && side
			}),
			this.eyeRight.draw({
				sX: eyeRightSX,
				sY: eyeSY,
				info: args.info || args.right,
				// away: side < 0 && -side
			}),
		],
	};
};
// END Eyes \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Eye /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Eye = function Eye(args) {
	// Forms && Sizes
	this.left = args.left;

	this.roundInner = args.roundInner;
	this.roundOuter = args.roundOuter;
	this.eyeBrow = args.eyeBrow;

	// Colors
	this.color = args.color;
	this.darkColor = args.darkColor;
	this.detailColor = args.detailColor;
};

TableComic.prototype.Eye.prototype.draw = function EyeDraw(args) {
	// sYNormal is the normal eye height, sY can be changed for smaller or bigger eyes, but is recommended to only be used for bigger eyes.
	// for closed eyes use openSY;
	// use eyeLidTopSY to change percentage of lower and upper eye;
	const { sX } = args;
	const sYNormal = this.pushLinkList({
		r: args.away ? 1 - args.away : 1,
		useSize: args.sY,
		min: 1,
		max: args.sY,
	});

	/* 0_1+*/ const sY = (this.sY = this.pushLinkList({
		r: 1,
		useSize: sYNormal,
	}));

	/* 0_1 */ const openSY = (this.openSY = this.pushLinkList({
		r: 1,
		useSize: sY,
	}));
	const eyeLidsFullSY = this.pushLinkList([sY, { r: -1, useSize: openSY }]);

	/* 0_1 */ const eyeLidTopSY = (this.eyeLidTopSY = this.pushLinkList({
		r: 0.55,
		useSize: eyeLidsFullSY,
	}));
	const eyeLidBottomSY = this.pushLinkList([
		eyeLidsFullSY,
		{ r: -1, useSize: eyeLidTopSY },
	]);

	/* -1_1 */ const eyeBrowMove = (this.eyeBrowMove = this.pushLinkList({
		r: 0,
		useSize: openSY,
	}));
	const eyeBrowInnerY = this.pushLinkList({
		r: -1,
		useSize: eyeBrowMove,
		min: { a: -1 },
		a: -1,
		add: [eyeLidTopSY],
	});
	const eyeBrowOuterY = this.pushLinkList({
		r: 1,
		useSize: eyeBrowMove,
		min: { a: -1 },
		a: -1,
		add: [eyeLidTopSY],
	});

	/* 0_1+*/ const pupilS = (this.pupilS = this.pushLinkList({
		r: 0.8,
		useSize: sY,
	}));
	/* 0_1 */ const pupilSX = (this.pupilSX = this.pushLinkList({
		r: 0.5,
		useSize: pupilS,
		min: 1,
	}));
	/* 0_1 */ const pupilSY = (this.pupilSX = this.pushLinkList({
		r: 1,
		useSize: pupilS,
		min: 1,
	}));

	// pupilPosrel moves relative to the white, pupilPos moves relative to the pupil
	const pupilRestSX = this.pushLinkList({
		add: [sX, { r: -1, useSize: pupilSX }],
		min: 1,
	});
	const pupilRestSY = this.pushLinkList({
		add: [sY, { r: -1, useSize: pupilSY }],
		min: 1,
	});

	/* 0_1+*/ const pupilPosXrel = (this.pupilPosXrel = this.pushLinkList({
		r: 0,
		useSize: pupilRestSX,
	}));
	/* 0_1+*/ const pupilPosYrel = (this.pupilPosYrel = this.pushLinkList({
		r: 0,
		useSize: pupilRestSY,
	}));
	/* 0_1+*/ const pupilPosX = (this.pupilPosX = this.pushLinkList({
		r: 0,
		useSize: pupilSX,
		add: [pupilPosXrel],
	}));
	/* 0_1+*/ const pupilPosY = (this.pupilPosY = this.pushLinkList({
		r: 0,
		useSize: pupilSY,
		add: [pupilPosYrel],
	}));

	const eyeLidOvershot = this.pushLinkList({ r: 0.1, max: 1, useSize: sX });

	this.addHoverChange(args.info);

	return {
		sX,
		sY,
		fY: true,
		rX: this.left,
		fX: !this.left,
		id: "eye",
		list: [
			// Corners
			{
				minX: 4,
				minY: 4,
				list: [
					this.roundInner && { name: "Dot", clear: true },
					this.roundOuter && { name: "Dot", clear: true, fX: true },
				],
			},

			// Main Eye
			{
				color: [255, 255, 255],
				mask: true,
				list: [
					// White
					{},

					// Pupil
					{
						color: [0, 0, 0],
						sX: pupilSX,
						sY: pupilSY,
						fY: true,
						x: pupilPosX,
						y: pupilPosY,
						id: "pupil",
						list: [
							{
								minX: 4,
								minY: 4,
								list: [
									{
										name: "Dot",
										clear: true,
										fX: true,
									},
									{
										name: "Dot",
										clear: true,
									},
									{
										name: "Dot",
										clear: true,
										fX: true,
										fY: true,
									},
									{
										name: "Dot",
										clear: true,
										fY: true,
									},
								],
							},
							{},
						],
					},
				],
			},

			// EyeLid Top / Eyebrow Top
			{
				rX: true,
				mX: { r: -1, useSize: eyeLidOvershot },
				list: [
					{
						color: this.darkColor,
						points: [
							{ y: -1, fX: true },
							{ y: -1 },
							{ y: eyeBrowOuterY, x: eyeLidOvershot },
							{ y: eyeBrowOuterY },
							{ y: eyeBrowInnerY, fX: true },
							{ y: eyeBrowInnerY, fX: true, x: eyeLidOvershot },
						],
					},
					{
						color: this.detailColor,
						weight: 1,
						z: 10,
						id: "eyeLid",
						points: [
							{ y: eyeBrowOuterY },
							{ y: eyeBrowInnerY, fX: true },
						],
					},
				],
			},

			// Eye Lid Bottom
			{
				sY: eyeLidBottomSY,
				fY: true,
				color: this.darkColor,
			},

			// Corners
			{
				minX: 4,
				minY: 4,
				list: [
					this.roundInner && {
						name: "Dot",
						color: this.color,
						fY: true,
					},
					this.roundOuter && {
						name: "Dot",
						color: this.color,
						fY: true,
						fX: true,
					},
					this.roundInner && { name: "Dot", color: this.color },
					this.roundOuter && {
						name: "Dot",
						color: this.color,
						fX: true,
					},
				],
			},
		],
	};
};
// END Eye \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Mouth /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Mouth = function Mouth(args) {
	// Colors
	this.color = args.color;
	this.darkColor = args.darkColor;
	this.detailColor = args.detailColor;
};

TableComic.prototype.Mouth.prototype.draw = function MouthDraw(args) {
	const cutOff = (this.cutOff = this.pushLinkList({
		r: 1,
		useSize: args.sX,
	}));
	/* 0_1 */ const sX = (this.sX = this.pushLinkList({
		r: 1,
		useSize: args.sX,
		a: -2,
		min: 1,
	}));
	const finalSX = (this.finalSX = this.pushLinkList({
		add: [
			sX,
			{
				add: [
					{ r: 0.25, useSize: cutOff, max: { a: 0 } },
					{ r: -0.25, useSize: cutOff, max: { a: 0 } },
				],
				max: { a: 0 },
			},
		],
		min: 1,
	}));
	/* 0_1 */ const sY = (this.sY = this.pushLinkList({
		r: 0,
		useSize: args.sY,
		min: 1,
	}));

	const restSX = this.pushLinkList([
		args.headSX,
		{ r: -1, useSize: finalSX },
	]);
	const halfRestSX = this.pushLinkList({ r: 0.5, useSize: restSX });
	const restSY = this.pushLinkList([args.sY, { r: -1, useSize: sY }, -1]);

	const sideRestSX = (this.sideRestSX = this.pushLinkList({
		r: 0,
		useSize: halfRestSX,
	}));

	/* 0_1 */ const x = (this.x = this.pushLinkList({
		add: [halfRestSX, sideRestSX],
		max: restSX,
	}));
	/* 0_1 */ const y = (this.y = this.pushLinkList({
		r: 0.3,
		useSize: restSY,
	}));

	const curveSX = (this.curveSX = this.pushLinkList({
		r: 0.3,
		useSize: finalSX,
	}));
	const curveSideSX = (this.curveSideSX = this.pushLinkList({
		r: 0,
		useSize: curveSX,
	}));
	const outerLeftSX = this.pushLinkList({ add: [curveSX, curveSideSX] });
	const outerRightSX = this.pushLinkList({
		add: [curveSX, { r: -1, useSize: curveSideSX }],
	});

	/* -1_1 */ const curveSY = (this.curveSY = this.pushLinkList({
		r: 0,
		useSize: sY,
	}));
	const curveTopSY = this.pushLinkList({
		add: [{ r: -1, useSize: curveSY }],
		min: 0,
	});
	const curveBottomSY = this.pushLinkList({ add: [curveSY], min: 0 });
	const curveMax = this.pushLinkList([sY, -1]);

	const teethTopMax = this.pushLinkList({ r: 0.55, useSize: sY });
	const teethBottomMax = this.pushLinkList([
		sY,
		{ r: -1, useSize: teethTopMax },
	]);

	/* 0_1 */ const teethTopSY = (this.teethTopSY = this.pushLinkList({
		r: 0,
		useSize: teethTopMax,
	}));
	/* 0_1 */ const teethBottomSY = (this.teethBottomSY = this.pushLinkList({
		r: 0,
		useSize: teethBottomMax,
	}));

	const smirkTop = this.pushLinkList({ r: 0.5, useSize: curveSY, max: 1 });
	const smirkBottom = this.pushLinkList({
		r: -0.1,
		useSize: curveSY,
		max: 1,
	});

	let mouthOuter;

	if (!args.info) {
		args.info = {};
	}
	// Assign the side value to the info, so it can be added to the changers.
	args.info.curveSideSX = args.info.cutOff = args.info.sideRestSX = args.side;

	this.addHoverChange(args.info);

	return {
		sX: args.headSX,
		sY: args.sY,
		color: [0, 0, 100],
		fY: true,
		list: [
			{
				sX: finalSX,
				sY,
				x,
				y,
				list: [
					{
						sY: smirkTop,
						sX: 1,
						x: -1,
						tY: true,
					},
					{
						sY: smirkTop,
						sX: 1,
						x: -1,
						tY: true,
						fX: true,
					},

					{
						sY: smirkBottom,
						sX: 1,
						x: -1,
						tY: true,
						fY: true,
					},
					{
						sY: smirkBottom,
						sX: 1,
						x: -1,
						tY: true,
						fY: true,
						fX: true,
					},

					// Outer Mouth Left
					{
						sX: outerLeftSX,
						rY: true,
						z: 1,
						list: (mouthOuter = [
							{
								sY: curveTopSY,
								minY: 2,
								clear: true,
								// color:[0,255,0],
								fY: true,
								stripes: {
									change: { r: -1, useSize: curveTopSY },
								},
								list: [
									{ sY: { r: 1, max: curveMax }, fY: true },
								],
							},
							{
								sY: curveBottomSY,
								minY: 2,
								clear: true,
								// color:[0,255,0],
								stripes: {
									change: { r: -1, useSize: curveBottomSY },
								},
								list: [{ sY: { r: 1, max: curveMax } }],
							},
						]),
					},

					// Outer Mouth Right
					{
						sX: outerRightSX,
						rX: true,
						fX: true,
						rY: true,
						z: 1,
						list: mouthOuter,
					},

					// Inner Mouth
					{},

					{
						color: [255, 255, 255],
						mX: { r: 0.1 },
						sY: teethTopSY,
					},
					{
						color: [255, 255, 255],
						mX: { r: 0.15 },
						sY: teethBottomSY,
						fY: true,
					},
				],
			},
		],
	};
};
// END Mouth \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Body /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Body = function Body(args) {
	this.actor = args.actor;

	// Forms & Sizes
	this.legSY_ = this.rFl(0.6, 0.8);

	// Colors
	this.skinColor = args.color;
	this.firstColor = args.firstColor || [255, 0, 0];
	this.secondColor = args.secondColor || [0, 255, 0];

	// Assets
	this.torso = new this.basic.Torso({
		color: this.firstColor,
		skinColor: this.skinColor,
		info: args.info.torso || {},
		actor: this.actor,
	});

	this.legs = new this.basic.Legs({
		color: this.secondColor,
	});
};

TableComic.prototype.Body.prototype.getSize = function BodyGetSize(args) {
	this.legSY = this.pushLinkList({ r: this.legSY_, useSize: args.sY });
	this.torsoSY = this.pushLinkList({
		add: [args.sY, { r: -1, useSize: this.legSY }],
	});

	this.legs.getSize({
		sX: args.sX,
		sY: this.legSY,
	});

	this.torso.getSize({
		sX: args.sX,
		sY: this.torsoSY,
	});
};

TableComic.prototype.Body.prototype.draw = function BodyDraw(args) {
	this.sY = args.sY;
	this.sX = args.sX;

	return {
		sY: args.sY,
		fY: true,
		list: [
			// {
			// 	color:[255,255,0],
			// 	z:1000,
			// 	sY: this.actor.realBodySY
			// },
			this.torso.draw({
				sX: args.sX,
				sY: this.torsoSY,
				info: args.info,
				lean: args.lean,
			}),
			this.legs.draw({
				sX: args.sX,
				sY: this.legSY,
				info: args.info,
				side: args.side,
			}),
		],
	};
};
// END Body \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Torso /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Torso = function Torso(args) {
	// Colors
	this.color = args.color;
	this.skinColor = args.skinColor;
	this.actor = args.actor;

	// Assests
	this.arm = new this.basic.Arm({
		color: this.color,
		skinColor: this.skinColor,
		info: args.info.arm || {},
		actor: this.actor,
	});
};

TableComic.prototype.Torso.prototype.getSize = function TorsoDraw(args) {
	this.x = this.pushLinkList({ r: 0.2, useSize: args.sX });
};

TableComic.prototype.Torso.prototype.draw = function TorsoDraw(args) {
	this.sX = args.sX;
	this.sY = args.sY;

	this.upperTorsoSY = this.pushLinkList({ r: 0.5, useSize: args.sY, min: 1 });
	this.lowerTorsoSY = this.pushLinkList({
		add: [args.sY, { r: -1, useSize: this.upperTorsoSY }, 1],
		min: 1,
	});

	return {
		color: this.color,
		sX: this.sX,
		sY: this.sY,
		// fX: true,
		list: [
			// Upper Torso
			{
				sY: this.upperTorsoSY,
				x: args.lean,
				list: [
					{},

					// Right Arm
					this.arm.draw({
						right: true,
						torsoSY: args.sY,
						torsoSX: args.sX,
						info: args.info.armRight,
						newInfo: args.info.handRight,
					}),

					// Left Arm
					this.arm.draw({
						right: false,
						torsoSY: args.sY,
						torsoSX: args.sX,
						info: args.info.armLeft,
						newInfo: args.info.handLeft,
					}),
				],
			},

			// Middle Torso
			{
				sY: this.upperTorsoSY,
				x: { r: 0.75, useSize: args.lean },
				cY: true,
			},

			// Lower Torso
			{
				sY: this.lowerTorsoSY,
				x: { r: 0.5, useSize: args.lean },
				fY: true,
			},
		],
	};
};
// END Torso \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Arm /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Arm = function Arm(args) {
	// Forms
	this.shortSleaves = args.info.shortSleaves;

	this.actor = args.actor;

	// Sizes

	// Colors
	this.color = args.color;
	this.skinColor = args.skinColor;
};

TableComic.prototype.Arm.prototype.draw = function ArmDraw(args) {
	const info = args.info || {};
	const armSY = this.pushLinkList({ r: 2, useSize: args.torsoSY });

	const upperArmSY = this.pushLinkList({ r: 0.4, useSize: armSY });
	const lowerArmSY = this.pushLinkList({
		add: [armSY, { r: -1, useSize: upperArmSY }],
	});

	const armS = this.pushLinkList({ r: 0.08, useSize: armSY, min: 1 });
	const upperArmS = this.pushLinkList({ r: 0.1, useSize: armSY, min: 1 });
	const armSHalf = this.pushLinkList({ r: 0.5, useSize: upperArmS, a: -1 });

	const handS = this.pushLinkList({ r: 0.1, useSize: armSY, min: 1 });
	const handSY = this.pushLinkList({ r: 0.14, useSize: armSY, min: 1 });

	const upperArmLX = this.pushLinkList({ r: 1, useSize: upperArmSY });
	const upperArmLY = this.pushLinkList({ r: 0, useSize: upperArmSY });

	const lowerArmLX = this.pushLinkList({ r: 1, useSize: lowerArmSY });
	const lowerArmLY = this.pushLinkList({ r: 0, useSize: lowerArmSY });

	const handX = this.pushLinkList({ add: [upperArmLX, lowerArmLX] });
	const handY = this.pushLinkList({ add: [upperArmLY, lowerArmLY] });

	const handLX = this.pushLinkList({ r: 1, useSize: handSY });
	const handLY = this.pushLinkList({ r: 0, useSize: handSY });

	const angles = {};

	const getAngleFunction = function (dimension, sin, data, name, prev) {
		const { max } = data;
		const { min } = data;
		const change = max - min;
		const { map } = data;
		const pi = Math.PI;
		const mathSin = Math[sin];

		if (typeof data === "number") {
			const angle = data * pi;
			return [
				dimension,
				function () {
					const value = (angles[name] =
						angle + (prev ? angles[prev] : 0));

					return mathSin(value);
				},
			];
		}

		return [
			dimension,
			function () {
				const value = (angles[name] =
					(min + arguments[map] * change) * pi +
					(prev ? angles[prev] : 0));

				return mathSin(value);
			},
		];
	};

	const upperArmAngle = info.upperArmAngle || 0;
	const lowerArmAngle = info.lowerArmAngle || 0;
	const handAngle = info.handAngle || 0;

	this.functionList.push(
		getAngleFunction(handLX, "sin", handAngle, "hand", "lowerArm"),
		getAngleFunction(handLY, "cos", handAngle, "hand", "lowerArm"),

		getAngleFunction(
			lowerArmLX,
			"sin",
			lowerArmAngle,
			"lowerArm",
			"upperArm",
		),
		getAngleFunction(
			lowerArmLY,
			"cos",
			lowerArmAngle,
			"lowerArm",
			"upperArm",
		),

		getAngleFunction(upperArmLX, "sin", upperArmAngle, "upperArm"),
		getAngleFunction(upperArmLY, "cos", upperArmAngle, "upperArm"),
	);

	return {
		tX: true,
		fX: args.right,
		rX: args.right,
		color: this.color,
		s: armS,
		z: info.z || 300,
		list: [
			{
				y: [armSHalf, 1],
				x: [armSHalf, 1],
				list: [
					// Upper Arm
					{
						weight: upperArmS,
						color: this.noSleaves && this.skinColor,
						points: [
							{},
							{
								x: upperArmLX,
								y: upperArmLY,
							},
						],
					},

					// Lower Arm
					{
						weight: armS,
						color: this.shortSleaves && this.skinColor,
						points: [
							{
								x: upperArmLX,
								y: upperArmLY,
							},
							{
								x: handX,
								y: handY,
							},
						],
					},

					// Lower Arm
					{
						color: this.skinColor,
						weight: handS,
						points: [
							{
								x: handX,
								y: handY,
							},
							{
								x: [handX, handLX],
								y: [handY, handLY],
							},
						],
					},
				],
			},

			// {
			// 	x: args.right ? [ { r: -1, useSize: armSHalf } ]: [ armSHalf, 1 ],
			// 	y: [ armSHalf ],
			// 	lowerArmWeight: armS,
			// 	upperArmWeight: upperArmS,
			// 	length: armSY,
			// 	ratio: 0.4,
			// 	// maxStraight: 0.99,
			// 	upperArmColor: [255,255,255] || ( this.noSleaves ? this.skinColor : this.color ),
			// 	lowerArmColor: [200,255,0] || ( this.shortSleaves ? this.skinColor : this.color ),
			// 	targetX: args.newInfo ?
			// 		this.pushLinkList({
			// 			add: [
			// 				{ r:-1, useSize: this.actor.x },
			// 				args.right ? { r: -1, useSize: this.actor.body.torso.sX, a: 1 } : false,
			// 				args.newInfo.obj.x,
			// 				{ r: args.newInfo.posX, useSize: args.newInfo.obj.sX },
			// 			]
			// 		})
			// 		: this.pushLinkList( { a:10 } ),
			// 	targetY: args.newInfo ?
			// 		this.pushLinkList( {
			// 			add:[
			// 				this.actor.y,
			// 				this.actor.bodySY,
			// 				{ r: -1 * args.newInfo.posY, useSize: args.newInfo.obj.sY },
			// 				args.newInfo.obj.y,
			// 				{ r: -1, useSize: handS }
			// 			]
			// 		} )
			// 		: this.actor.body.torso.sY,
			// 	jointX: this.pushLinkList({}),
			// 	jointY: this.pushLinkList({}),
			// 	endX: this.pushLinkList({}),
			// 	endY: this.pushLinkList({}),
			// 	flip: !args.right,
			// 	z: 1000,
			// 	debug: [255,0,0],
			// 	hand: {
			// 		length: handSY,
			// 		width: handS,
			// 		color: [ 0,0,0 ]|| this.skinColor,
			// 		endX: this.pushLinkList({}),
			// 		endY: this.pushLinkList({}),
			// 		angle: -0.5
			// 	}
			// },
		],
	};
};
// END Arm \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Legs /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Legs = function Legs(args) {
	// Forms & Sizes
	this.legSX_ = args.legSX || 0.2;
	this.hipSY_ = args.hipSY || 0.2;

	// Colors
	this.color = args.color;
};

TableComic.prototype.Legs.prototype.getSize = function LegsGetSize(args) {
	this.legSX = this.pushLinkList({ r: this.legSX_, useSize: args.sX });
	this.hipSY = this.pushLinkList({
		r: this.hipSY_,
		useSize: args.sY,
		min: this.legSY,
	});
	this.legY = this.pushLinkList([this.hipSY, { r: -1, useSize: this.legSX }]);
};

TableComic.prototype.Legs.prototype.draw = function LegsDraw(args) {
	const { sitting } = args.info;
	const bendLeg = sitting || args.info.bendLeg;
	const otherSide = args.info.side < 0;
	const legRotate = bendLeg && (otherSide ? -90 : 90);
	const feet = [{}, { sY: 1, color: [0, 0, 0], fY: true }];
	let leg;

	if (bendLeg) {
		this.lowerLeg = this.pushLinkList({ r: 0.5, useSize: args.sY });
		this.topLeg = this.pushLinkList([
			args.sY,
			{ r: -1, useSize: this.lowerLeg },
			{ r: -1, useSize: this.legSX },
		]);

		this.side = this.pushLinkList({ r: 0, useSize: this.topLeg });
		this.sideOther = this.pushLinkList({ r: -1, useSize: this.side });

		this.addHoverChange({
			side: args.info.body && args.info.body.side,
		});

		leg = [
			{
				s: this.legSX,
				list: [
					{
						sY: {
							add: [this.sideOther, this.legSX],
							min: this.legSX,
						},
						list: [
							{},
							// Legs to the Left
							{
								sY: this.legSX,
								fY: true,
								list: [
									// Legs to the Right
									{
										sY: {
											add: [this.side, this.legSX],
											min: this.legSX,
										},
										fY: true,
										list: [
											{},
											{
												sY: this.legSX,
												sX: this.lowerLeg,
												rotate: -legRotate,
												list: feet,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];
	} else {
		leg = [
			{
				sX: this.legSX,
				sY: args.sY,
				list: feet,
			},
		];
	}

	return {
		sX: args.sX,
		sY: args.sY,
		fY: true,
		color: this.color,
		list: [
			{
				sY: this.hipSY,
			},
			{
				y: sitting && this.legY,
				list: [
					{
						s: this.legSX,
						rotate: legRotate,
						list: leg,
						x: bendLeg && { add: [this.side], min: { a: 0 } },
					},
					{
						s: this.legSX,
						rotate: legRotate,
						list: leg,
						fX: true,
						x: bendLeg && { add: [this.sideOther], min: { a: 0 } },
					},
				],
			},
		],
	};
};
// END Legs \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
