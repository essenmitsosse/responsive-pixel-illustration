import "./RenderPixel.css";
import { getRenderOnCanvas } from "./getRenderOnCanvas";
import { useEffect, useState } from "react";
import { recordImage, listPairImage } from "./recordImage";

export default () => {
	const [idImage, setIdImage] = useState("teiresias");
	const {
		width,
		height,
		widthAbs,
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

	const setPixelCount = (pixelCount) => {
		setPixelSize((pixelCountMax ?? 1) / pixelCount)
	}

	const pixelCountMin = 50;
	const pixelCountMax = widthAbs;
	const pixelCount = Math.round((pixelCountMax ?? 1) / pixelSize)

	useEffect(() => {
		recordImage[idImage]
			.getImage()
			.then((imageFunctionExport) => setImageFunction(imageFunctionExport.default));
	}, [idImage]);

	redraw();

	return (
		<div className="home">
			<label style={{ display: 'inline-block' }}>
				<span>Select Image</span>
				<select style={{ display: 'block' }} value={idImage} onChange={(event) => setIdImage(event.currentTarget.value)}>
					{listPairImage.map(([id, image]) => (
						<option value={id} key={id}>
							{image.niceName}
						</option>
					))}
				</select>
			</label>
			<label style={{ display: 'inline-block' }}>
				<span>Width</span>
				<input style={{ display: 'block' }}
					value={width}
					onInput={(event) => setWidth(parseFloat(event.currentTarget.value))}
					type="range"
					min="0"
					max="1"
					step="0.0001"
				/>{" "}
			</label>
			<label style={{ display: 'inline-block' }}>
				<span>Height</span>
				<input style={{ display: 'block' }}
					value={height}
					onInput={(event) => setHeight(parseFloat(event.currentTarget.value))}
					type="range"
					min="0"
					max="1"
					step="0.0001"
				/>
			</label>
			<label style={{ display: 'inline-block' }}>
				<span>Pixel Size ({Math.round(pixelSize)})</span>
				<input style={{ display: 'block' }}
					value={pixelSize}
					onInput={(event) => setPixelSize(parseFloat(event.currentTarget.value))}
					type="range"
					min="2"
					max="30"
					step="1"
				/>
			</label>
			<label style={{ display: 'inline-block' }}>
				<span>Pixel Count ({Math.round(pixelCount)} / {Math.round(pixelCountMax ?? 1)})</span>
				<input
					style={{ display: 'block' }}
					value={pixelCount}
					onInput={(event) => setPixelCount(parseFloat(event.currentTarget.value))}
					type="range"
					min={pixelCountMin}
					max={pixelCountMax ?? 1}
					step="1"
				/>
			</label>
			<label style={{ display: 'inline-block' }}>
				<span>Resize on Hover</span>
				<input style={{ display: 'block' }}
					checked={isResizeable}
					onChange={() => setIsResizeable(!isResizeable)}
					type="checkbox"
				/>
			</label>
			{isReady ? null : "Bild lädt ..."}
			<div className="wrapper-canvas">
				<canvas ref={canvas} className="canvas" onMouseMove={onDrag} onTouchMove={onDrag} />
			</div>
		</div >
	);
};
