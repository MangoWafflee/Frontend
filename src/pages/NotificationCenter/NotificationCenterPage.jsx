import { Avatar, Box, Typography } from "@mui/material";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDefaultImage from "../../assets/images/UserDefaultImage.png";
import "./NotificationCenterPage.scss";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getRelativeTime = (dateString) => {
  const now = new Date();
  const requestDate = new Date(dateString);

  // 한국 시간(KST)으로 변환
  const localRequestDate = new Date(
    requestDate.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const diffInSeconds = Math.floor((now - localRequestDate) / 1000);

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

  // 친구요청 리스트 가져오기
  const fetchNotifications = async () => {
    if (!userId || !token) return; // userId와 token이 없으면 함수 종료

    setIsLoading(true);
    try {
      const url = `${BACKEND_URL}/follow/received?userId=${userId}`;
      console.log("Fetch URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 친구 요청 수락
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
        // 알림 리스트 갱신
        message.success("친구가 되었어요!");

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

  // 친구 요청 거절
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

      console.log(`Response status: ${response.status}`);
      const responseBody = await response.text();
      console.log(`Response body: ${responseBody}`);

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      message.error("팔로우 요청을 거절했어요!");

      // 요청 성공 시 알림 리스트 갱신
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

  // useEffect 훅
  useEffect(() => {
    if (userId && token) {
      fetchNotifications(); // 컴포넌트 마운트 시 데이터 가져오기
      const intervalId = setInterval(fetchNotifications, 5000); // 5초마다 폴링

      return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클린업
    }
  }, [userId, token]);

  return (
    <div>
      <main>
        {notifications.length === 0 || notifications === null ? (
          <div className="notifications-empty">
            <h3>아직 알림이 없어요!</h3>
          </div>
        ) : (
          notifications
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
            ))
        )}
      </main>
    </div>
  );
}
