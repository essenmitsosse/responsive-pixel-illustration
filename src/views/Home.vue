<template>
	<div class="home">
		<input type="range" min="0" max="1" step="0.0001" v-model="width">
		<input type="range" min="0" max="1" step="0.0001" v-model="height">
		<input type="range" min="2" max="12" step="1" v-model="pixelSize">
		<input type="checkbox" v-model="isResizeable">
		<div class="wrapper-canvas">
			<canvas class="canvas"
				ref="canvas"
				@mousemove="onDrag"
				@touchmove="onDrag"
			/>
		</div>
	</div>
</template>

<script>
import { PixelGraphics } from '@/responsivePixel/PixelGraphics';
import { graien } from '@/responsivePixel/scripts/graien';
import { imageFunctionTeiresias } from '@/responsivePixel/scripts/teiresias';

export default {
	name: 'Home',
	components: {},
	data() {
		return {
			width: 1,
			height: 1,
			pixelSize: 5,
			isResizeable: true,
			pixelGraphic: undefined,
		};
	},
	watch: {
		width() { this.redraw(); },
		height() { this.redraw(); },
		pixelSize() { this.redraw(); },
		isResizeable() { this.redraw(); },
	},
	mounted() {
		this.boundingClientRectCanvas = this.$refs.canvas.getBoundingClientRect();

		this.pixelGraphic = new PixelGraphics({
			divCanvas: document.getElementsByClassName('canvas')[0],
			pixelSize: this.pixelSize,
			imageFunction: imageFunctionTeiresias,
		});

		this.redraw();
	},
	methods: {
		redraw() {
			this.pixelGraphic.redraw({
				widthFactor: this.width,
				heightFactor: this.height,
				pixelSize: this.pixelSize,
				sizeX: this.boundingClientRectCanvas.width,
				sizeY: this.boundingClientRectCanvas.height,
				boundingClientRectCanvas: undefined,
			});
		},
		getEventX(event) {
			return ('clientX' in event ? event.clientX : event.touches[0].clientX) || 0;
		},
		getEventY(event) {
			return ('clientY' in event ? event.clientY : event.touches[0].clientY) || 0;
		},
		getPosXCanvas(event) {
			return this.getEventX(event) - this.boundingClientRectCanvas.x;
		},
		getPosYCanvas(event) {
			return this.getEventY(event) - this.boundingClientRectCanvas.y;
		},
		onDrag(event) {
			if (!this.isResizeable) { return; }
			if ('touches' in event && event.touches.length > 1) { return; }
			event.preventDefault();
			const clientX = this.getPosXCanvas(event);
			const clientY = this.getPosYCanvas(event);

			this.width = Math.abs(
				(clientX - this.boundingClientRectCanvas.width / 2)
				/ (this.boundingClientRectCanvas.width / 2),
			);

			this.height = Math.abs(
				(clientY - this.boundingClientRectCanvas.height / 2)
				/ (this.boundingClientRectCanvas.height / 2),
			);
		},
	},
};
</script>

<style lang="scss">
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
