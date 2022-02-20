<template>
	<div class="home">
		<input v-model="width" type="range" min="0" max="1" step="0.0001" />
		<input v-model="height" type="range" min="0" max="1" step="0.0001" />
		<input v-model="pixelSize" type="range" min="2" max="12" step="1" />
		<input v-model="isResizeable" type="checkbox" />
		<div class="wrapper-canvas">
			<canvas ref="canvas" class="canvas" @mousemove="onDrag" @touchmove="onDrag" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import { PixelGraphics } from "../responsivePixel/PixelGraphics";
// eslint-disable-next-line no-unused-vars
import { graien } from "../responsivePixel/scripts/graien";
import { imageFunctionTeiresias } from "../responsivePixel/scripts/teiresias";
import { getDimensionX, getDimensionY } from "./getDimension";

const width = ref(1);
const height = ref(1);
const pixelSize = ref(5);
const isResizeable = ref(true);
const canvas = ref(null);
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
</script>

<style scoped>
.wrapper-canvas {
	width: 100%;
	height: 75vh;
	position: relative;
}

.canvas {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
</style>
