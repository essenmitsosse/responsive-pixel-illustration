import "./RenderPixel.css";
import { getRenderOnCanvas } from "./getRenderOnCanvas";
import { useEffect } from "react";
import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

const getTeiresias = async (): Promise<ImageFunction> => {
	return (await import("../responsivePixel/scripts/teiresias")).imageFunctionTeiresias
};

export default () => {
	const {
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
		setImageFunction,
		isReady,
	} = getRenderOnCanvas();

	useEffect(() => {
		getTeiresias().then(setImageFunction);
	}, []);

	redraw();

	return (
		<div className="home">
			<input
				value={width}
				onInput={(event) => setWidth(parseFloat(event.currentTarget.value))}
				type="range"
				min="0"
				max="1"
				step="0.0001"
			/>{" "}
			<input
				value={height}
				onInput={(event) => setHeight(parseFloat(event.currentTarget.value))}
				type="range"
				min="0"
				max="1"
				step="0.0001"
			/>
			<input
				value={pixelSize}
				onInput={(event) => setPixelSize(parseFloat(event.currentTarget.value))}
				type="range"
				min="2"
				max="12"
				step="1"
			/>
			<input
				checked={isResizeable}
				onChange={() => setIsResizeable(!isResizeable)}
				type="checkbox"
			/>
			{isReady ? null : "Bild lädt ..."}
			<div className="wrapper-canvas">
				<canvas ref={canvas} className="canvas" onMouseMove={onDrag} onTouchMove={onDrag} />
			</div>
		</div>
	);
};
