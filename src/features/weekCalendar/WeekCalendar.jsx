import React, { useEffect, useState } from "react";
import "./WeekCalendar.scss";

export default function WeekCalendar() {
	const [standardDay, setStandardDay] = useState(new Date());
	const [previous7Days, setPrevious7Days] = useState([]);

	// 일주일 전 날짜로 설정하는 함수
	const setOneWeekAgo = () => {
		const newDate = new Date(standardDay);
		newDate.setDate(newDate.getDate() - 7);
		setStandardDay(newDate);
	};

	// 일주일 후 날짜로 설정하는 함수
	const setOneWeekLater = () => {
		const newDate = new Date(standardDay);
		newDate.setDate(newDate.getDate() + 7);
		setStandardDay(newDate);
	};

	// 오늘 날짜로 설정하는 함수
	const setToday = () => {
		setStandardDay(new Date());
	};

	// 해당 월의 몇 번째 주인지 계산하는 함수
	const getWeekOfMonth = (date) => {
		const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
		const dayOfWeek = startOfMonth.getDay();
		const adjustedDate = date.getDate() + dayOfWeek - 1;
		return Math.floor(adjustedDate / 7) + 1;
	};

	useEffect(() => {
		// 기준 날짜로부터 이전 7일의 날짜 배열 생성
		const getPrevious7Days = () => {
			const standard = standardDay;
			const dates = [];
			for (let i = 6; i >= 0; i--) {
				const date = new Date(standard);
				date.setDate(standard.getDate() - i);
				const day = date.getDate();
				const dayOfWeek = date.toLocaleString("default", {
					weekday: "long",
					locale: "ko-KR",
				});
				dates.push({ day, dayOfWeek, isToday: isToday(date) });
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

	return (
		<div className="calendar-container">
			<div className="calendar-header">
				<div>
					{standardDay.toLocaleString("default", {
						year: "2-digit",
					})} {" "}
					 {standardDay.getMonth() + 1}월{" "}
					{getWeekOfMonth(standardDay)}번째 주
				</div>
				<button className="today-button" onClick={setToday}>오늘</button>
			</div>
			<div className="calendar">
				<div className="previous-button" onClick={setOneWeekAgo}>
					{"<"}
				</div>
				{previous7Days.map((date, index) => (
					<div key={index} className="calendar-tile">
						<div
							className={`calendar-dayofweek ${
								date.dayOfWeek[0] === "토"
									? "sat"
									: date.dayOfWeek[0] === "일"
									? "sun"
									: ""
							}`}
						>{`${date.isToday ? "오늘" : date.dayOfWeek[0]}`}</div>
						<div className="calendar-day">
							{`${date.day}`}
							{/* <span className="smile">😃</span> */}
						</div>
					</div>
				))}
				<div className="next-button" onClick={setOneWeekLater}>
					{">"}
				</div>
			</div>

			<button>오늘 웃음 도전?</button>
		</div>
	);
}
