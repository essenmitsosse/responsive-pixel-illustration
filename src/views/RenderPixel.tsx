import "./RenderPixel.css";
import {
	useState,
	useRef,
	TouchEvent,
	MouseEvent,
	useEffect,
	useMemo,
} from "react";
import { recordImage, listPairImage } from "./recordImage";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	getDimensionX,
	getDimensionY,
	getSizeX,
	getSizeY,
} from "./getDimension";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
import { ImageFunction } from "../responsivePixel/PixelGraphics/types";

export default (props: { idImage: string }) => {
	const [relSizeX, setRelSizeX] = useState(1);
	const [relSizeY, setRelSizeY] = useState(1);
	const [pixelSize, setPixelSize] = useState(5);
	const [searchParams, setSearchParams] = useSearchParams();
	const isResizeable = searchParams.get("resizeable") !== "false";
	const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(
		null
	);
	const [boundingClientRectCanvas, setBoundingClientRectCanvas] =
		useState<DOMRect | null>(null);
	const [imageFunction, setImageFunction] = useState<ImageFunction | null>(
		null
	);
	const [absSizeXFull, setAbsSizeXFull] = useState<number | null>(null);
	const [absSizeYFull, setAbsSizeYFull] = useState<number | null>(null);
	const [isReady, setIsReady] = useState(false);
	const canvas = useRef<HTMLCanvasElement>(null);
	const pixelCountMin = 50;
	const pixelCount = useMemo(() => {
		return Math.round((absSizeXFull ?? 1) / pixelSize);
	}, [absSizeXFull, pixelSize]);

	const onDrag = (event: MouseEvent | TouchEvent) => {
		if (
			isResizeable === false ||
			("touches" in event && event.touches.length > 1) ||
			boundingClientRectCanvas === null
		) {
			return;
		}
		event.preventDefault();

		setRelSizeX(getDimensionX(event, boundingClientRectCanvas));
		setRelSizeY(getDimensionY(event, boundingClientRectCanvas));
	};

	const resize = () => {
		if (canvas.current === null) return;
		setBoundingClientRectCanvas(canvas.current.getBoundingClientRect());
	};

	useEffect(() => {
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	});

	useEffect(() => {
		if (boundingClientRectCanvas === null) return;
		setAbsSizeXFull(getSizeX(boundingClientRectCanvas));
		setAbsSizeYFull(getSizeY(boundingClientRectCanvas));
	}, [boundingClientRectCanvas]);

	useEffect(() => {
		if (
			pixelGraphic === null ||
			absSizeXFull === null ||
			absSizeYFull === null
		) {
			return;
		}
		pixelGraphic.redraw({
			relSizeX: relSizeX,
			relSizeY: relSizeY,
			pixelSize: pixelSize,
			absSizeXFull: absSizeXFull,
			absSizeYFull: absSizeYFull,
		});
	}, [
		pixelGraphic,
		absSizeXFull,
		absSizeYFull,
		relSizeX,
		relSizeY,
		pixelSize,
	]);

	useEffect(() => {
		if (canvas.current === null || imageFunction === null) {
			return;
		}
		resize();
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
		setPixelSize((absSizeXFull ?? 1) / pixelCount);
	};

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

	const setIsResizeable = (isResizable: boolean) => {
		setSearchParams(isResizable ? {} : { resizeable: "false" });
	};

	return (
		<div className="flex h-screen flex-col">
			<form className="flex w-full flex-wrap">
				<label className="mb-4 inline-block w-1/2 px-4 sm:w-1/3 md:w-1/6 ">
					<span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
						Select Image
					</span>
					<div className="relative">
						<select
							className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-1 px-4 pr-8  focus:border-gray-800 focus:outline-none dark:border-gray-600 dark:bg-gray-700 focus:dark:border-gray-300"
							value={props.idImage}
							onChange={(event) =>
								setIdImage(event.currentTarget.value)
							}
						>
							{listPairImage.map(([id, image]) => (
								<option value={id} key={id}>
									{image.niceName}
								</option>
							))}
						</select>
					</div>
				</label>
				<label className="mb-4 inline-block w-1/2 px-4 sm:w-1/3 md:w-1/6 ">
					<span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
						Width
					</span>
					<input
						className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
						value={relSizeX}
						onInput={(event) =>
							setRelSizeX(parseFloat(event.currentTarget.value))
						}
						type="range"
						min="0"
						max="1"
						step="0.0001"
					/>{" "}
				</label>
				<label className="mb-4 inline-block w-1/2 px-4 sm:w-1/3 md:w-1/6 ">
					<span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
						Height
					</span>
					<input
						className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
						value={relSizeY}
						onInput={(event) =>
							setRelSizeY(parseFloat(event.currentTarget.value))
						}
						type="range"
						min="0"
						max="1"
						step="0.0001"
					/>
				</label>
				<label className="mb-4 inline-block w-1/2 px-4 sm:w-1/3 md:w-1/6 ">
					<span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
						Pixel Size{" "}
						<span className="font-mono font-light opacity-50">
							({Math.round(pixelSize)})
						</span>
					</span>
					<input
						className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300 "
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
				<label className="mb-4 inline-block w-1/2 px-4 sm:w-1/3 md:w-1/6 ">
					<span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
						Pixel Count{" "}
						<span className="font-mono font-light opacity-50">
							({Math.round(pixelCount)} /{" "}
							{Math.round(absSizeXFull ?? 1)})
						</span>
					</span>
					<input
						className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
						value={pixelCount}
						onInput={(event) =>
							setPixelCount(parseFloat(event.currentTarget.value))
						}
						type="range"
						min={pixelCountMin}
						max={absSizeXFull ?? 1}
						step="1"
					/>
				</label>
				<label className="mb-4 inline-block w-1/2 px-4 sm:w-1/3 md:w-1/6 ">
					<span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
						Resize on Hover
					</span>
					<input
						className="form-checkbox mt-2 block h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-gray-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
						checked={isResizeable}
						onChange={() => setIsResizeable(!isResizeable)}
						type="checkbox"
					/>
				</label>
			</form>
			{isReady ? null : "Bild lädt ..."}
			<div className="relative h-full w-full">
				<canvas
					ref={canvas}
					className="absolute h-full w-full"
					onMouseMove={onDrag}
					onTouchMove={onDrag}
				/>
			</div>
		</div>
	);
};
