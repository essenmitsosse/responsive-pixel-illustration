<template>
	<div class="home">
		<div id="main"></div>
	</div>
</template>

<script>
import { InitPixel } from "@/responsivePixel/renderengine/init";

export default {
	name: 'Home',
	components: {},
	mounted() {
		new InitPixel({
			div: document.getElementById("main"),
		});
	}
}
</script>

<style lang="scss">
	#main {
		width: 100vw;
		height: 75vh;
		position: relative;

		& > * {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
