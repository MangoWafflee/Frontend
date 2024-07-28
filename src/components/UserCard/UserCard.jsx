import React from "react";

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";

export default function UserCard({ userName, userImg, userNickname }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={userImg}
        alt={userNickname}
      />
      <CardHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "5px",
          paddingTop: "5px",
        }}
        avatar={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={userImg}
              aria-label={userName}
              sx={{ width: 36, height: 36, marginRight: "5px" }}
            >
              <Typography sx={{ fontSize: "0.875rem" }}>
                {userName[0]}
              </Typography>
            </Avatar>
            {/* <Typography
              color="text.secondery"
              sx={{ fontSize: "0.85rem", textAlign: "left" }}
              noWrap
            >
              {userName}
            </Typography> */}
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
                {userName}
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
                {userNickname}
              </Typography>
            </div>
          </Box>
        }
      />
    </Card>
  );
}
