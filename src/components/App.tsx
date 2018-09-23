import React from "react";
import Main from "./Main";
import SideBar from "./SideBar";
export default class App extends React.Component {
	public render() {
		return (
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex"
				}}
			>
				<SideBar />
				<Main />
			</div>
		);
	}
}
