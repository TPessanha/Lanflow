import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { RemoteFile } from "./RemoteFile";

export const Main = () => (
	<main>
		<Switch>
			<Route exact={true} path="/" component={Home} />
			<Route exact={true} path="/remotefile" component={RemoteFile} />
		</Switch>
	</main>
);
