import { getPixelArray } from "./getPixelArray";
import { DrawingTools } from "./DrawingTools";
import { PixelGraphics } from "..";
import { Render } from "../types";

export const getDrawer = (pixelGraphics: PixelGraphics, renderList: ReadonlyArray<Render>) => {
	const drawingTool = new DrawingTools(pixelGraphics);
	const canvasTool = new drawingTool.Obj().create({ list: renderList });
	return (countW, countH) => {
		const pixelArray = getPixelArray(countW, countH);
		drawingTool.init(countW, countH, pixelArray);
		canvasTool.draw();
		return pixelArray;
	};
};
