import {
  faCamera,
  faCircleUser,
  faFaceGrinHearts,
  faHouse,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const location = useLocation();
  const allowedPaths = [
    "/app",
    "/friend",
    "/challenge",
    "/camerarecognition",
    "/profile",
  ];

  // 현재 경로가 allowedPaths에 포함되지 않으면 null 반환
  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="nav_bar">
      {/* HomePage */}
      <div>
        <NavLink
          to="/app"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
      </div>

      {/* CameraRecognitionPage */}
      <div>
        <NavLink
          to="/camerarecognition"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FontAwesomeIcon icon={faCamera} />
        </NavLink>
      </div>

      {/* FriendPage */}
      <div>
        <NavLink
          to="/friend"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FontAwesomeIcon icon={faUsers} />
        </NavLink>
      </div>

      {/* ChallengePage */}
      <div>
        <NavLink
          to="/challenge"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FontAwesomeIcon icon={faFaceGrinHearts} />
        </NavLink>
      </div>

      {/* ProfilePage */}
      <div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FontAwesomeIcon icon={faCircleUser} />
        </NavLink>
      </div>
    </div>
  );
}
