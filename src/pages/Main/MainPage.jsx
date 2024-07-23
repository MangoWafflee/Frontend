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
      <div className="main-menu circular">
        {/* 개인 기록 or 뱃지 */}
        <div className='record-container circular'>
          개인 기록
        </div>
        {/* 챌린지 */}
        <div className="challenge-container circular">
          <h1>🔥 챌린지</h1>
          <div className='challenge circular'>
            <span>일주일 연속 웃기</span>
            <div className="progress-bar">
              <div className="progress" style={{width:`${'80'}%`}}></div>
            </div>
          </div>
          <div className='challenge circular'>
            <span>일주일 연속 출석하기</span>
            <div className="progress-bar">
              <div className="progress" style={{width:`${'20'}%`}}></div>
            </div>
          </div>
          <span>{'>더보기'}</span>
        </div>

        {/* 미정 */}
        <div className="ranking-container circular">미정</div>
      </div>
    </div>
  );
}
