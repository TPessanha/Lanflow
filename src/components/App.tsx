import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import RemoteFile from "./RemoteFile";
export default class App extends React.Component {
	public render() {
		return (
			<div>
				<Header />
				<Switch>
					<Route exact={true} path="/" component={Home} />
					<Route
						exact={true}
						path="/remotefile"
						component={RemoteFile}
					/>
				</Switch>
			</div>
		);
	}
}
