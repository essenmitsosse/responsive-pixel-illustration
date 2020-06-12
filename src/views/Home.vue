<template>
	<div class="home">
		<input type="range" min="0" max="1" step="0.0001" v-model="width">
		<input type="range" min="0" max="1" step="0.0001" v-model="height">
		<input type="range" min="2" max="12" step="1" v-model="pixelSize">
		<input type="checkbox" v-model="isResizeable">
		<div class="wrapper-canvas">
			<canvas class="canvas"/>
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
			isResizeable: false,
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
				isResizeable: this.isResizeable,
			});
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
