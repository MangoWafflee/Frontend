import React, { useEffect, useState } from 'react';
import './ProfilePage.scss';
import { Divider } from '@mui/material';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import UserDefaultImage from '../../assets/images/UserDefaultImage.png';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  logout,
  login,
} from '../../features/auth/authSlice';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const name = user ? user.name : 'test';
  const nickname = user ? user.nickname : 'test';
  const userId = user ? user.id : 0;
  const uid = user ? user.uid : 0;
  const email = user ? user.email : '';
  const image =
    user && user.image ? user.image : UserDefaultImage;

  const [smileCount, setSmileCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const encodedNickname = encodeURIComponent(nickname);
      const url = `https://mango.angrak.cloud/smile/user/${encodedNickname}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setSmileCount(data.length);
        } else if (response.status === 404) {
          console.log('검색 결과가 없습니다.');
        } else {
          console.log('서버 오류');
        }
      } catch (error) {
        console.error('데이터 요청 오류:', error);
      }
    };
    fetchData();
  }, [nickname, dispatch]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `https://kapi.kakao.com/v1/user/logout?target_id_type=user_id&target_id=${localStorage.getItem(
          'kakaoUserId'
        )}`,
        {
          method: 'POST',
          headers: {
            Authorization: `KakaoAK b2077c53d402d3e5755993907e3cc0e9`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log('로그아웃한 아이디' + result.id);
      } else {
        console.log('실패');
        console.log(response.status);
      }
    } catch (error) {
      console.error('카카오 로그아웃 오류:', error);
    }

    dispatch(logout()); // Redux 상태 초기화

    message.success('로그아웃 되었습니다.');

    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>; // 또는 다른 로딩 상태 컴포넌트
  }

  return (
    <div id="profile-page">
      <div className="profile-section">
        <div className="profile-image">
          <img src={image} alt="프로필 사진" />
        </div>
        <div className="user-info">
          <h2>{name}</h2>
          <p>{nickname}</p>
          <p>{email}</p>
        </div>
      </div>

      <div className="user-point">
        <div>
          <h2>🏅획득 배지</h2>
          <p>0</p>
        </div>
        <div>
          <h2>😊웃은 횟수</h2>
          <p>{smileCount}</p>
        </div>
      </div>

      <Divider />

      <div className="profile-btn-container">
        <Link to="/profile/edit" className="user-link">
          <button className="edit-profile-btn">
            <span role="img" aria-label="pencil">
              📝 나의 프로필 수정
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
        <Link
          to={`/profile/smile/${nickname}`}
          className="user-link"
        >
          <button className="chattingList-btn">
            <span role="img" aria-label="conversation">
              😊 나의 웃음 기록
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
        <Link
          to={`/profile/achievement/${nickname}`}
          className="user-link"
        >
          <button className="edit-profile-btn">
            <span role="img" aria-label="pencil">
              🏅 나의 챌린지 기록
            </span>
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </Link>
      </div>

      <div className="user-logout-btn-container">
        <button
          className="user-logout-btn"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
