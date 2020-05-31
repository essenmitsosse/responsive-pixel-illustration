import { PixelGraphics } from './PixelGraphics';

// Create a new Canvas, add it to the div and return it
export function createSingleCanvas(div) {
	const canvas = document.createElement('canvas');
	canvas.resize = true;
	canvas.keepalive = true;
	div.appendChild(canvas);
	return (renderer) => new PixelGraphics(renderer)(canvas);
}
