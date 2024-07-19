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
				dates.push({ day, dayOfWeek });
			}
			return dates;
		};

		setPrevious7Days(getPrevious7Days());
	}, [standardDay]);

	return (
		<div className="calendar-container">
			<div className="calendar">
				<div className="previous-button" onClick={setOneWeekAgo}>
					{"<"}
				</div>
				{previous7Days.map((date, index) => (
					<div key={index} className="calendar-tile">
						<div className="calendar-dayofweek">{`${date.dayOfWeek[0]}`}</div>
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

			<button>웃음 도전?</button>
		</div>
	);
}

const EmojiOverlay = ({ date }) => {
	const emojis = ["😀", "😃", "😃", "😃", "😃", "😃", "😃"];
	return (
		<div className="emoji-overlay">
			{emojis[date.getDay() - 1]} {date.getDate()}
		</div>
	);
};
