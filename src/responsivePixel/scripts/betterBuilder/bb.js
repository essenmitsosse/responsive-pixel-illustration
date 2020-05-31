
var BB = function (init) {
	const args = {};
	const ObjProto = BB.prototype.Obj.prototype;
	const random = window.helper.random(init.id || Math.floor(Math.random() * 4294967296));

	for (const attr in init) {
		args[attr] = init[attr];
	}

	args.rotate *= 1;

	ObjProto.rotate = args.rotate;

	ObjProto.basic = this;
	ObjProto.basicArgs = args;
	ObjProto.ll = this.ll = [];

	ObjProto.white = [200, 200, 200];
	ObjProto.black = [20, 20, 20];

	ObjProto.c1 = [200, 20, 20];
	ObjProto.c2 = [20, 200, 20];
	ObjProto.c3 = [20, 0, 200];
	ObjProto.c4 = [200, 200, 20];
	ObjProto.c5 = [20, 200, 200];
	ObjProto.c6 = [200, 20, 200];

	ObjProto.c1D = [150, 20, 20];
	ObjProto.c2D = [20, 150, 20];
	ObjProto.c3D = [20, 0, 150];
	ObjProto.c4D = [150, 150, 20];
	ObjProto.c5D = [20, 150, 150];
	ObjProto.c6D = [150, 20, 150];

	ObjProto.IF = random.getIf;
	ObjProto.GR = random.getRandom;
	ObjProto.R = random.getRandomFloat;
};

BB.prototype.Obj = function () {};

const BBProto = BB.prototype;
const BBObj = BBProto.Obj;
const BBObjProto = BBObj.prototype;

// OVERVIEW
BBProto.Overview = function (init) {
	const list = [];
	const rotations = [];
	const rows = init.rows || 2;
	const vari = init.vari || 3;
	const reps = Math.round((rows / vari) / 0.55);
	const cols = reps === 0 ? vari : vari * reps;
	let i = 0;
	let j = 0;
	let k = 0;
	const inner = init.inner * 1 || 0.8;

	this.counter = 1;
	this.side = 'left';

	this.ll.push(
		this.outerSX = { r: 1 / cols },
		this.outerSY = { r: 1 / rows, height: true },
		this.innerS = {
			r: inner, useSize: this.outerSX, max: { r: inner, useSize: this.outerSY }, odd: true,
		},
		// this.innerS = { r:2, a:-1, useSize:this.innerSHalf }
	);

	do {
		rotations.push(new this.calcRotation((this.rotate || 0) + (180 / (vari)) * i));
	} while ((i += 1) < vari);


	do {
		j = 0;
		do {
			i = 0;

			this.entity = new this.basic[init.what || 'PersonMain']({});

			do {
				list.push(
					{
						sX: this.outerSX,
						sY: this.outerSY,
						x: { r: i + (k * vari), useSize: this.outerSX },
						y: { r: j, useSize: this.outerSY },
						fY: true,
						list: [
							{ color: [255 / rows * j, 255 / vari * i, 0], z: -Infinity },
							{
								s: this.innerS, color: this.white, cX: true, fY: true, z: -Infinity,
							},
							this.entity.draw({
								sX: this.innerS,
								sY: this.innerS,
								rotate: rotations[i],
								nr: this.counter += 1,
							}),
						],
					},
				);
			} while ((i += 1) < vari);
		} while ((j += 1) < rows);
	} while ((k += 1) < reps);

	list.push(new this.basic.RotateInfo(rotations[0]));

	return list;
};

BBProto.Overview.prototype = new BBObj();
