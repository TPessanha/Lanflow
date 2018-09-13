import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Home } from "./components/Home";

render(
	<AppContainer>
		<Home compiler="TypeScript" framework="React" />
	</AppContainer>,
	document.getElementById("root")
);
