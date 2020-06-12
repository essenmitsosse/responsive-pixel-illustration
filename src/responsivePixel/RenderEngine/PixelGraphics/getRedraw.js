export const getRedraw = (options, resize) => {
	const hoverEvent = options.imageFunction.hover;
	return (args) => {
		if (hoverEvent) { hoverEvent(args); }
		resize(args);
	};
};
