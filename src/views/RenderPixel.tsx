import "./RenderPixel.css";
import { useState, useRef, TouchEvent, MouseEvent, useEffect } from "react";
import { recordImage, listPairImage } from "./recordImage";
import { useNavigate } from "react-router-dom";
import { getDimensionX, getDimensionY, getSizeX } from "./getDimension";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export default (props: { idImage: string }) => {
	const [width, setWidth] = useState(1);
	const [height, setHeight] = useState(1);
	const [pixelSize, setPixelSize] = useState(5);
	const [isResizeable, setIsResizeable] = useState(true);
	const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(
		null
	);
	const [boundingClientRectCanvas, setBoundingClientRectCanvas] =
		useState<DOMRect | null>(null);
	const [imageFunction, setImageFunction] = useState<ImageFunction | null>(
		null
	);
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

	const setPixelCount = (pixelCount) => {
		setPixelSize((pixelCountMax ?? 1) / pixelCount);
	};

	const pixelCountMin = 50;
	const pixelCountMax = widthAbs;
	const pixelCount = Math.round((pixelCountMax ?? 1) / pixelSize);

	useEffect(() => {
		recordImage[props.idImage]
			.getImage()
			.then((imageFunctionExport) =>
				setImageFunction(imageFunctionExport.default)
			);
	}, [props.idImage]);

	const navigate = useNavigate();

	const setIdImage = (idImageNew: string) => {
		navigate(`/${idImageNew}`);
	};

	redraw();

	return (
		<div className="home">
			<label style={{ display: "inline-block" }}>
				<span>Select Image</span>
				<select
					style={{ display: "block" }}
					value={props.idImage}
					onChange={(event) => setIdImage(event.currentTarget.value)}
				>
					{listPairImage.map(([id, image]) => (
						<option value={id} key={id}>
							{image.niceName}
						</option>
					))}
				</select>
			</label>
			<label style={{ display: "inline-block" }}>
				<span>Width</span>
				<input
					style={{ display: "block" }}
					value={width}
					onInput={(event) =>
						setWidth(parseFloat(event.currentTarget.value))
					}
					type="range"
					min="0"
					max="1"
					step="0.0001"
				/>{" "}
			</label>
			<label style={{ display: "inline-block" }}>
				<span>Height</span>
				<input
					style={{ display: "block" }}
					value={height}
					onInput={(event) =>
						setHeight(parseFloat(event.currentTarget.value))
					}
					type="range"
					min="0"
					max="1"
					step="0.0001"
				/>
			</label>
			<label style={{ display: "inline-block" }}>
				<span>Pixel Size ({Math.round(pixelSize)})</span>
				<input
					style={{ display: "block" }}
					value={pixelSize}
					onInput={(event) =>
						setPixelSize(parseFloat(event.currentTarget.value))
					}
					type="range"
					min="2"
					max="30"
					step="1"
				/>
			</label>
			<label style={{ display: "inline-block" }}>
				<span>
					Pixel Count ({Math.round(pixelCount)} /{" "}
					{Math.round(pixelCountMax ?? 1)})
				</span>
				<input
					style={{ display: "block" }}
					value={pixelCount}
					onInput={(event) =>
						setPixelCount(parseFloat(event.currentTarget.value))
					}
					type="range"
					min={pixelCountMin}
					max={pixelCountMax ?? 1}
					step="1"
				/>
			</label>
			<label style={{ display: "inline-block" }}>
				<span>Resize on Hover</span>
				<input
					style={{ display: "block" }}
					checked={isResizeable}
					onChange={() => setIsResizeable(!isResizeable)}
					type="checkbox"
				/>
			</label>
			{isReady ? null : "Bild lädt ..."}
			<div className="wrapper-canvas">
				<canvas
					ref={canvas}
					className="canvas"
					onMouseMove={onDrag}
					onTouchMove={onDrag}
				/>
			</div>
		</div>
	);
};
