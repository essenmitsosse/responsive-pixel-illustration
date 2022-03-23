/* global BBProto, BBObj */

// PERSON MAIN  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
BBProto.PersonMain = function (args) {
	// Sizes and Forms
	this._headSY = this.R(0.1, 0.4);

	// Colors
	const color = this.GR(1, 6);

	this.color = args.color = this[`c${color}`];
	this.colorDark = args.colorDark = this[`c${color}D`];

	// Assets
	this.head = new this.basic.Head(args);
	this.neck = new this.basic.Neck(args);
	this.bodyMain = new this.basic.BodyMain(args);
}; // End PersonMain

BBProto.PersonMain.prototype = new BBObj();
BBProto.PersonMain.prototype.draw = function (args) {
	this.ll.push((this.headSY = { r: this._headSY, useSize: args.sY }));
	this.ll.push((this.neckSY = { a: 5 }));
	this.ll.push(
		(this.bodySY = [
			args.sY,
			{ r: -1, useSize: this.headSY },
			{ r: -1, useSize: this.neckSY },
			1,
		])
	);

	let head = this.head.draw({
		sY: this.headSY,
		rotate: args.rotate,
	});
	const bodyMain = this.bodyMain.draw({
		sX: args.sX,
		sY: this.bodySY,
		rotate: args.rotate,
		fY: true,
	});

	this.ll.push(
		(this.neckSX = {
			r: 0.5,
			useSize: head.sX,
			max: { r: 0.5, useSize: bodyMain.chest.sX },
		})
	);

	const neck =
		false &&
		new this.basic.Rotater({
			drawer: this.neck,
			id: "neck",
			rotate: args.rotate,
			baseSX: this.neckSX,
			sY: this.neckSY,
			y: this.headSY,
			zAbs: 60,
		});

	this.headXSide = 1;

	head = this.mover(head, {
		sXBase: bodyMain.chest.sX,
		xBase: this.headXSide,
		xRel: this.headXSide,
		xAdd: bodyMain.chest.x,
		y: 5,
		z: 100,
	});

	return {
		color: this.color,
		sY: args.sY,
		sX: args.sX,
		cX: true,
		fY: true,
		list: [head.get, neck && neck.get, bodyMain.get],
	};
}; // End PersonMain Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// BODY MAIN  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
BBProto.BodyMain = function (args) {
	// Forms & Sizes
	this._sX = this.R(0.4, 1);
	this._chestSY = this.R(0.1, 0.3);
	this.chestSX = this.GR(-1, 1);
	this.torsoSide = this.R(0.5, 1.5);
	this.chestSideSX = this.R(0.8, 1.2);
	this.chestFrontSX = this.R(0.8, 1.2);

	// Colors
	this.color = args.color;
	this.colorDark = args.colorDark;

	// Assets
	this.chest = new this.basic.Chest(args);
	this.lowerBody = new this.basic.LowerBody(args);
}; // End BodyMain

BBProto.BodyMain.prototype = new BBObj();
BBProto.BodyMain.prototype.draw = function (args) {
	this.ll.push((this.sX = { r: this._sX, useSize: args.sY }));

	this.ll.push((this.chestSY = { r: this._chestSY, useSize: args.sY }));
	this.ll.push(
		(this.lowerBodySY = [args.sY, { r: -1, useSize: this.chestSY }])
	);

	let lowerBody = new this.basic.Rotater({
		drawer: this.lowerBody,
		id: "lowerBody",
		rotate: args.rotate,
		baseSX: this.sX,
		sideSX: this.torsoSide,
		sY: this.lowerBodySY,
		fY: true,
		z: 20,
	});
	const chest = new this.basic.Rotater({
		drawer: this.chest,
		id: "chest",
		rotate: args.rotate,
		baseSX: this.sX,
		sideSX: this.chestSideSX,
		frontSX: this.chestFrontSX,
		sY: this.chestSY,
		z: 40,
	});

	lowerBody = this.mover(lowerBody, {
		xRel: -1 && 0,
		max: { a: 2 },
	});

	return {
		get: {
			sY: args.sY,
			fY: args.fY,
			z: args.z,
			list: [chest.get, lowerBody.get],
		},
		chest,
		lowerBody,
	};
}; // End BodyMain Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
