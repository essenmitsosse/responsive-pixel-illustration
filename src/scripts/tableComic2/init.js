import { TableComic } from "./main.js";

(function (tablePrototype) {
	for (var key in tablePrototype) {
		tablePrototype[key].prototype.basic = tablePrototype;
	}
})(TableComic.prototype);
