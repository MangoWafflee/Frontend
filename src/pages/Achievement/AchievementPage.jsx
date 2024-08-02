import React from 'react';
import { Divider } from 'antd';
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

export default function AchievementPage() {
  // 개인 기록
  const individualRecordList = [
    {
      id: 1,
      title: '5일 웃기',
      isAchieved: true,
      achievedAt: '2024.06.31',
      img: level1,
    },
    {
      id: 2,
      title: '7일 웃기',
      isAchieved: true,
      achievedAt: '2024.07.01',
      img: level2,
    },
    {
      id: 3,
      title: '10일 웃기',
      isAchieved: false,
      achievedAt: 'null',
      img: level3,
    },
    {
      id: 4,
      title: '15일 웃기',
      isAchieved: true,
      createdAt: '2024.07.10',
      img: level4,
    },
    {
      id: 5,
      title: '20일 웃기',
      isAchieved: false,
      createdAt: '2024.07.15',
      img: level5,
    },
    {
      id: 6,
      title: '25일 웃기',
      isAchieved: true,
      createdAt: '2024.07.20',
      img: level6,
    },
    {
      id: 7,
      title: '30일 웃기',
      isAchieved: true,
      createdAt: '2024.07.25',
      img: level7,
    },
    {
      id: 8,
      title: '35일 웃기',
      isAchieved: false,
      createdAt: '2024.07.30',
      img: level8,
    },
    {
      id: 9,
      title: '40일 웃기',
      isAchieved: true,
      createdAt: '2024.08.05',
      img: level9,
    },
  ];

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
      id: 1,
      title: '[7월] 7일 웃기',
      isAchieved: true,
      createdAt: '2024.07.12',
      img: challenge_24_07_7,
    },
    {
      id: 1,
      title: '[7월] 7일 웃기',
      isAchieved: true,
      createdAt: '2024.07.12',
      img: challenge_24_07_7,
    },
    {
      id: 1,
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
            <div className="badge" key={record.id}>
              <img
                src={record.img}
                alt="challenge-image"
                className={
                  record.isAchieved ? '' : 'grayscale'
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
            <div className="badge" key={record.id}>
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
