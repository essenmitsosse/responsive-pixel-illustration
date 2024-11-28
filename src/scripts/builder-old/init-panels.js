"use strict";
window.renderer = function (init) {
	var help = helper,
		getSmallerDim = help.getSmallerDim,
		getBiggerDim = help.getBiggerDim,
		mult = help.mult,
		sub = help.sub,
		builder = new Builder(init),
		renderList;

	renderList = new builder.basic.Comic(init);

	return {
		renderList: renderList,
		variableList: builder.joinVariableList,
		background: builder.backgroundColor,
	};
};
