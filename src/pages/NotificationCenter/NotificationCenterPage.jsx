import React from "react";
import "./NotificationCenterPage.scss";
import { useNavigate } from "react-router-dom";

export default function NotificationCenter() {
	const navigate = useNavigate();
	return (
		<div>
			<header>
				<div onClick={() => navigate(-1)}>{"<(뒤로가기버튼)"}</div>
				<h1>알림</h1>
			</header>
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
						<button className="accept-button">수락</button> <button className="reject-button">거절</button>
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
						<span> 바다코끼리님이 웃었어요<span className="timestamp">1분전</span></span>
					</div>
				</div>

                <div className="notification">
					<div className="user-info">
						<img
							src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
							alt="유저 이미지"
						/>
						<span><span className="timestamp">7분전</span> 우리흥님이 웃었어요</span>
					</div>
				</div>
				
			</main>
		</div>
	);
}
