import React from 'react';
import './Navbar.scss';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeSVG } from "../../assets/icons/Home.svg";
import { ReactComponent as SelectedHomeSVG } from "../../assets/icons/SelectedHome.svg";

export default function Navbar() {
  return (
    <nav className="nav_container">
      <ul className="nav_bar">
        <li>
          <NavLink
            to="/app"
            className="nav-link"
            activeClassName="active"
          >
            <HomeSVG/>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/friend"
            className="nav-link"
            activeClassName="active"
          >
            친구
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/challenge"
            className="nav-link"
            activeClassName="active"
          >
            챌린지
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className="nav-link"
            activeClassName="active"
          >
            프로필
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/camerarecognition"
            className="nav-link"
            activeClassName="active"
          >
            카메라
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
