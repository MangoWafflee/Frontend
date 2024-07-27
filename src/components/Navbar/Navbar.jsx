import React from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";
import { ReactComponent as HomeSVG } from "../../assets/icons/Home.svg";
import { ReactComponent as FriendSVG } from "../../assets/icons/Friend.svg";
import { ReactComponent as CameraSVG } from "../../assets/icons/Camera.svg";
import { ReactComponent as ChallengeSVG } from "../../assets/icons/Challenge.svg";
import { ReactComponent as UserSVG } from "../../assets/icons/User.svg";
import { ReactComponent as SelectedHomeSVG } from "../../assets/icons/SelectedHome.svg";
import { ReactComponent as SelectedFriendSVG } from "../../assets/icons/SelectedFriend.svg";
import { ReactComponent as SelectedCameraSVG } from "../../assets/icons/SelectedCamera.svg";
import { ReactComponent as SelectedChallengeSVG } from "../../assets/icons/SelectedChallenge.svg";
import { ReactComponent as SelectedUserSVG } from "../../assets/icons/SelectedUser.svg";

export default function Navbar() {
	return (
		<nav className="nav_container">
			<ul className="nav_bar">
				<li>
					<NavLink
						to="/app"
						className="nav-link"
						isActive={(match) => {
							return match !== null;
						}}
					>
						{({ isActive }) =>
							isActive ? <SelectedHomeSVG /> : <HomeSVG />
						}
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/friend"
						className="nav-link"
						isActive={(match) => {
							return match !== null;
						}}
					>
						{({ isActive }) =>
							isActive ? <SelectedFriendSVG /> : <FriendSVG />
						}
					</NavLink>
				</li>
        <li>
					<NavLink
						to="/camerarecognition"
						className="nav-link"
						isActive={(match) => {
							return match !== null;
						}}
					>
						{({ isActive }) =>
							isActive ? <SelectedCameraSVG /> : <CameraSVG />
						}
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/challenge"
						className="nav-link"
						isActive={(match) => {
							return match !== null;
						}}
					>
						{({ isActive }) =>
							isActive ? <SelectedChallengeSVG /> : <ChallengeSVG />
						}
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/profile"
						className="nav-link"
						isActive={(match) => {
							return match !== null;
						}}
					>
						{({ isActive }) =>
							isActive ? <SelectedUserSVG /> : <UserSVG />
						}
					</NavLink>
				</li>
				
			</ul>
		</nav>
	);
}
