import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCircleUser,
  faFaceGrinHearts,
  faHouse,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';
import { useCameraStatus } from '../../contexts/CameraStatusContext';

export default function Navbar() {
  const location = useLocation();
  const { setIsCameraActive } = useCameraStatus();

  const allowedPaths = [
    '/app',
    '/friend',
    '/challenge',
    '/camerarecognition',
    '/profile',
  ];

  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  const handleNavClick = (isCameraPage) => {
    setIsCameraActive(isCameraPage);
  };

  return (
    <div className="nav_bar">
      <div>
        <NavLink
          to="/app"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={() => handleNavClick(false)}
        >
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/camerarecognition"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={() => handleNavClick(true)}
        >
          <FontAwesomeIcon icon={faCamera} />
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/friend"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={() => handleNavClick(false)}
        >
          <FontAwesomeIcon icon={faUsers} />
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/challenge"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={() => handleNavClick(false)}
        >
          <FontAwesomeIcon icon={faFaceGrinHearts} />
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={() => handleNavClick(false)}
        >
          <FontAwesomeIcon icon={faCircleUser} />
        </NavLink>
      </div>
    </div>
  );
}
