/* global Comic */

// BEGINN Actors /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Actors = function Actors(args) {
	// Add Tracker for Debugging
	window.track = this.track();
	this.tracker = [];

	args.actorControl = this;

	// Forms And Sizes

	// Assets
	this.actor1 = new this.basic.Actor(args, true);
	this.actor2 = new this.basic.Actor(args, false);

	this.actor1.opponent = this.actor2;
	this.actor2.opponent = this.actor1;

	this.weakerActor =
		this.actor1.speed < this.actor2.strength ? this.actor1 : this.actor2;
	this.weakerActor.weak = true;

	this.hasBeenHit = false;

	this.currentActor = false;
	this.someOneIsActing = false;
};

Comic.prototype.Actors.prototype = {
	isDone() {
		this.currentActor = false;
	},

	getActorDistance() {
		return 1 - this.actor1.posX_ - this.actor2.posX_;
	},

	setActor(actor) {
		this.currentActor = actor;

		this.currentActor.acting = true;
		this.someOneIsActing = true;

		this.addComment(`\n\nnew Actor is ${actor.name}`);
	},

	endComic() {
		this.end = true;
	},

	prepare(args) {
		let first;

		this.panelNr = args.i + 1;

		if (!this.someOneIsActing) {
			if (this.rIf(0.9)) {
				first = this.rIf(0.5);

				this.setActor(first ? this.actor1 : this.actor2);

				this.actor1.startActing();
			} else {
				this.addComment("no new Actor found");
			}
		}

		this.actor1.act();
		this.actor2.act();

		// // If no one is acting, FIND NEW ACTOR
		// if( !this.currentActor ) {

		// 	// small Chance of no one acting
		// 	if( this.rIf(0.9) ) {
		// 		first = this.rIf(0.5);

		// 		this.currentActor = first ? this.actor1 : this.actor2;
		// 		this.idleActor = !first ? this.actor1 : this.actor2;

		// 		this.currentActor.acting = true;

		// 		this.addComment("new Actor is Actor" + ( first ? 1 : 2 )  );
		// 	} else {
		// 		this.addComment( "no new Actor found" );
		// 	}
		// }

		// // If someone is acting ACT
		// if( this.currentActor ) {

		// 	// Let the current actor act
		// 	this.currentActor.action();

		// 	// Get current Distance;
		// 	this.actorsCurrentDistanceRel = this.getActorDistance();

		// 	// Bounce Back Weaker Actor
		// 	if( this.actorsCurrentDistanceRel < 0 ) {
		// 		this.hit = !this.hasBeenHit;
		// 		this.hasBeenHit = true;

		// 		this.weakerActor.bounceBack( this.actorsCurrentDistanceRel );

		// 		this.actorsCurrentDistanceRel = this.getActorDistance();

		// 		this.actor1.stop();
		// 		this.actor2.stop();

		// 		this.currentActor.acting = false;
		// 		// this.currentActor = false;
		// 	}
		// }

		this.addTrack(this.panelNr);

		return {
			hit: this.hit,
			currentActor: this.currentActor,
			end: this.end,
		};
	},

	draw(args) {
		let actorsMaxDistance;
		let actorsCurrentDistance;

		let actorS;

		let actor1PosX;
		let actor2PosX;

		let actorArgs;

		this.actorsCurrentDistanceRel = this.getActorDistance();

		// Get real Positions of the actors
		this.linkList.push(
			(actorS = { r: 1, useSize: args.stageSquare }),
			(actorsMaxDistance = [args.stageSX, { r: -2, useSize: actorS }]),
			(actorsCurrentDistance = {
				r: this.actorsCurrentDistanceRel,
				useSize: actorsMaxDistance,
				min: 1,
			}),
			(actor1PosX = { r: this.actor1.posX_, useSize: actorsMaxDistance }),
			(actor2PosX = [
				actorsMaxDistance,
				{ r: -1, useSize: actorsCurrentDistance },
				{ r: -1, useSize: actor1PosX },
			])
		);

		actorArgs = {
			size: actorS,
			distance: actorsCurrentDistance,
		};

		return {
			actorS,
			list: [
				// Show stage for debugging
				args.debug && {
					list: [
						// Stage Grid
						{ name: "Grid", color: [200, 100, 0] },

						// Stage Marks
						{
							color: [180, 80, 0],
							stripes: { strip: { r: 0.1 } },
							sY: { r: 2 },
							list: [{ sX: 1 }],
						},

						// Outer Marks
						{ sX: 1, color: [140, 40, 0] },
						{ sX: 1, fX: true, color: [140, 40, 0] },

						{ sY: 1, color: [140, 40, 0] },
						{ sY: 1, fY: true, color: [140, 40, 0] },

						// Actor Start
						{
							sX: actorS,
							color: [80, 0, 80],
							sY: 1,
							y: -1,
							tY: true,
							fY: true,
						},
						{
							sX: actorS,
							color: [80, 80, 0],
							sY: 1,
							y: -1,
							tY: true,
							fY: true,
							fX: true,
						},

						// Actors Current
						{
							sX: actorS,
							x: actor1PosX,
							color: [150, 0, 150],
							sY: 2,
							y: -2,
							tY: true,
							fY: true,
						},
						{
							sX: actorS,
							x: actor2PosX,
							color: [150, 150, 0],
							sY: 2,
							y: -2,
							tY: true,
							fY: true,
							fX: true,
						},

						{
							sX: actorsCurrentDistance,
							x: [actor1PosX, actorS],
							y: -2,
							color: [50, 50, 50],
							sY: 3,
							fY: true,
							tY: true,
						},
					],
				},

				this.actor1.draw(actorArgs, actor1PosX),
				this.actor2.draw(actorArgs, actor2PosX),
			],
		};
	},

	track() {
		const that = this;
		return function () {
			let info = that.tracker.join("\n");

			// eslint-disable-next-line no-unused-vars
			info = new Array(20).join("\n") + info;

			// window.console.log( "%c%s", "color:#500", info );
		};
	},

	addTrack(i) {
		const { tracker } = this;
		const actor1Array = [];
		const actor2Array = [];
		const name = [];
		const addActor = function (actorArray, actor) {
			actorArray.push(
				// actor.acting ? "ACTING" : "NOT acting",
				`${Math.round(actor.speed * 100) / 100}`, // speed
				`${
					Math.round(actor.posX_ * 100) / 100 // posX_
				} / ${Math.round(actor.posY_ * 100) / 100}` // posX_
			);
		};

		name.push(
			// "   ACTING",
			"   SPEED",
			"   POSX/POSY",
			`   diff ${Math.round(this.getActorDistance() * 100) / 100}`
		);

		addActor(actor1Array, this.actor1, 1);
		addActor(actor2Array, this.actor2, 2);

		(function (a1, a2, name) {
			const l = name.length;
			let c = 0;
			let string;

			tracker.push(`${new Array(25).join("  _")}Frame #${i}`);

			do {
				string =
					name[c] + new Array(20 - `${name[c]}`.length).join(" ");
				string +=
					(a1[c] || "") +
					new Array(30 - `${a1[c]}`.length).join(" ") +
					(a2[c] || "");

				tracker.push(string);
			} while ((c += 1) < l);
		})(actor1Array, actor2Array, name);
	},

	addComment(comment) {
		this.tracker.push(`${this.panelNr} . . . . . . ${comment}`);

		// console.log( this.panelNr, comment );
	},
}; // END Actors \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
