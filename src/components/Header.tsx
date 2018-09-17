import React from "react";
import { Link } from "react-router-dom";

// The Header creates links that can be used to navigate
// between routes.
export default class Header extends React.Component {
	public render() {
		return (
			<header>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/remotefile">Remote file</Link>
						</li>
					</ul>
				</nav>
			</header>
		);
	}
}
