import { Color } from "./getRenderer/Color";

export interface Link {}

export interface Variable {}

export interface Render {}

export type ColorRgb = [number, number, number];

export type PixelArray = ReadonlyArray<ReadonlyArray<Color>>;
export interface ImageFunction {
	linkList: ReadonlyArray<Link>;
	variableList: ReadonlyArray<Variable>;
	renderList: ReadonlyArray<Render>;
	background: ColorRgb;
}
