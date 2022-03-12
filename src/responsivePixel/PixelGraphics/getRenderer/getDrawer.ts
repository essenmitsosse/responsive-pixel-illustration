import { getPixelArray } from "./getPixelArray";
import { DrawingTools } from "./DrawingTools";

export const getDrawer = (pixelGraphics, renderList) => {
	const drawingTool = new DrawingTools(pixelGraphics);
	const canvasTool = new drawingTool.Obj().create({ list: renderList });
	return function drawer(countW, countH) {
		const pixelArray = getPixelArray(countW, countH);
		drawingTool.init(countW, countH, pixelArray);
		canvasTool.draw();
		return pixelArray;
	};
};
