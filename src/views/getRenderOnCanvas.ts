import { ref, onMounted, onUpdated } from "vue";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
// eslint-disable-next-line no-unused-vars
import { graien } from "../responsivePixel/scripts/graien";
import { imageFunctionTeiresias } from "../responsivePixel/scripts/teiresias";
import { getDimensionX, getDimensionY } from "./getDimension";

export const getRenderOnCanvas = (canvas) => {
	const width = ref(1);
	const height = ref(1);
	const pixelSize = ref(5);
	const isResizeable = ref(true);
	let boundingClientRectCanvas = undefined;
	let pixelGraphic = undefined;

	const redraw = () => {
		if (pixelGraphic === undefined) {
			return;
		}
		pixelGraphic.redraw({
			widthFactor: width.value,
			heightFactor: height.value,
			pixelSize: pixelSize.value,
			sizeX: boundingClientRectCanvas.width,
			sizeY: boundingClientRectCanvas.height,
			boundingClientRectCanvas: undefined,
		});
	};

	const onDrag = (event) => {
		if (isResizeable.value === false || ("touches" in event && event.touches.length > 1)) {
			return;
		}
		event.preventDefault();

		width.value = getDimensionX(event, boundingClientRectCanvas);
		height.value = getDimensionY(event, boundingClientRectCanvas);
	};

	onMounted(() => {
		boundingClientRectCanvas = canvas.value.getBoundingClientRect();
		pixelGraphic = new PixelGraphics({
			divCanvas: canvas.value,
			pixelSize: pixelSize.value,
			imageFunction: imageFunctionTeiresias,
		});

		redraw();
	});

	onUpdated(redraw);

	return {
		onDrag,
		width,
		height,
		pixelSize,
		isResizeable,
	};
};
