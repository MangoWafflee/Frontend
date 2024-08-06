import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserCard.scss';

export default function UserCard({
  userName,
  userImage,
  userNickname,
  isFriend,
  isFriendApply,
  setIsFriendApply, // 부모 컴포넌트에서 상태를 업데이트하기 위해 추가
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const userId = user ? user.id : 0;

  const handleFriendApply = async () => {
    try {
      // Step 1: Fetch the receiver's uid using the nickname
      const response = await fetch(
        `https://mango.angrak.cloud/user/nickname/${userNickname}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch receiver's uid");
      }

      const data = await response.json();
      const receiverId = data.id; // The receiver's uid

      console.log(
        '친구 요청을 보낼 유저의 id:',
        receiverId
      );

      // Step 2: Send the friend request using the fetched id
      const requestPayload = {
        senderId: userId, // 현재 로그인한 유저의 id
        receiverId: receiverId, // 받아온 유저의 id
      };

      console.log('보내는 요청 데이터:', requestPayload);

      const requestResponse = await fetch(
        `https://mango.angrak.cloud/follow/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (!requestResponse.ok) {
        const errorData = await requestResponse.json();
        console.error(
          'Error response from server:',
          errorData
        );
        throw new Error('Failed to send friend request');
      }

      message.success('친구가 요청을 보냈어요!');
      console.log('친구 요청을 보냈습니다.');
      setIsFriendApply(true); // 친구 요청을 보낸 후 상태 업데이트
    } catch (error) {
      console.error('친구 요청 중 오류 발생:', error);
    }
  };

  const handleSmileWatch = () => {
    // 웃음 보기 로직을 구현합니다.
    console.log('웃음 보기를 눌렀습니다.');
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
                fontSize: '1.1rem',
                textAlign: 'left',
                //   marginLeft: "1rem",
                fontWeight: 'bold',
              }}
              noWrap
            >
              {userName}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.9rem',
                textAlign: 'left',
                marginLeft: '1rem',
                fontWeight: 'bold',
              }}
              noWrap
            >
              {userNickname}
            </Typography>
          </div>
          <div className="user-card-button">
            {isFriend ? (
              <button
                className="smile-watch-button"
                onClick={handleSmileWatch}
              >
                웃음 보기
              </button>
            ) : (
              <button
                className={
                  isFriendApply
                    ? 'friend-apply-button requested'
                    : 'friend-apply-button'
                }
                onClick={handleFriendApply}
              >
                {isFriendApply ? '요청됨' : '팔로우 요청'}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
