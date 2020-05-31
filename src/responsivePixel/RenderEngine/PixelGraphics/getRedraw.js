export const getRedraw = (options, resize) => {
	const hoverEvent = options.imageFunction.hover;
	return (args) => {
		options.init.addToQueryString(args, true);
		if (hoverEvent) {
			hoverEvent(args);
		}
		resize(args);
	};
};
