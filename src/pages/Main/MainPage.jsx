import React from "react";
import "./MainPage.scss";
import WeekCalendar from "../../features/weekCalendar/WeekCalendar";
import FriendRanking from "../../components/Ranking/FriendRanking";
import useNotification from "../../hooks/useNotification";

export default function MainPage() {

	Notification.requestPermission();
	const notify = useNotification();

	return (
		<div className="main-page">
			
			<h2>친구별 주간 랭킹</h2>
			<FriendRanking />
			<h2>주간 웃음 달력</h2>
			<WeekCalendar />
			<h2>챌린지 달성률</h2>
			<h2>날씨</h2>
			<FriendRanking />
			<FriendRanking />
			<FriendRanking />
			<button
                onClick={() => notify("This is a notification!", { body: "Here is the notification body" })}
            >
                Show Notification
            </button>
		</div>
	);
}
