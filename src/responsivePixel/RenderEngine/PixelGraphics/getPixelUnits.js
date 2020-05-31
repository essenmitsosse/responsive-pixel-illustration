"use strict";
import { PixelGraphics } from '.';

function getPixelUnits () {
	var old = [],
		variableListLink,
		variableListCreate,
		updateList,
		calculateList,
		oneD = ( function () {
			var createSize = function( args ) {
					return args === undefined ? 0 : ( args.height ? new Height( args ) : new Width( args ) );
				},
				M = Math;


			function Dimension 	() {}
			function Distance 	() {}
			function Width 		( args ) { this.prepare( args ); }
			function Height 	( args ) { this.prepare( args ); }
			function DistanceX 	( args ) { this.prepare( args ); }
			function DistanceY 	( args ) { this.prepare( args ); }

			// DIMENSIONS --- Width & Height

			Dimension.prototype.prepare = function ( args ) {
				var objType = typeof args;


				if ( objType === "object" ) { // is Object

					if ( args.constructor === Array ) { // is Array

						this.createAdder( args, true );
						return;

					} else if( args.getLinkedVariable ) { // Linked to Variable ( new style )
						this.realPartCalculation = args.getLinkedVariable;
						return;
					} else if ( args.getLength ) {
						this.realPartCalculation = this.getGetLengthCalculation( args.getLength[ 0 ], args.getLength[ 1 ] );
						return;
					}

					this.debug = args.debug;

					if ( typeof args.a === "string" ) {
						variableListLink( args.a, this );
					}

					if( args.add ) {
						this.createAdder( args.add );						
					}

					if( args.useSize ) {
						if( typeof args.useSize === "string" ) {

							variableListLink( args.useSize, this.useVari = {} );

						} else if ( args.useSize.getLinkedVariable ) {

							this.useSize = args.useSize.getLinkedVariable;

						} else {

							// errorAdd( "useSize must be a String" )

						}
					} else {
						this.dim = !args.height && ( args.otherDim ? !this.axis : this.axis );
					}

					// Get gefaults and try to do quick version
					if( this.getDefaults( args.r, args.a ) && !args.useSize && !args.add  ) {
						this.realPartCalculation = this.getQuick;
					} else {
						this.realPartCalculation = ( args.min || args.max ) ?
							this.getRealDistanceWithMaxMin(
								args.max,
								args.min,
								( this.dim ? Width : Height )
							) 
							: this.getRealDistance;
					}

					if ( args.save ) { this.realPartCalculation = this.saveDistance( variableListCreate( args.save ) ); }
					if ( args.odd || args.even ) { this.realPartCalculation = this.odd( args.odd || false ); }


				} else { // Short Hand Variables

					if ( objType === "number" ) { 
						if( this.dimension ) { // No calculation, just return Number
							this.simplify( args );
							return;
						} else {
							this.abs = args;
							this.rele = 0;
						}
					} else if ( objType === "string" ) { // Linked to Variable ( old style )
						variableListLink( args, this );
						this.rele = 0;
						this.realPartCalculation = this.getRealDistance;
						return;

					} else {
						this.dim = this.axis;
						if( this.getDefaults() ) {
							this.realPartCalculation = this.getQuick;
							return;
						}
					}
					
					this.realPartCalculation = this.getRealDistance;
				}
			};

			Dimension.prototype.saveDistance = function( saver ) {
				this.getRealForSave = this.realPartCalculation;

				return function () {

					var real = this.getRealForSave();

					saver.set( real );

					return real;
				};
			};

			Dimension.prototype.odd = function( odd ) {
				this.getRealForOdd = this.realPartCalculation;

				return function (  ) {
					var real = Math.round( this.getRealForOdd() );
					return real === 0 ? 0 : ( ( !(real%2) === false ) === odd ? real : real + 1 );
				};
			};

			Dimension.prototype.getDefaults = function ( r, a ) {
				if( r === undefined && a === undefined && this.adder === undefined ) {
					this.rele = 1;
					this.abs = 0;

					return true;
				} else {
					this.rele = r || 0;
					this.abs = a || 0;
				}
			};

			Dimension.prototype.getQuick = function () {
				return this.rele * (
					this.useSize ? this.useSize()
						: this.dim ? this.width : this.height 
				);
			};

			Dimension.prototype.createAdder = function ( add, onlyAdd ) {
				var l = add.length,
					adder = this.adder = [],
					Size = this.dim ? Height : Width;

				while ( l -- ) {
					adder.push( new Size( add[l] ) );
				}

				this[ onlyAdd ? "realPartCalculation" : "getRealDistance" ] = onlyAdd ? this.getRealDistanceWithCalcOnlyAdding : this.getRealDistanceWithCalc;
			};

			Dimension.prototype.getGetLengthCalculation = function ( x, y ) {
				x = new Width( x );
				y = new Width( y );

				return function () {
					return Math.round( Math.sqrt( Math.pow( x.getReal(), 2 ) + Math.pow( y.getReal(), 2 ) ) );
				};
			};

			Dimension.prototype.getReal = ( function () { 
				var round = M.round; 
				return function () {
					return round( this.realPartCalculation() ); 
				}; 
			} )();

			Dimension.prototype.getRealUnrounded = function () {
				return this.realPartCalculation(); 
			};

			Dimension.prototype.getRealDistanceBasic = function () {
				return (
					this.rele * ( 
						this.useVari ? this.useVari.abs
							: this.useSize ? this.useSize()
								: this.dim ? this.width : this.height 
					) + this.abs
				); 
			};

			Dimension.prototype.getRealDistance = Dimension.prototype.getRealDistanceBasic;

			Dimension.prototype.getRealDistanceWithCalc = function () {
				var add = 0,
					adder = this.adder,
					l = adder.length;

				while ( l -- ) { 
					add += adder[l].getReal();
				}

				return this.getRealDistanceBasic() + add;
			};

			Dimension.prototype.getRealDistanceWithCalcOnlyAdding = function () {
				var add = 0,
					adder = this.adder,
					l = adder.length;

				while ( l -- ) { add += adder[l].getReal(); }

				return add;
			};
			
			Dimension.prototype.getRealDistanceWithMaxMin = function ( max, min, Dim ) {
				max = max && new Dim( max );
				min = min && new Dim( min );

				return ( max && min ) ?
						function () { 
							var a,
								realMin = typeof min === "number" ? min : min.getReal(),
								realMax = typeof max === "number" ? max : max.getReal();

							return ( a = this.getRealDistance() ) > realMax ? 
								realMax < realMin ? realMin : realMax : 
								a < realMin ? 
									realMin : 
									a; 
						} :
						( max ) ?
							function () {
								var a,
									realMax = typeof max === "number" ? max : max.getReal(); 
								return ( a = this.getRealDistance() ) > realMax ? realMax : a; 
							} :
							function () { 
								var a,
									realMin = typeof min === "number" ? min : min.getReal(); 
								return ( a = this.getRealDistance() ) < realMin ? realMin : a; 
							};
			};	

			Dimension.prototype.getDim = function () { return this.dim ? this.width : this.height; };
			Dimension.prototype.dimension = true;

			Dimension.prototype.simplify = function ( abs ) {
				this.getReal = function () { return abs; };
			};

			Width.prototype = new Dimension();
			Height.prototype = new Dimension();

			Width.prototype.axis = true;
			Height.prototype.axis = false;

			// DISTANCES --- PosX & PosY
			Distance.prototype = new Dimension();
			Distance.prototype.getDefaults = function ( r, a ){
				if( r === undefined && a === undefined ) {
					this.rele = 0;
					this.abs = 0;

					return true;
				} else {
					this.rele = r || 0;
					this.abs = a || 0;
				}
			};

			Distance.prototype.getQuick = function () {
				return 0;
			};

			Distance.prototype.dimension = false;

			DistanceX.prototype = new Distance();
			DistanceY.prototype = new Distance();

			DistanceX.prototype.axis = true;

			return {
				createSize : createSize,
				Width : Width,
				Height : Height,
				DistanceX : DistanceX,
				DistanceY : DistanceY,
				set : function ( dimensions ) {
					var r = Math.round,
						x = dimensions.posX || 0,
						y = dimensions.posY || 0,
						w = dimensions.width,
						h = dimensions.height,
						getRealPos = function ( add ) {
							var round = r;
							return add ?
								function () { return round( this.realPartCalculation() + add ); }
								:
								function () { return round( this.realPartCalculation() ); };
						},
						getFromOtherSide = function( add ) {
							var round = r,
								width = w,
								height = h;
							return add ?
								function ( size ) { return  ( this.axis ? width : height ) + add - round(  this.realPartCalculation() + size ); }
								:
								function ( size ) {  return  ( this.axis ? width : height ) - round( this.realPartCalculation() + size ); };
						};

					DistanceX.prototype.getReal = getRealPos( x );
					DistanceY.prototype.getReal = getRealPos( y );
					DistanceX.prototype.fromOtherSide = getFromOtherSide( x );
					DistanceY.prototype.fromOtherSide = getFromOtherSide( y );

					Dimension.prototype.width = w;
					Dimension.prototype.height = h;
				}
			};
		} )(),

		Axis = ( function () {
			var D = oneD,
				createAxis = function ( Size, Pos ) {
					return function ( args ) {
						this.pos = new Pos( args.pos );
						this.size = new Size( args.size );
						this.margin = args.margin ? new Size( args.margin ) : false;
						this.toOtherSide = args.toOtherSide;
						this.fromOtherSide = args.fromOtherSide;
						this.center = args.center;
						if( args.min ) {
							this.min = new Size( args.min );
						}

						this.calcPos = this.center ?
							this.fromOtherSide ? 
								this.getCalcPos.fromOtherCenter : this.getCalcPos.center
							:
							this.toOtherSide ?
								this.fromOtherSide ? 
									this.getCalcPos.fromOtherToOther : this.getCalcPos.toOther
								:
								this.fromOtherSide ? 
									this.getCalcPos.fromOther : this.getCalcPos.normal;
					};
				},
				createPos = function ( Pos ) {
					return function ( args ) {
						this.pos = new Pos( args.pos );
						this.toOtherSide = args.toOtherSide;
						this.fromOtherSide = args.fromOtherSide;
						this.center = args.center;

						this.calcPos =  this.center ?
							this.fromOtherSide ? 
								this.getCalcPos.fromOtherCenter : this.getCalcPos.center
							:
							this.toOtherSide ?
								this.fromOtherSide ? 
									this.getCalcPos.fromOtherToOther : this.getCalcPos.toOther
								:
								this.fromOtherSide ? 
									this.getCalcPos.fromOther : this.getCalcPos.normal;
					};
				},
				Axis = function () {},
				AxisX = createAxis( D.Width, D.DistanceX ),
				AxisY = createAxis( D.Height, D.DistanceY ),
				Pos = function () {},
				PosX = createPos( D.DistanceX ),
				PosY = createPos( D.DistanceY );

			Axis.prototype = {
				get getSize() { return this.realSize; },
				get getPos() { return this.realPos; },
				get getEnd() { return this.realPos + this.realSize; }
			};

			Axis.prototype.calc = function () {
				this.realSize = ( this.size.getReal() ) - ( this.realMargin = this.margin ? this.margin.getReal() : 0 ) * 2;
				this.realPos = this.calcPos();
			};

			Axis.prototype.getCalcPos = {
				normal 				: function () 	{ return this.pos.getReal() + this.realMargin; },
				toOther 			: function () 	{ return this.pos.getReal() + this.realMargin - this.realSize; },
				center 				: function () 	{ return this.pos.getReal() + Math.floor( ( this.dim - this.realSize ) / 2 ); },

				fromOther 			: function () 	{ return this.pos.fromOtherSide( this.realSize ) - this.realMargin; },
				fromOtherToOther 	: function () 	{ return this.pos.fromOtherSide( 0 ) + this.realMargin; },
				fromOtherCenter		: function () 	{ return this.pos.fromOtherSide( this.realSize ) - Math.floor( ( this.dim - this.realSize ) / 2 ); },
			};

			AxisX.prototype = new Axis();
			AxisY.prototype = new Axis();

			Pos.prototype = new Axis();

			Pos.prototype.calc = function () {
				return this.calcPos();
			};

			Pos.prototype.getCalcPos = {
				normal 				: function () 	{ return this.pos.getReal(); },
				toOther 			: function () 	{ return this.pos.getReal() - 1; },
				center 				: function () 	{ return this.pos.getReal() + Math.floor( this.dim / 2 ); },

				fromOther 			: function () 	{ return this.pos.fromOtherSide( 1 ); },
				fromOtherToOther 	: function () 	{ return this.pos.fromOtherSide( 0 ); },
				fromOtherCenter		: function () 	{ return this.pos.fromOtherSide( 1 ) - Math.floor( this.dim  / 2 ); },
			};

			PosX.prototype = new Pos();
			PosY.prototype = new Pos();

			return {
				X : AxisX,
				Y : AxisY,
				PosX : PosX,
				PosY : PosY,
				set : function ( dimensions ) {
					AxisX.prototype.dim = PosX.prototype.dim = dimensions.width;
					AxisY.prototype.dim = PosY.prototype.dim = dimensions.height;
				}
			};

		} )(),

		twoD = ( function () {
			var A = Axis,
				XAxis = A.X,
				YAxis = A.Y,
				Position = function ( args, reflectX, reflectY, rotate ){
					var fromRight = ( args.fX || false ) !== reflectX,
						fromBottom = ( args.fY || false ) !== reflectY,

						x = new A.PosX( rotate ? 
						{
							pos: args.y,
							fromOtherSide : !fromBottom,
							toOtherSide : args.toTop,
							center : args.centerX || args.center,
						} :
						{
							pos: args.x,
							fromOtherSide : fromRight,
							toOtherSide : args.toLeft,
							center : args.centerY || args.center
						} ),
						y = new A.PosY( rotate ? 
						{
							pos : args.x,
							fromOtherSide : fromRight,
							toOtherSide : args.toLeft,
							center : args.centerX || args.center
						} :
						{
							pos : args.y,
							fromOtherSide : fromBottom,
							toOtherSide : args.toTop,
							center : args.centerY || args.center
						} );

					return function () {
						return {
							x : x.calc(),
							y : y.calc()
						};
					};
				},
				Dimensions = function ( args, fromRight, fromBottom, rotate ) {
					if( args.sX === undefined ) { args.sX = args.s; }
					if( args.sY === undefined ) { args.sY = args.s; }

					this.x = new XAxis( rotate ? 
					{
						size: args.sY, 
						pos: args.y, 
						margin: args.mY || args.m, 
						fromOtherSide: fromRight, 
						toOtherSide: args.tY,
						min : args.minY,
						center : args.cY || args.c
					} :
					{
						size: args.sX, 
						pos: args.x, 
						margin: args.mX || args.m, 
						fromOtherSide: fromRight, 
						toOtherSide: args.tX,
						min : args.minX,
						center : args.cX || args.c
					} );

					this.y = new YAxis( rotate ? {
						size: args.sX, 
						pos: args.x, 
						margin: args.mX || args.m, 
						fromOtherSide: fromBottom,
						toOtherSide: args.tX,
						min : args.minX,
						center : args.cX || args.c
					} :
					{
						size: args.sY, 
						pos: args.y, 
						margin: args.mY || args.m, 
						fromOtherSide: fromBottom,
						toOtherSide: args.tY,
						min : args.minY,
						center : args.cY || args.c
					} );
				};

			Dimensions.prototype = {
				get width() { return this.x.realSize; },
				get height() { return this.y.realSize; },
				get posX() { return this.x.realPos; },
				get posY() { return this.y.realPos; },
				get endX() { return this.x.realPos + this.x.realSize; },
				get endY() { return this.y.realPos + this.y.realSize; },
			};

			Dimensions.prototype.calc = function () {
				this.x.calc();
				this.y.calc();
				return this;
			};

			Dimensions.prototype.checkMin = function () {
				return ( this.x.realSize < 1 || ( this.x.min && this.x.realSize < this.x.min.getReal() ) ) || ( this.y.realSize < 1 || ( this.y.min && this.y.realSize < this.y.min.getReal() ) );
			};

			return {
				Position: Position,
				Dimensions : Dimensions
			};
		} )();

	return {
		Position: twoD.Position,
		Dimensions : twoD.Dimensions,
		createSize: oneD.createSize,
		Width : oneD.Width,
		Height : oneD.Height,
		setList : function( listLink, listCreate, updater ) {
			variableListLink = listLink;
			variableListCreate = listCreate;
			updateList = updater;
		},
		linkList : function( calc ) {
			calculateList = calc;
		},
		init : function ( dimensions ) {
			oneD.set( dimensions );
			Axis.set( dimensions );
			if( calculateList ) { calculateList( dimensions ); }
			if( updateList ) { updateList(); }
		},
		pop : function() {
			var o = old[old.length-2];
			if( o ) {
				oneD.set( o );
				Axis.set( o );
				old.pop();
			}
		},
		push : function ( dimensions ) {
			oneD.set( dimensions );
			Axis.set( dimensions );
			old.push( dimensions );
		}
	};
};

export { getPixelUnits };
