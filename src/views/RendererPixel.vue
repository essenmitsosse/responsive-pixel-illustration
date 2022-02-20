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

<script setup lang="ts">
import { Ref, ref } from "vue";
import { getRenderOnCanvas } from "./getRenderOnCanvas";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

const { onDrag, width, height, pixelSize, isResizeable } = getRenderOnCanvas(canvas);
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
