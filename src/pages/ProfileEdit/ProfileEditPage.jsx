import React from "react";
import "./ProfileEditPage.scss";

import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";

// import { message } from "antd";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const uid = localStorage.getItem("uid");
  let token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: "유저",
    nickname: "유저닉네임",
    image: UserDefaultImage,
    id: "유저아이디@kakao.com",
  });

  const [previewImage, setPreviewImage] = useState(UserDefaultImage);

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
          setPreviewImage(data.image);
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

  // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");

    var formData = new FormData();
    formData.append("image", user.image); // 이미지
    console.log(formData);

    // formData에 이미지와 json을 합친
    for (let value of formData.values()) {
      if (value instanceof Blob) {
        var reader = new FileReader();
        reader.onload = function () {
          console.log(reader.result); // Blob 내부 데이터를 콘솔에 출력
        };
        reader.readAsText(value);
      } else {
        console.log(value);
      }
    }

    fetch(`https://mango.angrak.cloud/user/user/${uid}`, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          navigate("/profile"); // 이미지 업로드 완료 후에 페이지 이동
          return response.json(); // JSON 형식의 응답을 파싱
        }
        throw new Error("네트워크 응답이 실패했습니다.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setUser({
        ...user,
        image: e.target.files[0],
      });
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit">
      <div className="userEdit-image">
        <img src={previewImage} alt="프로필 사진" />
        <label className="edit-icon">
          <FontAwesomeIcon icon={faCamera} />
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="userEdit-info-container">
        <label>이름</label>
        <div className="no-input">{user.name}</div>

        <label>로그인 된 아이디</label>
        <div className="no-input">{user.id}</div>

        <label>닉네임</label>
        <div className="userEdit-nickname">
          <input
            type="text"
            value={user.nickname}
            onChange={(e) =>
              setUser({
                ...user,
                nickname: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="submit-button-container">
        <button className="submit-button">저장하기</button>
      </div>
    </form>
  );
}
