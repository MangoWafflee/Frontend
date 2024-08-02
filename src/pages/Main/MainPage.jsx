import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WeekCalendar from '../../features/weekCalendar/WeekCalendar';
import './MainPage.scss';
import { Progress, Card, Button } from 'antd';
import RandomJoke from '../../components/RandomJoke/RandomJoke';
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
      <div className="main-page title">
        ㅇㅇㅇ님 500일째 웃고 계시네요🔥
      </div>
      <WeekCalendar />
      <div className="main-menu circular">
        {/* 개인 기록 or 뱃지 */}
        <RandomJoke />
        <div className="challenge-container circular">
          <Card
            title="개인 기록 🚩"
            extra={
              <Link to="/profile/achievement/ㅇㅇㅇ">
                {'More'}
              </Link>
            }
            styles={{
              body: { padding: 10 },
            }}
          >
            <div className="challenge circular">
              <span>15일 웃기</span>
              <Progress
                percent={60}
                status="active"
                style={{ width: '80%' }}
              />
            </div>
          </Card>
        </div>

        {/* 챌린지 */}
        <div className="challenge-container circular">
          <Card
            title="챌린지🔥"
            extra={<Link to="/challenge">{'More'}</Link>}
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
      </div>
    </div>
  );
}
