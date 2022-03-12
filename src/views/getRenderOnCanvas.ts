import { ref, onMounted, onUpdated, Ref } from "vue";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
// import { graien } from "../responsivePixel/scripts/graien";
import { imageFunctionTeiresias } from "../responsivePixel/scripts/teiresias";
import { getDimensionX, getDimensionY } from "./getDimension";

export const getRenderOnCanvas = (canvas: Ref<HTMLCanvasElement | null>) => {
	const width = ref(1);
	const height = ref(1);
	const pixelSize = ref(5);
	const isResizeable = ref(true);
	let boundingClientRectCanvas: DOMRect | null = null;
	let pixelGraphic: PixelGraphics | null = null;

	const redraw = () => {
		if (pixelGraphic === null || boundingClientRectCanvas === null) {
			return;
		}
		pixelGraphic.redraw({
			widthFactor: width.value,
			heightFactor: height.value,
			pixelSize: pixelSize.value,
			sizeX: boundingClientRectCanvas.width,
			sizeY: boundingClientRectCanvas.height,
		});
	};

	const onDrag = (event: MouseEvent | TouchEvent) => {
		if (
			isResizeable.value === false ||
			("touches" in event && event.touches.length > 1) ||
			boundingClientRectCanvas === null
		) {
			return;
		}
		event.preventDefault();

		width.value = getDimensionX(event, boundingClientRectCanvas);
		height.value = getDimensionY(event, boundingClientRectCanvas);
	};

	onMounted(() => {
		if (canvas.value === null) {
			return;
		}
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
