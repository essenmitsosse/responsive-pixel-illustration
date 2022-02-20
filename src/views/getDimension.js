const getPosClient = (nameDim, event) => {
	const nameDimClient = `client${nameDim.toUpperCase()}`;
	return (nameDim in event ? event[nameDimClient] : event.touches[0][nameDimClient]) || 0;
};

const getPosCanvas = (nameDim, event, boundingClientRectCanvas) =>
	getPosClient(nameDim, event) - boundingClientRectCanvas[nameDim];

const getGetDimension = (nameDim) => (event, boundingClientRectCanvas) => {
	const pos = getPosCanvas(nameDim, event, boundingClientRectCanvas);
	const sizeHalf = boundingClientRectCanvas[nameDim === "x" ? "width" : "height"] / 2;
	return Math.abs((pos - sizeHalf) / sizeHalf);
};

export const getDimensionX = getGetDimension("x");
export const getDimensionY = getGetDimension("y");
