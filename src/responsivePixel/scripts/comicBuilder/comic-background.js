
/* global Comic */

// BEGINN Mountains /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Mountains = function Mountains(args) {
	let count = this.rInt(3, 20);
	const singleWid = 1 / count;
	const list = [];

	while (count--) {
		list.push({
			sX: { r: singleWid },
			sY: { r: this.rFl(0, 1) },
			fY: true,
			x: { r: count * singleWid },
		});
	}

	return list;
};

Comic.prototype.Mountains.prototype.draw = function () {

}; // END Mountains \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
