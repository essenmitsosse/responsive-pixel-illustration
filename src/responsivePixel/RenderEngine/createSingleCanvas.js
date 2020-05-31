import { PixelGraphics } from './PixelGraphics';

// Create a new Canvas, add it to the div and return it
export function createSingleCanvas(canvasData, div) {
	const canvas = document.createElement('canvas');
	canvas.resize = true;
	canvas.keepalive = true;
	// canvas.style.position = "absolute";
	if (canvasData) {
		Object.keys(canvasData).forEach((key) => {
			canvas.style[key] = canvasData[key];
		});
	}
	div.appendChild(canvas);
	return (renderer) => new PixelGraphics(renderer)(canvas);
}
