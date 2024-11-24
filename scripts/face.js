"use strict";
var renderer = function (init) {
	var sX,
		sY,
		square,
		doubleMargin,
		margin,
		innerSX,
		innerSY,
		halfSX,
		mouthSX,
		mouthSY,
		mouthMaxSY,
		eyeSYMin,
		mouthRestSY,
		mouthY,
		faceRestSY,
		eyeSY,
		eyeRestSY,
		eyeY,
		eyeSX,
		eyeRestSX,
		eyeX,
		pupilSX,
		pupilSY,
		pupilRestSX,
		pupilRestSY,
		pupilX,
		pupilY,
		color = [0, 0, 0],
		globalParameter = (window.globalParameter = {}),
		random = window.helper.random(init.id),
		rFl = random.getRandomFloat,
		rInt = random.getRandom,
		rIf = random.getIf,
		round = function (value) {
			return Math.floor(value * 1000) / 1000;
		},
		setValue = function (what, value) {
			what.r = value;
		},
		setValueAfterPrepare = function (what, value) {
			what.s.rele = value;
		},
		moveEye = function (x, y) {
			setValue(pupilX, x);
			setValue(pupilY, y);
		},
		hover = function (a, b) {
			globalParameter.a = round(a);
			globalParameter.b = round(b);

			setValue(eyeSX, a);
			setValue(eyeY, b);

			color[0] = a * 255;
			color[2] = b * 255;
		},
		hoverAlt = function (c, d) {
			globalParameter.c = round(c);
			globalParameter.d = round(d);

			setValue(mouthSX, c);
			setValue(mouthSY, 1 - d);

			color[1] = c * d * 255;
		},
		linkList = [
			(sX = { main: true }),
			(sY = { main: true, height: true }),
			(square = { add: [sX], max: sY }),
			(margin = { r: 0.1, useSize: square, min: 1 }),
			(doubleMargin = { r: -2, useSize: margin }),
			(innerSX = { add: [sX, doubleMargin], odd: true, debug: true }),
			(innerSY = [sY, doubleMargin]),
			(halfSX = { r: 0.5, useSize: innerSX }),

			(mouthSX = { r: init.c || 0.5, useSize: halfSX, min: 1 }),
			(eyeSYMin = { r: 0.1, useSize: innerSY }),
			(mouthMaxSY = [innerSY, { r: -1, useSize: eyeSYMin }]),
			(mouthSY = { r: 1 - init.d || 0.1, useSize: mouthMaxSY, min: 1 }),
			(mouthRestSY = [mouthMaxSY, { r: -1, useSize: mouthSY }]),
			(mouthY = { r: 0.2, useSize: mouthRestSY }),

			(faceRestSY = [
				innerSY,
				{ r: -1, useSize: mouthSY },
				{ r: -1, useSize: mouthY },
			]),

			(eyeSY = { r: 0.5, useSize: faceRestSY, min: 1 }),
			(eyeRestSY = [faceRestSY, { r: -1, useSize: eyeSY }]),
			(eyeY = {
				r: init.a || 0.5,
				useSize: eyeRestSY,
				max: [eyeRestSY, -1],
			}),
			(eyeSX = {
				r: init.a || 0.5,
				useSize: halfSX,
				max: [halfSX, -2],
				min: 1,
			}),
			(eyeRestSX = [halfSX, { r: -1, useSize: eyeSX }]),
			(eyeX = { r: 0.5, useSize: eyeRestSX }),

			(pupilSX = { r: 0.5, useSize: eyeSX }),
			(pupilSY = { r: 0.5, useSize: eyeSY }),

			(pupilRestSX = [eyeSX, { r: -1, useSize: pupilSX }]),
			(pupilRestSY = [eyeSY, { r: -1, useSize: pupilSY }]),

			(pupilX = { r: 0.2, useSize: pupilRestSX }),
			(pupilY = { r: 0.2, useSize: pupilRestSY }),
		],
		eyeBrows = rIf(0.5),
		half = function (left) {
			return [
				// Skin
				{
					color: color,
				},

				// // Eye Area
				// {
				// 	sY:faceRestSY
				// },

				// Eye
				{
					sX: eyeSX,
					sY: eyeSY,
					x: eyeX,
					y: eyeY,
					color: [255, 255, 255],
					list: [
						eyeBrows && {
							sY: { r: 0.1, min: 1 },
							tY: true,
							color: [50, 50, 50],
						},
						{ name: "RoundRect" },
						{
							sX: pupilSX,
							sY: pupilSY,
							x: pupilX,
							y: pupilY,
							fX: left,
							list: [
								{ name: "RoundRect", color: [0, 0, 0] },
								{
									name: "RoundRect",
									s: { r: 0.2 },
									fX: left,
								},
							],
						},
					],
				},

				// Mouth
				{
					sX: mouthSX,
					sY: mouthSY,
					y: mouthY,
					fY: true,
					color: [0, 0, 255],
				},
			];
		},
		renderList = [
			{
				sX: innerSX,
				sY: innerSY,
				c: true,
				color: [255, 0, 0],
				list: [
					{
						color: [255, 255, 0],
						sX: halfSX,
						rX: true,
						list: half(true),
					},
					{
						color: [255, 0, 0],
						fX: true,
						sX: halfSX,
						fY: true,
						list: half(false),
					},
				],
			},
		];

	hover(init.a || 0.5, init.b || 0.5);
	hoverAlt(init.c || 0.5, init.d || 0.5);

	setValue = setValueAfterPrepare; // Change the way the control functions work after first init

	return {
		renderList: renderList,
		linkList: linkList,
		background: [0, 0, 0],
		hover: hover,
		hoverAlt: hoverAlt,
	};
};
