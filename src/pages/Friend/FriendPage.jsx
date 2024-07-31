import { Divider, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";
import SearchBar from "../../components/SearchBar/SearchBar";
import FriendItem from "./FriendItem";
import "./FriendPage.scss";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Friend Page API연결 test버전
export default function FriendPage() {
  const [searchText, setSearchText] = useState(""); // 검색창 값
  const [searchUserName, setSearchUserName] = useState(""); // 검색한 유저 이름
  const [searchUserImage, setSearchUserImage] = useState(""); // 검색한 유저 이미지
  const [searchUserNickname, setSearchUserNickname] = useState(""); // 검색한 유저 닉네임

  const [userId, setUserId] = useState(4); // 현재 로그인한 사용자의 ID
  const [userDummyData, setUserDummyData] = useState([
    {
      userId: 7,
      userName: "손흥민",
      userNickname: "son",
      userImage: "UserDefaultImagDefaultImage",
      isRequest: false,
      isFollowing: false,
    },
    {
      userId: 23,
      userName: "마마",
      userNickname: "sang",
      userImage: "UserDefaultImagDefaultImage",
      isRequest: false,
      isFollowing: false,
    },
    {
      userId: 13,
      userName: "박지성",
      userNickname: "ji",
      userImage: "UserDefaultImagDefaultImage",
      isRequest: false,
      isFollowing: false,
    },
  ]);

  const handleButtonClick = async (user) => {
    const { userId: receiverId, isRequest, isFollowing } = user;
    if (!isRequest && !isFollowing) {
      await handleFollowRequest(receiverId);
    } else if (isRequest && !isFollowing) {
      console.log("이미 팔로우 요청을 보냈습니다.");
    } else if (isFollowing) {
      // isFollowing == false 로 업데이트
      await handleUnfollow(receiverId);
    } else {
      console.error("알 수 없는 상태입니다.");
    }
  };

  // 팔로우 요청 함수
  const handleFollowRequest = async (receiverId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/follow/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`팔로우 요청 실패: ${errorResponse}`);
      }

      const updatedUserDummyData = userDummyData.map((user) => {
        if (user.userId === receiverId) {
          return { ...user, isRequest: true };
        }
        return user;
      });

      setUserDummyData(updatedUserDummyData);

      console.log(`${receiverId}님께 팔로우를 요청합니다.`);
    } catch (error) {
      console.error(error.message);
    }
  };

  // 언팔로우 함수
  const handleUnfollow = async (receiverId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/follow/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`언팔로우 실패: ${errorResponse}`);
      }

      // 언팔로우 상태 업데이트
      const updatedUserDummyData = userDummyData.map((user) =>
        user.userId === receiverId ? { ...user, isFollowing: false } : user
      );
      setUserDummyData(updatedUserDummyData);
    } catch (error) {
      console.error(error.message);
    }
  };

  function searchFunction(e) {
    e.preventDefault();
    setSearchText(searchText);
    console.log("검색어:", searchText);

    // 더미데이터를 찾는 로직
    const searchResult = userDummyData.find(
      (user) => user.userName === searchText || user.userNickname === searchText
    );
    if (searchResult) {
      setSearchUserName(searchResult.userName);
      setSearchUserImage(searchResult.userImage);
      setSearchUserNickname(searchResult.userNickname);
      setIsModalOpen(true); // 모달 열기
    } else {
      alert("검색 결과가 없습니다.");
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태

  // 모달 밖을 클릭했을 때 모달을 닫는 기능 추가
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      // 모달이 아닌 부분을 클릭했을 때 모달이 아래로 사라지는 애니메이션 적용
      modalRef.current.style.animation = "modal-slide-down 0.3s ease forwards";
      setTimeout(() => {
        setIsModalOpen(false); // 애니메이션 종료 후 모달 닫기
        modalRef.current.style.animation = ""; // 애니메이션 초기화
      }, 300); // 애니메이션 지속시간과 동일한 시간으로 설정
    }
  };

  const handleFriendClick = (userId, userNickname, userName, userImage) => {
    setSearchUserName(userName);
    if (userImage === undefined || userImage === null || userImage === "") {
      setSearchUserImage(UserDefaultImage);
    } else {
      setSearchUserImage(userImage);
    }
    setSearchUserNickname(userNickname);
    setIsModalOpen(!isModalOpen); // 모달 열기/닫기 토글
  };

  // 친구 요청 목록 가져오기
  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/follow/findRequestId/${userId}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes("친구 추가 요청 내역을 찾을 수 없습니다.")) {
          setUserDummyData([]);
          // localStorage.setItem("userDummyData", JSON.stringify([]));
          return;
        }
        throw new Error(`서버 응답 오류: ${errorText}`);
      }

      const serverData = await response.json();

      const updatedUserDummyData = userDummyData.map((user) => {
        const request = serverData.find(
          (req) => req.receiver.id === user.userId
        );
        if (request) {
          return { ...user, isRequest: request.status === "PENDING" };
        }
        return user;
      });

      setUserDummyData(updatedUserDummyData);
      // localStorage.setItem(
      //   "userDummyData",
      //   JSON.stringify(updatedUserDummyData)
      // );
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log(userDummyData);
    fetchFriendRequests();
  }, [userId]);

  return (
    <div className="friend-page">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSubmit={(e) => {
          e.preventDefault();
          console.log("검색어:", searchText);
          // 검색 결과 처리 로직 추가
        }}
      />

      <div className="user-list">
        <div className="user-list-bar">
          <h3
            style={{
              fontWeight: "bold",
              color: "black",
              marginBottom: "0.2rem",
            }}
          >
            유저
          </h3>
          <Divider />
        </div>
        {userDummyData.length > 0 ? (
          userDummyData.map((user) => (
            <FriendItem
              key={user.userId}
              friend={user}
              onFollowRequest={() => handleFollowRequest(user.userId)}
              onClick={() => {
                handleButtonClick(user);
              }}
            />
          ))
        ) : (
          <Typography>친구 목록이 비어있습니다.</Typography>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-background" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              {/* <UserCard
                userName={searchUserName}
                userImage={searchUserImage}
                userNickname={searchUserNickname}
                isFriend={isFriend}
                isFriendApply={isFriendApply}
              ></UserCard> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
