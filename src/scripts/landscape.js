"use strict";
var renderer = function (args) {
	args = args || {};

	var help = helper,
		getSmallerDim = help.getSmallerDim,
		getBiggerDim = help.getBiggerDim,
		mult = help.mult,
		sub = help.sub,
		ranInt = help.getRandomInt,
		backgroundColor = [0, 0, 0],
		width = [0.2, 0.5, 0.8],
		colorNr = ranInt(4),
		dayNight = ranInt(2),
		sunPos = ranInt(2),
		mountains = ranInt(2),
		clouds = ranInt(2),
		tree = ranInt(2),
		colorScheme = [
			[
				[255, 255, 255],
				[180, 180, 180],
				[100, 100, 100],
				[40, 40, 40],
			],
			[
				[0, 255, 255],
				[0, 180, 180],
				[0, 100, 100],
				[0, 40, 40],
			],
			[
				[255, 0, 255],
				[180, 0, 180],
				[100, 0, 100],
				[40, 0, 40],
			],
			[
				[255, 255, 0],
				[180, 180, 0],
				[100, 100, 0],
				[40, 40, 0],
			],
		][colorNr],
		c1 = colorScheme[0],
		c2 = colorScheme[1],
		c3 = colorScheme[2],
		c4 = colorScheme[3],
		renderList = [
			{
				m: "borderS",
				list: [
					{ color: [c3, c4][dayNight], use: "sky" },
					clouds === 0
						? dayNight === 1
							? { color: c2, use: "sky", chance: 0.01 }
							: {
									color: c2,
									use: "sky",
									chance: 0.02,
									sX: { a: 1, random: { r: 0.1 } },
								}
						: undefined,
					{ save: "sky" },
					{
						s: "sunS",
						color: c2,
						x: "sunPosX",
						y: "sunPosY",
						id: "sun",
						list: [
							// Sun
							{ name: "Dot", clear: true },
							{ name: "Dot", clear: true, fX: true },
							{ name: "Dot", clear: true, fY: true },
							{ name: "Dot", clear: true, fX: true, fY: true },
							dayNight === 1
								? {
										s: { r: 0.4 },
										fX: true,
										cY: true,
										clear: true,
									}
								: undefined,
							{},
						],
					},
					{
						color: [c2, c3][dayNight],
						y: "horizontSY",
						fY: true,
						sY: "mountainSY",
						minY: 1,
						list: [
							// Mountains
							{
								points: [
									{ fY: true },
									{ y: { r: 0.4 } },
									{ x: { r: 0.2 } },
									{ x: { r: 0.6 }, y: { r: 0.6 } },
									{ x: { r: 0.8 }, y: { r: 0.4 } },
									{ fX: true, y: { r: 0.7 } },
									{ fY: true, fX: true },
								],
							},
						],
					},
					{
						sY: "horizontSY",
						fY: true,
						color: [c2, c3, c2, c3][dayNight + sunPos],
					}, // Ground
					tree === 0
						? {
								color: c4,
								list: [
									{ sX: { r: 0.1 }, x: { r: 0.2 } },
									{
										sY: { a: 1 },
										sX: { r: 0.6 },
										stripes: {
											strip: 2,
											random: { r: 0.2 },
										},
									},
								],
							}
						: undefined,
				],
			}, // END images

			{
				color: c4,
				list: [
					{ sY: "borderS" },
					{ sY: "borderS", fY: true },
					{ sX: "borderS" },
					{ sX: "borderS", fX: true },
				],
			},
		],
		variableList = {
			"width": { r: 1 },
			"height": { r: 1, height: true },
			"squ": { a: "width", max: "height" },

			"borderS": { r: 0.03, a: 1, useSize: "squ", min: 1 },

			"imgSX": ["width", mult(-2, "borderS")],
			"imgSY": ["height", mult(-2, "borderS")],

			"imgSqu": getSmallerDim({ r: 1, useSize: ["imgSX", "imgSY"] }),

			"horizontSY": {
				r: [0.1, 0.25, 0.5, 0.7][sunPos + clouds],
				useSize: "imgSY",
			},
			"mountainSY": { r: [0, 0.6][mountains], useSize: "imgSqu" },

			"skySY": ["imgSY", sub("horizontSY")],
			"skyMountainSY": ["skySY", mult(-0.5, "mountainSY")],

			"sunPosX": { r: [0.2, 0.6][sunPos] },
			"sunPosY": { r: [0.1, 0.5][sunPos], useSize: "skyMountainSY" },
			"sunS": mult(0.15, "imgSqu"),
		};

	// ( function ( maxChance, count, variations ) {
	// 	var singleDouble = Math.sqrt( maxChance ) / count,
	// 		minVari = 1 / singleDouble,
	// 		minBit = Math.log( minVari ) / Math.log( 2 ),
	// 		minTri = Math.log( minVari ) / Math.log( 3 ),
	// 		singleChance = 1 / variations,
	// 		imagesChance = singleChance * count,
	// 		currentChance = Math.pow( imagesChance ,2);

	// 	console.log(
	// 		"Chance of the same Image twice in %i images: %f%,"+
	// 		"\nmin. Number of Variations: %f,"+
	// 		"\n2Cases: %f,"+
	// 		"\n3Cases: %f" +

	// 		"\n\nChance of Single Images with %i variations: %f%"+
	// 		"\nChance of Single Images to appear in %i images: %f%"+
	// 		"\nChance of the same Image twice in %i images: %f%",
	// 		count,
	// 		maxChance * 100,
	// 		// singleDouble * 100,
	// 		Math.round( 10 * minVari ) / 10,
	// 		Math.round( 10 * ( minBit + .5 ) ) / 10,
	// 		Math.round( 10 * ( minTri + .5 ) ) / 10,

	// 		variations,
	// 		Math.round( singleChance * 100000 ) / 1000,
	// 		count,
	// 		Math.round( imagesChance * 100000 ) / 1000,
	// 		count,
	// 		Math.round( currentChance * 100000 ) / 1000
	// 	);

	// } )( .1, args.x * args.y, 2*2*2*2*4 );

	return {
		renderList: renderList,
		variableList: variableList,
		background: backgroundColor,
	};
};
