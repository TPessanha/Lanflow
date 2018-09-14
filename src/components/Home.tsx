import React from "react";
import * as style from "./HomeStyle.scss";

export interface IHomeProps {
	compiler: string;
	framework: string;
}

// 'IHomeProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Home extends React.Component<IHomeProps, {}> {
	public render() {
		return (
			<div>
				<h1 className={style.test}>
					This is the main page!
				</h1>
			</div>
		);
	}
}