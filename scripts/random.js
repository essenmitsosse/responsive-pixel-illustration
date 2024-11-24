"use strict";
var renderer = function( args ){
	args = args || {};

	var help = helper,
		getSmallerDim = help.getSmallerDim,
		getBiggerDim = help.getBiggerDim,
		mult = help.mult,
		sub = help.sub,
		ranInt = help.getRandomInt,
		backgroundColor = [0,0,0],

		nr = args.i.toString(2),
		s = ( function () {
			var s = [],
				i = 5;

			if( nr.length < i ) {
				nr = new Array( i - nr.length + 1 ).join("0") + nr
			} 

			while( i -- ) {
				s[i] = nr[i] === "1" ? true : false;
			}

			return s;
		} )(),

		c1 = [255,0,0],
		c2 = [0,255,0],
		c3 = [0,0,255],
		c4 = [255,255,255],
		c5 = [255,255,0],
		c6 = [120,0,120],
		c7 = [20,50,80],

		renderList = [
			{ m:"borderS",list:[
				{ color: s[4] ? c1 : c6 },
				s[3] ? // Halfers
					{ sX:{r:s[1] ? .5 : 1}, sY:{r:s[1] ? 1 : .5 }, fX:s[4], fY:s[4], color:s[0] ? c2 : c3, list:[
						{},
						s[2] ?
							{ m:1, color: s[1] ? c5 : c7 }
							: undefined
					] }
					: undefined,
				s[0] ? 
					{ list:[
						{ sY:{r:.5}, color:c5, stripes:{ gap:1, random:{r:-.5} } },
						s[1] ? 
							{ fY:true, sY:{r:.5}, color:c5, stripes:{ gap:1, random:{r:-.5} } }
							: undefined
					]}					
					: undefined,
				s[2] ? // Crosses
					{ color: s[3] ? c4 : c3, list:[
						s[0] ? 
							{ weight: s[4] ? 2 : 5, points:[
								{},
								{ fX:true, fY:true }
							]}
							: undefined,
						s[1] ?
							{ weight: s[4] ? 2 : 5, points:[
								{ fX:true },
								{ fY:true }
							]}
							: undefined
					] }
					: undefined,
				s[1] ? // Middle Square
					{ m:{r:.3}, color: s[3] ? c3 : c2, list:[
						{},
						s[4] ?
							{ m:{r:.2}, color: s[2] ? c4 : c5 }
							: undefined
					]}
					: undefined,
				s[1] ?
					{ list:[
						{ use:"points", chance:.1, color:c7 },
						{ save:"points"}
					] }
					: undefined,
			]}, // END images

			{ color:backgroundColor, list:[
				{ sY:"borderS" },
				{ sY:"borderS", fY:true },
				{ sX:"borderS" },
				{ sX:"borderS", fX:true }
			]}
		],

		variableList = {
			"width" : { r:1 },
			"height" : {r:1, height:true},
			"squ" : { a:"width", max:"height" }, 

			"borderS" : {r:.03, a:1, useSize:"squ", min:1},

			"imgSX" : [ "width", mult(-2,"borderS") ],
			"imgSY" : [ "height", mult(-2,"borderS")],

			"imgSqu" : getSmallerDim({ r:1, useSize:["imgSX","imgSY"] }),
		};

	console.log( nr, s );

	return {
		renderList : renderList, 
		variableList : variableList,
		background: backgroundColor
	};


};
