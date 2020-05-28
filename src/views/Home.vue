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
