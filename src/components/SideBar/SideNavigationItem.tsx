import React from "react";
import { Link } from "react-router-dom";
import * as style from "./SideBarStyle.scss";

import * as Logger from "../../../src/scripts/utils/Logger";
const LOGGER = Logger.getLogger();

export interface ISideNavigationItemProps
	extends React.Props<SideNavigationItem> {
	itemText: string;
	itemIcon: string;
	itemPath: string;
	selectedItem?: string;
	onItemSelect?: any;
	onClick?: any;
}
export interface ISideNavigationItemState {
	selectedItem: string;
	isExpanded: boolean;
}
export default class SideNavigationItem extends React.Component<
	ISideNavigationItemProps,
	ISideNavigationItemState
> {
	constructor(props: Readonly<ISideNavigationItemProps>) {
		super(props);
		this.state = {
			selectedItem: props.selectedItem ? props.selectedItem as string : "",
			isExpanded: false
		};

		this.handleSelect = this.handleSelect.bind(this);
	}

	public render() {
		// LOGGER.info("-------");
		// LOGGER.info("Path: " + this.props.itemPath);
		// LOGGER.info("Unselected: " + style.sideNavItem);
		// LOGGER.info("Selected: " + style.selectedSideNavItem);
		// LOGGER.info("Equal?: " + (this.props.selectedItem === this.props.itemPath));
		// LOGGER.info("Style: " + style);
		return (
			<Link
				className={
					[style.sideNavItem, this.props.selectedItem === this.props.itemPath
						? "selectedSideNavItem"
						: ""].join(" ")
				}
				to={this.props.itemPath}
				onClick={this.handleSelect}
			>
				<p>
					<this.props.itemIcon className={style.sideNavItemIcon} />
					{this.props.itemText}
				</p>
			</Link>
		);
	}

	private handleSelect(event: any) {
		if (this.props) {
			LOGGER.debug("Props: %j", this.props);
			const { onItemSelect, itemPath } = this.props;

			if (onItemSelect) {
				onItemSelect(itemPath, event);
			}
		}
	}
}
