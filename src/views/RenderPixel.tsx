import "./RenderPixel.css";
import { getRenderOnCanvas } from "./getRenderOnCanvas";
import { useEffect, useState } from "react";
import { recordImage, listPairImage } from "./recordImage";

export default () => {
	const [idImage, setIdImage] = useState("teiresias");
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
		recordImage[idImage]
			.getImage()
			.then((imageFunctionExport) => setImageFunction(imageFunctionExport.default));
	}, [idImage]);

	redraw();

	return (
		<div className="home">
			<select value={idImage} onChange={(event) => setIdImage(event.currentTarget.value)}>
				{listPairImage.map(([id, image]) => (
					<option value={id} key={id}>
						{image.niceName}
					</option>
				))}
			</select>
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
				max="30"
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
