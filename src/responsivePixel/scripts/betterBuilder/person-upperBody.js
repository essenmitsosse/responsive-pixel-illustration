// CHEST  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
BBProto.Chest = function ( args ) {
	this.color = args.color;
	this.colorDark = args.colorDark;
} // End Chest

BBProto.Chest.prototype = new BBObj();
BBProto.Chest.prototype.draw = function ( args, front, right ) {
	return [
		{
			color:[front ? 200 : 150, right ? 200 : 150, front || right ? 0 : 0]
		}
	]
} // End Chest Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -