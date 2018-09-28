import React from "react";
import { Link } from "react-router-dom";
import * as style from "../styles/SideBarStyle.scss";

//Assets
import NotificationIcon from "../assets/img/notification.svg";

// The SideBar creates links that can be used to navigate
// between routes.
export default class SideBar extends React.Component {
	public render() {
		return (
			<div className={style.sideNav}>
				<div className={style.sideNavHeader}>
					<Link to="/">
						<h1 className={style.sideNavTitle}>
							Lan
							<strong>Flow</strong>
						</h1>
					</Link>
					<Link to="/notifications">
						<NotificationIcon className={style.sideNavIcon} />
						<span className={style.notificationBadge}>20</span>
					</Link>
				</div>
				<hr className={style.sideNavSeparator} />
				<div>
					<ul
						style={{
							listStyle: "none",
							marginTop: "-10px",
							padding: "0px"
						}}
					>
						<li>
							<Link className={style.sideNavItem} to="/">
								Home
							</Link>
						</li>
						<li>
							<Link
								className={style.sideNavItem}
								to="/remotefile"
							>
								Remote file
							</Link>
						</li>
						<li>
							<Link
								className={style.sideNavItem}
								to="/notifications"
							>
								Notifications
							</Link>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
