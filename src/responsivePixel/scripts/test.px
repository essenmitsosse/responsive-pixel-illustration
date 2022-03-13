"use strict";
var renderer = function( init ){
	var helper = window.helper,
		random = helper.random( init.id ),
		// rIf = random.getIf,
		// rInt = random.getRandom,
		rFl = random.getRandomFloat,

		backgroundColor = [0,0,0],

		width = { main: true },
		height = { main: true, height: true },
		square = { r:1, useSize: width, max: height },
		test1X = { r: rFl( 0, 1 ) && 0.5, useSize: width  },
		test1Y = { r: rFl( 0, 1 ) && 0.5, useSize: height  },

		mouseX = { r: 0.5, useSize: width  },
		mouseY = { r: 0.5, useSize: height  },
		diffX = { add: [ mouseX, { r: -1, useSize: test1X } ] },
		diffY = { add: [ mouseY, { r: -1, useSize: test1Y } ] },
		weight = { r: 0, min: 1, useSize: square },
		length = { r: 0.1, useSize: square },

		jointX = {},
		jointY = {},
		endX = {},
		endY = {},
		handEndX = {},
		handEndY = {},

		setValue = helper.setValue,

		hover = function ( a, b ) {
			setValue( mouseX, a );
			setValue( mouseY, b );
		},

		hoverAlt = function ( a, b ) {
			setValue( weight, a * 0.1 );
			setValue( length, b * 1 );
		},

		linkList = [
			width,
			height,
			square,
			test1X,
			test1Y,
			mouseX,
			mouseY,
			diffX,
			diffY,
			weight,
			length,
			jointX,
			jointY,
			endX,
			endY,
			handEndX,
			handEndY
		],

		renderList,
		cross = [
			{ mX:-1 },
			{ mY:-1 }
		];

	renderList = [

		// // Stroke
		// { s:1, color: [50,50,50], x:test1X, y:test1Y, list:[
		// 	{
		// 		weight: weight,
		// 		points: [
		// 			{},
		// 			{ x: diffX, y: diffY }
		// 		]
		// 	}
		// ] },

		// // End
		// { s:1, color: [255,0,255], x: [ test1X, endX ], y: [ test1Y, endY ], z:10, list:cross },

		// Arm Better
		{

			x: test1X,
			y: test1Y,
			list: [

				{
					name: "Arm",
					lowerArmWeight: weight,
					upperArmWeight: [ weight, 1 ],
					length: length,
					ratio: 0.6,
					maxStraight: 0.99,
					upperArmColor: [ 0,0,255],
					lowerArmColor: [ 0,255,255],
					targetX: diffX,
					targetY: diffY,
					jointX: jointX,
					jointY: jointY,
					endX: endX,
					endY: endY,
					z: 10000000,
					debug:[255,0,0],
					ellbowDown: true,
					hand: {
						length: { r:0.1, useSize: square },
						width: [ weight, 2 ],
						color: [ 255,0,0 ],
						endX: handEndX,
						endY: handEndY,
						angle: -0.5
					}
				},
			]
		},

		// // Center
		// { s:1, color: [255,0,0], x:test1X, y:test1Y, list:cross },
		

		// // Mouse
		// { s:1, color: [0,255,0], x:mouseX, y:mouseY, list:cross },

	];

	return {
		renderList : renderList,
		linkList : linkList,
		hover: hover,
		hoverAlt: hoverAlt,
		background: backgroundColor,
		changeValueSetter: function () {
			setValue = helper.setValueNew;
		}
	};
};
