import { faAngleLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  matchPath,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./Header.scss";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = useParams();

  const goBack = () => {
    navigate(-1);
  };

  const isNotificationPath = matchPath("/app/notification", location.pathname);
  const isSmilePath = matchPath("/profile/smile/:nickname", location.pathname);
  const isEditProfilePath = matchPath("/profile/edit", location.pathname);

  const [scrollY, setScrollY] = useState(false);

  const handleScroll = () => {
    // 스크롤이 Top에서 50px 이상 내려오면 true값을 useState에 넣어줌
    if (window.scrollY >= 50) {
      setScrollY(true);
      // console.log(scrollY);
    } else {
      // 스크롤이 50px 미만일경우 false를 넣어줌
      setScrollY(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); //clean up
    };
  }, []);

  useEffect(() => {
    if (scrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(scrollY);
  }, [scrollY]);

  return (
    <div className={`header ${isVisible ? "visible" : "hidden"}`}>
      {isNotificationPath || isSmilePath || isEditProfilePath ? (
        <div className="icon-back">
          <NavLink to="#" className="nav-link" onClick={goBack}>
            <FontAwesomeIcon icon={faAngleLeft} />
            &nbsp;&nbsp;
            {isNotificationPath
              ? "알림"
              : isSmilePath
              ? `😆 ${nickname}님의 웃음`
              : "프로필 수정"}
          </NavLink>
        </div>
      ) : (
        <div className="logo">😆SmileHub</div>
      )}
      <div className="icon-bell">
        <NavLink
          to="/app/notification"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FontAwesomeIcon icon={faBell} />
        </NavLink>
      </div>
    </div>
  );
}
