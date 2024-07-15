import React from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="nav_container">
			<ul className="nav_bar">
				<li>
					<NavLink to="/app"  className="nav-link" activeClassName="active">
						홈
					</NavLink>
				</li>
				<li>
					<NavLink to="/friend" className="nav-link" activeClassName="active">
						친구
					</NavLink>
				</li>
				<li>
					<NavLink to="/challenge" className="nav-link" activeClassName="active">
						챌린지
					</NavLink>
				</li>
				<li>
					<NavLink to="/mypage" className="nav-link" activeClassName="active">
						마이
					</NavLink>
				</li>
			</ul>
		</nav>
	);
}
