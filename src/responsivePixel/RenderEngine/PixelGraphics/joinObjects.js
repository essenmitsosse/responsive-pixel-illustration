export const joinObjects = (...args) => {
	const newObj = {};
	args.forEach((obj) => {
		if (obj === undefined) {
			return;
		}
		Object.entries(obj).forEach(([key, value]) => {
			newObj[key] = value;
		});
	});
	return newObj;
};
