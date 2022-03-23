/* global Comic */

// BEGINN World /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.World = function World(args) {
	this.copy(args);

	// Forms & Sizes
	this.groundTopSY = this.rFl(0, 0.3);
	this.basicZoom = this.rFl(0.9, 1.5);
	this.zoomed = false;
	this.zoomedIn = this.basicZoom * this.rFl(1.5, 2.5);
	this.zoomedOut = this.basicZoom * this.rFl(0.3, 0.5);

	// Colors
	this.foregroundBaseColor = [
		this.rInt(200, 255),
		this.rInt(200, 255),
		this.rInt(200, 255),
	];
	this.noBackground = this.rIf(0.1);
	this.backgroundColor = this.noBackground
		? args.backgroundColor
		: this.foregroundBaseColor;
	this.groundColor = [
		this.foregroundBaseColor[0] * 0.5,
		this.foregroundBaseColor[1] * 0.5,
		this.foregroundBaseColor[2] * 0.5,
	];
	this.groundShadowColor = [
		this.groundColor[0] * 0.5,
		this.groundColor[1] * 0.5,
		this.groundColor[2] * 0.5,
	];

	// Assets
	this.actors = new this.basic.Actors({
		foregroundBaseColor: this.foregroundBaseColor,
		groundShadowColor: this.groundShadowColor,
		panelCount: args.panelCount,
	});

	this.mountains = this.rIf(0.3) && new this.basic.Mountains();
};

Comic.prototype.World.prototype = {
	prepare(args) {
		const zoom = this.rIf(this.zoomed ? 0.8 : 0.3);

		this.actorInfos = this.actors.prepare(args);

		if (zoom) {
			this.zoomed = !this.zoomed;

			this.currentZoom = this.zoomed
				? this.rIf(0.3)
					? this.zoomedIn
					: this.zoomedOut
				: this.basicZoom;

			this.focusedActor = this.rIf(0.5)
				? this.actors.actor1
				: this.actors.actor2;
		}

		return {
			actorInfos: this.actorInfos,
		};
	},

	draw(args) {
		let groundSY;
		let groundTopSY;
		let stageSX;
		let stageSY;
		let stageSquare;
		let stageDoubleX;
		let stageDoubleY;
		let stageCenterX;
		let stageCenterY;
		let stageX;
		let stageY;

		let actorCenterX;

		let actors;

		const cameraZoom = this.currentZoom;
		const cameraPan = cameraZoom > 1.5 && this.focusedActor;

		this.linkList.push(
			(stageSX = cameraZoom
				? { r: cameraZoom, useSize: args.stageSmallestSX }
				: args.stageSmallestSX),
			(stageSY = cameraZoom
				? { r: cameraZoom, useSize: args.stageSmallestSY }
				: args.stageSmallestSY),
			(stageSquare = { add: [stageSX], max: stageSY }),
			// Stage Position
			(stageDoubleX = { add: [args.sX, { r: -1, useSize: stageSX }] }),
			(stageDoubleY = { add: [args.sY, { r: -1, useSize: stageSY }] }),
			(stageCenterX = { r: 0.5, useSize: stageDoubleX }),
			(stageCenterY = { r: 0.5, useSize: stageDoubleY })
		);

		actors = this.actors.draw({
			stageSquare,
			stageSX,
			stageSY,
			debug: args.debug,
		});

		stageX = [stageCenterX];
		stageY = [stageCenterY];

		if (cameraPan) {
			this.linkList.push(
				(actorCenterX = [
					{ r: 0.5, useSize: stageSX },
					{ r: -1, useSize: actors.actorS },
					{ r: 0.5, useSize: this.focusedActor.sX },
					{ r: -1, useSize: this.focusedActor.posX },
				])
			);

			stageX.push({
				r: this.focusedActor.left ? 1 : -1,
				useSize: actorCenterX,
			});

			stageY.push(
				{ r: 0.5, useSize: stageSY },
				{ r: -1, useSize: this.focusedActor.sY },
				{ r: 0.5, useSize: this.focusedActor.topHeadSY }
			);
		}

		this.linkList.push(
			stageX,
			stageY,

			// Ground & Sky
			(groundTopSY = { r: this.groundTopSY, useSize: stageSX, min: 1 }),
			(groundSY = [groundTopSY, stageY]),
			[args.stageSY, { r: -1, useSize: groundSY }]
		);

		return [
			{ color: this.backgroundColor },
			{
				color: this.groundColor,
				fY: true,
				sY: groundSY,
				list: this.mountains && [
					{},

					// Add Mountains
					{
						tY: true,
						sX: stageSX,
						sY: { r: 0.2, useSize: stageSY },
						x: stageX,
						mX: { r: -1, useSize: stageSX },
						list: this.mountains,
					},
				],
			},

			// Stage
			{
				fY: true,
				sY: stageSY,
				sX: stageSX,
				x: stageX,
				y: stageY,
				list: actors.list,
			},

			args.first &&
				new this.basic.Logo({
					sX: args.sX,
					sY: args.sY,
					stageSX,
					stageX,
				}),
		];
	}, // End draw - - - - - - - - - - - - - - - - - -
}; // END World \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Logo /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Logo = function Logo(args) {
	let widePanelChecker;
	let widePanelRest;
	let widePanelBorder;
	let widePanelPan;
	let logoRest;
	const color = [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)];
	const shadowColor = [color[0] * 0.6, color[1] * 0.6, color[2] * 0.6];
	const list = [];
	let totalCuts;
	let cuts = (totalCuts = this.rInt(3, 15));
	let cutHole;
	let cutShadow;

	this.linkList.push(
		(widePanelChecker = {
			add: [args.sX, { r: -2, useSize: args.stageSX }],
			max: 1,
			min: { a: 0 },
		}),
		(widePanelRest = [args.sX, { r: -1, useSize: args.stageSX }]),
		(widePanelBorder = { r: -0.1, useSize: widePanelRest }),
		(widePanelPan = [widePanelBorder, { r: 0.5, useSize: widePanelRest }]),
		(logoRest = [widePanelRest, widePanelBorder])
	);

	args.stageX.push({
		r: 10000,
		useSize: widePanelRest,
		max: widePanelPan,
		min: { a: 0 },
	});

	while (cuts--) {
		cutShadow = {};
		cutHole = {};

		cutHole.clear = true;
		cutShadow.color = shadowColor;

		cutHole.x = {};
		cutShadow.x = {};

		cutShadow.x.r = cutHole.x.r = cuts / totalCuts;
		cutShadow.sX = cutHole.sX = this.rIf(0.2) ? 3 : 1;

		cutShadow.x.a = -1;
		cutShadow.z = 50;

		// Half Height
		if (this.rIf(0.5)) {
			cutShadow.sY = cutHole.sY = { r: 1 / this.rInt(2, 5) };
			cutShadow.fY = cutHole.fY = this.rIf(0.5);
			cutShadow.cY = cutHole.cY = this.rIf(0.2);
		}

		list.push(cutHole, cutShadow);
	}

	list.push(
		{ z: 10 },
		{
			sX: 1,
			fX: true,
			color: shadowColor,
			z: 50,
		},
		{
			sY: 1,
			fY: true,
			color: shadowColor,
			z: 50,
		}
	);

	return {
		sX: { r: 100000, useSize: widePanelChecker },
		color,
		mask: true,
		z: 50000,
		list: [
			{
				sX: { r: 0.6, useSize: logoRest },
				sY: { r: 0.7 },
				x: { r: 0.15, useSize: logoRest },
				y: { r: 0.1 },
				list,
			},
		],
	};
}; // END Logo \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
