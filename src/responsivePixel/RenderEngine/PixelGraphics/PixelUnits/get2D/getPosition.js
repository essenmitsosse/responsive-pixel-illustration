export const getPosition = (Axis) => (args, reflectX, reflectY, rotate) => {
	const fromRight = (args.fX || false) !== reflectX;
	const fromBottom = (args.fY || false) !== reflectY;
	const x = new Axis.PosX(rotate
		? {
			pos: args.y,
			fromOtherSide: !fromBottom,
			toOtherSide: args.toTop,
			center: args.centerX || args.center,
		}
		: {
			pos: args.x,
			fromOtherSide: fromRight,
			toOtherSide: args.toLeft,
			center: args.centerY || args.center,
		});
	const y = new Axis.PosY(rotate
		? {
			pos: args.x,
			fromOtherSide: fromRight,
			toOtherSide: args.toLeft,
			center: args.centerX || args.center,
		}
		: {
			pos: args.y,
			fromOtherSide: fromBottom,
			toOtherSide: args.toTop,
			center: args.centerY || args.center,
		});
	return () => ({
		x: x.calc(),
		y: y.calc(),
	});
};
