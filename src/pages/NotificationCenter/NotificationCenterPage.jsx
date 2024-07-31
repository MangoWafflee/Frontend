import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationCenterPage.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "../../app/axios";

// 친구 요청 내역 불러오기
// const getFriendRequests=async()=>{
// 	const response= await axios.get('api주소');
// 	return response.data;
// }

// 친구의 웃은 내역 불러오기
// const getFriendSmiles=async()=>{
// 	const response= await axios.get('api주소');
// 	return response.data;
// }

export default function NotificationCenter() {
	const navigate = useNavigate();

	const friendRequests = [
		{
			id: 1,
			creadtedAt: "",
			img: "",
			nickname: "",
		},
	];

	const smileLists = [];

	return (
		<div>
			<main>
				{/* 친구 요청 알림  */}
				<div className="notification">
					<div className="user-info">
						<img
							src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
							alt="유저 이미지"
						/>
						<div className="friend-request-info">
							<span>친구 요청</span>
							<span>바다 코끼리</span>
						</div>
					</div>
					<div className="button-container">
						<button className="accept-button">수락</button>{" "}
						<button className="reject-button">거절</button>
					</div>
				</div>
				<hr />
				{/* 웃음 알림 */}
				<div className="notification">
					<div className="user-info">
						<img
							src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
							alt="유저 이미지"
						/>
						<span>
							<strong>바다코끼리</strong>님이 웃었어요
							<span className="timestamp"> 1분 전</span>
						</span>
					</div>
				</div>

				<div className="notification">
					<div className="user-info">
						<img
							src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
							alt="유저 이미지"
						/>
						<span>
							<strong>우리흥</strong>님이 웃었어요
							<span className="timestamp"> 7분 전</span>
						</span>
					</div>
				</div>
			</main>
		</div>
	);
}
