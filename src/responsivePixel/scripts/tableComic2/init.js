(function (tablePrototype) {
	for (const key in tablePrototype) {
		tablePrototype[key].prototype.basic = tablePrototype;
	}
})(window.TableComic.prototype);
