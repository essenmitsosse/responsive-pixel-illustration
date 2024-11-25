"use strict";
// PERSON
Builder.prototype.Person = function (args) {
	var that = this,
		nr = (this.nr = this.basic.objectCount += 1);

	args = args || {};

	this.bigHead = args.bigHead = this.init.bigHead === "true";
	this.superHead = this.IF(0.1) ? (this.bigHead ? 0.2 : 1.5) : 1;

	this.args = args;
	this.zInd = args.zInd = 1000;
	args.nr = nr;

	this.unevenCenter = args.unevenCenter = false;

	// Precalc Sizes
	this.vL["personSqu" + nr] = args.size;
	this.vL["personHalfSX" + nr] = this.mult(0.5, "personSqu" + nr);

	this.vL["topSY" + nr] = this.mult(
		(this.bigHead ? 0.7 : 0.2) * this.superHead,
		"personSqu" + nr,
	);
	this.vL["bottomSY" + nr] = ["personSqu" + nr, this.sub("topSY" + nr)];

	this.vL["personSX" + nr] = this.mult(
		this.FL() * 0.2 + 0.1,
		"personHalfSX" + nr,
	);
	this.vL["personSideSX" + nr] = this.mult(1.2, "personSX" + nr);
	this.vL["personSY" + nr] = this.mult(
		this.dwarf ? 0.7 : 1,
		"personSqu" + nr,
	);

	this.vL["headSX" + nr] = {
		r: this.IF() ? 0.7 : 0.3,
		useSize: "topSY" + nr,
		min: 2,
	};
	this.vL["headNeckSY" + nr] = { r: 1, useSize: "topSY" + nr, min: 3 };

	this.vL["headSideSX" + nr] = this.mult(2, "headSX" + nr);

	this.vL["neckSX" + nr] = {
		r: 0.4,
		useSize: "headSX" + nr,
		max: ["personSX" + nr, -1],
	};
	this.vL["neckSY" + nr] = this.mult(
		this.IF() ? 0.2 : 0.1,
		"headNeckSY" + nr,
	);

	this.vL["headSY" + nr] = ["headNeckSY" + nr, this.sub("neckSY" + nr)];

	this.vL["faceSX" + nr] = {
		r: this.IF(0.4) ? 0.3 : 0.6,
		useSize: "headSX" + nr,
		a: 1,
		max: "headSX" + nr,
		min: 2,
	};
	this.vL["faceSY" + nr] = this.mult(this.IF() ? 0.25 : 0.4, "headSY" + nr);
	this.vL["faceRestX" + nr] = ["headSX" + nr, this.sub("faceSX" + nr)];
	this.vL["faceRestY" + nr] = ["headSY" + nr, this.sub("faceSY" + nr)];
	this.vL["faceY" + nr] = this.mult(0.6, "faceRestY" + nr);
	this.vL["eyeX" + nr] = this.IF(0.5)
		? { r: 0.5, useSize: "faceSX" + nr, max: ["faceSX" + nr, -2] }
		: { a: 0 };
	this.vL["eyeS" + nr] = {
		r: 0.5,
		useSize: "faceSX" + nr,
		max: { a: 3, max: ["faceSX" + nr, this.sub("eyeX" + nr), -1] },
	};

	this.vL["faceSideSX" + nr] = {
		r: 0.35,
		useSize: "headSideSX" + nr,
		min: "eyeS" + nr,
	};
	this.vL["faceSideRestX" + nr] = [
		"headSideSX" + nr,
		this.sub("faceSideSX" + nr),
	];

	this.vL["hairSX" + nr] = { r: 1, useSize: "faceRestX" + nr, a: -1 };
	this.vL["hairSideSX" + nr] = this.mult(0.85, "faceSideRestX" + nr);

	this.vL["legSY" + nr] = this.mult(this.IF() ? 0.3 : 0.7, "bottomSY" + nr);
	this.vL["torsoSY" + nr] = {
		r: this.IF() ? 0.2 : 0.3,
		useSize: "bottomSY" + nr,
		max: ["bottomSY" + nr, this.sub("legSY" + nr)],
	};

	this.vL["bodySY" + nr] = ["legSY" + nr, "torsoSY" + nr];

	this.vL["legWid" + nr] = { r: 0.3, useSize: "personSX" + nr, min: 1 };
	this.vL["crotchSY" + nr] = this.IF(0.3)
		? {
				r: 1.5,
				useSize: "personSX" + nr,
				min: 1,
				max: this.mult(0.5, "legSY" + nr),
			}
		: "legWid" + nr;

	this.vL["armSY" + nr] = this.mult(0.5, "bodySY" + nr);

	this.vL["armWid" + nr] = { r: 0.2, useSize: "personSX" + nr, min: 1 };

	this.vL["shoulderSideSX" + nr] = {
		r: 0.4,
		useSize: "personSX" + nr,
		min: "armWid" + nr,
		max: ["armWid" + nr, 1],
	};
	this.vL["shoulderSX" + nr] = "shoulderSideSX" + nr;
	this.vL["shoulderHeadSX" + nr] = this.bigHead
		? "shoulderSX" + nr
		: {
				add: [
					"headSX" + nr,
					"armWid" + nr,
					1,
					this.sub("personSX" + nr),
				],
				min: 1,
			};
	this.vL["restArmSY" + nr] = [
		"armSY" + nr,
		this.sub("shoulderHeadSX" + nr),
		"armWid" + nr,
	];

	this.vL["upperArm" + nr] = this.mult(0.5, "armSY" + nr);
	this.vL["lowerArm" + nr] = ["armSY" + nr, this.sub("upperArm" + nr)];

	this.basicBody = new this.basic.BasicBody(args);
}; // END Person
Builder.prototype.Person.prototype = new Builder.prototype.Object();
Builder.prototype.Person.prototype.draw = function (args) {
	var nr = (args.nr = this.nr),
		back = (args.back = args.view === "back"),
		side = (args.side = args.view && !back);

	return side
		? [{ list: this.basicBody.draw(args, args.view === "rightSide") }]
		: [
				{
					sX: "personHalfSX" + nr,
					rX: true,
					list: this.basicBody.draw(args, !back),
				},
				{
					x: this.unevenCenter ? "personHalfSX" + i : undefined,
					fX: !this.unevenCenter,
					sX: "personHalfSX" + nr,
					list: this.basicBody.draw(args, back),
				},
			];
}; // END Person draw

// BASICBODY --------------------------------------------------------------------------------
Builder.prototype.BasicBody = function (args) {
	this.nr = args && args.nr;
	this.zInd = args.zInd;

	// Forms & Sizes
	args.animal = this.IF(0.05);
	args.topless = args.animal || this.IF(0.1);

	// Color
	this.skinColor = args.skinColor = new this.Color(
		this.IF() ? 1 : 0,
		Math.floor(this.GR(1, 4)),
	);
	args.skinDetailColor = args.skinColor.copy({ brContrast: -2 });
	args.clothColor = new this.Color(
		this.IF(0.3) ? (this.IF(0.3) ? 0 : 1) : 2,
		this.IF() ? (this.IF() ? 4 : 2) : 3,
	);

	// Assets
	this.head = new this.basic.Head(args);

	this.upperBody = new this.basic.UpperBody(args);

	this.onBack = this.upperBody.onBack;
	this.onFront = this.upperBody.onFront;

	this.armRight = this.upperBody.armRight;
	this.armLeft = this.upperBody.armLeft;

	this.lowerBody = new this.basic.LowerBody(args);
}; // END BasicBody
Builder.prototype.BasicBody.prototype = new Builder.prototype.Object();
Builder.prototype.BasicBody.prototype.draw = function (args, right) {
	var nr = this.nr,
		side = args.side;

	args.right = right;

	return [
		{
			z: this.zInd,
			sX: "personSX" + nr,
			sY: "personSY" + nr,
			cX: side,
			fY: true,
			rX: side && !right,
			list: [
				// SHADOW
				{
					color: this.basic.backgroundShadowColor.get(),
					fY: true,
					tY: true,
					x: side && -1,
					y: 1,
					sY: 2,
					sX: {
						r: 1,
						a: side ? "shoulderSideSX" + nr : "shoulderSX" + nr,
					},
				},

				{
					sY: "torsoSY" + nr,
					fY: true,
					y: "legSY" + nr,
					list: [
						// Arm Back ( Side View)
						(!right ? this.armRight : this.armLeft).draw(args),

						// Arm Fron ( Side View )
						side
							? (right ? this.armRight : this.armLeft).draw(args)
							: undefined,

						// Legs and Crotch
						this.lowerBody.draw(args),

						// Torso
						this.upperBody.draw(args),

						// Head and Neck ( from Front and Side )
						this.head.draw(args),
					],
				},
			],
		},
	];
}; // END BasicBody draw

// HEAD --------------------------------------------------------------------------------
Builder.prototype.Head = function (args) {
	this.nr = args && args.nr;
	this.zInd = args.zInd;

	// Forms & Sizes
	this.bigHead = args.bigHead;
	this.shortBeard = !this.beard && this.IF(0.1);

	// Colors
	this.skinColor = args.skinColor;
	this.skinDetailColor = args.skinDetailColor;
	this.hairColor = args.hairColor = (
		this.IF(0.5) ? args.clothColor : args.skinColor
	).copy({ brContrast: this.IF() ? 2 : -2 });
	this.shortBeardColor = this.skinColor.copy({ brContrast: -1 });

	// Assests
	this.face = new this.basic.Face(args);
	this.headGear = !args.animal
		? this.IF()
			? new this.basic.BasicHat(args)
			: this.IF(0.05)
				? new this.basic.Helmet(args)
				: undefined
		: undefined;
	this.ears = this.IF(0.05) && new this.basic.Ear(args);
}; // END Head
Builder.prototype.Head.prototype = new Builder.prototype.Object();
Builder.prototype.Head.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	args.zInd = this.zInd + (args.back ? -75 : 75);

	return {
		tY: true,
		color: this.skinColor.get(),
		id: "head" + nr,
		z: args.zInd,
		list: [
			// Neck
			{ sX: "neckSX" + nr, sY: "neckSY" + nr, cX: side, fY: true },

			// Head
			{
				id: "head" + nr,
				y: "neckSY" + nr,
				sX: side ? "headSideSX" + nr : "headSX" + nr,
				sY: "headSY" + nr,
				cX: side,
				fY: true,
				list: [
					{ name: "Dot", clear: true, fX: true },
					{ name: "Dot", clear: true, fX: true, fY: true },
					side ? { name: "Dot", clear: true } : undefined, // Forehead Side
					side ? { name: "Dot", clear: true, fY: true } : undefined, // Chin Side

					{},

					this.shortBeard && {
						color: this.shortBeardColor.get(),
						fY: true,
						sY: { r: 0.5 },
						sX: side && ["faceSideSX" + nr, 1],
						z: args.zInd + (args.back ? -5 : 5),
						list: [
							{ name: "Dot", clear: true, fX: true, fY: true },
							{},
						],
					},

					!args.back && {
						color: this.hairColor.get(),
						sY: this.mult(0.5, "faceY" + nr),
						list: [{ stripes: { random: { r: -0.5 }, seed: nr } }],
					},
					{
						color: this.hairColor.get(),
						fX: true,
						sX:
							!args.back &&
							(side ? "hairSideSX" + nr : "hairSX" + nr),
						sY: this.beard
							? undefined
							: this.mult(0.5, "headSY" + nr),
					},

					this.face.draw(args),

					this.ears && this.ears.draw(args),

					// Headhear
					this.headGear && this.headGear.draw(args),
				],
			},
		],
	};
}; // END Head draw

// FACE --------------------------------------------------------------------------------
Builder.prototype.Face = function (args) {
	var nr = (this.nr = args && args.nr);

	// Forms & Sizes
	this.bigEyes = this.IF(0.3);

	// Colors
	this.skinColor = args.skinColor;
	this.skinDetailColor = args.skinDetailColor;
	this.hairColor = args.hairColor;
	this.teethC = this.skinColor.copy({ brSet: 5 });
	this.hairColor = args.hairColor;

	// Assests
	this.beard = this.IF();
	this.moustach =
		((this.beard && this.IF(0.6)) || this.IF()) &&
		new this.basic.Beard(args);

	if (this.beard) {
		this.vL["beardOvershotSideSX" + nr] = this.mult(0.2, "hairSideSX" + nr);
	}
}; // END Face
Builder.prototype.Face.prototype = new Builder.prototype.Object();
Builder.prototype.Face.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side,
		mouth = args.mouth,
		eyes = args.eyes,
		teeth = args.teeth,
		eyesClosed = eyes === "closed" || (args.right && eyes === "wink"),
		eyesAngry = eyes === "angry",
		eyesHappy = eyes === "happy",
		eyesSquish = eyesAngry || eyesHappy,
		mouthOpen = mouth === "open",
		mouthGrin = mouth === "grin",
		mouthD = mouth === "D:",
		mouthNarrow =
			args.mouthWid === "narrow" || (!args.right && eyes === "wink"),
		mouthHappy = mouth === "happy",
		mouthSad = mouth === "sad",
		mouthClosed = mouthHappy || mouthSad,
		teethUp = (!mouthClosed && teeth === "up") || teeth === "both",
		teethDown = (!mouthClosed && teeth === "down") || teeth === "both",
		teethFull = !mouthClosed && teeth === "full";

	return {
		z: args.zInd + (args.back ? -50 : 50),
		color: this.skinDetailColor.get(),
		y: "faceY" + nr,
		sY: "faceSY" + nr,
		sX: side ? "faceSideSX" + nr : "faceSX" + nr,
		list: [
			// Eyes
			{
				y: eyesAngry && -1,
				sY:
					!eyesSquish && this.bigEyes && !eyesClosed
						? { r: 1, a: -2, max: 2, min: 1 }
						: 1,
				sX:
					!eyesSquish && (this.bigEyes || eyesClosed)
						? { r: 0.5, min: eyesClosed ? 2 : 1 }
						: 1,
				fX: true,
			},

			eyesSquish && { s: 1, fX: true, x: 1, y: eyesHappy && -1 },

			// Mouth & Beard
			{
				y: this.moustach ? -1 : 0,
				sY:
					mouthOpen || mouthD
						? { r: 0.5, max: { r: 1, a: -2 }, min: 2 }
						: mouthGrin
							? { r: 0.4, max: { r: 1, a: -3 }, min: 2 }
							: 1,
				fY: true,
				id: "mouth" + nr,
				list: [
					// Mouth
					{
						z: args.zInd + (args.back ? -60 : 60),
						sX:
							(mouthNarrow && { r: 0.4, a: 1, max: { r: 1 } }) ||
							(mouthClosed && { r: 1, a: -1 }),
						y: mouthHappy && 1,
						list: [
							(mouthGrin || mouthD) && {
								name: "Dot",
								fY: mouthGrin,
								fX: true,
								clear: true,
							},
							{ color: teethFull && this.teethC.get() },
							teethUp && {
								color: this.teethC.get(),
								sY: { r: 0.3, max: 1 },
								sX: { r: 0.8 },
							},
							teethDown && {
								color: this.teethC.get(),
								sY: { r: 0.2, max: 1 },
								sX: { r: 0.7 },
								fY: true,
							},
							mouthClosed && {
								name: "Dot",
								y: mouthHappy ? -1 : 1,
								x: -1,
								fX: true,
							},
						],
					},

					// BEARD
					this.moustach && this.moustach.draw(args),

					this.beard && {
						color: this.hairColor.get(),
						id: "beard",
						tY: true,
						fY: true,
						z: args.zInd + (args.back ? -150 : 150),
						y: mouthClosed && -1,
						sX: side
							? [
									"headSideSX" + nr,
									"beardOvershotSideSX" + nr,
									this.sub("hairSideSX" + nr),
								]
							: "headSX" + nr,
						sY: this.mult(this.bigHead ? 1 : 1, "faceSY" + nr),
						list: [
							{
								sX: side
									? "beardOvershotSideSX" + nr
									: "hairSX" + nr,
								sY: ["faceSY" + nr, 2],
								fX: true,
								tY: true,
							},
							{
								fX: true,
								stripes: {
									random: { r: 0.5 },
									change: { r: 1 },
									seed: nr * 2,
								},
							},
						],
					},
				],
			},
		],
	};
}; // END Face draw

// EAR --------------------------------------------------------------------------------
Builder.prototype.Ear = function (args) {
	var nr = (this.nr = args && args.nr);

	// Forms & Sizes
	this.ear = this.IF(0.5);
	this.bend = !this.ear && this.IF(1.4);

	// Colors
	this.earColor = this.ear ? args.skinColor : args.hairColor;

	// Precalc Sizes
	this.vL["earSX" + nr] = {
		r: this.FL() * (this.ear ? 0.2 : 2),
		useSize: "faceSX" + nr,
		min: 1,
	};
	this.vL["earSY" + nr] = {
		r: this.FL() * 0.4,
		useSize: "faceSY" + nr,
		min: 1,
	};
}; // END Ear
Builder.prototype.Ear.prototype = new Builder.prototype.Object();
Builder.prototype.Ear.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		z: side && args.zInd + 100,
		id: "horn" + nr,
		y: !this.ear && { r: -0.2 },
		sX: side ? "earSY" + nr : "earSX" + nr,
		sY: "earSY" + nr,
		cX: side,
		cY: true,
		fX: true,
		tX: true,
		color: this.earColor.get(),
		list: this.bend && [
			{},
			{
				sY: { r: 0.3, useSize: "earSX" + nr },
				sX: { r: 1, useSize: "earSY" + nr },
				fX: true,
				tY: true,
			},
		],
	};
}; // END Ear draw

// BEARD --------------------------------------------------------------------------------
Builder.prototype.Beard = function (args) {
	this.nr = args && args.nr;
	this.hairColor = args.hairColor;
}; // END Beard
Builder.prototype.Beard.prototype = new Builder.prototype.Object();
Builder.prototype.Beard.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		color: this.hairColor.get(),
		id: "this.beard",
		sY: 1,
		x: side ? 0 : { r: 0.5, max: 1 },
		y: -1,
	};
}; // END Beard draw

// BASICHAT --------------------------------------------------------------------------------
Builder.prototype.BasicHat = function (args) {
	this.nr = args && args.nr;

	// Forms & Sizes
	this.hatRim = this.IF(0.8);
	this.hatNarrow = this.hatRim && this.IF(0.5);
	this.hatBasecap = this.hatRim && this.IF();
	this.highHat = this.IF();
	this.roundHat = this.IF(0.6);
	this.dentHat = this.IF(this.hatRim && !this.hatBasecap ? 0.2 : 0.05);

	// Colors
	this.hatColor = args.clothColor.copy({
		nextColor: this.IF(),
		brAdd: this.IF() ? -1 : 0,
	});
	this.hatRimColor =
		this.hatRim &&
		args.clothColor.copy({
			nextColor: true,
			brContrast: this.IF() ? 2 : -2,
		});
}; // END BasicHat
Builder.prototype.BasicHat.prototype = new Builder.prototype.Object();
Builder.prototype.BasicHat.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		id: "hat" + nr,
		tY: true,
		color: this.hatColor.get(),
		y: 3,
		sY: this.highHat ? "headSY" + nr : "headSX" + nr,
		list: [
			this.roundHat && { name: "Dot", clear: true, fX: true },
			this.roundHat && side && { name: "Dot", clear: true },

			!side && this.dentHat && { sX: { r: 0.3 }, clear: true, sY: 1 },

			// Basecap Cutout
			this.hatBasecap &&
				(side || args.back) && {
					clear: true,
					sY: { r: 0.1 },
					sX: { r: 0.3 },
					fY: true,
					fX: side,
					y: 1,
				},

			{},

			!this.hatBasecap &&
				this.hatRim && {
					fY: true,
					y: 1,
					sY: { r: 0.2 },
					color: this.hatRimColor.get(),
				},

			this.hatBasecap
				? {
						fY: true,
						sY: { r: 0.1, min: 1 },
						fX: true,
						sX: side ? { r: 1.5 } : undefined,
						color: this.hatRimColor.get(),
					}
				: this.hatRim && {
						fY: true,
						sY: { r: 0.1, min: 1 },
						mX: this.mult(
							this.hatNarrow ? -0.5 : -1,
							"headSX" + nr,
						),
					},
		],
	};
}; // END BasicHat draw

// HELMET --------------------------------------------------------------------------------
Builder.prototype.Helmet = function (args) {
	var brightArmor = this.IF(0.05);

	this.nr = args && args.nr;
	this.mainC = args.clothColor.copy({
		brContrast: brightArmor ? 2 : this.IF(0.1) ? 2 : -2,
	});
}; // END Helmet

Builder.prototype.Helmet.prototype = new Builder.prototype.Object();

Builder.prototype.Helmet.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side,
		back = args.back;

	return {
		z: args.zInd + (back ? -160 : 160),
		color: this.mainC.get(),
		id: "helmet",
		list: [
			{ sY: { r: 0.9, useSize: "faceY" + nr } },
			{
				sX: side
					? ["faceSideSX" + nr, -1]
					: [
							"faceSX" + nr,
							this.sub("eyeS" + nr),
							this.sub("eyeX" + nr),
						],
				sY: { r: 0.6 },
			},
			{
				sY: { r: 1.1 },
				list: [
					{
						fX: true,
						sX: back
							? undefined
							: side
								? "faceSideRestX" + nr
								: "faceRestX" + nr,
					},
					{ z: args.zInd + (back ? 170 : -170) },
				],
			},
		],
	};
}; // END Helmet draw

// UPPER BODY --------------------------------------------------------------------------------
Builder.prototype.UpperBody = function (args) {
	this.nr = args && args.nr;
	this.zInd = args.zInd;

	// Forms && Sizes
	args.sleeveLess = args.topless || this.IF(0.1);
	args.shortSleves = !args.sleevLess && this.IF();
	this.satchel = this.IF(0.05);

	// Colors
	this.skinColor = args.skinColor;
	this.bodyColor = args.bodyColor = args.topless
		? args.skinColor
		: args.clothColor;
	this.satchelColor = args.beltColor = this.satchel
		? this.bodyColor.copy({
				brContrast: this.IF(0.1) ? 2 : -2,
				nextColor: this.IF(),
			})
		: undefined;

	// Assests
	this.armLeft = new this.basic.Arm(args);
	this.armRight = new this.basic.Arm(args, true);

	this.chestDeko = args.topless
		? new this.basic.Nipple(args)
		: this.IF(0.1)
			? new this.basic.Buttons(args)
			: undefined;

	if (this.IF(0.02)) {
		this.onBack = new this.basic.Cape(args);
		this.onFront = new this.basic.CapeFront(args);
	}
}; // END UpperBody
Builder.prototype.UpperBody.prototype = new Builder.prototype.Object();
Builder.prototype.UpperBody.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	args.zInd = this.zInd;

	return {
		color: this.bodyColor.get(),
		list: [
			{},

			args.back || (this.chestDeko && this.chestDeko.draw(args)),

			// Stuff on Back
			this.onBack && this.onBack.draw(args),
			// Stuff on Chest / Shoulders
			this.onFront && this.onFront.draw(args),

			this.satchel &&
				(side || !args.right) && {
					color: this.satchelColor.get(),
					weight: "armWid" + nr,
					optimizeY: true,
					z: args.zInd + (args.back ? -10 : 10),
					points: side
						? [
								{ fY: args.right },
								{
									fY: !args.right,
									fX: true,
									x: "shoulderSideSX" + nr,
								},
							]
						: [{ fX: true }, { fY: true, x: { r: -1, a: 1 } }],
				},
		],
	};
}; // END UpperBody draw

// NIPPLES --------------------------------------------------------------------------------
Builder.prototype.Nipple = function (args) {
	this.nr = args && args.nr;

	this.skinColor = args.skinColor;
	this.skinDetailColor = args.skinDetailColor;

	args.sleeveLess = args.topless || this.IF(0.1);
}; // END Nipple
Builder.prototype.Nipple.prototype = new Builder.prototype.Object();
Builder.prototype.Nipple.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		color: this.skinDetailColor.get(),
		name: "Dot",
		x: { r: side ? 0.2 : 0.5 },
		y: this.mult(0.4, "torsoSY" + nr),
	};
}; // END Nipple draw

// BUTTONS --------------------------------------------------------------------------------
Builder.prototype.Buttons = function (args) {
	this.nr = args && args.nr;
	this.buttonColor = args.clothColor.copy({ brContrast: this.IF() ? 1 : -1 });

	this.closeButtons = this.IF(0.5);
	this.wideButtons = this.IF();
}; // END Buttons
Builder.prototype.Buttons.prototype = new Builder.prototype.Object();
Builder.prototype.Buttons.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		color: this.buttonColor.get(),
		sX: this.wideButtons ? 2 : 1,
		x: side && 1,
		stripes: { horizontal: true, gap: this.closeButtons ? 1 : 3 },
	};
}; // END Buttons draw

// CAPE --------------------------------------------------------------------------------
Builder.prototype.Cape = function (args) {
	this.nr = args && args.nr;
	this.capeColor = args.capeColor = args.bodyColor.copy({
		prevColor: true,
		brAdd: -3,
	});
}; // END Cape
Builder.prototype.Cape.prototype = new Builder.prototype.Object();
Builder.prototype.Cape.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		z: args.zInd + (args.back ? 10 : -10),
		id: "cape" + nr,
		color: this.capeColor.get(),
		list: [
			{
				name: "Dot",
				clear: true,
				fX: true,
				x: { r: -1, useSize: "shoulderSX" + nr, a: -1 },
			},
			{
				fX: side,
				x: side ? [this.sub("shoulderSX" + nr), -1] : 0,
				sX: {
					r: 1,
					add: [this.mult(side ? 2 : 1, "shoulderSX" + nr), 1],
				},
				sY: { r: 3, max: this.mult(0.9, "bodySY" + nr) },
			},
		],
	};
}; // END Cape draw

// CAPE FRONT --------------------------------------------------------------------------------
Builder.prototype.CapeFront = function (args) {
	this.nr = args && args.nr;
	this.capeColor = args.capeColor;
}; // END CapeFront
Builder.prototype.CapeFront.prototype = new Builder.prototype.Object();
Builder.prototype.CapeFront.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		z: args.zInd + (args.back ? -150 : 150),
		id: "cape" + nr,
		sX: side
			? ["personSX" + nr, this.mult(2, "shoulderSX" + nr)]
			: ["personSX" + nr, "shoulderSX" + nr],
		sY: this.mult(0.25, "torsoSY" + nr),
		x: side ? this.sub("shoulderSX" + nr) : undefined,
		color: this.capeColor.get(),
	};
}; // END CapeFront draw

// ARM --------------------------------------------------------------------------------
Builder.prototype.Arm = function (args, right) {
	this.right = right;
	this.nr = args && args.nr;
	this.zInd = args.zInd;

	this.name = right ? "right" : "left";

	// Forms & Sizes
	this.shortSleves = args.shortSleves;

	// Color
	this.skinColor = args.skinColor;
	this.skinDetailColor = args.skinDetailColor;
	this.sleeveColor = args.sleeveLess ? false : args.clothColor;

	// Assets
	this.tool =
		(this.IF(0.05) && new this.basic.SquareObject(args, this.name)) ||
		(this.IF(0.05) && new this.basic.Sword(args, this.name));
}; // END Arm
Builder.prototype.Arm.prototype = new Builder.prototype.Object();
Builder.prototype.Arm.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side,
		up = false,
		shoulder = args.shoulder && args.shoulder[this.name],
		shoulder90 = shoulder === -90,
		ellbow = args.ellbow && args.ellbow[this.name];

	return {
		z: (args.zInd =
			this.zInd +
			(args.back ||
			(args.side &&
				(!args.right === this.right || args.right === !this.right) &&
				shoulder !== 0)
				? -100
				: 100)),
		fX: !side || (this.right && args.right) || (!this.right && !args.right),
		tX: true,
		rX:
			side &&
			((!this.right && args.right) || (this.right && !args.right)),
		rY: up,
		sX: up && !side ? "shoulderHeadSX" + nr : "shoulderSX" + nr,
		sY: "armWid" + nr,
		id: "arm" + this.name + nr,
		color: (this.sleeveColor || this.skinColor).get(),
		list: [
			// SHOULDER
			{ sX: 1 },

			// ARM
			{
				rotate: shoulder,
				rY:
					((!args.back && !this.right) ||
						(args.back && this.right)) &&
					shoulder90,
				list: [
					{ name: "Dot", clear: true, fX: true },
					{
						sX: "armWid" + nr,
						sY: up && !side ? "restArmSY" + nr : "upperArm" + nr,
						fX: true,
						list: [
							// Hands / Arms
							{},
							// Sleeves
							!this.topLess &&
								this.shortSleves && {
									sY: "armWid" + nr,
									fY: true,
									color: this.skinColor.get(),
								},

							{
								rotate:
									(args.back ? -1 : 1) *
									(this.right ? -1 : 1) *
									ellbow,
								fY: true,
								s: "armWid" + nr,
								y:
									this.right &&
									((ellbow === 90 && shoulder === 180) ||
										(ellbow === -90 && shoulder === 0)) &&
									this.sub("armWid" + nr),
								color:
									(this.topless || this.shortSleves) &&
									this.skinColor.get(),
								list: [
									{
										tY: true,
										fY: true,
										sY: "lowerArm" + nr,
										y: "armWid" + nr,
										list: [
											{},
											{
												fY: true,
												sY: "armWid" + nr,
												color: this.skinColor.get(),
												list: [
													this.tool &&
														this.tool.draw(args),
													{},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	};
}; // END Arm draw

// SWORD --------------------------------------------------------------------------------
Builder.prototype.Sword = function (args, name) {
	var nr = (this.nr = args && args.nr),
		nrName = (this.nrName = nr + name);

	this.length = this.FL() * 1.5;
	this.width = this.FL() * 3;
	this.hiltColor = args.skinColor.copy({ nextColor: true, brContrast: -2 });
	this.bladeColor = this.hiltColor.copy({
		nextColor: this.IF(),
		brContrast: 2,
	});
	this.noKnife = this.IF();
	this.bend = !this.noKnife || this.IF();

	this.vL["bladeLength" + nrName] = { r: this.length, useSize: "armSY" + nr };
	this.vL["bladeWid" + nrName] = { r: this.width, useSize: "armWid" + nr };
	this.vL["handleSX" + nrName] = this.IF()
		? { r: this.FL(), useSize: "bladeLength" + nrName }
		: ["armWid" + nr, 3];
}; // END Sword

Builder.prototype.Sword.prototype = new Builder.prototype.Object();
Builder.prototype.Sword.prototype.draw = function (args) {
	var nr = this.nr,
		nrName = this.nrName,
		side = args.side;

	return {
		sY: 1,
		color: this.hiltColor.get(),
		id: "tool" + nrName,
		list: [
			{
				sX: "bladeLength" + nrName,
				sY: "bladeWid" + nrName,
				x: ["handleSX" + nrName, -2],
				cY: this.noKnife,
				color: this.bladeColor.get(),
				list: [
					!this.bend && { name: "Dot", clear: true, fX: true },
					{ name: "Dot", clear: true, fY: true, fX: true },
					{},
				],
			},

			{ sX: "handleSX" + nrName, x: -2, cY: this.noKnife },
			this.noKnife && {
				x: ["handleSX" + nrName, -2],
				sX: 1,
				sY: 5,
				cY: this.noKnife,
			},
		],
	};
}; // END Sword draw

// SQUAREOBJECT --------------------------------------------------------------------------------
Builder.prototype.SquareObject = function (args, name) {
	var nr = (this.nr = args && args.nr),
		nrName = (this.nrName = nr + name);

	// Forms & Sizes

	this.atMiddle = this.IF(0.4);
	this.handle = !this.atMiddle && this.IF(0.7);
	this.handleWide = this.handle && this.IF(0.4);
	this.handleSmall = !this.handleWide && this.IF(0.5);
	this.detail = this.IF(0.6);

	if (this.detail) {
		this.detailMX = this.FL() * 0.4;
		this.detailMY = this.FL() * 0.4;
		this.detailSY = this.FL();
	}

	this.roundTop = !(this.handle && this.handleWide) && this.IF(0.5);
	this.roundBottom = this.IF(0.5);

	// Colors
	this.shieldColor = args.skinColor.copy({
		nextColor: this.IF(0.5),
		brContrast: this.IF() ? 2 : -2,
	});
	this.shieldColorDetail =
		this.detail &&
		this.shieldColor.copy({
			prevColor: this.IF(0.8),
			brContrast: this.IF() ? 2 : -2,
		});

	// Precalc Sizes
	this.vL["shieldSX" + nrName] = {
		r: this.FL() * 0.6,
		useSize: "armSY" + nr,
		min: "armWid" + nr,
	};
	this.vL["shieldSY" + nrName] = {
		r: this.FL() * 0.6,
		useSize: "armSY" + nr,
		min: 1,
	};
	this.handle &&
		(this.vL["handleSY" + nrName] = {
			r: this.FL() * 0.7,
			useSize: "armSY" + nr,
		});
}; // END SquareObject

Builder.prototype.SquareObject.prototype = new Builder.prototype.Object();
Builder.prototype.SquareObject.prototype.draw = function (args) {
	var nr = args.nr,
		nrName = this.nrName,
		side = args.side;

	return {
		color: this.shieldColor.get(),
		list: [
			this.handle && {
				sX: this.handleWide
					? "shieldSX" + nrName
					: this.handleSmall
						? 1
						: [2, "armWid" + nr],
				cX: true,
				list: [
					{ sY: 1 },
					{
						fY: true,
						tY: true,
						y: 1,
						sX: 1,
						sY: "handleSY" + nrName,
					},
					{
						fY: true,
						tY: true,
						y: 1,
						fX: true,
						sX: 1,
						sY: "handleSY" + nrName,
					},
				],
			},

			{
				sX: "shieldSX" + nrName,
				sY: "shieldSY" + nrName,
				cX: true,
				tY: true,
				fY: true,
				y:
					(this.atMiddle && this.mult(0.5, "shieldSY" + nrName, 1)) ||
					(this.handle && {
						r: -1,
						useSize: "handleSY" + nrName,
						a: 1,
					}),
				z: args.zInd + 5,

				id: "shield" + nrName,
				list: [
					{
						minX: 3,
						minY: 3,
						list: [
							this.roundTop && { name: "Dot", clear: true },
							this.roundTop && {
								name: "Dot",
								fX: true,
								clear: true,
							},
							this.roundBottom && {
								name: "Dot",
								fY: true,
								clear: true,
							},
							this.roundBottom && {
								name: "Dot",
								fY: true,
								fX: true,
								clear: true,
							},
						],
					},
					{},
					this.detail && {
						mX: { r: this.detailMX },
						sY: { r: this.detailSY },
						mY: { r: this.detailMY },
						color: this.shieldColorDetail.get(),
					},
				],
			},
		],
	};
}; // END SquareObject draw

// LOWER BODY --------------------------------------------------------------------------------
Builder.prototype.LowerBody = function (args) {
	this.nr = args && args.nr;

	// Forms & Sizes
	this.noPants = args.animal;
	this.skirt = args.skirt = !this.noPants && this.IF();
	this.highPants = this.IF();

	args.bareLegs = this.IF(args.skirt ? 0.9 : 0.05);
	args.shortPants = !args.bareLegs && this.IF();

	this.shoes = !this.noPants && this.IF(0.8);
	this.boots = args.boots = this.shoes && this.IF();

	this.belt = !this.noPants && this.IF(0.5);

	// Colors
	this.skinColor = args.skinColor;
	this.pantsColor = args.pantsColor =
		args.pantsColor ||
		(this.noPants
			? false
			: args.clothColor.copy({
					nextColor: this.IF(0.6),
					brContrast: this.IF() ? 1 : -1,
				}));
	this.shoeColor = args.shoeColor = this.shoes
		? (this.pantsColor || args.clothColor).copy({ brSet: 0 })
		: false;
	this.beltColor = this.belt
		? args.beltColor ||
			this.pantsColor.copy({ prevColor: true, brContrast: -1 })
		: undefined;

	// Assests
	this.legLeft = new this.basic.Leg(args);
	this.legRight = new this.basic.Leg(args, true);
}; // END LowerBody
Builder.prototype.LowerBody.prototype = new Builder.prototype.Object();
Builder.prototype.LowerBody.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side;

	return {
		tY: true,
		fY: true,
		sY: "legSY" + nr,
		color: (this.pantsColor || this.skinColor).get(),
		list: [
			(args.right ? this.legLeft : this.legRight).draw(args),
			side && (!args.right ? this.legLeft : this.legRight).draw(args),

			// CROTCH / SKIRT
			this.skirt ? { sY: { r: 0.7 } } : { sY: "crotchSY" + nr },

			this.belt && {
				y: { r: 0.2, useSize: "crotchSY" + nr, max: 1 },
				sY: { r: 0.3, useSize: "crotchSY" + nr, min: 1, max: 2 },
				color: this.beltColor.get(),
			},

			this.highPants && {
				sY: { r: 0.5, useSize: "torsoSY" + this.nr },
				tY: true,
			},
		],
	};
}; // END LowerBody draw

// LEG --------------------------------------------------------------------------------
Builder.prototype.Leg = function (args, right) {
	this.right = right;
	this.nr = args && args.nr;

	this.shortPants = args.shortPants;
	this.boots = args.boots;

	this.skinColor = args.skinColor;
	this.legColor = args.bareLegs ? false : args.pantsColor;
	this.shoeColor = args.shoeColor;
}; // END Leg
Builder.prototype.Leg.prototype = new Builder.prototype.Object();
Builder.prototype.Leg.prototype.draw = function (args) {
	var nr = args.nr,
		side = args.side,
		skinColor = this.skinColor;

	return {
		fX: !side || this.right,
		sX: "legWid" + nr,
		color: (this.legColor || skinColor).get(),
		list: [
			{},

			this.shortPants
				? { color: skinColor.get(), fY: true, sY: { r: 0.5 } }
				: undefined,

			// FEET
			{
				color: (this.shoeColor || skinColor).get(),
				fY: true,
				sY: this.boots ? { r: 0.5 } : { r: 1, otherDim: true },
			},
		],
	};
}; // END Leg draw
