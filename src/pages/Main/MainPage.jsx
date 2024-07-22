import React from 'react';
import './MainPage.scss';
import WeekCalendar from '../../features/weekCalendar/WeekCalendar';
import FriendRanking from '../../components/Ranking/FriendRanking';
import useNotification from '../../hooks/useNotification';
import Header from '../../components/Header/Header';

export default function MainPage() {
  // 로그인 여부 확인해서 로그인 안되어있는데 시도시 소개페이지로 이동
  
  return (
    <div className="main-page">
      <Header />
      <h2>ㅇㅇㅇ님 2일째 웃고 계시네요🔥</h2>
      <WeekCalendar />
      <div className="main-menu">
        <div className='individual-record'>
          안녕
        </div>
        <div className="challenge"></div>
        <div className="ranking"></div>
      </div>
    </div>
  );
}
