import { inject } from "@vercel/analytics";
import { InitPixel } from "./renderengine/init.js";

inject();

(() =>
	new InitPixel({
		div: document.getElementById("main"),
		// imageName: window.location.hash.substr(1)
	}))();
