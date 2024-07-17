import React from "react";
import "./MainPage.scss";
import Calendar from "react-calendar";
import WeekCalendar from "../../components/Calendar/WeekCalendar";
import FriendRanking from "../../components/Ranking/FriendRanking";

export default function MainPage() {
	return (
		<div className="main-page">
			{/* 앱 로고 및 알림 아이콘 */}
			<div className="top-layer">
				<div className="logo">logo</div>
				<div>notification</div>
			</div>
			<h2>친구별 주간 랭킹</h2>
			<FriendRanking />
			<h2>주간 웃음 달력</h2>
			<WeekCalendar />
			<h2>챌린지 달성률</h2>
			<h2>날씨</h2>
		</div>
	);
}
