import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Image from "./views/Image";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<Image idImage="tantalos" />} />
					<Route path=":idImage" element={<Image />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root"),
);
