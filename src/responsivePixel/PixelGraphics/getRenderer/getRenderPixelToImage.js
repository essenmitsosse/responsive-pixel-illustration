export function getRenderPixelToImage(backgroundColor) {
	return function renderPixelToImage(pixelW, pixelH, pixelArray, imageData) {
		let sizeXPixel = pixelW;
		let w4 = sizeXPixel * 4;
		const wFull = w4;
		const pHSave = pixelH;
		const fullSave = w4 * pHSave;
		const pA = pixelArray;
		while (sizeXPixel) {
			sizeXPixel -= 1;
			w4 -= 4;
			let sizeYPixel = pHSave;
			let full = fullSave;
			const row = pA[sizeXPixel];
			while (sizeYPixel) {
				sizeYPixel -= 1;
				const c = row[sizeYPixel].s.pop();
				const i = w4 + (full -= wFull);
				const color = c !== undefined ? c.c : backgroundColor;

				/* eslint-disable no-param-reassign */
				if (color) {
					[imageData[i], imageData[i + 1], imageData[i + 2]] = color;
					imageData[i + 3] = 255;
				} else {
					imageData[i + 3] = 0;
				}
			}
		}
		return imageData;
	};
}
