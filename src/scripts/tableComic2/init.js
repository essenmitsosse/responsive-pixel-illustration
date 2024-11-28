(function (tablePrototype) {
	for (var key in tablePrototype) {
		tablePrototype[key].prototype.basic = tablePrototype;
	}
})(window.TableComic.prototype);
