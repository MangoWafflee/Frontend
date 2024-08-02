import React, { useEffect, useState } from "react";
import "./FriendPage.scss";

import { Avatar, Box, Divider, Typography } from "@mui/material";
import { useRef } from "react";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";
import SearchBar from "../../components/SearchBar/SearchBar";
import UserCard from "../../components/UserCard/UserCard";

export default function FriendPage() {
  const [searchText, setSearchText] = useState(""); // 검색창 값
  const [searchUserName, setSearchUserName] = useState(""); // 검색한 유저 이름
  const [searchUserImage, setSearchUserImage] = useState(""); // 검색한 유저 이미지
  const [searchUserNickname, setSearchUserNickname] = useState(""); // 검색한 유저 닉네임
  const [searchUserId, setSearchUserId] = useState(0); // 검색한 유저 아이디

  const [isFriend, setIsFriend] = useState(false); // 친구 여부
  const [isFriendApply, setIsFriendApply] = useState(false); // 친구 요청 수락 여부

  const [friendList, setFriendList] = useState([
    {
      userName: "김지후",
      userNickname: "hu",
      userImage: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
    },
    {
      userName: "이상현",
      userNickname: "sang",
      //   userImage: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
    },
    {
      userName: "김보성",
      userNickname: "bo",
      userImage: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
    },
  ]);

  const uid = localStorage.getItem("uid");
  let token = localStorage.getItem("token");

  //API 요청(친구목록 가져오기)
  useEffect(() => {
    let server = `https://mango.angrak.cloud`;
    let url = `/follow/list/${uid}`; // URL 확인

    const fetchData = async () => {
      const response = await fetch(server + url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 404) {
        console.log(url);
        console.log("검색 결과가 없습니다.");
      }

      if (response.status === 200) {
        const data = await response.json(); // response.json()이 완료될 때까지 기다림

        console.log(url);
        console.log(data);

        setFriendList(data); // 상태 업데이트
      } else {
        console.log("실패");
      }
    };
    fetchData();
  }, [friendList, token]);

  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false); // 친구 모달 열림/닫힘 상태
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // 검색 모달 열림/닫힘 상태

  function searchFunction(e) {
    e.preventDefault();
    setSearchText(searchText);
    console.log("검색어:", searchText);

    // 닉네임에 해당하는 유저 조회
    fetch(`https://mango.angrak.cloud/user/user/nickname/${searchText}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          const data = response.json();
          setSearchUserName(data.name);

          if (
            data.image === undefined ||
            data.image === null ||
            data.image === ""
          ) {
            setSearchUserImage(UserDefaultImage);
          } else {
            setSearchUserImage(data.image);
          }
          setSearchUserNickname(data.nickname);
          setSearchUserId(data.uid);
        }
        throw new Error("네트워크 응답이 실패했습니다.");
      })
      .catch((error) => {
        console.error(error);
      });

    //나중에 존재하는 닉네임인지 확인하는 걸로 바꿔야함
    if (searchText === null || searchText === "") {
      alert("검색어를 입력해주세요.");
    } else {
      setIsSearchModalOpen(!isSearchModalOpen); // 모달 열기/닫기 토글
    }
  }

  // 모달 밖을 클릭했을 때 모달을 닫는 기능 추가
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      // 모달이 아닌 부분을 클릭했을 때 모달이 아래로 사라지는 애니메이션 적용
      modalRef.current.style.animation = "modal-slide-down 0.3s ease forwards";
      setTimeout(() => {
        setIsFriendModalOpen(false); // 애니메이션 종료 후 모달 닫기
        setIsSearchModalOpen(false); // 애니메이션 종료 후 모달 닫기
        modalRef.current.style.animation = ""; // 애니메이션 초기화
      }, 300); // 애니메이션 지속시간과 동일한 시간으로 설정
    }
  };

  const handleFriendClick = (userNickname, userName, userImage) => {
    setSearchUserName(userName);
    if (userImage === undefined || userImage === null || userImage === "") {
      setSearchUserImage(UserDefaultImage);
    } else {
      setSearchUserImage(userImage);
    }
    setSearchUserNickname(userNickname);

    setIsFriendModalOpen(!isFriendModalOpen); // 모달 열기/닫기 토글
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
        {friendList === null || friendList.length === 0 ? (
          <div className="friend-list-empty">
            <h3>친구를 추가해보세요!</h3>
          </div>
        ) : (
          friendList.map((result, index) => (
            <div
              className="friend"
              key={index}
              onClick={() =>
                handleFriendClick(
                  result.userNickname,
                  result.userName,
                  result.userImage
                )
              }
            >
              <Box
                sx={{ display: "flex", alignItems: "center", margin: "0.5rem" }}
              >
                <Avatar
                  src={result.userImage}
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
                      fontSize: "1rem",
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
                      marginLeft: "1.5rem",
                    }}
                    noWrap
                  >
                    {result.userNickname}
                  </Typography>
                </div>
              </Box>
            </div>
          ))
        )}
      </div>
      {isFriendModalOpen && (
        <div className="modal-background" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <UserCard
                userName={searchUserName}
                userImage={searchUserImage}
                userNickname={searchUserNickname}
                isFriend={true}
                isFriendApply={isFriendApply}
              ></UserCard>
            </div>
          </div>
        </div>
      )}
      {isSearchModalOpen && (
        <div className="modal-background" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <UserCard
                userName={searchUserName}
                userImage={searchUserImage}
                userNickname={searchUserNickname}
                isFriend={false}
                isFriendApply={isFriendApply}
              ></UserCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
