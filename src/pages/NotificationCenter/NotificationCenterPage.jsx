import { Avatar, Box, Typography } from "@mui/material";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";
import "./NotificationCenterPage.scss";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // Import Korean locale for Day.js
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Initialize Day.js plugins
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale("ko"); // Set Day.js locale to Korean

const getRelativeTime = (dateString) => {
  const koreanTime = dayjs(dateString).tz("Asia/Seoul");
  return koreanTime.fromNow();
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [smileNotifications, setSmileNotifications] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const userId = user ? user.id : 0;

  const fetchNotifications = async () => {
    if (!userId || !token) return;

    setIsLoading(true);
    try {
      const url = `${BACKEND_URL}/follow/received?userId=${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Notifications: ", data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    if (!userId || !token) return;

    setIsLoading(true);
    try {
      const url = `${BACKEND_URL}/follow/list/${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Friends: ", data);
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSmileData = async (nickname) => {
    console.log(`Fetching smile data for ${nickname}`);
    try {
      const url = `${BACKEND_URL}/smile/user/${nickname}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(`Smile data for ${nickname}: `, data);
      return data;
    } catch (error) {
      console.error(`Error fetching smile data for ${nickname}:`, error);
      return [];
    }
  };

  const updateSmileNotifications = async () => {
    console.log("Updating smile notifications...");
    const newSmileNotifications = [];

    for (const friend of friends) {
      console.log(`Fetching smile data for friend: ${friend.nickname}`);
      try {
        const smileData = await fetchSmileData(friend.nickname);
        console.log(`Smile data for ${friend.nickname}: `, smileData);
        if (smileData.length > 0) {
          newSmileNotifications.push(
            ...smileData.map((smile) => ({
              ...smile,
              friendName: friend.name,
              friendNickname: friend.nickname,
              friendImage: friend.image,
            }))
          );
        }
      } catch (error) {
        console.error(
          `Error updating smile notifications for ${friend.nickname}:`,
          error
        );
      }
    }

    if (newSmileNotifications.length > 0) {
      console.log("New Smile Notifications: ", newSmileNotifications);
      setSmileNotifications((prev) => [...prev, ...newSmileNotifications]);
    } else {
      console.log("No new smile notifications.");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/follow/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          requestId: requestId,
          status: "ACCEPTED",
        }),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const responseBody = await response.text();

      if (response.ok) {
        message.success("친구가 되었어요!");
        await fetchFriends(); // 친구 목록 갱신
        await updateSmileNotifications(); // 웃음 알림 갱신

        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.id !== requestId
          )
        );
      } else {
        console.error("Unexpected response body:", responseBody);
      }
    } catch (error) {
      console.error("Error accepting follow request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/follow/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          requestId: requestId,
          status: "REJECTED",
        }),
      });

      const responseBody = await response.text();

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      message.error("팔로우 요청을 거절했어요!");

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== requestId
        )
      );
    } catch (error) {
      console.error("Error rejecting follow request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchNotifications();
      fetchFriends();
      updateSmileNotifications();

      const intervalId = setInterval(() => {
        fetchNotifications();
        updateSmileNotifications();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [userId, token]);

  // 알림 병합 및 정렬
  const combinedNotifications = [
    ...notifications.map((notif) => ({ ...notif, type: "follow" })),
    ...smileNotifications.map((notif) => ({ ...notif, type: "smile" })),
  ].sort(
    (a, b) =>
      new Date(b.requestDate || `${b.date}T${b.time}`) -
      new Date(a.requestDate || `${a.date}T${a.time}`)
  );

  return (
    <div>
      <main>
        {combinedNotifications.length === 0 ? (
          <div className="notifications-empty">
            <h3>아직 알림이 없어요!</h3>
          </div>
        ) : (
          combinedNotifications.map((notification, index) => (
            <div className="notification" key={index}>
              <div className="user-info">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0.5rem",
                  }}
                >
                  <Avatar
                    src={
                      notification.sender?.image ||
                      notification.friendImage ||
                      UserDefaultImage
                    }
                    aria-label={
                      notification.sender?.name || notification.friendName
                    }
                    sx={{ width: 45, height: 45 }}
                  >
                    <Typography sx={{ fontSize: "1rem" }}>
                      {
                        (notification.sender?.name ||
                          notification.friendName)[0]
                      }
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
                      {notification.sender?.name || notification.friendName}
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
                      {notification.sender?.nickname ||
                        notification.friendNickname}
                    </Typography>
                  </div>
                </Box>
                {notification.type === "smile" && (
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: "0.8rem",
                      textAlign: "left",
                      marginLeft: "1.5rem",
                    }}
                    noWrap
                  >
                    친구가 웃었어요!
                  </Typography>
                )}
              </div>

              <div className="button-container">
                <div className="timestamp">
                  {getRelativeTime(
                    notification.requestDate ||
                      `${notification.date}T${notification.time}`
                  )}
                </div>
                {notification.type === "follow" && (
                  <>
                    <button
                      className="accept-button"
                      onClick={() => handleAcceptRequest(notification.id)}
                      disabled={isLoading}
                    >
                      팔로우 수락
                    </button>{" "}
                    <button
                      className="reject-button"
                      onClick={() => handleRejectRequest(notification.id)}
                      disabled={isLoading}
                    >
                      거절
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
