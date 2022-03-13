import "./RenderPixel.css";
import { getRenderOnCanvas } from "./getRenderOnCanvas";
import { imageFunctionTeiresias } from "../responsivePixel/scripts/teiresias";

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
	} = getRenderOnCanvas(imageFunctionTeiresias);

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
			<div className="wrapper-canvas">
				<canvas ref={canvas} className="canvas" onMouseMove={onDrag} onTouchMove={onDrag} />
			</div>
		</div>
	);
};
