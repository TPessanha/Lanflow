import React from "react";
import { Link } from "react-router-dom";
import * as style from "./SideBarStyle.scss";
export interface ISideNavigationItemProps {
	itemText: string;
	itemIcon: string;
	itemPath: string;
}
export default class SideNavigationItem extends React.Component<ISideNavigationItemProps> {
	public render() {
		return (
			<Link className={style.sideNavItem} to={this.props.itemPath}>
				<p>
					<this.props.itemIcon className={style.sideNavItemIcon} />
					{this.props.itemText}
				</p>
			</Link>
		);
	}
}
