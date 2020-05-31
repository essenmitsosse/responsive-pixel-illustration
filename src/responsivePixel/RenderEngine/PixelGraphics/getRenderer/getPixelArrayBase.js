import { Color } from './Color';

const getColor = () => new Color();

export const getPixelArrayBase = (width, height) => new Array(width)
	.fill()
	.map(() => new Array(height)
		.fill()
		.map(getColor));
