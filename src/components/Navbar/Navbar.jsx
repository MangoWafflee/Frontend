import React from "react";
import { NavLink } from "react-router-dom";
// import { ReactComponent as HomeSVG } from "../../assets/icons/Home.svg";
import "./Navbar.scss";

import {
  faCamera,
  faCircleUser,
  faFaceGrinHearts,
  faHouse,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
  return (
    // <div className="nav_container">
    <div className="nav_bar">
      <div>
        <NavLink to="/app" className="nav-link" activeClassName="active">
          {/* <HomeSVG /> */}
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
      </div>
      <div>
        <NavLink to="/friend" className="nav-link" activeClassName="active">
          {/* 친구 */}
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </NavLink>
      </div>
      <div>
        <NavLink to="/challenge" className="nav-link" activeClassName="active">
          {/* 뱃지 */}
          <FontAwesomeIcon icon={faFaceGrinHearts} />
        </NavLink>
      </div>

      <div>
        <NavLink
          to="/camerarecognition"
          className="nav-link"
          activeClassName="active"
        >
          {/* 카메라 */}
          <FontAwesomeIcon icon={faCamera} />
        </NavLink>
      </div>
      <div>
        <NavLink to="/profile" className="nav-link" activeClassName="active">
          {/* 프로필 */}
          <FontAwesomeIcon icon={faCircleUser} />
        </NavLink>
      </div>
    </div>
    // </div>
  );
}
