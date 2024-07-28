import React, { useState } from "react";
import "./FriendPage.scss";
// import { ReactComponent as SearchSVG } from "../../assets/icons/Search.svg";
// import { ReactComponent as AddFriendSVG } from "../../assets/icons/AddFriend.svg";

import { Avatar, Box, Divider, Typography } from "@mui/material";
import { useRef } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import UserCard from "../../components/UserCard/UserCard";

export default function FriendPage() {
  const [searchText, setSearchText] = useState(""); // 검색창 값
  const [searchUserName, setSearchUserName] = useState(""); // 검색한 유저 이름
  const [searchUserImg, setSearchUserImg] = useState(""); // 검색한 유저 이미지
  const [searchUserNickname, setSearchUserNickname] = useState(""); // 검색한 유저 닉네임

  //   const [friendList, setFriendList] = useState(null);
  // 더미데이터
  const friendList = [
    {
      userName: "손흥민",
      userNickname: "son",
      userImg: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
    },
    {
      userName: "이상현",
      userNickname: "sang",
      //   userImg: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
    },
    {
      userName: "박지성",
      userNickname: "ji",
      userImg: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
    },
  ];

  function searchFunction(e) {
    e.preventDefault();
    setSearchText(searchText);
    console.log("검색어:", searchText);

    // 더미데이터
    setSearchUserName("손흥민");
    setSearchUserImg("https://cdn-icons-png.flaticon.com/512/4715/4715329.png");
    setSearchUserNickname("son");

    setIsModalOpen(!isModalOpen); // 모달 열기/닫기 토글
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

  const handleFriendClick = (nickname) => {
    setSearchText(nickname);

    // 더미데이터
    setSearchUserName("손흥민");
    setSearchUserImg("https://cdn-icons-png.flaticon.com/512/4715/4715329.png");
    setSearchUserNickname("son");

    setIsModalOpen(!isModalOpen); // 모달 열기/닫기 토글
  };

  return (
    <div className="friend-page">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSubmit={searchFunction}
      />

      <div className="friend-list">
        <div className="friend-list-bar">
          <h3
            style={{
              fontWeight: "bold",
              color: "black",
              marginBottom: "0.2rem",
            }}
          >
            친구
          </h3>
          <Divider />
        </div>
        {friendList !== null &&
          friendList.map((result, index) => (
            <div
              className="friend"
              key={index}
              onClick={() => handleFriendClick(result.userNickname)}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", margin: "0.5rem" }}
              >
                <Avatar
                  src={result.userImg}
                  aria-label={result.userName}
                  sx={{ width: 45, height: 45 }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>
                    {result.userName[0]}
                  </Typography>
                </Avatar>
                <div className="friend-info">
                  <Typography
                    color="text.primary"
                    sx={{
                      fontSize: "0.9rem",
                      textAlign: "left",
                      marginLeft: "1rem",
                      fontWeight: "bold",
                    }}
                    noWrap
                  >
                    {result.userName}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: "0.8rem",
                      textAlign: "left",
                      marginLeft: "1rem",
                    }}
                    noWrap
                  >
                    {result.userNickname}
                  </Typography>
                </div>
              </Box>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="modal-background" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <UserCard
                userName={searchUserName}
                userImg={searchUserImg}
                userNickname={searchUserNickname}
              ></UserCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
