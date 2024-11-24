"use strict"
// ARM --------------------------------------------------------------------------------
Builder.prototype.Arm = function ( args ) {
	// Form & Sizes
	this.armSX = this.IF(.8) ? .04 : this.R(0,.1);
	
	this.armSY = this.R(.4,.6);
	if( args.demo && args.arm ) {
		this.armSY = args.arm;
	}

	this.upperArmSY = this.R(.2,.8);

	this.sleeves = args.sleeves = !args.topless && this.IF(.95);
	this.sleeves && ( 
		this.sleeveSY = this.R(0,1),
		this.upperSleeveSY = this.upperArmSY > this.sleeveSY ? this.sleeveSY : "full",
		this.lowerSleeveSY = this.upperArmSY > this.sleeveSY ? false : this.sleeveSY - this.upperArmSY,
		this.fullUpper = this.upperSleeveSY === "full"
	);

	this.vest = args.sleeves && this.IF();

	this.shirt = this.sleeves && args.shirt;

	// Colors
	this.skinColor = args.skinColor;
	this.shirtColor = args.shirtColor;

	// Assets
	this.shoulderPad = this.IF(.05) && new this.basic.ShoulderPad( args );
	this.toolLeft = ( args.demo || this.IF(.1) ) && new ( this.IF(.5) ? this.basic.Shield : this.basic.Sword )( args );
	this.toolRight = ( !args.demo && this.IF(.1) ) && new ( this.IF(.5) ? this.basic.Shield : this.basic.Sword )( args, true );

	this.headGear = args.headGear;

} // END Arm
Builder.prototype.Arm.prototype = new Builder.prototype.Object();
Builder.prototype.Arm.prototype.draw = function ( args, rightSide, behind ) {
	var nr = args.nr,
		sideView = args.sideView,
		name = rightSide ? "right" : "left",
		nrName = name + nr,
		renderFromRight = sideView ? rightSide : args.right !== args.backView,

		tool = rightSide ? this.toolRight : this.toolLeft,
		otherHand = !rightSide ? this.toolRight : this.toolLeft,
		finger = args.finger && args.finger[ name ],

		shoulderAngle = ( args.shoulder && args.shoulder[ name ] || 0 ) * Math.PI,
		armAngle = ( args.arm && args.arm[ name ] || 0 ) * Math.PI + shoulderAngle,

		fullAngle = ( armAngle / Math.PI ) * 180,

		upperZ = shoulderAngle < 1.5 ? -150 : 0;

	if( fullAngle > 180 ) { fullAngle -= 360; }
	else if ( fullAngle < -180 ) { fullAngle += 360; }

	if( args.calc ) {
		this.vL[ "armSX"+nr ] = { r:this.armSX, useSize:"personHalfSX"+nr, min:1 };
		this.vL[ "armSY"+nr ] = { r:this.armSY, useSize:"fullBodySY"+nr };
		this.vL[ "shoulderSX"+nr ] = [ "armSX"+nr ];
		this.vL[ "shoulderSY"+nr ] = { r:1, useSize:"armSX"+nr, min:1, max:"chestSY"+nr };
		this.vL[ "shoulderFullSX"+nr ] = [ this.mult( sideView ? 2 : 1, "shoulderSX"+nr ), "chestSX"+nr ];

		this.vL[ "handSX"+nr ] = { add:["armSX"+nr,1], min:1, max:{r:.1, useSize:"personHalfSX"+nr } };
		this.vL[ "handHalfNegSX"+nr ] = { r:-.5, useSize:"handSX"+nr };

		this.vL[ "upperArmSY"+nr ] = { r:this.upperArmSY, useSize:"armSY"+nr };
		this.vL[ "lowerArmSY"+nr ] = [ "armSY"+nr, this.sub("upperArmSY"+nr) ];

		if( this.sleeves ) {
			!this.fullUpper ? 
				( this.vL[ "upperSleeveSY"+nr ] = { r:this.upperSleeveSY, useSize:"armSY"+nr } )
				: ( this.vL[ "lowerSleeveSY"+nr ] = { r:this.lowerSleeveSY, useSize:"armSY"+nr } );
		}
	}

	this.vL[ "armHalfSX"+nrName ] = { r:renderFromRight  ? .49 : .51, useSize:"armSX"+nr, max:{r:.22, useSize:"upperBodySX"+nr, a:renderFromRight ? -1 : 0 } };

	this.vL[ "upperArmX"+nrName ] = { r:Math.sin( shoulderAngle ), useSize:"upperArmSY"+nr};
	this.vL[ "upperArmY"+nrName ] = { r:Math.cos( shoulderAngle ), useSize:"upperArmSY"+nr };

	this.vL[ "lowerArmX"+nrName ] = { r:Math.sin( armAngle ), useSize:"lowerArmSY"+nr };
	this.vL[ "lowerArmY"+nrName ] = { r:Math.cos( armAngle ), useSize:"lowerArmSY"+nr };

	if( this.sleeves ) {
		!this.fullUpper ? 
			( 
				this.vL[ "upperSleeveX"+nrName ] = { r:Math.sin( shoulderAngle ), useSize:"upperSleeveSY"+nr}, 
				this.vL[ "upperSleeveY"+nrName ] = { r:Math.cos( shoulderAngle ), useSize:"upperSleeveSY"+nr } 
			) : ( 
				this.vL[ "lowerSleeveX"+nrName ] = { r:Math.sin( armAngle ), useSize:"lowerSleeveSY"+nr },
				this.vL[ "lowerSleeveY"+nrName ] = { r:Math.cos( armAngle ), useSize:"lowerSleeveSY"+nr }
			);
	}

	return {
		sX:"shoulderSX"+nr,
		sY:"armSY"+nr,
		tX:true, 
		fX:!behind,
		rX:behind,
		id:"shoulder"+nrName,
		color: this.vest ? this.shirtColor.get() : ( !this.sleeves && this.skinColor.get() ),
		z:1000,
		list:[
			// Shoulder
			{	
				sX:"shoulderSX"+nr,
				sY:"shoulderSY"+nr,
				z:upperZ,
			},

			this.shoulderPad && this.shoulderPad.draw( args, 10 ),			

			// // Turn Checkers
			// { 	s:5, z:1000000, color:args.right ? [0,255,0] : [255,0,0], tX:true, fX:true, list:[ {},
			// 		{ 
			// 			s:1, 
			// 			color:[0,0,0], 
			// 			fY:fullAngle < 90 && fullAngle > -90, 
			// 			fX:fullAngle > 0, 
			// 			cX:( fullAngle < 22.5 && fullAngle > -22.5 ) || ( fullAngle > 157.5 || fullAngle < -157.5 ),
			// 			cY:( fullAngle > 67.5 && fullAngle < 112.5 ) || ( fullAngle < -67.5 && fullAngle > -112.5 )
			// 		}
			// ]},
			// { 	s:5, x:5, z:1000000, color:args.right ? [0,150,0] : [150,0,0], tX:true, fX:true, 
			// 	rotate: ( fullAngle > 45 ?
			// 		fullAngle < 135 ?
			// 			-90
			// 			: -180
			// 		: fullAngle < -45 ?
			// 			fullAngle > -135 ?
			// 				90
			// 				: 180
			// 			: 0 ) * ( renderFromRight ? -1 : 1 ),
			// 	list:[
			// 		{},
			// 		{ 
			// 			fY:true,
			// 			cX:true,
			// 			s:1, 
			// 			color:[0,0,0], 
			// 		}
			// ]},

			{
				fX:true,
				x:{ add:[this.sub("armHalfSX"+nrName) ], a:renderFromRight && -1  },
				y:[this.mult(.49,"armSX"+nr)],
				list:[
					

					// Upper Arm
					{
						list:[
							{
								z:upperZ,
								weight:"armSX"+nr,
								points:[
									{ },
									{ x:"upperArmX"+nrName, y:"upperArmY"+nrName }
								]
							},
						]
					},

					// // Upper Sleeve
					// this.sleeves && !this.fullUpper && {
					// 	z:upperZ,
					// 	weight:"armSX"+nr,
					// 	color:[255,0,0],
					// 	points:[
					// 		{ },
					// 		{ x:"upperSleeveX"+nrName, y:"upperSleeveY"+nrName }
					// 	]
					// },

					// Lower Arm
					{
						x:"upperArmX"+nrName,
						y:"upperArmY"+nrName,
						z:800,
						list:[
							{
								weight:"armSX"+nr,
								points:[
										{},
										{ x:"lowerArmX"+nrName, y:"lowerArmY"+nrName}
									]
							},

							// Shirt							
							this.shirt && { 
								s:{ a:"handSX"+nr },
								minX:2,
								x:["lowerArmX"+nrName,renderFromRight ? "handHalfNegSX"+nr : {a:0}],
								y:["lowerArmY"+nrName],
								color:this.shirtColor.get(),
								list:[
									{
										fY:fullAngle < 90 && fullAngle > -90, 
										fX:fullAngle > 0, 
										x:( ( fullAngle < 22.5 && fullAngle > -22.5 ) || ( fullAngle > 157.5 || fullAngle < -157.5 ) ) ? 0 : 1,
										y:( ( fullAngle > 67.5 && fullAngle < 112.5 ) || ( fullAngle < -67.5 && fullAngle > -112.5 ) ) ? 0 : 1
									}
								]
							},

							// Hand							
							{ 
								s:"handSX"+nr,
								x:["lowerArmX"+nrName,"handHalfNegSX"+nr],
								y:["lowerArmY"+nrName,"handHalfNegSX"+nr],
								color:this.skinColor.get(),
								rX:fullAngle < 0,
								rotate:( fullAngle > 45 ?
									fullAngle < 135 ?
										-90
										: -180
									: fullAngle < -45 ?
										fullAngle > -135 ?
											90
											: 180
										: 0 ) * ( renderFromRight ? -1 : 1 ),
								list:[
									{},

									// Finger
									!tool && finger && {sX:1, sY:{r:1.5, a:1, max:{r:.15, useSize:"personHalfSX"+nr }}, fX:true },

									// Tool
									( !args.demo || args.tool ) && tool && tool.draw( args, 100 ),

									( rightSide || otherHand ) && args.hatDown && !tool && this.headGear && {
										rY:true,
										list:[
											this.headGear.draw( args, 100 ),
											!sideView && {
												tX:true,
												rX:true,
												x:1,
												list:[
													this.headGear.draw( args, 100 )
												]
											}
										]
									}
									
								]
							},

						]
					},
				]
			},		
		]
	};

} // END Arm draw

// SHOULDER PAD --------------------------------------------------------------------------------
Builder.prototype.ShoulderPad = function ( args ) {
	// Form & Sizes
	this.X = this.R(-1,0);
	this.Y = this.R(-1,.5);
	this.SX = this.R(.1,.4);
	this.SY = this.R(1,3);
	this.roundTop = this.IF(.5);
	this.roundBottom = this.IF();
	this.roundInner = this.IF(.3);
	this.border = this.IF(.5);
	this.deko = this.IF(.2);
	this.topDetail = this.IF(.2);
	this.topDetail && (
		this.topDetailStrip = this.IF(.2),
		this.topDetailX = !this.topDetailStrip && this.R(0,1),
		this.topDetailSY = this.R(0,1)
	);

	// Colors
	this.shoulderPadColor = this.IF() ?
		args.clothColor
		: this.IF() ? 
			args.secondColor.copy({ brContrast:1, max:4 }) 
			: args.clothColor.copy({ brContrast:-1, max:4 });

	this.shoulderPadDetailColor = this.IF() ?
		args.clothColor
		: this.IF() ? 
			args.secondColor.copy({ brContrast:2, max:4 }) 
			: this.shoulderPadColor.copy({ brContrast:-1, max:4 });

	( this.deko || this.topDetail ) && (
		this.dekoColor = ( this.IF(.5) ? this.shoulderPadColor : args.secondColor ).copy({ brContrast:2, max:4 }),
		this.dekoShadowColor = this.dekoColor.copy({ brContrast:-1, max:4 })
	)

	// Assets

} // END ShoulderPad
Builder.prototype.ShoulderPad.prototype = new Builder.prototype.Object();
Builder.prototype.ShoulderPad.prototype.draw = function ( args, z ) {
	var nr = args.nr,
		sideView = args.sideView;


	return {
		sX:{r:this.SX, useSize:"personHalfSX"+nr, min:"armSX"+nr, save:"shoulderPadSX"+nr },
		sY:{r:this.SY, useSize:"armSX"+nr, min:{r:.2, useSize:"shoulderPadSX"+nr} },
		y:{r:this.Y , useSize:"armSX"+nr, max:{a:0} },
		x:{ r:this.X, useSize:"trapSX"+nr },
		id:"shoulderPad"+nr,
		z:z,
		color:this.shoulderPadColor.get(),
		// rX:sideView && args.right,
		list:[
			this.roundInner && { name:"Dot", clear:true },
			this.roundTop && { name:"Dot", clear:true, fX:true },
			this.roundBottom && { name:"Dot", clear:true, fX:true, fY:true },
			
			this.deko && {
				fY:true,
				tY:true,
				color:this.dekoColor.get(),
				sX:{r:1, a:-1},
				list:[
					{
						color:this.dekoShadowColor.get()
					},
					{
						stripes:{
							gap:1,
							random:1
						},
					},
				]
			},

			// Main
			{
			},

			// Top Detail
			this.topDetail && {
				color:this.dekoColor.get(),
				tY:true,
				cX:this.topDetailStrip,
				fX:!this.topDetailStrip,
				sX:this.topDetailStrip ? { r:1, a:-2 } : {r:.2, min:1, save:"shoulderPadDetailSX"+nr },
				sY:{r:this.topDetailSY },
				x:!this.topDetailStrip && {r:this.topDetailX, max:["shoulderPadSX"+nr,this.sub("shoulderPadDetailSX"+nr)] },
				y:1,
				list:this.topDetailStrip ? [
					{
						stripes:{
							gap:{r:.1, min:1}
						}
					}
				]
				:[
					{ name:"Dot", clear:true },
					{ name:"Dot", fX:true, clear:true },
					{}
				]
			},

			// Border
			this.border && {
				fY:true,
				sY:1,
				color:this.shoulderPadDetailColor.get()
			}
		]
	};

} // END ShoulderPad draw

// TOOL --------------------------------------------------------------------------------
Builder.prototype.Tool = function ( args ) {
	// Form & Sizes

	// Assets

} // END Tool
Builder.prototype.Tool.prototype = new Builder.prototype.Object();
Builder.prototype.Tool.prototype.draw = function ( args, z ) {
	var nr = args.nr,
		sideView = args.sideView;

	return {
		s:"armSX"+nr,
		fY:true,
		// rX:sideView && args.right,
		list:[
			// { cX:true, sX:{r:1.5, useSize:"personHalfSX"+nr}, color:[0,0,255], list:[
			// 	{},
			// 	{ color:[50,100,200], s:3, cY:true, fX:true }
			// ]}
		]
	};

} // END Tool draw

// SWORD --------------------------------------------------------------------------------
Builder.prototype.Sword = function ( args, right ) {
	// Form & Sizes
	this.rightSide = right;
	this.bladeSY = this.R(0,1.5);
	this.bladeSX = this.IF(.1) ? this.R(0,.4) : this.R(0,.2);
	this.handleSX = this.R(0,.5);
	this.handleOtherSX = this.handleSX / 2 + this.R(-.25,.25);
	this.noKnife = this.IF(.5);
	this.crossGuard = this.IF(1.5) ;
	this.notRound = this.IF();
	this.bend = !this.notRound && this.IF();
	this.middleStrip = this.IF(.5);

	// Color
	this.hiltColor = ( this.IF(.5) ? args.firstColor : args.secondColor ).copy({ brContrast:-1 });
	this.bladeColor = ( this.IF(.5) ? args.firstColor : args.secondColor ).copy( { brContrast:1, max:4 } );
	this.bladeLightColor = this.bladeColor.copy( { brContrast:1 } );
	this.bladeShadowColor = this.bladeColor.copy( { brContrast:-1 } );
	
	// Assets
	

} // END Sword

Builder.prototype.Sword.prototype = new Builder.prototype.Object();
Builder.prototype.Sword.prototype.draw = function ( args, z ) {
	var nr = args.nr,
		name = this.rightSide ? "right" : "left",
		nrName = name + nr,
		side = args.side;

	this.vL[ "handleSY"+nrName ] = { add:["handSX"+nr,-2], min:1 };
	this.vL[ "bladeSX"+nrName ] = {r:this.bladeSY, useSize:"personHalfSX"+nr, min:{r:3, useSize:"armSX"+nr }};
	this.vL[ "bladeSY"+nrName ] = {r:this.bladeSX, useSize:"personHalfSX"+nr, min:"handleSY"+nrName };
	this.vL[ "handleSX"+nrName ] = { r:this.handleSX, useSize:"personHalfSX"+nr };
	this.vL[ "handleOtherSX"+nrName ] = { r:this.handleOtherSX, useSize:"personHalfSX"+nr, min:["handSX"+nr,1] };

	return { 
		sY:"handleSY"+nrName,
		z:z,
		cY:true,
		color:this.hiltColor.get(),
		id:"tool"+nrName,
		list:[
			
			{ 
				sX:"bladeSX"+nrName, 
				sY:"bladeSY"+nrName, 
				cY:this.noKnife,
				x:"handleSX"+nrName,
				color:this.bladeColor.get(), 
				list:[
					!this.notRound && { sX:3, minX:3, fX:true, list:[
						!this.bend && { sY:1, clear:true },
						{ sY:1, clear:true, fY:true },
					]},
					!this.notRound && {
						minX:3, mY:1, sX:1, fX:true, list:[
							!this.bend && { sY:1, clear:true },
							{ sY:1, clear:true, fY:true },
						]
					},

					{},
					this.middleStrip && { sY:{ r:.25, max:2 }, mX:1, cY:this.noKnife, color:this.bladeLightColor.get(), list:[
						{ sY:{r:1, max:1}, fY:true },
						{ sY:{r:1, max:1}, color:this.bladeShadowColor.get() }
					] },
				] 
			},


			{ 
				sX:"handleSX"+nrName,
			},
			{ 
				sX:"handleOtherSX"+nrName, 
				fX:true,
			},
			
			// Cross Guard
			this.crossGuard && { 
				x:"handleSX"+nrName, 
				sX:1, 
				sY:{r:this.noKnife ? 1.2 : 1, useSize:"bladeSY"+nrName }, 
				cY:this.noKnife
			},
		]
	};
} // END Sword draw

// SHIELD --------------------------------------------------------------------------------
Builder.prototype.Shield = function ( args, right ) {
	// Form & Sizes
	this.name = right ? "right" : "left";
	this.shieldSX = this.IF() ? this.R(.4,.8) : this.R(0,.4);
	this.shieldSY = this.IF() ? this.R(.4,.8) : this.R(0,.4);

	this.IF() && (
		this.stripesGap = this.R(.01,.2),
		this.stripesStrip = this.R(.01,.2)
	);

	this.roundTop = this.IF(.5);
	this.roundBottom = this.IF(.5);

	// Colors
	this.shieldColor = ( this.IF(.5) ? args.firstColor : args.secondColor ).copy({ brContrast:this.IF() ? 1 : -1 });
	this.shieldShadowColor = this.shieldColor.copy({brContrast:-1});

	// Assets
	this.IF( 1.1 ) && ( 
		this.logo = new this.basic.Logo( 
			args,
			right,
			true,
			this.IF(.1) ? this.shieldColor.copy({ nextColor:true, brContrast:3 }) : this.shieldShadowColor
		) 
	);

} // END Shield

Builder.prototype.Shield.prototype = new Builder.prototype.Object();
Builder.prototype.Shield.prototype.draw = function ( args, z ) {
	var nr = args.nr,
		nrName = this.name + nr,
		side = args.side,
		logo = [ this.logo.draw( args, z + 805 ) ];

	this.vL[ "shieldSX"+nrName ] = {r:this.shieldSX, useSize:"personHalfSX"+nr, min:1 };
	this.vL[ "shieldSY"+nrName ] = {r:this.shieldSY, useSize:"personHalfSX"+nr, min:1 };

	return { 
		color:this.shieldColor.get(),
		z:z+800,
		sX:"shieldSX"+nrName,
		sY:"shieldSY"+nrName,
		cX:true,
		cY:true,
		id:"shield"+nrName,
		list:[
			( this.roundTop || this.roundBottom ) && {
				minY:3,
				clear:true,
				list:[
					this.roundTop && { name:"Dot" },
					this.roundTop && { name:"Dot", fX:true },

					this.roundBottom && { name:"Dot", fY:true },
					this.roundBottom && { name:"Dot", fY:true, fX:true }
				]
			},

			{},
			this.stripesGap && {
				color:this.shieldShadowColor.get(),
				stripes:{
					gap:{r:this.stripesGap},
					strip:{r:this.stripesStrip}
				}
			},

			logo && {
				sX:{r:.5},
				rX:true,
				list:logo
			},
			logo && {
				sX:{r:.5},
				fX:true,
				list:logo
			},
		]
	};
} // END Shield draw
