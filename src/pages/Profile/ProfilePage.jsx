import React from "react";
import "./ProfilePage.scss";

import { Divider } from "@mui/material";
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "유저",
    nickname: "유저닉네임",
    image: UserDefaultImage,
    id: "유저아이디@kakao.com",
  });

  const handleLogout = () => {
    const KakaoLogout = async () => {
      const response = await fetch(
        `https://kapi.kakao.com/v1/user/logout?target_id_type=user_id&target_id=${localStorage.getItem(
          "kakaoUserId"
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `KakaoAK b2077c53d402d3e5755993907e3cc0e9`,
          },
          body: JSON.stringify({
            target_id_type: "user_id",
            target_id: localStorage.getItem("kakaoUserId"),
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("로그아웃한 아이디" + result.id);
      } else {
        console.log("실패");
        console.log(response.status);
      }
    };
    KakaoLogout();

    // 로그아웃 처리 로직을 구현합니다.
    message.success("로그아웃 되었습니다.");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("storeid");
    localStorage.removeItem("RefreshToken");

    // 페이지 이동
    navigate("/");
  };

  return (
    <div id="profile-page">
      <div className="profile-section">
        <div className="profile-image">
          <img src={user.image} alt="프로필 사진" />
        </div>
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>{user.nickname}</p>
          <p>{user.id}</p>
        </div>
      </div>

      <div className="user-point">
        <div>
          <h2>🏅획득 배지</h2>
          <p>11</p>
        </div>
        <div>
          <h2>😊웃은 횟수</h2>
          <p>100</p>
        </div>
      </div>

      <Divider />

      <div className="profile-btn-container">
        <Link to="/profile/edit" className="user-link">
          <button className="edit-profile-btn">
            <span role="img" aria-label="pencil">
              ✏️ 나의 회원정보 수정
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
        <Link to="/profile/smile" className="user-link">
          <button className="chattingList-btn">
            <span role="img" aria-label="conversation">
              📝 나의 웃음 기록
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
      </div>

      <div className="user-logout-btn-container">
        <button className="user-logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
