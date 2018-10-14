import React, { cloneElement/*, ReactChild*/, ReactElement } from "react";
import { Link } from "react-router-dom";
import * as style from "./SideBarStyle.scss";

//import matchComponent from "../MatchComponent";

//Assets
import NotificationIcon from "../../assets/img/notification.svg";
import SideNavigationItem from "./SideNavigationItem";

// import * as Logger from "../../../src/scripts/utils/Logger";

// const LOGGER = Logger.getLogger();
export interface ISideNavigationProps {
	homePath: string;
	notificationsPath: string;
	sideTitle: JSX.Element;
	componentType?: any;
}

interface ISideNavigationState {
	selectedItem: string;
	isExpanded: boolean;
}

export default class SideNavigation extends React.Component<
	ISideNavigationProps,
	ISideNavigationState
> {

	constructor(props: Readonly<ISideNavigationProps>) {
		super(props);
		this.state = {
			selectedItem: props.homePath,
			isExpanded: true
		};
	}

	public onSelect = (item: string) => {
		this.setState({ selectedItem: item });
	}

	public onToggleExpand = (expand: boolean) => {
		this.setState({ isExpanded: expand });
	}

	public render() {
		const { selectedItem, isExpanded } = this.state;

		return (
			<div className={style.sideNav}>
				<div className={style.sideNavHeader}>
					<Link
						to={this.props.homePath}
						style={{
							textDecoration: "none"
						}}
					>
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
					{React.Children.map(this.props.children, child => {
						if (React.isValidElement(child)) {
							return this.renderSideNavigationItem(
								(child as unknown) as SideNavigationItem,
								selectedItem,
								isExpanded
							);
						}
						else {
							return child;
						}
					})}
				</div>
			</div>
		);
	}

	// private isNavItem(child: ReactChild) {
	// 	return matchComponent(SideNavigationItem, child);
	// }

	private renderSideNavigationItem(child: SideNavigationItem, item: string, expanded: boolean) {
		//LOGGER.info("Child: " + child.props.itemText + "- SelectedItem: " + item + " - isExpanded: " + expanded);
		return cloneElement(((child as unknown) as ReactElement<{selectedItem: string; isExpanded: boolean; onItemSelect: any;}>), {
			selectedItem: item,
			isExpanded: expanded,
			onItemSelect: (selected: string) => {
				this.setState({ selectedItem: selected });
				this.onSelect(selected);
			}
        });
	}

}