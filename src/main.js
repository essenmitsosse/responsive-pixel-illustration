import { inject } from "@vercel/analytics";
import "./renderengine/init.js";
import "./renderengine/info.js";
import "./renderengine/helper.js";
import "./renderengine/pixel.js";
import "./renderengine/creator.js";
import "./renderengine/renderer.js";
import "./renderengine/admin.js";

inject();

(() =>
	new window.InitPixel({
		div: document.getElementById("main"),
		// imageName: window.location.hash.substr(1)
	}))();
