<template>
	<div class="home">
		<input type="range" min="0" max="1" step="0.0001" v-model="width">
		<input type="range" min="0" max="1" step="0.0001" v-model="height">
		<input type="range" min="1" max="12" step="1" v-model="pixelSize">
		<div class="wrapper-canvas">
			<canvas class="canvas"/>
		</div>
	</div>
</template>

<script>
import { RenderEngine } from '@/responsivePixel/RenderEngine';
import graien from '@/responsivePixel/scripts/graien';

export default {
	name: 'Home',
	components: {},
	data() {
		return {
			width: 1,
			height: 1,
			pixelSize: 5,
			renderEngine: undefined,
		};
	},
	watch: {
		width() { this.redraw(); },
		height() { this.redraw(); },
		pixelSize() { this.redraw(); },
	},
	mounted() {
		this.renderEngine = new RenderEngine({
			divCanvas: document.getElementsByClassName('canvas')[0],
			ImageFunction: graien,
		});
	},
	methods: {
		redraw() {
			this.renderEngine.renderer.redraw({
				widthFactor: this.width,
				heightFactor: this.height,
				pixelSize: this.pixelSize,
			});
		},
	},
};
</script>

<style lang="scss">
	.wrapper-canvas {
		width: 100vw;
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
