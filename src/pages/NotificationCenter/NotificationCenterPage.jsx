import { Avatar, Box, Typography } from "@mui/material";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";
import "./NotificationCenterPage.scss";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getRelativeTime = (dateString) => {
  const now = new Date();

  // Convert to Korean time zone
  const requestDate = new Date(dateString);
  const koreanTime = new Date(
    requestDate.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const diffInSeconds = Math.floor((now - koreanTime) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInWeek = secondsInDay * 7;
  const secondsInMonth = secondsInDay * 30;
  const secondsInYear = secondsInDay * 365;

  let result;

  if (diffInSeconds < secondsInMinute) {
    result = "방금 전";
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    result = `${minutes}분 전`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    result = `${hours}시간 전`;
  } else if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    result = `${days}일 전`;
  } else if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    result = `${weeks}주 전`;
  } else if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    result = `${months}개월 전`;
  } else {
    const years = Math.floor(diffInSeconds / secondsInYear);
    result = `${years}년 전`;
  }

  return result;
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
    const newSmileNotifications = [];

    for (const friend of friends) {
      const smileData = await fetchSmileData(friend.nickname);
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
    }

    const existingNotificationKeys = new Set(
      smileNotifications.map(
        (notif) => `${notif.friendNickname}-${notif.date}-${notif.time}`
      )
    );

    const uniqueNewSmileNotifications = newSmileNotifications.filter(
      (notif) =>
        !existingNotificationKeys.has(
          `${notif.friendNickname}-${notif.date}-${notif.time}`
        )
    );

    if (uniqueNewSmileNotifications.length > 0) {
      console.log("New Smile Notifications: ", uniqueNewSmileNotifications);
      setSmileNotifications((prev) => [
        ...prev,
        ...uniqueNewSmileNotifications,
      ]);
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

      const intervalId = setInterval(() => {
        fetchNotifications();
        updateSmileNotifications();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [userId, token]);

  return (
    <div>
      <main>
        {notifications.length === 0 && smileNotifications.length === 0 ? (
          <div className="notifications-empty">
            <h3>아직 알림이 없어요!</h3>
          </div>
        ) : (
          <>
            {notifications
              .slice()
              .reverse()
              .map((notification) => (
                <div className="notification" key={notification.id}>
                  <div className="user-info">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        margin: "0.5rem",
                      }}
                    >
                      <Avatar
                        src={notification.sender.image || UserDefaultImage}
                        aria-label={notification.sender.name}
                        sx={{ width: 45, height: 45 }}
                      >
                        <Typography sx={{ fontSize: "1rem" }}>
                          {notification.sender.name[0]}
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
                          {notification.sender.name}
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
                          {notification.sender.nickname}
                        </Typography>
                      </div>
                    </Box>
                  </div>

                  <div className="button-container">
                    <div className="timestamp">
                      {getRelativeTime(notification.requestDate)}
                    </div>
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
                  </div>
                </div>
              ))}

            {smileNotifications
              .slice()
              .reverse()
              .map((smileNotification, index) => (
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
                        src={smileNotification.friendImage || UserDefaultImage}
                        aria-label={smileNotification.friendName}
                        sx={{ width: 45, height: 45 }}
                      >
                        <Typography sx={{ fontSize: "1rem" }}>
                          {smileNotification.friendName[0]}
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
                          {smileNotification.friendName}
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
                          {smileNotification.friendNickname}
                        </Typography>
                      </div>
                    </Box>
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
                  </div>

                  <div className="button-container">
                    <div className="timestamp">
                      {getRelativeTime(
                        `${smileNotification.date}T${smileNotification.time}`
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
      </main>
    </div>
  );
}
