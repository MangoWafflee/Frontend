import React from "react";
import "./ProfileEditPage.scss";

import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";

// import { message } from "antd";

export default function ProfileEditPage() {
  const name = "유저";
  const userId = "유저아이디@kakao.com";
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState(UserDefaultImage);

  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

  //     // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    // // Check if passwords match
    // if (password !== passwordConfirm) {
    //   //message.error("비밀번호가 일치하지 않습니다.");
    //   setLoginCheck(true);
    //   return;
    // } else {
    //   setLoginCheck(false);
    // }

    // // Create payload
    // const payload = {
    //   email: email,
    //   nickname: nickname,
    //   password: password,
    // };

    // try {
    //   const response = await fetch(
    //     `${process.env.NODE_ENV === "development" ? "" : ""}${
    //       process.env.REACT_APP_API_URL
    //     }user`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `${token}`,
    //       },
    //       body: JSON.stringify(payload),
    //     }
    //   );
    //   const data = await response.json();
    //   if (response.status === 200) {
    //     // Redirect to login.html
    //     console.log("성공!");
    //     message.success("수정이 완료되었습니다.");
    //   } else if (response.status === 400) {
    //     // Handle error
    //     message.error("수정에 실패하였습니다.");
    //   }
    // } catch (error) {
    //   console.error("오류 발생:", error);
    //   message.error("수정에 실패하였습니다.");
    //   navigate("/user");
    // }

    // if (imageCheck) {
    //   var formData = new FormData();
    //   formData.append("image", image); // 이미지
    //   console.log(formData);
    //   // formData에 이미지와 json을 합친
    //   for (let value of formData.values()) {
    //     if (value instanceof Blob) {
    //       var reader = new FileReader();
    //       reader.onload = function () {
    //         console.log(reader.result); // Blob 내부 데이터를 콘솔에 출력
    //       };
    //       reader.readAsText(value);
    //     } else {
    //       console.log(value);
    //     }
    //   }
    //   fetch(
    //     `${process.env.NODE_ENV === "development" ? "" : ""}${
    //       process.env.REACT_APP_API_URL
    //     }user/image?email=` + email,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `${token}`,
    //       },
    //       body: formData,
    //     }
    //   )
    //     .then((response) => {
    //       if (response.ok) {
    //         setImageCheck(false);
    //         navigate("/user"); // 이미지 업로드 완료 후에 페이지 이동
    //         return response.json(); // JSON 형식의 응답을 파싱
    //       }
    //       throw new Error("네트워크 응답이 실패했습니다.");
    //     })
    //     // .then(data => {
    //     //     alert('서버로 이미지 전송 성공!');
    //     //     setImageCheck(false);
    //     //     navigate("/user");  // 이미지 업로드 완료 후에 페이지 이동
    //     // })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // } else {
    //   navigate("/user");
    // }
    // console.log({ nickname, phoneNumber, password, image });
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      //   setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
      //   setImageCheck(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit">
      <div className="userEdit-image">
        <img src={image} alt="프로필 사진" />
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
        <div className="no-input">{name}</div>

        <label>로그인 된 아이디</label>
        <div className="no-input">{userId}</div>

        <label>닉네임</label>
        <div className="userEdit-nickname">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
      </div>
      <div className="submit-button-container">
        <button className="submit-button">저장하기</button>
      </div>
    </form>
  );
}
