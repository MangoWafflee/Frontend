import React from "react";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./UserCard.scss";

export default function UserCard({
  userName,
  userImage,
  userNickname,
  isFriend,
  isFriendApply,
}) {
  const navigate = useNavigate();

  const handleFriendApply = () => {
    // 친구 요청 로직을 구현합니다.
    console.log("친구 요청을 보냈습니다.");
  };

  const handleSmileWatch = () => {
    // 웃음 보기 로직을 구현합니다.
    console.log("웃음 보기를 눌렀습니다.");
    navigate(`/profile/smile/${userNickname}`); // 지정된 주소로 이동
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={userImage}
        alt={userNickname}
      />
      <CardContent>
        <div className="user-card-container">
          <div className="user-card-text">
            <Typography
              color="text.primary"
              sx={{
                fontSize: "1.1rem",
                textAlign: "left",
                //   marginLeft: "1rem",
                fontWeight: "bold",
              }}
              noWrap
            >
              {userName}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: "0.9rem",
                textAlign: "left",
                marginLeft: "1rem",
                fontWeight: "bold",
              }}
              noWrap
            >
              {userNickname}
            </Typography>
          </div>
          <div className="user-card-button">
            {isFriend ? (
              <button className="smile-watch-button" onClick={handleSmileWatch}>
                웃음 보기
              </button>
            ) : (
              <button
                className={
                  isFriendApply
                    ? "friend-apply-button requested"
                    : "friend-apply-button"
                }
                onClick={handleFriendApply}
              >
                {isFriendApply ? "요청됨" : "팔로우 요청"}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
