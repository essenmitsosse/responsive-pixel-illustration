/* global TableComic */

// BEGINN Table /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Table = function Table(args) {
	// Forms and Sizes
	this.sX_ = args.sX || this.rFl(0.4, 0.6);
	this.sY_ = args.sY || this.rFl(0.4, 0.7);

	// Colors
	this.color = args.color || [200, 200, 200];
	this.colorTop = args.colorTop || [225, 210, 225];
};

TableComic.prototype.Table.prototype.draw = function TableDraw(args) {
	this.sX = this.pushLinkList({ r: this.sX_, useSize: args.stageSX });
	this.sY = this.pushLinkList({ r: this.sY_, useSize: args.stageSY });

	this.getPosition(args);

	return this.getObject([
		// Table Leg
		{
			sX: { r: 0.1 },
			cX: true,
		},

		// Table Foot
		{
			mX: { r: 0.35 },
			sY: { r: 0.05, min: 1 },
			fY: true,
		},

		// Table Top
		{
			sY: { r: 0.1 },
			list: [
				{},
				{
					sY: { r: 0.3, min: 1 },
					color: this.colorTop,
				},
			],
		},
	]);
};

TableComic.prototype.Table.prototype.getPosition = function TableGetPosition(
	id
) {
	return {
		x: id === 0 ? this.x : this.pushLinkList([this.x, this.sX]),
		y: this.sY,
	};
};
// END Table \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Chair /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Chair = function Chair(args) {
	// Forms and Sizes
	this.sX_ = args.sX || 0.25;
	this.sY_ = args.sY || 0.32;

	this.reflect = args.toLeft;

	// Colors
	this.color = args.color || [200, 200, 200];
};

TableComic.prototype.Chair.prototype.draw = function ChairDraw(args) {
	this.sX = this.pushLinkList({ r: this.sX_, useSize: args.stageSX });
	this.sY = this.pushLinkList({ r: this.sY_, useSize: args.stageSY });

	this.getPosition(args);

	this.backrestSX = this.pushLinkList({
		r: 0.1,
		useSize: this.square,
		min: 1,
	});

	return this.getObject([
		// Seat
		{ sY: this.backrestSX },

		// Front Leg
		{
			sX: this.backrestSX,
			fX: true,
		},

		// Backrest // Back Leg
		{
			fY: true,
			sY: { r: 2 },
			sX: this.backrestSX,
			tX: true,
		},
	]);
};
// END Chair \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Glass /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Glass = function Glass(args) {
	this.color = args.color || [100, 100, 255];
	this.glassColor = [255, 255, 255];
	this.mixColor = [
		this.color[0] * 0.5 + this.glassColor[0] * 0.5,
		this.color[1] * 0.5 + this.glassColor[1] * 0.5,
		this.color[2] * 0.5 + this.glassColor[2] * 0.5,
	];
};

TableComic.prototype.Glass.prototype.draw = function GlassDraw(args) {
	let normalGlass;

	this.sX = this.pushLinkList({ r: 0.1, useSize: args.square, min: 1 });
	this.sY = this.pushLinkList({ r: 0.15, useSize: args.square, min: 1 });

	this.level = this.pushLinkList({ r: 0, useSize: this.sY });

	this.getPosition(args);
	this.addHoverChange(args.info);

	normalGlass = [
		{ sY: { r: 0.08, min: 1, useSize: this.sY }, fY: true },
		{ sX: 1 },
		{ sX: 1, fX: true },
	];

	return this.getObject([
		// normal Glass
		{ color: this.glassColor, list: normalGlass },

		// filling
		{
			sY: this.level,
			fY: true,
			list: [
				{ color: this.color },
				{ color: this.mixColor, list: normalGlass },
			],
		},
	]);
};
// END Glass \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Emotion /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Emotion = function Emotion(args) {
	this.color = args.color || [50, 50, 0];
	this.heartColor = [255, 0, 0];
};

TableComic.prototype.Emotion.prototype.draw = function EmotionDraw(args) {
	this.sX = this.pushLinkList({
		r: 0.1,
		useSize: args.square,
		min: 1,
		odd: true,
	});
	this.sY = this.sX;

	this.getPosition(args);

	this.colorList.push([
		this.heartColor,
		function (a) {
			const maxR = 255;
			const maxB = 0;
			const maxG = 0;
			const minR = 50;
			const minB = 150;
			const minG = 150;
			const changeR = maxR - minR;
			const changeG = maxG - minG;
			const changeB = maxB - minB;

			return [minR + changeR * a, minG + changeG * a, minB + changeB * a];
		},
	]);

	if (args.info.heart) {
		this.cloudSX = this.pushLinkList({ r: 0, useSize: this.sX });
		if (args.info.thunder) {
			this.thunderSY = this.pushLinkList({ r: 0, useSize: this.sY });
		}

		this.addHoverChange({
			cloudSX: { map: 0, min: -0.5, max: 0.5 },
			thunderSY: { map: 0, min: 1, max: -4 },
		});
	}

	return this.getObject([
		{
			color: args.info.heart ? this.heartColor : this.color,
			sX: this.sX,
			sY: this.sY,
			rX: args.info.right,
			list: args.info.heart
				? [
						{
							list: [
								args.info.thunder && {
									color: [255, 255, 255],
									tY: true,
									fY: true,
									y: { r: 0.2 },
									sY: this.thunderSY,
									list: [
										{
											weight: 1,
											points: [
												{ x: { r: 0.5 } },
												{
													x: { r: 0.65 },
													y: { r: 0.4 },
												},
												{
													x: { r: 0.35 },
													y: { r: 0.6 },
												},
												{ x: { r: 0.5 }, fY: true },
											],
										},
									],
								},

								{
									sY: { r: 0.8 },
									mX: { r: 0.05, otherDim: true, a: 1 },
									fY: true,
								},

								// Outside
								{
									sY: { r: 0.6 },
									sX: { r: 0.4, min: 2 },
									x: {
										r: 0.2,
										useSize: this.cloudSX,
										max: { a: 0 },
									},
								},
								{
									sY: { r: 0.6 },
									sX: { r: 0.4, min: 2 },
									x: {
										r: 0.4,
										useSize: this.cloudSX,
										max: { a: 0 },
									},
									fX: true,
								},

								// Bottom
								{
									mX: { r: 0.3 },
									fY: true,
									tY: true,
									sY: { r: 0.1, min: 1 },
									x: {
										r: 0.4,
										useSize: this.cloudSX,
										max: { a: 0 },
									},
								},

								// Cloud
								{ mX: this.cloudSX, mY: { r: 0.1, min: 1 } },
							],
						},
				  ]
				: [
						{
							weight: 1,
							points: [{ fY: true }, { fX: true }],
						},
						{
							weight: 1,
							points: [
								{ fY: true, y: { r: 0.2 }, x: { r: -0.6 } },
								{ fX: true, x: { r: 1 } },
							],
						},
						{
							weight: 1,
							points: [
								{ fY: true, x: { r: 0.2 }, y: { r: -0.2 } },
								{ fX: true, y: { r: 0.5 } },
							],
						},
				  ],
		},
	]);
};
// END Emotion \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
