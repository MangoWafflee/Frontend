import React from 'react';
import './MainPage.scss';
import WeekCalendar from '../../features/weekCalendar/WeekCalendar';
import FriendRanking from '../../components/Ranking/FriendRanking';

import Header from '../../components/Header/Header';

export default function MainPage() {
  // 로그인 여부 확인해서 로그인 안되어있는데 시도시 소개페이지로 이동

  return (
    <div className="main-page">
      <Header />
      <h2>주간 웃음 달력</h2>
      <WeekCalendar />

      
    </div>
  );
}
