import { useState, useRef, TouchEvent, MouseEvent, useEffect } from "react";
import { getDimensionX, getDimensionY, getSizeX } from "./getDimension";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export const getRenderOnCanvas = () => {
	const [width, setWidth] = useState(1);
	const [height, setHeight] = useState(1);
	const [pixelSize, setPixelSize] = useState(5);
	const [isResizeable, setIsResizeable] = useState(true);
	const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(null);
	const [boundingClientRectCanvas, setBoundingClientRectCanvas] = useState<DOMRect | null>(null);
	const [imageFunction, setImageFunction] = useState<ImageFunction | null>(null);
	const [widthAbs, setWidthAbs] = useState<number | null>(null);
	const [isReady, setIsReady] = useState(false);
	const canvas = useRef<HTMLCanvasElement>(null);

	const redraw = () => {
		if (pixelGraphic === null || boundingClientRectCanvas === null) {
			return;
		}
		pixelGraphic.redraw({
			widthFactor: width,
			heightFactor: height,
			pixelSize: pixelSize,
			sizeX: boundingClientRectCanvas.width,
			sizeY: boundingClientRectCanvas.height,
		});
	};

	const onDrag = (event: MouseEvent | TouchEvent) => {
		if (
			isResizeable === false ||
			("touches" in event && event.touches.length > 1) ||
			boundingClientRectCanvas === null
		) {
			return;
		}
		event.preventDefault();

		setWidthAbs(getSizeX(boundingClientRectCanvas));

		setWidth(getDimensionX(event, boundingClientRectCanvas));
		setHeight(getDimensionY(event, boundingClientRectCanvas));
	};

	useEffect(() => {
		if (canvas.current === null || imageFunction === null) {
			return;
		}
		setBoundingClientRectCanvas(canvas.current.getBoundingClientRect());
		setPixelGraphic(
			new PixelGraphics({
				divCanvas: canvas.current,
				pixelSize: pixelSize,
				imageFunction: imageFunction,
			})
		);
		setIsReady(true);
	}, [canvas, imageFunction]);

	return {
		width,
		height,
		widthAbs,
		pixelSize,
		isResizeable,
		isReady,
		canvas,
		setWidth,
		setHeight,
		setPixelSize,
		setIsResizeable,
		setImageFunction,
		onDrag,
		redraw,
	};
};
