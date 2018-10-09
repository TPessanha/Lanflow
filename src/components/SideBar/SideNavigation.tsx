import React from "react";
import { Link } from "react-router-dom";
import * as style from "./SideBarStyle.scss";

//Assets
import NotificationIcon from "../../assets/img/notification.svg";
export interface ISideNavigationProps {
    homePath: string;
    notificationsPath: string;
    sideTitle: JSX.Element;
}

export default class SideNavigation extends React.Component<ISideNavigationProps> {
	public render() {
		return (
			<div className={style.sideNav}>
				<div className={style.sideNavHeader}>
					<Link to={this.props.homePath} 
						style={{
							textDecoration: "none"
						}}>
						<h1 className={style.sideNavTitle}>
							{this.props.sideTitle}
						</h1>
					</Link>
					<Link to={this.props.notificationsPath}>
						<NotificationIcon
							className={style.sideNavNotificationIcon}
						/>
						<span className={style.notificationBadge}>20</span>
					</Link>
				</div>
				<hr className={style.sideNavSeparator} />
				<div>
                    {this.props.children}
				</div>
			</div>
		);
	}
}
