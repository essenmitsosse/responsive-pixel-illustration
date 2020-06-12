import { getPixelArrayBase } from './getPixelArrayBase';

export const getPixelArray = (canvasWidth, canvasHeight) => {
	const pixelArray = getPixelArrayBase(canvasWidth, canvasHeight);
	let minX = 0;
	let minY = 0;
	let maxX = canvasWidth;
	let maxY = canvasHeight;
	return {
		setMask(dimensions, push) {
			const old = {
				posX: minX,
				width: maxX - minX,
				posY: minY,
				height: maxY - minY,
			};
			// TODO: Dont check if its the old values;
			maxX = (minX = dimensions.posX) + dimensions.width;
			maxY = (minY = dimensions.posY) + dimensions.height;
			if (!maxX || maxX > canvasWidth) {
				maxX = canvasWidth;
			}
			if (!maxY || maxY > canvasHeight) {
				maxY = canvasHeight;
			}
			if (!minX || minX < 0) {
				minX = 0;
			}
			if (!minY || minY < 0) {
				minY = 0;
			}
			if (push) {
				if (maxX > old.posX + old.width) {
					maxX = old.posX + old.width;
				}
				if (maxY > old.posY + old.height) {
					maxY = old.posY + old.height;
				}
				if (minX < old.posX) {
					minX = old.posX;
				}
				if (minY < old.posY) {
					minY = old.posY;
				}
			}
			return old;
		},
		getSet(color, zInd, id) {
			return (x, y) => {
				if (x >= minX && x < maxX && y >= minY && y < maxY) {
					pixelArray[x][y].draw(color, zInd, id);
				}
			};
		},
		getClear(id) {
			return (x, y) => {
				if (x >= minX && x < maxX && y >= minY && y < maxY) {
					pixelArray[x][y].clear(id);
				}
			};
		},
		getSetForRect(color, zInd, id) {
			return (args) => {
				const { posX } = args;
				const { posY } = args;
				const endX = args.width + posX;
				const endY = args.height + posY;
				const sizeX = endX > maxX ? maxX : endX;
				const sizeY = endY > maxY ? maxY : endY;
				const startX = posX < minX ? minX : posX;
				const startY = posY < minY ? minY : posY;
				let currentX = sizeX;
				while (currentX > startX) {
					currentX -= 1;
					let currentY = sizeY;
					const row = pixelArray[currentX];
					while (currentY > startY) {
						currentY -= 1;
						row[currentY].draw(color, zInd, id);
					}
				}
			};
		},
		getClearForRect(id) {
			return (args) => {
				const endX = args.width + args.posX;
				const endY = args.height + args.posY;
				const sizeX = endX > maxX ? maxX : endX;
				const sizeY = endY > maxY ? maxY : endY;
				const startX = args.posX < minX ? minX : args.posX;
				const startY = args.posY < minY ? minY : args.posY;
				let currentX = sizeX;
				while (currentX > startX) {
					currentX -= 1;
					let currentY = sizeY;
					const row = pixelArray[currentX];
					while (currentY > startY) {
						currentY -= 1;
						row[currentY].clear(id);
					}
				}
			};
		},
		getSaveForRect(save, mask) {
			return (args) => {
				const endX = args.width + args.posX;
				const endY = args.height + args.posY;
				const sizeX = endX > canvasWidth ? canvasWidth : endX;
				const sizeY = endY > canvasHeight ? canvasHeight : endY;
				const startX = args.posX < 0 ? 0 : args.posX;
				const startY = args.posY < 0 ? 0 : args.posY;
				const s = save;
				let currentX = sizeX;
				while (currentX > startX) {
					currentX -= 1;
					let currentY = sizeY;
					/* eslint-disable-next-line no-param-reassign */
					const col = mask[currentX] || (mask[currentX] = []);
					while (currentY > startY) {
						currentY -= 1;
						s.push([currentX, currentY]);
						col[currentY] = true;
					}
				}
			};
		},
		getClearSaveForRect(_, mask) {
			return (args) => {
				const endX = args.width + args.posX;
				const endY = args.height + args.posY;
				const sizeX = endX > canvasWidth ? canvasWidth : endX;
				const sizeY = endY > canvasHeight ? canvasHeight : endY;
				const startX = args.posX < 0 ? 0 : args.posX;
				const startY = args.posY < 0 ? 0 : args.posY;
				let currentX = sizeX;
				while (currentX > startX) {
					currentX -= 1;
					let currentY = sizeY;
					const col = mask[currentX];
					if (col) {
						while (currentY >= startY) {
							currentY -= 1;
							if (col[currentY]) {
								col[currentY] = false;
							}
						}
					}
				}
			};
		},
		get: pixelArray,
	}; // Return prepared Color-Array, with default Color;
};
