import { Color } from "./getRenderer/Color";

export interface Variable {}

export interface Render {}

export type ColorRgb = readonly [number, number, number];

export type PixelArray = ReadonlyArray<ReadonlyArray<Color>>;
export interface ImageFunction {
	linkList?: ReadonlyArray<Link>;
	variableList?: Record<string, Variable>;
	renderList: ReadonlyArray<Render>;
	background: ColorRgb;
}

interface GetLength {
	getLength: [number, number];
	debug?: true;
}

interface GetLinkedVariable {
	getLinkedVariable: () => number;
	debug?: true;
}

export interface Link {
	a: string;
	debug?: true;
}

export type InputDimension =
	| number
	| string
	| GetLength
	| GetLinkedVariable
	| Link;
