"use strict";

// HEAD --------------------------------------------------------------------------------
Builder.prototype.Head = function (args) {
	var hairNext = this.IF(0.7);

	// Form & Sizes
	this.headSY = this.IF(0.01) ? this.R(0, 0.4) : this.R(0.1, 0.15);
	if (args.demo && args.head) {
		this.headSY = args.head;
	}

	this.neckSY = this.R(0.05, 0.2);
	this.neckSX = this.R(0.4, 0.9);

	this.headSX = this.R(0.1, 0.7) * this.headSY;
	this.headSideSYFak = this.R(1.6, 2.4);

	this.lowerHeadSX = (this.IF(0.5) && this.R(0.8, 1.2)) || 1;

	this.foreheadSY = this.R(0.1, 0.75);

	// Colors
	this.skinColor = args.skinColor;
	this.skinShadowColor = args.skinShadowColor;
	this.skinDetailColor = args.skinDetailColor;

	this.hairColor = args.hairColor =
		args.animal || this.IF(0.1)
			? args.skinColor.copy({
					brContrast:
						(this.IF(0.5) ? 2 : 1) * (this.IF(0.5) ? -1 : 1),
				})
			: args.skinColor.copy({
					nextColor: hairNext,
					prevColor: !hairNext,
					brContrast: -2,
				});
	this.hairDetailColor = args.hairDetailColor = args.hairColor.copy({
		brContrast: -1,
	});

	this.hatColor = args.hatColor = (
		this.IF(0.5) ? args.firstColor : args.secondColor
	).copy({
		brAdd: this.IF(0.5) ? 0 : this.IF(0.7) ? -2 : 1,
	});

	// Assets
	this.eye = new this.basic.Eye(args);
	this.mouth = new this.basic.Mouth(args);
	this.beard = this.IF() && new this.basic.Beard(args);
	this.headGear = args.headGear =
		(args.demo || this.IF(0.3)) &&
		new (this.IF(0.01)
			? this.basic.Horns
			: this.IF(0.2)
				? this.basic.Helm
				: this.IF(0.1)
					? this.basic.HeadBand
					: this.basic.Hat)(args);
	this.hair = this.IF(0.9) && new this.basic.Hair(args);
}; // END Head
Builder.prototype.Head.prototype = new Builder.prototype.Object();
Builder.prototype.Head.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView,
		list;

	if (args.calc) {
		this.vL["headMinSY" + nr] = {
			r: this.headSY,
			useSize: args.size,
			a: 1,
			min: 1,
		};
		this.vL["headMinSX" + nr] = {
			r: this.headSX,
			min: 1,
			useSize: args.size,
			a: 1.4,
		};

		this.vL["neckSX" + nr] = sideView
			? {
					add: [
						{ r: -1 + this.neckSX, useSize: "headMinSX" + nr },
						"headMinSX" + nr,
					],
					max: "personSX" + nr,
					min: 1,
				}
			: {
					r: this.neckSX,
					useSize: "headMinSX" + nr,
					max: "personSX" + nr,
					min: 1,
				};
		this.vL["neckSY" + nr] = {
			r: this.headSY * this.neckSY,
			useSize: args.size,
			a: -1,
			min: { a: 0 },
		};
	}

	list = {
		y: ["fullBodySY" + nr],
		fY: true,
		color: this.skinColor.get(),
		z: 100,
		list: [
			{
				cX: sideView,
				list: [
					// Neck
					{
						sY: ["neckSY" + nr, 2],
						y: -1,
						sX: "neckSX" + nr,
						cX: sideView,
						fY: true,
					},

					// Head
					{
						sX: sideView ? "headSX" + nr : "lowerHeadSX" + nr,
						sY: "headSY" + nr,
						fY: true,
						y: "neckSY" + nr,
						cX: sideView,
						id: "head" + nr,
						list: [
							// Upper Head
							{
								sX: "headSX" + nr,
								sY: ["upperHeadSY" + nr, 1],
								id: "upperHead" + nr,
								list: [
									// Horns
									this.horns && this.horns.draw(args),

									// Hair
									this.hair && this.hair.draw(args),

									// Head Gear
									(!args.demo || args.hat) &&
										!args.hatDown &&
										this.headGear &&
										this.headGear.draw(args),

									{
										minX: 4,
										minY: 4,
										list: [
											{
												name: "Dot",
												clear: true,
												fX: true,
												fY: true,
											},
											{
												name: "Dot",
												clear: true,
												fX: true,
											},
											sideView && {
												name: "Dot",
												clear: true,
											},
										],
									},

									{},
								],
							},

							// Round Bottom
							{
								fY: true,
								sY: "lowerHeadSY" + nr,
								minY: 4,
								minX: 3,
								list: [
									{
										name: "Dot",
										fY: true,
										clear: true,
										fX: true,
									},
									sideView && {
										name: "Dot",
										fY: true,
										clear: true,
									},
								],
							},

							// Lower Head
							{
								sY: "lowerHeadSY" + nr,
								fY: true,
								list: [
									{ name: "Dot", clear: true, fX: true },
									{},

									// Beard
									this.beard && this.beard.draw(args),
								],
							},

							// Face
							// Mouth
							this.mouth.draw(args, args.backView ? -500 : 50),

							// Eye Area
							this.eye.draw(args, args.backView ? -500 : 50),
						],
					},
				],
			},
		],
	};

	if (args.calc) {
		this.vL["faceMaxSY" + nr] = [
			"mouthMaxSY" + nr,
			"eyeSY" + nr,
			"eyeFullMaxY" + nr,
		];
		this.vL["foreheadSY" + nr] = {
			r: this.foreheadSY,
			useSize: "headMinSY" + nr,
		};
		this.vL["upperHeadSY" + nr] = [
			"foreheadSY" + nr,
			"eyeSY" + nr,
			"eyeY" + nr,
		];

		this.vL["headSX" + nr] = {
			add: ["eyeSX" + nr, "eyeX" + nr],
			min: {
				r: sideView ? this.headSideSYFak : 1,
				useSize: "headMinSX" + nr,
				min: ["mouthSX" + nr],
			},
		};

		this.vL["headMaxSY" + nr] = {
			add: ["mouthTopMaxY" + nr, "upperHeadSY" + nr],
		};
		this.vL["headSY" + nr] = {
			add: ["mouthTopY" + nr, "upperHeadSY" + nr],
			min: "headMinSY" + nr,
		};

		this.vL["hairSX" + nr] = {
			add: ["headSX" + nr, !this.hair ? { a: 0 } : sideView ? 2 : 1],
			max: { r: 1.2, useSize: "headSX" + nr },
		};
		this.vL["lowerHeadSY" + nr] = [
			"headSY" + nr,
			this.sub("upperHeadSY" + nr),
			1,
		];
		this.vL["eyeOutX" + nr] = [
			"headSX" + nr,
			this.sub("eyeSX" + nr),
			this.sub("eyeX" + nr),
		];
		this.vL["lowerHeadSX" + nr] = {
			r: this.lowerHeadSX,
			useSize: "headSX" + nr,
			min: "mouthSX" + nr,
		};
	}
	return list;
};

// EYE --------------------------------------------------------------------------------
Builder.prototype.Eye = function (args) {
	// Form & Sizes
	this.eyeBrow = this.IF(0.7);
	this.monoBrow = this.eyeBrow && this.IF(0.05);

	this.eyeLidsBottom = this.IF(0.7);
	this.eyeLidsTop = this.IF(this.eyeBrow ? 0.3 : 0.7);
	this.eyeLids = this.eyeLidsBottom || this.eyeLidsTop;

	this.eyeRoundTop = this.IF(0.5);
	this.eyeRoundBottom = this.IF(0.5);

	this.eyeSX = this.R(0.2, 0.4);
	this.eyeSY = this.R(0.2, 3);

	this.eyeX = this.R(0.1, 0.7) - this.eyeSX;
	this.eyeY = this.R(-0.2, 0.3);

	this.highPupil = this.IF(0.1);

	this.glasses = this.IF(0.02);

	// Colors
	this.skinColor = args.skinColor;
	this.skinShadowColor = args.skinShadowColor;
	this.skinDetailColor = args.skinDetailColor;
	this.hairColor = args.hairColor;

	this.eyeColor = args.skinColor.copy({ brAdd: this.glasses ? 2 : 1 });
	this.pupilColor = this.glasses
		? this.eyeColor.copy({ brAdd: -2 })
		: args.skinDetailColor;

	this.glassesColor = args.skinColor.copy({
		nextColor: this.IF(0.5),
		brAdd: -2,
	});

	// Assets
}; // END Eye
Builder.prototype.Eye.prototype = new Builder.prototype.Object();
Builder.prototype.Eye.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView,
		thisEye = args.eye || {},
		lids = thisEye.lids,
		lookHor = thisEye.lookHor,
		lookVert = thisEye.lookVert,
		brow = thisEye.brow,
		eyeSad = lids === "sad",
		eyeAngry = eyeSad || lids === "angry",
		eyeClosed =
			eyeAngry ||
			lids === "closed" ||
			lids === "sleepy" ||
			(args.right && lids === "wink"),
		eyeHalfClosed = !eyeClosed && lids === "halfClosed",
		lookUp = lookHor === "up",
		lookDown = lookHor === "down" || lookHor === "veryDown",
		lookExtrem = lookUp || lookHor === "veryDown",
		lookForward = !lookUp && !lookDown,
		lookSide = lookVert,
		lookRight = lookVert === "right",
		eyeBrowRaised =
			brow === "raised" || (args.right && brow === "sceptical"),
		eyeBrowLow = brow === "low" || (!args.right && brow === "sceptical"),
		eyeBrowSad =
			brow === "sad" || (args.right && brow === "superSceptical"),
		eyeBrowAngry =
			eyeBrowSad ||
			brow === "angry" ||
			(!args.right && brow === "superSceptical");

	if (args.calc) {
		this.vL["eyeFullSX" + nr] = {
			r: this.eyeSX,
			useSize: "headMinSX" + nr,
			max: "headMinSX" + nr,
		};
		this.vL["eyeSX" + nr] = {
			r: sideView ? 0.8 : 1,
			useSize: "eyeFullSX" + nr,
			min: { r: 0.3, useSize: "headMinSX" + nr, max: 1 },
		};
		this.vL["eyeSY" + nr] = {
			r: this.eyeSX * this.eyeSY,
			useSize: "headMinSX" + nr,
			min: { r: 0.2, useSize: "headMinSY" + nr, max: 1 },
			max: { r: 2, useSize: "eyeSX" + nr, a: -1 },
		};

		this.vL["eyeX" + nr] = {
			r: this.eyeX,
			useSize: "headMinSX" + nr,
			min: 1,
		};
		this.vL["eyeY" + nr] = {
			r: this.eyeY,
			useSize: "headMinSY" + nr,
			min: { a: 0 },
		};
		this.vL["eyeFullY" + nr] = ["eyeY" + nr, "mouthTopY" + nr, 0.1];
		this.vL["eyeFullMaxY" + nr] = ["eyeY" + nr, "mouthTopMaxY" + nr, 0.1];

		this.vL["eyeBrowSY" + nr] = { r: 0.3, useSize: "eyeSY" + nr };
	}

	return (
		!args.backView && {
			sX: "eyeSX" + nr,
			sY: "eyeSY" + nr,
			x: "eyeX" + nr,
			y: "eyeFullY" + nr,
			fY: true,
			id: "eyes" + nr,
			color: (this.glasses
				? this.pupilColor
				: this.skinShadowColor
			).get(),
			z: 0,
			list: [
				this.glasses && {
					color: this.glassesColor.get(),
					list: [
						// Rim
						{ m: -1 },

						//Between Eyes
						{ sY: 1, sX: "eyeX" + nr, tX: true },

						// Ear Things
						{ sY: 1, sX: "eyeOutX" + nr, fX: true, tX: true },

						// Glasses
						{ color: this.eyeColor.get() },
					],
				},

				!eyeClosed
					? {
							// Open Eyes
							list: [
								{
									minY: 3,
									minX: 3,
									list: [
										{
											minX: 4,
											list: [
												!this.eyeLidsTop && {
													name: "Dot",
													clear: true,
												},
												!this.eyeLidsBottom && {
													name: "Dot",
													fY: true,
													clear: true,
												},
											],
										},

										!this.eyeLidsBottom && {
											name: "Dot",
											fY: true,
											fX: true,
											clear: true,
										},
										!this.eyeLidsTop && {
											name: "Dot",
											fX: true,
											clear: true,
										},
									],
								},

								{
									sY: !this.glasses && eyeHalfClosed && 1,
									y: !this.glasses &&
										eyeHalfClosed && ["lowerLids" + nr],
									fY: true,
									list: [
										{ color: this.eyeColor.get() },

										{
											sX: {
												r: 0.4,
												max: ["eyeSX" + nr, -1],
												min: 1,
											},
											sY: !this.highPupil && {
												r: lookExtrem ? 0.5 : 0.6,
												max: "eyeSY" + nr,
												min: 1,
											},
											color: this.pupilColor.get(),
											fY: !lookUp,
											rY: lookUp,
											rX:
												lookSide &&
												args.right == lookRight,
											fX:
												lookSide &&
												args.right == lookRight,
											cY: lookForward,
											id: "pupil" + nr,
											list: !this.highPupil && [
												{
													minX: 3,
													minY: 3,
													list: [
														{
															name: "Dot",
															clear: true,
															fX: true,
														},
													],
												},
												{
													minX: 4,
													minY: 4,
													list: [
														{
															name: "Dot",
															clear: true,
														},
														lookForward && {
															name: "Dot",
															clear: true,
															fX: true,
															fY: true,
														},
														lookForward && {
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

								// Half Closed
								!this.glasses &&
									eyeHalfClosed && {
										id: "halfClosed" + nr,
										list: [
											{
												sY: {
													r: 1,
													add: [
														this.sub(
															"lowerLids" + nr,
														),
														-1,
													],
												},
											},
											{
												sY: {
													r: 0.5,
													max: { r: 1, a: -2 },
													save: "lowerLids" + nr,
												},
												fY: true,
											},
										],
									},

								// EyeLids Top
								!this.glasses &&
									this.eyeLidsTop && {
										minY: 3,
										list: [
											{
												sY: { r: 1, a: -2, max: 1 },
											},
										],
									},

								// EyeLids Bottom
								!this.glasses &&
									this.eyeLidsBottom && {
										minY: 4,
										list: [
											{
												sY: { r: 1, a: -2, max: 1 },
												fY: true,
											},
										],
									},
							],
						}
					: {
							// Closed Eyes
							fY: true,
							sY: 1,
							cY: lids !== "sleepy",
						},

				// Eye Brow
				this.eyeBrow && {
					sX: this.monoBrow
						? ["eyeSX" + nr, "eyeX" + nr]
						: {
								r: 1,
								a: 1,
								max: ["headSX" + nr, this.sub("eyeX" + nr)],
							},
					sY: eyeBrowAngry
						? [
								"eyeBrowSY" + nr,
								{ r: 0.2, useSize: "eyeSY" + nr, max: 1 },
							]
						: "eyeBrowSY" + nr,
					y:
						(eyeBrowRaised && -1) ||
						(eyeBrowLow && {
							r: 0.2,
							useSize: "eyeSX" + nr,
							max: 1,
						}),
					minX: 2,
					fX: this.monoBrow,
					tY: true,
					id: "eyeBrow" + nr,
					color: this.hairColor.get(),
					list: eyeBrowAngry && [
						{
							sX: { r: 0.5 },
							sY: "eyeBrowSY" + nr,
							fY: eyeBrowSad,
							fX: true,
						},
						{
							sX: { r: 0.5 },
							sY: "eyeBrowSY" + nr,
							fY: !eyeBrowSad,
						},

						// { a:eyeBrowSad ? -1 : 1, max:{r:.2} }
					],
				},
			],
		}
	);
}; // END Eye draw

// MOUTH --------------------------------------------------------------------------------
Builder.prototype.Mouth = function (args) {
	// Form & Sizes
	this.mouthSX = this.R(0.4, 0.6);
	this.mouthSY = this.R(0.2, 0.4);
	this.mouthY = this.R(0.1, 0.6);

	// Colors
	this.skinColor = args.skinColor;
	this.skinDetailColor = args.skinDetailColor;
	this.teethColor = this.skinColor.copy({ brAdd: 2 });
	this.teethShadowColor = this.teethColor.copy({ brAdd: -1 });

	// Assets
}; // END Mouth
Builder.prototype.Mouth.prototype = new Builder.prototype.Object();
Builder.prototype.Mouth.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView,
		thisMouth = args.mouth || {},
		mouthWidth = thisMouth.width,
		mouthHeight = thisMouth.height,
		mouthForm = thisMouth.form,
		teeth = thisMouth.teeth,
		mouthD = mouthForm === "D:",
		mouthGrin = mouthD || mouthForm === "grin",
		mouthNarrow = mouthWidth === "narrow",
		mouthSlight = mouthHeight === "slight",
		mouthHalfOpen = mouthHeight === "half",
		mouthOpen = mouthSlight || mouthHalfOpen || mouthHeight === "full",
		mouthSmile = mouthGrin && !mouthOpen,
		teethFull =
			!mouthSlight && mouthOpen && !mouthNarrow && teeth === "full",
		teethTop =
			!mouthSlight &&
			((mouthOpen && teeth === "top") || teeth === "both"),
		teethBottom =
			!mouthSlight &&
			((mouthOpen && teeth === "bottom") || teeth === "both"),
		smirk = thisMouth.smirk;

	if (args.calc) {
		this.vL["mouthSX" + nr] = {
			r: this.mouthSX * (sideView ? 0.7 : 1),
			a: 0.5,
			useSize: "headMinSX" + nr,
			max: "headMinSX" + nr,
		};
		this.vL["mouthMaxSY" + nr] = {
			r: this.mouthSY,
			useSize: "headMinSY" + nr,
		};
		this.vL["mouthSY" + nr] =
			mouthSlight || mouthSmile
				? { a: 2, max: "mouthMaxSY" + nr }
				: mouthOpen
					? mouthHalfOpen
						? this.mult(0.5, "mouthMaxSY" + nr)
						: "mouthMaxSY" + nr
					: { a: 1, max: "mouthMaxSY" + nr };
		this.vL["mouthY" + nr] = { r: this.mouthY, useSize: "headMinSY" + nr };
		this.vL["mouthTopMaxY" + nr] = ["mouthMaxSY" + nr, "mouthY" + nr];
		this.vL["mouthTopY" + nr] = ["mouthSY" + nr, "mouthY" + nr];
	}

	return (
		!args.backView && {
			sX: {
				r: (mouthNarrow ? 0.4 : 1) * (smirk && args.right ? 0.4 : 1),
				useSize: "mouthSX" + nr,
			},
			minX: 2,
			sY: "mouthSY" + nr,
			y: "mouthY" + nr,
			fY: true,
			id: "mouth" + nr,
			z: 0,
			color: this.skinDetailColor.get(),
			list: mouthSmile
				? [
						{ sX: 1, sY: 1, fX: true, fY: mouthD },
						{ sX: { r: 1, a: -1 }, sY: 1, fY: !mouthD },
					]
				: mouthOpen && [
						mouthOpen &&
							(mouthD || mouthGrin) && {
								name: "Dot",
								clear: true,
								fX: true,
								fY: mouthD,
							},

						{},

						teethFull && {
							sX: { r: 0.75, min: { r: 1, a: -2, min: 2 } },
							color: this.teethColor.get(),
							list: [
								{},
								{
									sY: { r: 0.2, max: 1 },
									cY: true,
									color: this.teethShadowColor.get(),
								},
							],
						},

						teethTop && { sY: 1, color: this.teethColor.get() },

						teethBottom && {
							sY: 1,
							fY: true,
							color: this.teethColor.get(),
						},
					],
		}
	);
}; // END Mouth draw

// HAIR --------------------------------------------------------------------------------
Builder.prototype.Hair = function (args) {
	// Form & Sizes
	this.curly = args.headGear && this.IF();

	this.longHair = this.IF(0.1);
	this.hairSY = this.R(0.1, 1) * (this.longHair ? 3 : 1);
	this.hairSide = this.curly || this.IF(0.99);
	this.hairSideSY = 0.8 || (this.hairSide && this.R(0.2, 0.8));
	this.hairAccuracy = this.R(0.1, 0.3);
	this.hairS = this.R(0.01, 0.1);

	this.detailSY = this.R(0, 0.25);
	this.detailChance = this.R(0, 0.5);

	// Colors
	this.hairColor = args.hairColor;
	this.hairDetailColor = args.hairDetailColor;

	// Assets
}; // END Hair
Builder.prototype.Hair.prototype = new Builder.prototype.Object();
Builder.prototype.Hair.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView,
		backView = args.backView,
		rightSide = sideView || !args.right,
		name = args.id + "_" + args.right + nr;

	if (args.calc) {
		this.vL["hairS" + nr] = {
			r: this.hairS,
			useSize: "headMinSY" + nr,
			min: 1,
		};
		this.vL["hairAccuracy" + nr] = {
			r: this.hairAccuracy * -1,
			useSize: "headMinSY" + nr,
			max: { a: 0 },
		};
		this.vL["hairDetailSY" + nr] = {
			r: this.detailSY,
			useSize: "headMinSY" + nr,
			min: 1,
		};
	}

	return {
		color: this.hairColor.get(),
		sX: "hairSX" + nr,
		cX: sideView,
		fX: sideView,
		z: 100,
		id: "hair" + nr,
		list: [
			// Main Hair Front
			{
				use: "hairFront" + name,
				cut: true,
			},

			// Main Hair Back
			{
				use: "hairBack" + name,
				z: -1000,
				cut: true,
			},

			// Detail
			{
				minY: 6,
				list: [
					// Back
					{
						use: "hairBack" + name,
						z: -1000,
						color: this.hairDetailColor.get(),
						chance: this.detailChance,
						sY: {
							a: "hairDetailSY" + nr,
							random: "hairDetailSY" + nr,
						},
						mask: true,
					},
					// Front
					{
						use: "hairFront" + name,
						color: this.hairDetailColor.get(),
						chance: this.detailChance,
						sY: {
							a: "hairDetailSY" + nr,
							random: "hairDetailSY" + nr,
						},
						mask: true,
					},
				],
			},

			// Top
			{
				save: "hairFront" + name,
				sX: "headSX" + nr,
				cX: sideView,
				sY: 1,
			},

			{
				sY: { r: 1, a: -1 },
				y: 1,
				list: [
					// ForeHead
					rightSide && {
						sX: !sideView && {
							r: 2,
							useSize: "hairSX" + nr,
							a: -1,
						},
						sY: { r: 0.5, useSize: "foreheadSY" + nr, a: -1 },
						fX: true,
						save: "hairFront" + name,
						list: [
							{
								stripes: {
									random: "hairAccuracy" + nr,
									seed: args.id + (args.right ? 1 : 0),
									strip: "hairS" + nr,
								},
							},
						],
					},

					// Back Hair
					this.hairSide && {
						color: this.longHair ? [0, 100, 150] : [0, 130, 255],
						fX: true,
						sX: sideView
							? { r: 0.5 }
							: { r: 2, useSize: "hairSX" + nr, a: -1 },
						sY: {
							r: this.hairSY,
							useSize: "headMinSY" + nr,
							min: "hairSideSY" + nr,
							max: ["personRealMinSY" + nr, -2],
						},
						list: [
							{
								save:
									(backView ? "hairFront" : "hairBack") +
									name,
								color: [255, 0, 0],
								stripes: {
									random: "hairAccuracy" + nr,
									seed: args.id + (args.right ? 1 : 0),
									strip: "hairS" + nr,
								},
							},
						],
					},

					// Side Hair
					this.hairSide && {
						sX: {
							r: sideView ? 0.8 : 0.6,
							useSize: "eyeOutX" + nr,
							max: {
								r: sideView ? 0.9 : 0.15,
								useSize: "headSX" + nr,
							},
						},
						sY: {
							r: this.hairSideSY,
							useSize: "upperHeadSY" + nr,
							save: "hairSideSY" + nr,
						},
						x: 1,
						fX: true,
						save: "hairFront" + name,
						// color:[0,0,255],
						stripes: {
							random: sideView && "hairAccuracy" + nr,
							strip: sideView && "hairS" + nr,
							change: !sideView && { r: -0.3 },
							seed: args.id + (args.right ? 1 : 0),
						},
					},
				],
			},
		],
	};
}; // END Hair draw

// BEARD --------------------------------------------------------------------------------
Builder.prototype.Beard = function (args) {
	// Form & Sizes
	this.threeOClok = this.IF(0.1);
	this.mainBeard = this.IF(0.5);
	this.mustach = !this.mainBeard || this.IF(0.8);
	this.goate = this.mustach && this.IF(this.mainBeard ? 0.8 : 0.05);
	this.mustachGap = this.mustach && this.IF(0.5);
	this.beardColor = args.hairColor;
	this.chinBard = this.IF(0.05);
	this.beardLength = this.R(0.2, 1.5);

	this.detailSY = this.R(0, 0.25);
	this.detailChance = this.R(0, 0.5);

	// Color
	this.threeOClok &&
		(this.skinShadowColor = args.skinShadowColor.copy({ min: 1 }));
	this.hairDetailColor = args.hairDetailColor;

	// Assets
}; // END Beard
Builder.prototype.Beard.prototype = new Builder.prototype.Object();
Builder.prototype.Beard.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView;

	if (args.calc) {
		this.vL["beardDetailSY" + nr] = {
			r: this.detailSY,
			useSize: "headMinSY" + nr,
			min: 1,
		};
	}

	return {
		color: this.beardColor.get(),
		id: "beard" + nr,
		z: args.backView && -100,
		list: [
			// 3 O’Clock Shadow
			this.threeOClok && {
				id: "head" + nr,
				sY: "mouthTopY" + nr,
				fY: true,
				color: this.skinShadowColor.get(),
			},

			// Beard Detail
			this.mainBeard && { use: "beard" + nr },

			this.mainBeard && {
				use: "beard" + nr,
				color: this.hairDetailColor.get(),
				chance: this.detailChance,
				sY: { a: "beardDetailSY" + nr, random: "beardDetailSY" + nr },
				mask: true,
			},

			// Mustach
			this.mustach && {
				sY: { r: 0.6, useSize: "eyeY" + nr },
				sX: ["mouthSX" + nr, 1],
				fY: true,
				y: "mouthTopY" + nr,
				x: this.mustachGap && 1,
				stripes: { horizontal: true, change: -1 },
			},

			// Goate
			this.goate && {
				sX: { r: 0.2 },
				sY: "mouthTopY" + nr,
				fY: true,
				x: [
					"mouthSX" + nr,
					this.mustachGap
						? { r: 0.1, useSize: "headSX" + nr, max: 1 }
						: { a: 0 },
				],
			},

			// Main Beard
			this.mainBeard && {
				fY: true,
				tY: true,
				id: "beard" + nr,
				y: ["mouthY" + nr, -1],
				sY: { r: this.beardLength, useSize: "headMaxSY" + nr },
				sX: { r: (sideView ? 0.5 : 1) * (this.chinBard ? 0.5 : 1) },
				list: [
					{
						y: -1,
						sY: 2,
					},

					{
						stripes: {
							change: { r: -0.5 },
							random: { r: -0.3, a: 2, max: { a: 0 } },
							seed: args.id + (args.right ? 1 : 0) * 2,
						},
						save: "beard" + nr,
					},
				],
			},
		],
	};
}; // END Beard draw

// HAT --------------------------------------------------------------------------------
Builder.prototype.Hat = function (args) {
	// Form & Sizes
	this.hatSY = this.R(0, 1);

	this.smallHat = this.IF(0.05) && this.R(0.3, 1);

	this.getSmaller = this.IF();
	this.hatTopSX = this.getSmaller && this.R(-0.6, 1);

	this.roundHat = !this.getSmaller && this.IF(0.5);
	this.hatRim = this.IF(0.6);
	this.baseCap = this.hatRim && this.IF(0.1);
	this.thickRim = this.hatRim && this.IF(0.3);
	this.hatBand = this.IF(
		0.3 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.4 : 0),
	);

	this.dent = this.IF(
		0.2 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.49 : 0),
	);
	this.dentSX = this.dent && this.R(0, 0.5);

	this.hatDepthY = this.R(0.1, 1) * (this.smallHat || 1);
	this.hatRimSY = this.hatRim && this.R(1, 2);

	// Colors
	this.hatColor = args.hatColor;
	this.hatBandColor =
		this.hatBand &&
		!this.baseCap &&
		(this.IF(0.5) ? args.firstColor : args.secondColor).copy({
			brContrast: -1,
		});
	this.hatRimColor = this.IF(this.baseCap ? 0.8 : 0.1)
		? this.hatColor.copy({ nextColor: true, brContrast: -2 })
		: this.hatColor;

	// Assets
}; // END Hat
Builder.prototype.Hat.prototype = new Builder.prototype.Object();
Builder.prototype.Hat.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView;

	// if( args.calc ) {
	// 	this.vL[ "hatDepthY"+nr ] = ;
	// }

	return {
		color: this.hatColor.get(),
		tY: true,
		id: "hat" + nr,
		z: 500,
		cX: sideView,
		fX: sideView,
		sY: {
			r: this.hatSY,
			useSize: "headMinSY" + nr,
			min: [
				{
					r: this.hatDepthY,
					useSize: "foreheadSY" + nr,
					min: 1,
					save: "hatDepthY" + nr,
				},
				1,
			],
		},
		sX: this.smallHat
			? { r: this.smallHat, useSize: "hairSX" + nr }
			: "hairSX" + nr,
		y: !this.smallHat && "hatDepthY" + nr,
		list: [
			// Dent
			!sideView &&
				this.dent && {
					sX: { r: this.dentSX * (this.hatTopSX || 1), min: 1 },
					clear: true,
					sY: 1,
				},

			// Rounding
			this.roundHat && { name: "Dot", clear: true, fX: true },
			this.roundHat && sideView && { name: "Dot", clear: true },

			// Hat Band
			this.hatBand &&
				(sideView || !this.baseCap) && {
					z: 10,
					sY: { r: 0.3, min: 2 },
					sX: this.baseCap && { r: 0.2 },
					fX: true,
					fY: true,
					clear: this.baseCap,
					color: this.hatBandColor && this.hatBandColor.get(),
				},

			this.getSmaller && { id: "hair" + nr, clear: true },

			// Main Hat
			{
				points: this.getSmaller && [
					sideView
						? { y: this.hatTopSX > 0 && "hatDepthY" + nr, fY: true }
						: { y: -1 },
					sideView
						? {
								x: { r: this.hatTopSX * (sideView ? 0.5 : 1) },
								y: -1,
							}
						: { y: -1 },
					{
						x: { r: this.hatTopSX * (sideView ? 0.5 : 1) },
						fX: true,
						y: -1,
					},
					{
						y: this.hatTopSX > 0 && "hatDepthY" + nr,
						fY: true,
						fX: true,
					},
					{ fY: true, fX: true },
					{ fY: true },
				],
			},

			// Rim
			this.hatRim && {
				id: "hatRim" + nr,
				z: 20,
				sY: { a: this.thickRim ? 2 : 1, save: "hatRim" + nr },
				sX:
					(!this.baseCap && { r: this.hatRimSY }) ||
					(sideView && { r: (this.hatRimSY - 1) / 2 + 1 }),
				cX: sideView && !this.baseCap,
				fX: sideView,
				fY: true,
				color: this.hatRimColor.get(),
			},
		],
	};
}; // END Hat draw

// HELM --------------------------------------------------------------------------------
Builder.prototype.Helm = function (args) {
	// Form & Sizes
	this.helmSY = this.IF(0.5) ? 1 : this.R(0.1, 1.5);
	this.nosePiece = this.IF(0.5);
	this.topDetail = this.IF(0.3);
	this.foreheadDetail = this.IF(0.3);
	this.bottomDetail = this.IF(0.3);
	this.sides = this.IF(0.8);
	this.full = this.sides && this.IF(0.1);

	this.foreheadDetailGap = this.GR(0, 3);
	this.foreheadDetailSX = this.GR(0, 3);
	this.foreheadDetailSY = this.R(0.1, 0.5);

	// Colors
	this.helmColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
		brContrast: this.IF(0.8) ? -2 : 0,
	});
	this.helmDetailColor = this.helmColor.copy({ brContrast: -1 });

	// Assets
	this.horns = this.IF(0.1) && new this.basic.Horns(args);
}; // END Helm
Builder.prototype.Helm.prototype = new Builder.prototype.Object();
Builder.prototype.Helm.prototype.draw = function (args) {
	var nr = args.nr,
		sideView = args.sideView;

	// if( args.calc ) {
	// 	this.vL[ "hatDepthY"+nr ] = ;
	// }

	return {
		color: this.helmColor.get(),
		id: "hat" + nr,
		z: 160,
		y: -1,
		cX: sideView,
		sY: [{ r: this.helmSY, useSize: "headMaxSY" + nr }, 2],
		sX: "hairSX" + nr,
		list: [
			{
				list: [
					!sideView &&
						this.sides && {
							color: !args.backView && this.helmDetailColor.get(),
							z: -1000,
						},

					// Horns
					this.horns && this.horns.draw(args),

					// Top Detail
					this.topDetail && {
						tY: true,
						sX: { r: 0.2, min: 1 },
						sY: 1,
						cX: sideView,
						color: this.helmDetailColor.get(),
					},

					// Top Part
					{ sY: { r: 1, max: "foreheadSY" + nr } },

					// Sides
					this.sides && {
						sX: { a: "eyeOutX" + nr, min: 1 },
						fX: true,
						list: this.bottomDetail && [
							{},
							{
								fY: true,
								y: 1,
								sY: 2,
								color: this.helmDetailColor.get(),
							},
						],
					},

					// Full
					this.full && {
						y: ["foreheadSY" + nr, "eyeSY" + nr, 1],
						sY: "mouthTopMaxY" + nr,
					},

					// Nose Piece
					this.nosePiece && {
						z: 5,
						sX: {
							r: 0.2,
							useSize: "headSX" + nr,
							max: "eyeX" + nr,
							min: ["eyeX" + nr, -1],
						},
						sY: ["foreheadSY" + nr, "eyeSY" + nr, 2],
					},

					args.backView && {},
				],
			},

			this.foreheadDetail && {
				sY: {
					r: this.foreheadDetailSY,
					useSize: "foreheadSY" + nr,
					min: 1,
					save: "helmDetailSX" + nr,
				},
				y: {
					r: 0.7,
					a: -1,
					useSize: "foreheadSY" + nr,
					min: { a: 0 },
					max: {
						r: -1.2,
						useSize: "helmDetailSX" + nr,
						a: "foreheadSY" + nr,
					},
				},
				color: this.helmDetailColor.get(),
				stripes: {
					gap: this.foreheadDetailGap,
					strip: this.foreheadDetailSX,
				},
			},
		],
	};
}; // END Helm draw

// HEADBAND --------------------------------------------------------------------------------
Builder.prototype.HeadBand = function (args) {
	// Form & Sizes

	// Colors
	this.headBandColor = args.hatColor;

	// Assets
}; // END HeadBand
Builder.prototype.HeadBand.prototype = new Builder.prototype.Object();
Builder.prototype.HeadBand.prototype.draw = function (args, z) {
	var nr = args.nr,
		sideView = args.sideView;

	return {
		z: z,
		sY: {
			r: 0.3,
			useSize: "foreheadSY" + nr,
			min: 1,
			save: "headBandSX" + nr,
		},
		sX: "hairSX" + nr,
		cX: sideView,
		color: this.headBandColor.get(),
		y: {
			r: 0.5,
			useSize: "foreheadSY" + nr,
			max: ["foreheadSY" + nr, this.sub("headBandSX" + nr)],
		},
	};
}; // END HeadBand draw

// HORNS --------------------------------------------------------------------------------
Builder.prototype.Horns = function (args) {
	// Form & Sizes
	this.hornsSX = this.R(0.05, 2);
	this.hornsSY = this.R(0.05, 0.3);
	this.hornsY = this.R(0.1, 0.25);

	this.hornsBendSY = this.R(0.1, 1);

	// Colors
	this.hornColor = this.IF() ? args.skinColor : args.hairColor;

	// Assets
}; // END Horns
Builder.prototype.Horns.prototype = new Builder.prototype.Object();
Builder.prototype.Horns.prototype.draw = function (args, z) {
	var nr = args.nr,
		sideView = args.sideView;

	// if( args.calc ) {
	// 	this.vL[ "hatDepthY"+nr ] = ;
	// }

	return {
		tX: !sideView || !this.ears,
		fX: true,
		z: z + (sideView ? 100 : 0),
		id: "horns" + nr,
		color: this.hornColor.get(),
		sX: {
			r: this.hornsSX * (sideView ? 0.5 : 1),
			useSize: "headSX" + nr,
			min: 1,
		},
		sY: { r: this.hornsSY, useSize: "headMaxSY" + nr },
		x: sideView && {
			r: this.ears ? 0.3 : this.hornsSX * 0.3,
			useSize: "headSX" + nr,
		},
		y: { r: this.hornsY, useSize: "headMaxSY" + nr },
		list: [
			{ name: "Dot", clear: true, fX: true, fY: true },
			// bend
			{
				tY: true,
				fX: true,
				sX: { r: 1, a: -1, otherDim: true, min: 1 },
				sY: { r: this.hornsBendSY, otherDim: true },
				list: [{ name: "Dot", clear: true, fX: true }, {}],
			},

			// Main Horn
			{},
		],
	};
}; // END Horns draw
