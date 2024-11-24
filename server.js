"use strict";
/* global require, __dirname, console */


var express = require("express"),
	app = express(),
	server = require("http").Server(app),
	io = require("socket.io")(server),
	colors = require( "colors" );

server.listen(8888);

app.get("/", function (req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname + "/"));

// My Functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var admins = [],

	// Logs the Messages and sends them to the admin
	message = ( function createMessenger () {
		var getTime = function () {
				var date = new Date();

				return date.toLocaleTimeString(); 
			},
			totalMessageList = "",
			sendToAdmin = function ( messageName, message ) {
				var l = admins.length;

				if( l > 0 ) {
					while( l -- ) {
						admins[ l ].emit( messageName || "initMessageList", message || totalMessageList ); 
					}					
				}
			};

		return {
			add : function newMessage ( time, message, color, bold ) {
				var terminalMessage = message,
					browserMessage,
					showTime = time ? getTime() : "";

				if( color ) {
					terminalMessage = terminalMessage[ color ];
				}
				if( bold ) {
					terminalMessage = terminalMessage.bold;
				}

				browserMessage = 
					"<span class='" + color + ( bold ? " bold" : "" ) + "'>" + 
						"<span class='time'>" + showTime + "</span>" + 
						message + 
					"</span>";

				totalMessageList = "<li>" + browserMessage + "</li>" + totalMessageList;

				sendToAdmin();
				console.log( showTime, terminalMessage );
			},

			sendToAdmin : sendToAdmin,
		};
	} )(),

	socketFunctions = ( function ( message ) {
		var totalCount = 0,
			imageFormat = {},
			values = {},
			slide = 0,

			maxClients = 0,

			warnAllSockets = function () {
				var list = io.sockets.sockets,
					l = list.length;

				totalCount = l;

				while( l -- ) {
					list[ l ].disconnectIsExpected = true;
				}

				admins = [];
			},

			// Updates the List of all clients and sends it to the admin, if he exists
			refreshClientList = function () {
				var list = io.sockets.sockets,
					clientList = "",
					l = list.length;

				if( l > maxClients ) {
					maxClients = l;
				}

				clientList = l + "/" + maxClients;

				clientList = "<h1 id='connectionCount' class='" + ( l < maxClients ? "warning" : "normal" ) + "'>" + clientList + "</h1>";

				while ( l -- ) {
					clientList += "<div class='client'>" + list[ l ].name + "</div>";
				}

				message.sendToAdmin( "initClientList", clientList );
			},

			takeImageDataApart = function ( data ) {
				var newDataObj = JSON.parse( data ),
					key;

				for( key in newDataObj ) {
					imageFormat[ key ] =  newDataObj[ key ];
				}
			},

			updateValues = function ( data ) {
				var key;

				data = JSON.parse( data );

				// if slide has changed, reset image format
				if( data.slide && data.slide !== slide ) { 
					slide = data.slide; 
					imageFormat = {};
					data.panels = undefined;
				} 

				for ( key in data ) {
					values[ key ] = data[ key ];
				}
			};

		return {
			connected: function( data ){
				data = JSON.parse( data );
				if( !this.disconnectIsExpected ) {
					this.name = data.name;
					console.log( ( "___connected " + this.name + "!" ).green );
					if ( data.admin ) {
						this.admin = true;
						admins.push( this );
					}
				}

				refreshClientList();

				this.emit( "newValues", JSON.stringify( values ), JSON.stringify( imageFormat ) );
			},

			redraw: function( data ) {

				if( this.resize ) {
					this.broadcast.emit( "redrawImage", data );
					this.startResetTimer();

					takeImageDataApart( data );
				}
			},			

			updateValue: function ( data ) {
				message.add( true, ( "- - - " + data ), "blue" );
				warnAllSockets();
				updateValues( data );

				io.sockets.emit( "newValues", JSON.stringify( values ) );
			},

			seedId: function() {
				message.add( true, ( "- - - seed random ids" ), "blue" );
				warnAllSockets();

				delete values.id;

				io.sockets.emit( "newId", "0" );
			},

			disconnect: function(){
				if( !this.disconnectIsExpected ) {
					message.add( true, ( "disconnected " + this.name ), "red", "bold" );
				}

				if( this.admin === true ) {
					this.admin = false;
				}

				refreshClientList();
			},

			// iAmAdmin: function() {
			// 	if( !this.disconnectIsExpected ) {
			// 		this.admin = true;
			// 		admins.push( this );
			// 	}

			// 	refreshClientList();
			// 	message.sendToAdmin();
			// },

			test: function( data ) {
				console.log( "test: ", data );
			}
		};
	})( message );

// On new socket connection - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

io.on("connection", function ( socket ) {
	// var key;
	socket.timer = false;
	socket.resize = true;

	socket.name = "no_name_yet";
	socket.disconnectIsExpected = false;
	socket.admin = false;

	socket.resetTimer = function () {
		socket.resize = true;
	};

	socket.startResetTimer = function() {
		this.resize = false;	
		this.timer = setTimeout( this.resetTimer, 20 );
	}

	socket._events = socketFunctions;
});

// When everything worked confirm server start - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

message.add( false, "server started, connections: " + io.sockets.sockets.length );
