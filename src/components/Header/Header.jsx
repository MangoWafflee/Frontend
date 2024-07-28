import React from "react";
import { NavLink } from "react-router-dom";

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Header.scss";

export default function Header() {
  return (
    <header>
      {/* 앱 로고 및 알림 아이콘 */}
      <div className="top_layer">
        <div className="logo">MongoWaffle</div>
        <div className="icon-bell">
          <NavLink
            to="/app/notification"
            className="nav-link"
            activeClassName="active"
          >
            <FontAwesomeIcon icon={faBell} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
