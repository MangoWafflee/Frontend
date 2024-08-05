import React, { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AchievementPage.scss';
import level1 from '../../assets/badges/level1.png';
import level2 from '../../assets/badges/level2.png';
import level3 from '../../assets/badges/level3.png';
import level4 from '../../assets/badges/level4.png';
import level5 from '../../assets/badges/level5.png';
import level6 from '../../assets/badges/level6.png';
import level7 from '../../assets/badges/level7.png';
import level8 from '../../assets/badges/level8.png';
import level9 from '../../assets/badges/level9.png';
import challenge_24_07_7 from '../../assets/challenges/challenge_24_07_7.png';
import useFetchUserBadges from '../../hooks/useFetchUserBadges';

export default function AchievementPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [uid, setUid] = useState('');
  const { badgeList, error } = useFetchUserBadges(uid);
  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    if (storedUser) {
      setUser(storedUser);
      setUid(storedUser.uid);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const badgeImages = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
  ];

  // 개인 기록
  const individualRecordList = badgeList.map(
    (badge, index) => ({
      id: badge.id,
      title: badge.title,
      isAchieved: badge.isAchieved,
      achievedAt: badge.achievedAt,
      img: badgeImages[index % badgeImages.length],
    })
  );

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
          individualRecordList.map((record, index) => (
            <div
              className="badge"
              key={`individual-${record.id}`}
            >
              <img
                src={record.img}
                alt="challenge-image"
                className={
                  record.isAchieved == '성공'
                    ? ''
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
