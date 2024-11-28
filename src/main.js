import { inject } from "@vercel/analytics";
import { InitPixel } from "./renderengine/init.js";
import "./renderengine/info.js";
import "./renderengine/helper.js";
import "./renderengine/pixel.js";
import "./renderengine/creator.js";
import "./renderengine/renderer.js";
import "./renderengine/admin.js";

inject();

(() =>
	new InitPixel({
		div: document.getElementById("main"),
		// imageName: window.location.hash.substr(1)
	}))();
