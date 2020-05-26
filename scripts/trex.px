"use strict";
var renderer = function(){
	var white = [255,255,255],
		grey = [160,160,160],
		ground = [90,60,50],
		groundDark = [65,54,57],
		trexsingle = [
			{ name: "Obj", sX:{r:.25,min:10}, sY:{r:.25,min:5}, list: [//Head
				{ name: "Rect", y:{r:.4,min:2}, fY:true, sX:{r:.7}, sY:{a:1}, clear:true }, // Mouth
				{ name: "RoundRect" },
				{ name: "Dot", x:{r:.6}, y:{r:.25}, color: white },
			]}, 

			{ name: "Obj", fX:true, fY:true, sX:{r:.85}, sY:{r:.7}, list: [//Body
				{ name: "Obj", sX:{r:.6}, list: [ // Body without Tail
					{ name: "RoundRect", sY: {r:.1,min:3}, fY:true, color: ground, changeColor:{ what:"multiply", amount:0.6 } }, //Shadow
					
					{ name: "Obj", x:{r:.4}, y:{r:.09,min:2}, sX:{r:.5, min:7}, sY:{r:.5,a:1}, fY:true, fX:true, changeColor:{ what:"multiply", amount:0.6 }, list: [ // Back Leg
						{ name: "Rect", sX:{r:.6,min:2}, fX:true },// Leg
						{ name: "Rect", sY:{a:1}, fY:true }, // Feet
						{ name: "Dot", y:{r:1}, color: white },
						{ name: "Dot", x:{a:2}, y:{r:1}, color: white },
					]},
					{ name: "Obj", x:{r:.3},sX:{r:.5, min:7}, sY:{r:.5,a:1}, fY:true, fX:true, list: [ // Front Leg
						{ name: "Rect", sX:{r:.6,min:2}, fX:true },// Leg
						{ name: "Rect", sY:{a:1}, fY:true }, // Feet
						{ name: "Dot", fY:true, color: white },
						{ name: "Dot", x:{a:2}, fY:true, color: white },
					]},
					{ name: "Obj", x:{r:-.02,min:-1,max:0}, y:{r:-.2,a:1}, sX:{r:.25,min:6}, sY:{r:.3}, list:[
						{ name: "Polygon", points: [
							{x:{r:-.1}},
							{x:{r:.2},fX:true},
							{fX:true, fY:true},
							{fY:true, y:{a:1}}
						] }
					] },//Neck
					{ name: "RoundRect", sY:{r:.5,min:5} }, //Torso
					{ name: "Rect", x:{r:-.15,max:-3}, sX:{r:.2,min:3}, y:{r:.2}, sY:{a:1} }, // Arms
					{ name: "Rect", x:{r:-.1,max:-2}, sX:{r:.2,min:2}, y:{r:.25,a:1}, sY:{a:1} },
				]},

				{ name: "RoundRect", fX:true, sX:{r:.6},sY:{r:.1} }, // Tail
			]},
		],

		renderList = [
			{ name: "Rect", sY: {r:.4}, fY:true, color: ground },
			{ name: "Obj", id:"trex2", sX:{r:.5}, minWidth:15, sY:{r:.2, a:5, otherDim:true}, x:{r:-.1}, y:{r:.2}, fY:true, color: [100,120,200], // Trex
				rX:true, list: trexsingle
			},
			{ name: "Obj", id:"trex1", sX:{min:55}, sY:{min:22}, mY:{r:.07,a:-1}, x:{a:-20,r:-.2}, fX:true, color: [180,50,50], // Trex
				list: trexsingle
			}
		],

		backgroundColor = [170,190,230];

	return {
		renderList : renderList,
		background: backgroundColor
	}
};