
// HEAD --------------------------------------------------------------------------------
Builder.prototype.Head = function (args) {
	// Form & Sizes
	this.neckSY = this.R(0.05, 0.2);
	this.neckSX = this.R(0.4, 0.9);

	this.headSX = this.R(0.2, 0.7);
	this.headSideSYFak = this.R(1.6, 2.4);

	this.skullRatio = this.IF(0.5) && this.R(0.8, 1.2);
	this.skullTopSY = this.skullRatio && this.R(0.5, 0.7);

	this.foreHeadSY = this.R(0.1, 0.5);

	// Colors
	this.skinColor = args.skinColor;
	this.skinShadowColor = args.skinShadowColor;
	this.skinDetailColor = args.skinDetailColor;

	this.hairColor = args.hairColor = args.skinColor.copy({ nextColor: true, brContrast: -2 });

	// Assets
	this.hair = new this.basic.Hair(args);
	this.eye = new this.basic.Eye(args);
	this.mouth = new this.basic.Mouth(args);
	this.beard = this.IF() && new this.basic.Beard(args);
}; // END Head
Builder.prototype.Head.prototype = new Builder.prototype.Object();
Builder.prototype.Head.prototype.draw = function (args, z) {
	const { nr } = args;
	const { sideView } = args;
	let list;

	this.vL[`headMinSX${nr}`] = {
		r: this.headSX * (sideView ? this.headSideSYFak : 1), a: 0.7, min: 2, useSize: `headNeckSY${nr}`,
	};
	this.vL[`neckSX${nr}`] = sideView
		? { add: [{ r: (-1 + this.neckSX), useSize: `headMinSX${nr}` }, `headMinSX${nr}`], max: `chestSX${nr}`, min: 1 }
		: {
			r: this.neckSX, useSize: `headMinSX${nr}`, max: `torsoSX${nr}`, min: 1,
		};
	this.vL[`neckSY${nr}`] = { r: this.neckSY, useSize: `headNeckSY${nr}` };
	this.vL[`headMinSY${nr}`] = { add: [`headNeckSY${nr}`, this.sub(`neckSY${nr}`)], min: 2 };

	this.vL[`foreHeadSY${nr}`] = { r: this.foreHeadSY, useSize: `headMinSX${nr}`, min: 1 };

	list = {
		sY: `headNeckSY${nr}`,
		y: [`lowerBodySY${nr}`, `torsoSY${nr}`],
		fY: true,
		color: this.skinColor.get(),
		list: [
			{
				cX: sideView,
				z,
				list: [
					// Neck
					{
						sY: [`neckSY${nr}`, 1],
						sX: `neckSX${nr}`,
						cX: sideView,
						fY: true,
						z: z + (args.backView ? 50 : 0),
					},

					// Head
					{
						sX: `headSX${nr}`,
						sY: `headSY${nr}`,
						fY: true,
						y: `neckSY${nr}`,
						cX: sideView,
						id: `head${nr}`,
						list: [

							{ color: [255, 0, 0] },
							// Face
							// Mouth
							this.mouth.draw(args, z),

							// Eye Area
							this.eye.draw(args, z),
						],

					},
				],
			},
		],
	};

	this.vL[`headSX${nr}`] = `headMinSX${nr}`;
	this.vL[`headSY${nr}`] = [`mouthTopY${nr}`, `eyeY${nr}`, `eyeSY${nr}`, `foreHeadSY${nr}`];

	return list;
};

// EYE --------------------------------------------------------------------------------
Builder.prototype.Eye = function (args) {
	// Form & Sizes
	this.eyeBrow = this.IF(0.3);
	this.eyeLids = this.IF(0.7);
	this.eyeLidsTop = !this.eyeBrow && this.IF(0.3);

	this.eyeRoundTop = !this.eyeBrow && this.IF(0.5);
	this.eyeRoundBottom = this.IF(0.5);

	this.eyeSX = this.R(0.2, 0.5);
	this.eyeSY = this.R(0.15, 0.5);

	this.eyeX = this.R(0.3, 0.7) - this.eyeSX;
	this.eyeY = this.R(0.05, 0.15);

	// Colors
	this.skinColor = args.skinColor;
	this.skinShadowColor = args.skinShadowColor;
	this.skinDetailColor = args.skinDetailColor;
	this.hairColor = args.hairColor;

	this.eyeColor = args.skinColor.copy({ brAdd: 2 });
	this.pupilColor = args.skinColor.copy({ brAdd: -3 });

	// Assets
}; // END Eye
Builder.prototype.Eye.prototype = new Builder.prototype.Object();
Builder.prototype.Eye.prototype.draw = function (args, z) {
	const { nr } = args;
	const { sideView } = args;
	const eyeRounder = (this.eyeRoundTop || this.eyeRoundBottom) && {
		minX: 4,
		minY: this.eyeRoundTop && this.eyeRoundBottom ? 3 : 2,
		list: [
			this.eyeRoundTop && { name: 'Dot', clear: true },
			this.eyeRoundTop && { name: 'Dot', fX: true, clear: true },
			this.eyeRoundBottom && { name: 'Dot', fY: true, clear: true },
			this.eyeRoundBottom && {
				name: 'Dot', fX: true, fY: true, clear: true,
			},
		],
	};

	const thisEye = args.eye;

	const eyeClosed = thisEye.lids === 'closed' || args.right && thisEye.lids === 'wink';
	const eyeHalfClosed = !eyeClosed && thisEye.lids === 'halfClosed';

	const lookUp = thisEye.up;
	const lookSide = thisEye.look;
	const lookRight = thisEye.look === 'right';

	this.vL[`eyeSX${nr}`] = { r: this.eyeSX, useSize: `headMinSX${nr}`, a: 1 };
	this.vL[`eyeSY${nr}`] = { r: this.eyeSY, useSize: `headMinSY${nr}`, a: 1 };

	this.vL[`eyeX${nr}`] = { r: this.eyeX, useSize: `headMinSX${nr}`, min: 1 };
	this.vL[`eyeY${nr}`] = { r: this.eyeY, useSize: `headMinSY${nr}`, a: `mouthTopY${nr}` };

	return {
		sX: `eyeSX${nr}`,
		sY: `eyeSY${nr}`,
		x: `eyeX${nr}`,
		y: `eyeY${nr}`,
		fY: true,
		color: this.eyeColor.get(),
		list: [
			{},
			// { color:this.skinShadowColor.get() },
			// {
			// 	sY: {r:eyeHalfClosed ?.5 : 1, useSize:"eyeSY"+nr, save:"finalEyeSY"+nr },
			// 	cY:true,
			// 	list:[
			// 		// Eye Lids
			// 		!eyeClosed && { color:this.skinShadowColor.get(), list:[
			// 			eyeRounder,

			// 			{},
			// 		] },

			// 		// Eye
			// 		!eyeClosed && {
			// 			// mX:this.eyeLids && this.eyeBrow && { r:.2, max:1 },
			// 			cX:true,
			// 			sX:{ r:1, add:this.eyeLids && [{ r:-.15, min:-1 },{ r:-.1, min:-1 }], save:"finalEyeSX"+nr },
			// 			sY:this.eyeLids && { r:1, a:-1, min:{ a:2, max:"finalEyeSY"+nr },  },
			// 			fY:this.eyeLidsTop,
			// 			id:"eyeWhite"+nr,
			// 			list:[
			// 				eyeRounder,

			// 				{},

			// 				// Pupil
			// 				{
			// 					sX:{r:.5, useSize:"eyeSX"+nr, max:{r:1, useSize:"finalEyeSX"+nr, a:-1, min:1 } },
			// 					sY:{r:.8, useSize:"eyeSY"+nr, max:{r:1} },
			// 					fY:!lookUp,
			// 					rY:lookUp,
			// 					rX:lookSide && args.right == lookRight,
			// 					fX:lookSide && args.right == lookRight,
			// 					color:this.pupilColor.get(),
			// 					list:[
			// 						{ minY:3, minX:2, list:[
			// 							{ name:"Dot", clear:true, fX:true },
			// 							// { name:"Dot", clear:true, fX:true, fY:true },
			// 						]},

			// 						{}
			// 					]
			// 				}
			// 			]
			// 		},

			// 		eyeClosed && { cY:true, sY:1, color:this.skinShadowColor.get(), },
			// 	]
			// },

			// // Eye Brow
			// this.eyeBrow && { tY:true, sY:{ r:.3, max:1 },
			// 	color:this.hairColor.get()
			// }
		],
	};
}; // END Eye draw

// MOUTH --------------------------------------------------------------------------------
Builder.prototype.Mouth = function (args) {
	// Form & Sizes
	this.mouthSX = this.R(0.4, 0.8);
	this.mouthSY = this.R(0.2, 0.4);
	this.mouthY = this.R(0.05, 0.15);

	// Colors
	this.skinDetailColor = args.skinDetailColor;

	// Assets
}; // END Mouth
Builder.prototype.Mouth.prototype = new Builder.prototype.Object();
Builder.prototype.Mouth.prototype.draw = function (args, z) {
	const { nr } = args;
	const { sideView } = args;

	this.vL[`mouthSX${nr}`] = {
		r: this.mouthSX, useSize: `headMinSX${nr}`, a: 1, min: 1, max: `headMinSX${nr}`,
	};
	this.vL[`mouthSY${nr}`] = {
		r: this.mouthSY, useSize: `headMinSY${nr}`, a: 0.7, min: 1,
	};
	this.vL[`mouthY${nr}`] = { r: this.mouthY, useSize: `headMinSY${nr}`, a: 0.4 };
	this.vL[`mouthTopY${nr}`] = [`mouthSY${nr}`, `mouthY${nr}`];

	return {
		sX: `mouthSX${nr}`,
		sY: `mouthSY${nr}`,
		y: `mouthY${nr}`,
		fY: true,
		color: this.skinDetailColor.get(),
		list: [
			// Mouth Area
			// { color:this.skinColor.copy({brContrast:-1}).get() },

			{
				// sY:1,
				// sX:{r:.5,min:1},
				// cY:true,
				// fY:true
			},
		],
	};
}; // END Mouth draw

// HAIR --------------------------------------------------------------------------------
Builder.prototype.Hair = function (args) {
	// Form & Sizes
	this.hairSY = this.R(0.5, 0.9);

	// Colors
	this.hairColor = args.hairColor;

	// Assets
}; // END Hair
Builder.prototype.Hair.prototype = new Builder.prototype.Object();
Builder.prototype.Hair.prototype.draw = function (args, z) {
	const { nr } = args;
	const { sideView } = args;

	this.vL[`hairSideSY${nr}`] = { r: 0.5, useSize: `skullTopSY${nr}` };

	return {
		color: this.hairColor.get(),
		list: [
			{
				sY: {
					r: this.hairSY, useSize: `eyeYTop${nr}`, min: { r: 0.2, useSize: `headSY${nr}`, max: 1 }, max: `eyeYTop${nr}`,
				},
				list: [
					{ stripes: { random: { r: -0.5 }, seed: nr } },
				],
			},

			// {
			// 	color: this.hairColor.get(),
			// 	sX: "eyeOutterX"+nr,
			// 	sY: "hairSideSY"+nr,
			// 	fX:true
			// }
		],

	};
}; // END Hair draw


// BEARD --------------------------------------------------------------------------------
Builder.prototype.Beard = function (args) {
	// Form & Sizes
	this.beardColor = args.hairColor;

	// Assets
}; // END Beard
Builder.prototype.Beard.prototype = new Builder.prototype.Object();
Builder.prototype.Beard.prototype.draw = function (args, z) {
	const { nr } = args;
	const { sideView } = args;

	// return {
	// 	z:z,
	// 	fY:true,
	// 	tY:true,
	// 	sY:{r:.5},
	// 	color: this.beardColor.get()
	// };
}; // END Beard draw
