<template>
	<div class="home">
		<input type="range" min="0" max="1" step="0.0001" v-model="width">
		<input type="range" min="0" max="1" step="0.0001" v-model="height">
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
			renderEngine: undefined,
		};
	},
	watch: {
		width() { this.redraw(); },
		height() { this.redraw(); },
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
				pixelSize: 2,
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
