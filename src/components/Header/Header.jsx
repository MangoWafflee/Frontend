import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { faAngleLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Header.scss";

export default function Header({ forceRedirect }) {
  let navigate = useNavigate();

  let goBack = () => {
    navigate(-1);
  };

  return (
    <div className="header">
      <div className="icon-back">
        <NavLink
          to="#"
          className="nav-link"
          onClick={forceRedirect ? () => {} : goBack}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </NavLink>
      </div>
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
  );
}
