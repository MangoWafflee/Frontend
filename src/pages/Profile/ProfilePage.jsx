import React from "react";
import "./ProfilePage.scss";

import { Divider } from "@mui/material";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";

export default function ProfilePage() {
  const navigate = useNavigate();

  const uid = localStorage.getItem("uid");
  let token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: "유저",
    nickname: "유저닉네임",
    image: UserDefaultImage,
    id: "유저아이디@kakao.com",
  });

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      let url = `https://mango.angrak.cloud/user/uid/${uid}`; // URL 확인
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setUser({
            ...user,
            name: data.name,
            nickname: data.nickname,
            image: data.image,
            id: data.id,
          });
        } else if (response.status === 404) {
          console.log("검색 결과가 없습니다.");
        } else {
          console.log("서버 오류");
        }
      } catch (error) {
        console.error("데이터 요청 오류:", error);
      }
    };

    fetchData();
  }, [token]);

  const [smileCount, setSmileCount] = useState(0);
  // 웃음횟수 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const encodedNickname = encodeURIComponent(user.nickname);
      const url = `https://mango.angrak.cloud/smile/user/${encodedNickname}`; // URL 확인

      console.log("Encoded URL:", url); // URL 확인

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setSmileCount(data.length);
        } else if (response.status === 404) {
          console.log("검색 결과가 없습니다.");
        } else {
          console.log("서버 오류");
        }
      } catch (error) {
        console.error("데이터 요청 오류:", error);
      }
    };

    fetchData();
  }, [user.nickname]);

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
          <p>0</p>
        </div>
        <div>
          <h2>😊웃은 횟수</h2>
          <p>{smileCount}</p>
        </div>
      </div>

      <Divider />

      <div className="profile-btn-container">
        <Link to="/profile/edit" className="user-link">
          <button className="edit-profile-btn">
            <span role="img" aria-label="pencil">
              📝 나의 프로필 수정
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
        <Link to={`/profile/smile/${user.nickname}`} className="user-link">
          <button className="chattingList-btn">
            <span role="img" aria-label="conversation">
              😊 나의 웃음 기록
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
        <Link
          to={`/profile/achievement/${user.nickname}`}
          className="user-link"
        >
          <button className="edit-profile-btn">
            <span role="img" aria-label="pencil">
              🏅 나의 챌린지 기록
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
