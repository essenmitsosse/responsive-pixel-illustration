import { getPixelArray } from './getPixelArray';

export const getDrawer = (pixelStarter, renderList) => {
	const pixelUnit = pixelStarter.pixelUnits;
	const drawingTool = new pixelStarter.DrawingTools(pixelUnit, pixelStarter.getRandom);
	const canvasTool = new drawingTool.Obj().create({ list: renderList });
	return function drawer(countW, countH) {
		const pixelArray = getPixelArray(countW, countH);
		drawingTool.init(countW, countH, pixelArray);
		canvasTool.draw();
		return pixelArray;
	};
};
