import { inject } from "@vercel/analytics";

inject();

(() =>
	new window.InitPixel({
		div: document.getElementById("main"),
		// imageName: window.location.hash.substr(1)
	}))();
