"use strict"; /* global Comic */

// BEGINN ACTOR /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Actor = function Actor(args, left) {
	this.copy(args);

	this.name = "actor" + (left ? "1" : "2");

	// Forms & Sizes
	this.left = left;
	this.posX_ = 0;
	this.posY_ = 0;
	this.movementDirection = this.left ? 1 : -1;
	this.baseSpeed = this.rFl(0.1, 0.3);
	this.speed = 0;

	this.hasLegs = this.rIf(0.5);

	this.sX_ = this.rFl(0.4, 1);
	this.sY_ = this.rFl(0.6, 1);
	this.legsSY_ = this.hasLegs && this.rFl(0, 0.3);

	this.topHeadSY_ = this.rFl(0.25, 0.75);

	this.mouthSX = this.rFl(0, 1);
	this.mouthY = this.rFl(0, 1);

	this.faceSX = this.rFl(0.2, 0.4);

	this.foreHeadRound = this.rIf(0.5);
	this.backHeadRound = this.rIf(0.5);

	// Colors
	this.color = [
		args.foregroundBaseColor[0] * this.rFl(0, 0.8),
		args.foregroundBaseColor[1] * this.rFl(0, 0.8),
		args.foregroundBaseColor[2] * this.rFl(0, 0.8),
	];

	this.shadowColor = [
		this.color[0] * 0.6,
		this.color[1] * 0.6,
		this.color[2] * 0.6,
	];

	this.lightColor = [
		this.color[0] * 1.2,
		this.color[1] * 1.2,
		this.color[2] * 1.2,
	];

	this.groundShadowColor = args.groundShadowColor;
	// Assets
	this.eye = new this.basic.Eye({
		color: this.color,
		shadowColor: this.shadowColor,
		lightColor: this.lightColor,
	});

	this.carryObject = this.rIf(0.1) && new this.basic.CarryObject();
};

Comic.prototype.Actor.prototype = {
	act: function () {},

	idle: function () {},

	startActing: function () {
		this.setAction("decide", { actions: ["startWalking", "hit"] });
	},

	setAction: function (action, args) {
		this.act = this[action];

		args = args || {};

		this.actorControl.addComment(
			this.name + (!args.dontStart ? " " : " will start ") + action,
		);

		if (!args.dontStart) {
			this.act(args);
		}
	},

	decide: function (args) {
		this.eye.changeExpression(0.4);
		this.setAction(args.actions[this.rInt(0, args.actions.length - 1)], {
			dontStart: true,
		});
	},

	startWalking: function () {
		this.speed =
			// Walk way if to close, or randomly
			(1 - this.opponent.posX_ - this.posX_ < 0.2 || this.rIf(0.2)
				? -1
				: 1) *
			0.2 *
			this.rFl(1, 3);
		this.setAction("walk");
	},

	walk: function () {
		var opponentPos = 1 - this.opponent.posX_;

		// Small Chance of randomly stopping to walk
		if (this.rIf(1 - this.posX_)) {
			this.posX_ += this.speed;

			this.walking = true;

			if (this.posX_ < -2) {
				// Walking Away

				if (this.rIf(0.5)) {
					// End Comic
					this.actorControl.endComic();
				} else {
					// Turn Around
					this.speed *= -1.5;
					this.actorControl.addComment(this.name + " turned around ");
				}
			} else if (opponentPos - this.posX_ < 0) {
				this.posX_ = opponentPos;
				this.actorControl.addComment(
					this.name + " has reached " + this.opponent.name,
				);
				this.setAction("stop");

				this.walking = false;
			}
		} else {
			this.actorControl.addComment(this.name + " randomly stopps");
			this.setAction("stop");
		}
	},

	passBall: function (args) {
		var stay = this.rIf(0, args.stay);

		if (stay) {
			this.actorControl.addComment(this.name + " STAYS Actor");
			this.setAction("decide", args);
			args.dontStart = true;
		} else {
			this.setAction("idle");
			this.actorControl.setActor(this.opponent);
			this.opponent.setAction("decide", args);
		}
	},

	hit: function () {
		var distance = 1 - this.opponent.posX_ - this.posX_;
		if (distance < 0.3) {
			this.hitting = true;
			this.armLength = distance;
			this.opponent.isHit = true;
		} else {
			this.pointing = true;
		}

		this.setAction("stop", { stay: 0.5 });
	},

	kiss: function () {
		this.kissing = true;

		this.setAction("stop", { dontStart: true, stay: 0.5 });
	},

	jump: function () {
		this.posY_ = 0.5;
		this.setAction("fall", { dontStart: true });
	},

	fall: function () {
		this.posY_ -= 0.5;
		if (this.posY_ <= 0) {
			this.posY_ = 0;
			this.hasLanded = true;
			this.setAction("stop", {
				actions: ["hit", "startWalking"],
				delay: 0.8,
				stay: 0.5,
			});
		}
	},

	stop: function (args) {
		args = args || this.stopArgs || {};

		this.speed = 0;

		if (args.delay && this.rIf(args.delay)) {
			this.actorControl.addComment(this.name + " delays Ballpass");
			args.delay /= 2;
			this.stopArgs = args;
			return;
		}
		this.setAction("passBall", {
			actions: args.actions || ["kiss", "hit", "jump", "startWalking"],
			stay: args.stay || 0.5,
		});
	},

	draw: function (args, posX) {
		var sX,
			sY,
			legsSY,
			headSY,
			faceSX,
			topHeadSY,
			bottomHeadSY,
			backward = this.speed < 0,
			still = !this.isHit && this.speed === 0,
			moveBottom = still ? 0 : 0,
			moveTop = still ? 0 : 1,
			inAir = this.posY_ > 0,
			landed = this.hasLanded,
			hits = this.hitting,
			kiss = this.kissing,
			walk = this.walking,
			armForward = hits || this.pointing,
			legSpeed = this.feetPos ? -0.3 : 0.3;

		this.feetPos = !this.feetPos;

		this.hitting =
			this.pointing =
			this.hasLanded =
			this.isHit =
			this.kissing =
			this.walking =
				false;

		this.linkList.push(
			(this.sX = sX = { r: this.sX_, useSize: args.size }),
			(this.sY = sY =
				{ r: this.sY_ * (landed ? 0.6 : 1), useSize: args.size }),
		);

		if (this.hasLegs) {
			this.linkList.push((legsSY = { r: this.legsSY_, useSize: sY }));
		}

		this.linkList.push(
			(this.headSY = headSY =
				this.hasLegs ? [sY, { r: -1, useSize: legsSY }] : sY),
			(this.topHeadSY = topHeadSY =
				{ r: this.topHeadSY_, useSize: headSY }),
			(this.bottomHeadSY = bottomHeadSY =
				[headSY, { r: -1, useSize: topHeadSY }]),
			(faceSX = { r: this.faceSX, useSize: sX }),
		);

		this.posX = posX;

		return {
			s: args.size,
			fY: true,
			fX: !this.left,
			x: posX,
			rX: this.left,
			z: 1000 + (hits ? 1000 : 0),
			list: [
				// // Whole Box
				// {
				// 	color:[Math.random()*255,150,150],
				// },

				// Whole Body
				{
					sX: sX,
					sY: sY,
					fY: true,
					id: this.name,
					color: this.color,
					rX: backward,
					x: moveBottom,
					y: this.posY_ && { r: this.posY_, useSize: sY },
					list: [
						// Symbol
						// Heart
						kiss && {
							color: [
								this.color[0] * 2,
								this.color[1] * 1.2,
								this.color[2] * 1.2,
							],
							sY: { r: 0.1, useSize: sY, min: 3 },
							sX: 1,
							cX: true,
							tY: true,
							y: -1,
							z: 2000,
							list: [
								{ mX: { r: -0.1, otherDim: true, a: -1 } },
								{
									y: -1,
									sX: { r: 0.4, otherDim: true, min: 2 },
									tX: true,
								},
								{
									y: -1,
									sX: { r: 0.4, otherDim: true, min: 2 },
									fX: true,
									tX: true,
								},
							],
						},

						// Head
						{
							sY: headSY,
							list: [
								// Top Head
								{
									sY: this.topHeadSY,
									x: moveTop,
									mX: landed && 1,
									list: [
										// Round Head
										this.foreHeadRound && {
											sX: { r: 0.1, max: 1 },
											sY: { r: 0.1, max: 1 },
											clear: true,
										},
										this.backHeadRound && {
											sX: { r: 0.1, max: 1 },
											sY: { r: 0.1, max: 1 },
											fX: true,
											clear: true,
										},

										// Main Top Head
										{},

										// Shadow
										{
											sX: 1,
											color: this.shadowColor,
											fX: true,
											z: 10,
										},

										// Face
										{
											sX: faceSX,
											list: [
												{
													color: this.lightColor,
													sX: { r: 0.5 },
												},

												// Eye
												this.eye.draw(),
											],
										},
									],
								},

								// Bottom Head
								{
									sY: bottomHeadSY,
									mX: inAir && 1,
									fY: true,
									list: [
										// Main Bottom Head
										{},

										// Arm
										{
											tX: true,
											sY: { r: 0.1, min: 1 },
											cY: true,
											cX: !armForward,
											sX: !armForward
												? 1
												: hits
													? {
															r: 2,
															useSize:
																args.distance,
															a: 1,
														}
													: { r: 0.3, min: 2 },

											list: [
												hits && {
													sX: {
														r: 1,
														otherDim: true,
													},
													color: [200, 255, 0],
													list: [
														{
															name: "RoundRect",
															m: { r: -1.8 },
														},
													],
												},
												{},
												this.carryObject &&
													this.carryObject.draw({
														size: args.size,
													}),
											],
										},

										// Shadow
										{
											sX: 1,
											color: this.shadowColor,
											fX: true,
											z: 10,
										},
										{
											sY: 1,
											color: this.shadowColor,
											fY: true,
											z: 10,
										},

										// Face
										{
											sX: faceSX,
											list: [
												{
													color: this.lightColor,
													sX: { r: 0.5 },
												},

												// Mouth
												kiss
													? {
															sX: { r: 0.2 },
															sY: {
																r: 0.1,
																min: 1,
															},
															tX: true,
															y: {
																r: this.mouthY,
																min: 1,
															},
															fY: true,
															color: this
																.shadowColor,
															list: [
																{},
																{
																	sX: 1,
																	mY: -1,
																},
															],
														}
													: {
															sY: 1,
															sX: {
																r: this.mouthSX,
															},
															y: {
																r: this.mouthY,
																min: 1,
															},
															color: this
																.shadowColor,
															z: 100,
															fY: true,
														},
											],
										},
									],
								},
							],
						},

						// Legs
						this.hasLegs && {
							fY: true,
							sY: legsSY,
							color: this.shadowColor,
							list: walk
								? [
										// Walks
										{
											points: [
												{ y: -1 },
												{
													fY: true,
													x: {
														r: legSpeed,
														otherDim: true,
													},
												},
											],
										},
										{
											points: [
												{ y: -1, fX: true },
												{
													fY: true,
													fX: true,
													x: {
														r: legSpeed,
														otherDim: true,
													},
												},
											],
										},
									]
								: [
										// Stands
										{ sX: 1 },
										{ sY: 1, sX: 2, fY: true, x: -1 },

										{ sX: 1, fX: true },
										{ sY: 1, sX: 2, fY: true, fX: true },
									],
						},
					],
				},

				// Shadow
				{
					color: this.groundShadowColor,
					sY: 2,
					sX: sX,
					fY: true,
					y: -1,
					mX: inAir ? 2 : -1,
					x: moveBottom,
					z: -100,
				},
			],
		};
	},
}; // END Actors \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Eye /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Eye = function Eye(args) {
	// Forms and Sizes
	this.sX = this.rFl(0, 0.5);
	this.sY = this.rFl(0, 0.5);
	this.x = this.rFl(0, 1);
	this.y = this.rFl(0, 1);

	this.eyes = this.rIf(0.9);

	// Colors
	this.color = [
		args.lightColor[0] + 150,
		args.lightColor[1] + 150,
		args.lightColor[2] + 150,
	];
	this.eyeBrowColor = args.shadowColor;

	this.changeExpression(0);
};

Comic.prototype.Eye.prototype = {
	changeExpression: function (chance) {
		this.eyeBrowRaised = this.rIf(chance)
			? this.eyeBrowRaised
			: this.rInt(-2, 0);
		this.eyeBrowAngled = this.rIf(chance)
			? this.eyeBrowAngled
			: this.rIf(0.6);
		this.evil = this.rIf(chance)
			? this.evil
			: this.eyeBrowAngled && this.rIf(0.5);
	},

	draw: function () {
		return {
			sX: { r: this.sX, min: 1 },
			sY: { r: this.sY, min: 1 },
			x: { r: this.x },
			y: { r: this.y, min: 1 },
			z: 150,
			color: this.color,
			list: [
				this.eyes && {},
				{
					color: this.eyeBrowColor,
					tY: true,
					sX: { r: 1.2, min: 2 },
					cX: true,
					sY: { r: 0.3, min: 1, otherDim: true },
					y: this.eyeBrowRaised,
					list: this.eyeBrowAngled && [
						{ y: 1, sX: { r: 0.5 }, fX: !this.evil },
						{ sX: { r: 0.5 }, fX: this.evil },
					],
				},
			],
		};
	},
}; // END Eye \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN CarryObject /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.CarryObject = function CarryObject(args) {
	// Forms & Sizes
	this.sX_ = this.rFl(0.1, 0.3);
	this.sY_ = this.rFl(0.1, 0.3);

	// Colors
	this.color = [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)];
	this.lightColor = [
		this.color[0] * 1.5,
		this.color[1] * 1.5,
		this.color[2] * 1.5,
	];
	this.darkColor = [
		this.color[0] * 0.7,
		this.color[1] * 0.7,
		this.color[2] * 0.7,
	];
};

Comic.prototype.CarryObject.prototype.draw = function (args) {
	return {
		z: 300,
		c: true,
		sX: { r: this.sX_, useSize: args.size },
		sY: { r: this.sY_, useSize: args.size },
		color: this.color,
		list: [
			{},
			{ sX: 1, cX: true, color: this.lightColor },
			{ sY: 1, fY: true, color: this.darkColor },
		],
	};
}; // END CarryObject \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN DUMMYDUMMYDUMMY /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.DUMMYDUMMYDUMMY = function DUMMYDUMMYDUMMY(args) {};

Comic.prototype.DUMMYDUMMYDUMMY.prototype.draw = function () {}; // END DUMMYDUMMYDUMMY \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
