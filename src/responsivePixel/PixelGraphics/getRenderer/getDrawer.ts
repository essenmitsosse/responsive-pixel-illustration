import { getPixelArray } from "./getPixelArray";
import { getDrawingTools } from "./DrawingTools";
import type { PixelGraphics } from "..";
import type { Render } from "../types";

export const getDrawer = (
	pixelGraphics: PixelGraphics,
	renderList: ReadonlyArray<Render>,
) => {
	const drawingTool = getDrawingTools(pixelGraphics);
	const canvasTool = new drawingTool.Obj().create({ list: renderList });
	return (countW, countH) => {
		const pixelArray = getPixelArray(countW, countH);
		drawingTool.init(countW, countH, pixelArray);
		canvasTool.draw();
		return pixelArray;
	};
};
