import React from "react";
import { Avatar, Box, Typography, Button } from "@mui/material";

const FriendItem = ({ friend, onFollowRequest, onClick }) => {
  if (!friend || !friend.userId || !friend.userName || !friend.userImage) {
    return null;
  }

  const { userId, userName, userImage, userNickname, isRequest, isFollowing } =
    friend;

  const handleFollowRequest = (e) => {
    e.stopPropagation();
    onFollowRequest(userId);
  };

  const getButtonText = () => {
    if (isFollowing) return "팔로잉";
    if (isRequest) return "요청됨";
    return "팔로우";
  };

  const getButtonColor = () => {
    if (isFollowing) return "gray";
    if (isRequest) return "gray";
    return "primary.main";
  };

  return (
    <div className="friend" onClick={onClick}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "0.5rem",
        }}
      >
        <Avatar
          src={friend.userImage}
          aria-label={friend.userName}
          sx={{ width: 45, height: 45 }}
        >
          <Typography sx={{ fontSize: "1rem" }}>
            {friend.userName[0]}
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
            {friend.userName}
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
            {friend.userNickname}
          </Typography>
        </div>
        <Button
          onClick={handleFollowRequest}
          sx={{
            marginLeft: "auto",
            color: getButtonColor(),
            borderColor: getButtonColor(),
            borderWidth: 1,
            borderRadius: 50,
            borderStyle: "solid",
            "&:hover": {
              borderColor: getButtonColor(),
            },
          }}
          disabled={isRequest || isFollowing}
        >
          {getButtonText()}
        </Button>
      </Box>
    </div>
  );
};

export default FriendItem;
