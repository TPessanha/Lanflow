import React from "react";
import { Route, Switch } from "react-router-dom";
import * as style from "../styles/AppStyle.scss";
import Home from "./Home";
import Notifications from "./Notifications";
import RemoteFile from "./RemoteFile";
export default class Main extends React.Component {
	public render() {
		return (
			<div className={style.content}>
				<Switch>
					<Route exact={true} path="/" component={Home} />
					<Route
						exact={true}
						path="/remotefile"
						component={RemoteFile}
					/>
					<Route
						exact={true}
						path="/notifications"
						component={Notifications}
					/>
				</Switch>
			</div>
		);
	}
}
