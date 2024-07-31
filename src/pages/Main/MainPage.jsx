import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WeekCalendar from '../../features/weekCalendar/WeekCalendar';
import './MainPage.scss';
import { Progress, Card } from 'antd';

export default function MainPage() {
  const navigate = useNavigate();

  // 로그인 여부 확인해서 로그인 안되어있는데 시도시 소개페이지로 이동
  useEffect(() => {
    if (false) navigate('/');
  }, [navigate]);

  // 일주일 달력에 관한 웃음 기록
  const smileRecordList = [];

  return (
    <div className="main-page">
      {/* <h3>ㅇㅇㅇ님 500일째 웃고 계시네요🔥</h3> */}
      <WeekCalendar />
      <div className="main-menu circular">
        {/* 개인 기록 or 뱃지 */}
        <div
          className="record-container circular"
          onClick={() => navigate('/achievement')}
        >
          개인 기록
        </div>
        {/* 챌린지 */}
        <div className="challenge-container circular">
          <Card
            title="챌린지🔥"
            extra={<Link to="/challenge">{'More'}</Link>}
            style={{
              width: 180,
            }}
            styles={{
              body: { padding: 10 },
            }}
          >
            <div className="challenge circular">
              <span>일주일 연속 웃기</span>
              <Progress
                percent={75}
                status="active"
                style={{ width: '80%' }}
              />
            </div>
            <div className="challenge circular">
              <span>일주일 연속 출석하기</span>
              <Progress
                percent={35}
                status="active"
                style={{ width: '80%' }}
              />
            </div>
          </Card>
        </div>

        {/* 미정 */}
        <div className="ranking-container circular">
          미정
        </div>
      </div>
    </div>
  );
}
