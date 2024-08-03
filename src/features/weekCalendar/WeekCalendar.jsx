import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './WeekCalendar.scss';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../auth/authSlice';

export default function WeekCalendar() {
  const navigate = useNavigate();
  const user = useSelector(selectUser); // user 객체
  const nickname = user ? user.nickname : 'test'; // 닉네임 꺼내 쓰기
  const [smileData, setSmileData] = useState([]);
  const [standardDay, setStandardDay] = useState(
    new Date()
  );
  const [previous7Days, setPrevious7Days] = useState([]);

  const setOneWeekAgo = () => {
    const newDate = new Date(standardDay);
    newDate.setDate(newDate.getDate() - 7);
    setStandardDay(newDate);
  };

  const setOneWeekLater = () => {
    const newDate = new Date(standardDay);
    newDate.setDate(newDate.getDate() + 7);
    setStandardDay(newDate);
  };

  const setToday = () => {
    setStandardDay(new Date());
  };

  const getWeekOfMonth = (date) => {
    const startOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
    const dayOfWeek = startOfMonth.getDay();
    const adjustedDate = date.getDate() + dayOfWeek - 1;
    return Math.floor(adjustedDate / 7) + 1;
  };

  useEffect(() => {
    const getPrevious7Days = () => {
      const standard = standardDay;
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(standard);
        date.setDate(standard.getDate() - i);
        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('default', {
          weekday: 'long',
          locale: 'ko-KR',
        });
        dates.push({
          day,
          dayOfWeek,
          isToday: isToday(date),
          dateString: date.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식의 날짜 문자열 추가
        });
      }
      return dates;
    };

    const isToday = (someDate) => {
      const today = new Date();
      return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
      );
    };

    setPrevious7Days(getPrevious7Days());
  }, [standardDay]);

  // 유저 웃음 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      let url = `https://mango.angrak.cloud/smile/user/${nickname}`; // URL 확인
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data); // 응답 데이터 출력
          setSmileData(data); // 응답 데이터를 상태에 저장
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
  }, [nickname]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setOneWeekLater(),
    onSwipedRight: () => setOneWeekAgo(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="calendar-container" {...handlers}>
      <div className="calendar-header">
        <div>
          {standardDay.toLocaleString('default', {
            year: '2-digit',
          })}{' '}
          {standardDay.getMonth() + 1}월{' '}
          {getWeekOfMonth(standardDay)}번째 주
        </div>
        <button className="today-button" onClick={setToday}>
          오늘
        </button>
      </div>
      <div className="calendar">
        {previous7Days.map((date, index) => (
          <div
            key={index}
            className={`calendar-tile ${
              date.isToday ? 'today' : ''
            }`}
          >
            <div
              className={`calendar-dayofweek ${
                date.dayOfWeek[0] === '토'
                  ? 'sat'
                  : date.dayOfWeek[0] === '일'
                  ? 'sun'
                  : ''
              }`}
            >
              {date.isToday ? (
                <FontAwesomeIcon icon={faStar} />
              ) : (
                date.dayOfWeek[0]
              )}
            </div>
            <div className="calendar-day">
              {smileData.some(
                (smile) => smile.date === date.dateString
              )
                ? '😃'
                : date.day}
            </div>
          </div>
        ))}
      </div>
      <button
        className="smile-button"
        type="primary"
        onClick={() => navigate('/camerarecognition')}
      >
        오늘의 웃음 도전 😃
      </button>
    </div>
  );
}
