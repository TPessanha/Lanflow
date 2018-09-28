import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import registerServiceWorker from "./scripts/registerServiceWorker";

render(
	<AppContainer>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AppContainer>,
	document.getElementById("root")
);
registerServiceWorker();
