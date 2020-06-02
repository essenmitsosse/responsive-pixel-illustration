import { getPixelArray } from './getPixelArray';

export const getDrawer = (pixelGraphics, renderList) => {
	const pixelUnit = pixelGraphics.pixelUnits;
	const drawingTool = new pixelGraphics.DrawingTools(pixelUnit, pixelGraphics.getRandom);
	const canvasTool = new drawingTool.Obj().create({ list: renderList });
	return function drawer(countW, countH) {
		const pixelArray = getPixelArray(countW, countH);
		drawingTool.init(countW, countH, pixelArray);
		canvasTool.draw();
		return pixelArray;
	};
};
