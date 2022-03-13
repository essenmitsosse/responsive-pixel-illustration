import { getPosition } from "./getPosition";
import { getDimension } from "./getDimension";

export const get2D = (Axis) => ({
	Position: getPosition(Axis),
	Dimensions: getDimension(Axis),
});
