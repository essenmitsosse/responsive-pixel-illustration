"use strict";
var renderer = function( init ){
	init = init || {};

	var help = helper,
		getSmallerDim = help.getSmallerDim,
		getBiggerDim = help.getBiggerDim,
		mult = help.mult,
		sub = help.sub,
		margin = help.margin,
		ranInt = help.getRandomInt,
		shadowColor = [200,200,200],
		shadow = help.darken( shadowColor, 0.7 ),
		detail = help.darken( shadowColor, 0.4 ),

		backgroundColor = [255,255,255],

		rows = init.rows || 3,
		fields = init.vari || 1,
		fieldsCount = 1 + ( fields - 1 ) * .7,
		cols = Math.floor( ( 2 * rows ) / fieldsCount ) || 1,

		joinVariableList = {},

		personC = 0,

		Person = function () {
			var i = personC += 1,

				bodyC = [ Math.random()*255, Math.random()*255, Math.random()*255 ],
				legC = detail( bodyC ),
				skinC = [255,180,120],
				skinCDetail = detail( skinC ),

				personMX = Math.random() * 0.3,
				bodySY = Math.random() * .6 + .3,
				armSX = Math.random() * 0.4 - .2,
				armSY = Math.random(),
				armWid = Math.random(),
				legsSY = Math.random(),
				// legSX = Math.random(),
				crotchSY = Math.random() * .5,
				headMX = (Math.random() ) * .5,
				headSideSX = Math.random() * .5 + .4,
				neckSX = Math.random(),
				neckSY = Math.random() * .3,
				neckMX = Math.random() * .4,
				faceMX = Math.random() * .3,
				faceSY = Math.random() * .8,
				faceY = Math.random() * .9,
				faceSideSX = Math.random() * .8,
				hairBackSide = Math.random(),
				hairFrontSY = Math.random(),

				leg = [
					{ sX:1 }
				];

				joinVariableList[ "personMX"+i ] = mult( personMX, "personS"); // Body Width from Margin
				
				joinVariableList[ "personSX"+i ] = margin( "personS", "personMX"+i );
				joinVariableList[ "personSY"+i ] = "personS";
				
				joinVariableList[ "bodySY"+i ] = { r:bodySY, useSize:"personS" }; // Body Height ( without Head )
				joinVariableList[ "bodySX"+i ] = "personSX"+i;
				
				joinVariableList[ "armSX"+i ] = {r:armSX, min:1, useSize:"personSX"+i };
				joinVariableList[ "armSY"+i ] = {r: armSY, useSize:"bodySY"+i, min:3 }
				joinVariableList[ "armWid"+i ] = {r:armWid, min:1, max:"headSX", save:"armWid"},

				joinVariableList[ "legSY"+i ] = {r:legsSY, useSize:"bodySY"+i, max:["bodySY"+i,-1] };
				
				joinVariableList[ "torsoSY"+i ] = [ "bodySY"+i, sub("legSY"+i) ];
				joinVariableList[ "torsoSX"+i ] = margin( "bodySX"+i, "armSX"+i );
				
				joinVariableList[ "headMX"+i ] = mult( headMX, "torsoSX"+i);
				joinVariableList[ "headSX"+i ] = margin( "torsoSX"+i, "headMX"+i );
				joinVariableList[ "headSideSX"+i ] = { r:headSideSX, useSize:"torsoSX"+i, min:2 };
				joinVariableList[ "neckHeadSY"+i ] = [ "personSY"+i, sub("bodySY"+i) ];
				joinVariableList[ "neckSY"+i ] = { r:neckSY, useSize:"neckHeadSY"+i };
				joinVariableList[ "headSY"+i ] = [ "neckHeadSY"+i, sub("neckSY"+i) ];
				joinVariableList[ "neckMX"+i ] = { r:neckMX, useSize:"headSideSX"+i };
				joinVariableList[ "neckSX"+i ] = { add:["headSX"+i, mult(-2,"neckMX"+i) ], max:{ a:"torsoSX"+i, max:"headSideSX"+i }, min:1 };

				joinVariableList[ "faceMX"+i ] = { r:faceMX, useSize:"headSX"+i, max:[mult(.5,"headSX"+i),-1] };
				joinVariableList[ "faceSX"+i ] = [margin( "headSX"+i, "faceMX"+i )];
				joinVariableList[ "faceSY"+i ] = { r:faceSY, useSize:"headSY"+i, min:3, max:"headSY"+i };
				joinVariableList[ "faceSideSX"+i ] = { r:faceSideSX, useSize:"headSideSX"+i, min:1 };
				joinVariableList[ "faceRY"+i ] = [ "headSY"+i, sub("faceSY"+i) ];
				joinVariableList[ "faceY"+i ] = mult(faceY,"faceRY"+i);

				joinVariableList[ "hairFrontSY"+i ] = mult(hairFrontSY, "faceY"+i);
				joinVariableList[ "headBackSideSX"+i ] = [ "headSideSX"+i, sub("faceSideSX"+i) ];
				joinVariableList[ "hairBackSideSX"+i ] = mult( hairBackSide, "headBackSideSX"+i );

			return function ( pos ) {
				var armsup = pos.arms === "armsup",
					headLeft = pos.head === "left",
					headRight = pos.head === "right",
					headSide = headLeft || headRight,
					arm = [
							{ sX:"armWid"+i, tY:armsup, rY:armsup, list:[
								{},
								{ fY:true, sY:{r:1, otherDim:true }, color:skinC }
							] }
						],
					face = headSide ?
						[
							{ name:"Dot" },
							{ sY:1, fY:true }
						]
						:
						[
							{ name:"Dot" },
							{ name:"Dot", fX:true },
							{ sY:1, fY:true }
						];

				return [
					// { color:shadow(backgroundColor) },
					{ sX:"personSX"+i, cX:true, list:[
						{ color:skinC, sY:"neckHeadSY"+i, sX: headSide ? "headSideSX"+i : "headSX"+i, cX:true, list:[
							{ fY:true, sX:"neckSX"+i, cX:true },
							{ sY:"headSY"+i, cX:true, list:[ // Head
								{},
								{ sX: headSide ? "faceSideSX"+i : "faceSX"+i, sY:"faceSY"+i, y:"faceY"+i, cX:!headSide, fX:headLeft, rX:headRight, color:skinCDetail, list:face },
								{ color:skinCDetail, minY:1, sY:"hairFrontSY"+i, list:[ // Hair
									{},
									headSide ?
										{ sY:"headSY"+i, sX:"hairBackSideSX"+i, fX:headRight }
										:
										undefined,
								]}								
							]},
						] },

						
						{ fY:true, sY:"bodySY"+i , color:bodyC, list:[
							{ sY:"armWid" },
							{ sX:"armSX"+i, sY:"armSY"+i, fX:true, rX:true, list:arm }, // Right Arm
							{  // Left Arm
								sY:"armSY"+i, 
								sX:"armSX"+i, 
								list:arm 
							},
							{ mX:"armSX"+i, list:[
								{ sY:"torsoSY"+i },
								{ sY:"legSY"+i, fY:true, color:legC, list:[ // Legs
									{ sY:{r:crotchSY, min:1, max:{r:1, a:-1} } },
									{ sX:{r:.5}, list:leg },
									{ sX:{r:.5}, fX:true, rX:true, list:leg }
								] }
							] }, // Torso
							
						] },
					]}
				]
			}
		},

		getRow = function( cols ) {
			var all = [];

				while( cols -- ) {
					all.push( { list:getCols( Person, true, cols ), x:mult( fieldsCount * cols, "personS" ) } );
				}

			return all
		},

		getCols = function ( func, isCol, nr, nr2 ) {
			var i = 0,
				max = isCol ? rows : fields,
				list = [],
				thisWid,
				pos, size,
				dir = isCol ? "Y" : "X",
				args,

				eyeLookVert = [ "", "", "", "left", "right" ],
				eyeLookHor = [ "", "", "", "", "", "up", "down", "up", "down", "verDown" ],
				eyeLids = [ "", "", "", "", "", "", "", "", "", "halfClosed", "halfClosed", "halfClosed", "closed", "closed", "wink" ],
				eyeBrow = [ "", "", "", "raised", "low", "sceptical", "superSceptical", "angry", "sad" ],

				mouthHeight = [ "", "", "", "", "", "", "", "", "", "slight", "slight", "half", "full" ],
				mouthWid = [ "", "", "", "narrow" ],
				mouthForm = [ "", "", "", "sceptical", "grin", "D:" ],

				legPos = [ "", "", "", "", "", "", "", "", "", "", "", "legRaise",
					// "kneeBend", "legHigh" 
				],

				teethPos = [ "", "top", "bottom", "both", "full"],
				shoulderPos = [ 0, 0, 0, 0, 0, -90, -90, 180 ],
				ellbowPos = [ 0, 0, 0, 90, -90 ],

				views = [ "", "", "", "", "", "", "rightView", "leftView", "rightView", "leftView", "rightView", "leftView", "rightView", "leftView","backView" ];

			while( i < max ) {
				pos = { r: i * ( !isCol ? .7 : 1 ), useSize:"personS" };

				

				if( !isCol ) {

					args = {};
					args.view = views[ Math.floor( Math.random() * views.length ) ];

					args.eye = {
						lookVert: eyeLookVert[ Math.floor( Math.random() * eyeLookVert.length ) ],
						lookHor: eyeLookHor[ Math.floor( Math.random() * eyeLookHor.length ) ],
						lids: eyeLids[ Math.floor( Math.random() * eyeLids.length ) ],
						brow : eyeBrow[ Math.floor( Math.random() * eyeBrow.length ) ],
					};

					args.mouth = {
						height : mouthHeight[ Math.floor( Math.random() * mouthHeight.length ) ],
						width : mouthWid[ Math.floor( Math.random() * mouthWid.length ) ] && "narrowSide",
						form : mouthForm[ Math.floor( Math.random() * mouthForm.length ) ],
						teeth : teethPos[ Math.floor( Math.random() * teethPos.length ) ],
						smirk : Math.random() < .08
					}

					args.shoulder = { 
						left: Math.random() > .2 && Math.pow( Math.random(), 3 ), 
						right: Math.random() > .2 && Math.pow( Math.random(), 3 )
					};

					args.arm = { 
						left: args.shoulder.left > .55  ? Math.random() *.5 : Math.random() > .2 ? Math.random() * 1.5 - .75 : Math.random() * .5 - .25, 
						right: args.shoulder.right > .55  ? Math.random() *.5 : Math.random() > .2 ? Math.random() * 1.5 - .75 : Math.random() * .5 - .25 
					};

					args.finger = {
						left: Math.random() < .1,
						right: Math.random() < .1,
					}

					args.leg = {};
					args.leg[ Math.floor() < .5 ? "right" : "left" ] = legPos[ Math.floor( Math.random() * legPos.length ) ]

					args.hatDown = Math.random() < .02;

					// args.view = "backView";
					// args.view = "leftView";

					// args.shoulder = { right : 0,	left : 180 };
					// args.ellbow = 	{ right : -90,	left : -90 };
					// args.hand = 	{ right : 90,	left : 90 };

					switch( i ) {
						case 0:
							args.view = "";
							break;
						case 1:
							args.view ="leftView";
							break;
						case 2:
							args.view ="backView";
							break;
						case 3:
							args.view ="rightView";
							break;
					};

					args.size = "personInnerS";
				} else {
				}

				list.push( isCol ? 
					{ y: pos, s:"personS", list: [ 
						{ s:"personInnerS", c:true, list: getCols( new func( args ), false, i, nr ) }
					] }
					: { x: pos, list: func( args ) }
				)
				i += 1;
			}

			return list;
		},
		
		renderList = [
			{ sY:mult( rows, "personS" ), cY:true, list:getRow( cols ) },

			// [
			// 	// { stripes:{ gap:3, strip:{ a:"personSY", random:"personSYR" }, horizontal:true }, list:[
			// 	// 	{ stripes:{ gap:2, strip:{ a:"personSX", random:"personSXR" }, overflow:true }, list:person() }
			// 	// ] }
			// ] },
		],

		variableList = {
			"width" : { r:1 },
			"height" : {r:1, height:true},
			"squ" : { a:"width", max:"height" }, 

			"borderS" : {a:1, useSize:"squ" },

			"imgSX" : [ "width", mult(-2,"borderS") ],
			"imgSY" : [ "height", mult(-2,"borderS")],

			"imgSqu" : getSmallerDim({ r:1, useSize:["imgSX","imgSY"] }),

			"personS" : { r: 1 / rows, useSize:"imgSY", max:{ r: 1 / ( fieldsCount * cols ), useSize:"imgSX" } },
			"personM" : { r:.05, useSize:"personS", min:2 },
			"personInnerS" : margin( "personS", "personM" ),


			"personBigInnerS" : mult(2.5,"personInnerS"),
			"personSmalleInnerS" : mult(.3,"personInnerS"),
			"third" : { r:.3333, useSize:"width", a:-5},
		};

	for (var attr in joinVariableList) { variableList[attr] = joinVariableList[attr]; }

	return {
		renderList : renderList, 
		variableList : variableList,
		background: backgroundColor
	};


};
