import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationCenterPage.scss";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getRelativeTime = (dateString) => {
  const now = new Date();
  const requestDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - requestDate) / 1000);

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

  // 데이터 가져오기 함수
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const userId = "6"; // 실제 userId로 변경
      const url = `${BACKEND_URL}/follow/received?userId=${userId}`;

      console.log("Fetch URL:", url);

      const response = await fetch(url);

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
        },
        body: JSON.stringify({
          requestId: requestId,
          status: "ACCEPTED",
        }),
      });

      console.log(`Response status: ${response.status}`);
      const responseBody = await response.text();
      console.log(`Response body: ${responseBody}`);

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      // 요청 성공 시 알림 리스트 갱신
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== requestId
        )
      );
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
    fetchNotifications(); // 컴포넌트 마운트 시 데이터 가져오기
    const intervalId = setInterval(fetchNotifications, 5000); // 10초마다 폴링

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클린업
  }, []);

  return (
    <div>
      {/* <header>
				<div onClick={() => navigate(-1)}>{"<(뒤로가기버튼)"}</div>
				<h1>알림</h1>
			</header> */}
      <main>
        {notifications.length === 0 ? (
          <p>알림이 없습니다.</p>
        ) : (
          notifications
            .slice()
            .reverse()
            .map((notification) => (
              <div className="notification" key={notification.id}>
                <div className="user-info">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                    alt="유저 이미지"
                  />
                  <div className="friend-request-info">
                    <span>
                      {notification.sender.name}님이 팔로우하고 싶어합니다.
                    </span>
                  </div>
                  <div className="timestamp">
                    {getRelativeTime(notification.requestDate)}
                  </div>
                </div>
                <div className="button-container">
                  <button
                    className="accept-button"
                    onClick={() => handleAcceptRequest(notification.id)}
                    disabled={isLoading}
                  >
                    확인
                  </button>{" "}
                  <button
                    className="reject-button"
                    onClick={() => handleRejectRequest(notification.id)}
                    disabled={isLoading}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
        )}
        <hr />
        {/* 웃음 알림 */}
        <div className="notification">
          <div className="user-info">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
              alt="유저 이미지"
            />
            <span>
              {" "}
              바다코끼리님이 웃었어요<span className="timestamp">1분전</span>
            </span>
          </div>
        </div>

        <div className="notification">
          <div className="user-info">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
              alt="유저 이미지"
            />
            <span>
              <span className="timestamp">7분전</span> 우리흥님이 웃었어요
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
