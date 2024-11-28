import { inject } from "@vercel/analytics";
import { InitPixel } from "./renderengine/init.js";
import "./renderengine/helper.js";

inject();

(() =>
	new InitPixel({
		div: document.getElementById("main"),
		// imageName: window.location.hash.substr(1)
	}))();
