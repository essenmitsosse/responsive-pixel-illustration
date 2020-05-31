export function getRenderPixelToImage(backgroundColor) {
	return function renderPixelToImage(pixelW, pixelH, pixelArray, imageData) {
		let pW = pixelW; let w4 = pW * 4; const wFull = w4; let pH; const pHSave = pixelH; const fullSave = w4 * pHSave; let full; let c; let i; let row; const pA = pixelArray; const defaultRed = backgroundColor && backgroundColor[0]; const defaultGreen = backgroundColor && backgroundColor[1]; const
			defaultBlue = backgroundColor && backgroundColor[2];
		while (pW--) {
			w4 -= 4;
			pH = pHSave;
			full = fullSave;
			row = pA[pW];
			while (pH--) {
				if ((c = row[pH].s.pop())) {
					c = c.c;
					imageData[i = w4 + (full -= wFull)] = c[0];
					imageData[i += 1] = c[1];
					imageData[i += 1] = c[2];
					imageData[i += 1] = 255;
				} else if (backgroundColor) {
					imageData[i = w4 + (full -= wFull)] = defaultRed;
					imageData[i += 1] = defaultGreen;
					imageData[i += 1] = defaultBlue;
					imageData[i += 1] = 255;
				} else {
					imageData[i = w4 + (full -= wFull) + 3] = 0;
				}
			}
		}
		return imageData;
	};
}
