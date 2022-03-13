import { MouseEvent, TouchEvent } from "react";

enum Axis {
	"x" = "x",
	"y" = "y",
}

const recordBoundClientRectSize = {
	[Axis.x]: "width",
	[Axis.y]: "height",
} as const;

const recordClient = {
	[Axis.x]: "clientX",
	[Axis.y]: "clientY",
} as const;

const getIsMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => "clientX" in event;

const getPosClient = (axis: Axis, event: MouseEvent | TouchEvent): number => {
	const nameDimClient = recordClient[axis];
	return (getIsMouseEvent(event) ? event[nameDimClient] : event.touches[0][nameDimClient]) || 0;
};

const getPosCanvas = (
	axis: Axis,
	event: MouseEvent | TouchEvent,
	boundingClientRectCanvas: DOMRect
): number => getPosClient(axis, event) - boundingClientRectCanvas[axis];

const getGetDimension =
	(axis: Axis) =>
	(event: MouseEvent | TouchEvent, boundingClientRectCanvas: DOMRect): number => {
		const pos = getPosCanvas(axis, event, boundingClientRectCanvas);
		const sizeHalf = boundingClientRectCanvas[recordBoundClientRectSize[axis]] / 2;
		return Math.abs((pos - sizeHalf) / sizeHalf);
	};

export const getDimensionX = getGetDimension(Axis.x);
export const getDimensionY = getGetDimension(Axis.y);
