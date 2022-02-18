// Make all the Comic Constructors available to all of them as the "basic"-Object.
(function (comicPrototype) {
	for (const key in comicPrototype) {
		comicPrototype[key].prototype.basic = comicPrototype;
	}
})(window.Comic.prototype);
