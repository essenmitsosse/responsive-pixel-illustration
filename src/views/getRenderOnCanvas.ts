import { useState, useRef, TouchEvent, MouseEvent, useEffect } from "react";
import { getDimensionX, getDimensionY } from "./getDimension";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
import { imageFunctionTeiresias } from "../responsivePixel/scripts/teiresias";

export const getRenderOnCanvas = () => {
	const [width, setWidth] = useState(1);
	const [height, setHeight] = useState(1);
	const [pixelSize, setPixelSize] = useState(5);
	const [isResizeable, setIsResizeable] = useState(true);
	const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(null);
	const [boundingClientRectCanvas, setBoundingClientRectCanvas] = useState<DOMRect | null>(null);
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

		setWidth(getDimensionX(event, boundingClientRectCanvas));
		setHeight(getDimensionY(event, boundingClientRectCanvas));
	};

	useEffect(() => {
		if (!canvas.current) {
			return;
		}
		setBoundingClientRectCanvas(canvas.current.getBoundingClientRect());
		setPixelGraphic(
			new PixelGraphics({
				divCanvas: canvas.current,
				pixelSize: pixelSize,
				imageFunction: imageFunctionTeiresias,
			})
		);
	}, [canvas]);

	return {
		width,
		height,
		pixelSize,
		isResizeable,
		canvas,
		setWidth,
		setHeight,
		setPixelSize,
		setIsResizeable,
		onDrag,
		redraw,
	};
};
