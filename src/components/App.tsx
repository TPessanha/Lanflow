import React from "react";
import { Route, Switch } from "react-router-dom";
import * as style from "../styles/AppStyle.scss";
import Home from "./Home";
import Notifications from "./Notifications";
import RemoteFile from "./RemoteFile";
import SideNavigation from "./SideBar/SideNavigation";

//Assets
import NotificationIcon from "../assets/img/notification.svg";
import SideNavigationItem from "./SideBar/SideNavigationItem";

export default class App extends React.Component {
	public title() {
		return (
			<div>
				Lan
				<strong style={{
					fontWeight: 600,
					color: "hsl(0,0%,11%)"
				}}>Flow</strong>
			</div>
		);
	}

	public render() {
		return (
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex"
				}}
			>
				<SideNavigation
					homePath="/"
					notificationsPath="/notifications"
					sideTitle={this.title()}
				>
					<SideNavigationItem
						itemText="Home"
						itemIcon={NotificationIcon}
						itemPath="/"
					/>
					<SideNavigationItem
						itemText="Remote file"
						itemIcon={NotificationIcon}
						itemPath="/remotefile"
					/>
					<SideNavigationItem
						itemText="Notifications"
						itemIcon={NotificationIcon}
						itemPath="/notifications"
					/>
				</SideNavigation>

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
			</div>
		);
	}
}
