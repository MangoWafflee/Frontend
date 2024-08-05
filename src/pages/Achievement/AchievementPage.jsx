import React, { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AchievementPage.scss';
import useFetchUserBadges from '../../hooks/useFetchUserBadges';
import challenge_24_07_7 from '../../assets/challenges/challenge_24_07_7.png';

export default function AchievementPage() {
  const navigate = useNavigate();
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');
  const { badgeList, error } = useFetchUserBadges(
    uid,
    token
  );

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUid(storedUser.uid);
      setToken(storedToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 개인 기록
  const individualRecordList = badgeList.map((badge) => ({
    id: badge.id,
    title: badge.title,
    isAchieved: badge.isAchieved,
    achievedAt: badge.achievedAt,
    img: badge.image,
  }));

  // 챌린지 기록
  const challengeRecordList = [
    {
      id: 1,
      title: '[7월] 7일 웃기',
      isAchieved: true,
      createdAt: '2024.07.12',
      img: challenge_24_07_7,
    },
    {
      id: 2,
      title: '[7월] 7일 웃기',
      isAchieved: true,
      createdAt: '2024.07.12',
      img: challenge_24_07_7,
    },
    {
      id: 3,
      title: '[7월] 7일 웃기',
      isAchieved: true,
      createdAt: '2024.07.12',
      img: challenge_24_07_7,
    },
    {
      id: 4,
      title: '[7월] 7일 웃기',
      isAchieved: true,
      createdAt: '2024.07.12',
      img: challenge_24_07_7,
    },
  ];

  return (
    <div className="ahcievement-page">
      <h2>개인 기록</h2>
      <div className="badge-container">
        {individualRecordList.length === 0 ||
        individualRecordList === null ? (
          <div>참여중인 챌린지가 없습니다.</div>
        ) : (
          individualRecordList.map((record) => (
            <div
              className="badge"
              key={`individual-${record.id}`}
            >
              <img
                src={record.img}
                alt="challenge-image"
                className={
                  record.isAchieved === '성공'
                    ? ''
                    : 'grayscale'
                }
              />
              <div className="column">
                <p>{record.title}</p>
                {record.isAchieved && (
                  <p>{record.achievedAt}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Divider />
      <h2>챌린지</h2>
      <div className="badge-container">
        {challengeRecordList.length === 0 ||
        challengeRecordList === null ? (
          <div className="challenge">
            획득한 챌린지 뱃지가 없습니다.
          </div>
        ) : (
          challengeRecordList.map((record) => (
            <div
              className="badge"
              key={`challenge-${record.id}`}
            >
              <img
                src={record.img}
                alt="challenge-image"
                className={
                  record.isAchieved
                    ? 'challenge-badge'
                    : 'grayscale'
                }
              />
              <div className="column">
                <p>{record.title}</p>
                {record.isAchieved && (
                  <p>{record.createdAt}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
