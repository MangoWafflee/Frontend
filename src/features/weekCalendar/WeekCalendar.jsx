import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './WeekCalendar.scss';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, Link } from 'react-router-dom';

export default function WeekCalendar() {
  const navigate = useNavigate();
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
              {`${date.day}`}
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
