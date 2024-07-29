import React from "react";
import { Divider } from "antd";
import "./AchievementPage.scss";

export default function AchievementPage() {
	// 개인 기록
	const individualRecordList = [
		{
			id: 1,
			title: "5일 연속 웃기",
			isAchieved: true,
			createdAt: "2024.06.31",
			img: "https://cafe24.poxo.com/ec01/badgemall/UVTjSep0dwP4/wX7AtHyXOEbmR/izsmT9MqFaYuvpxwVgFX/Z51umynKwSmnYrwd14t/CZo2v7nIOjCuZneWQQ==/_/img/goldbadge_m.png",
		},
		{
			id: 2,
			title: "20일 연속 웃기",
			isAchieved: true,
			createdAt: "2024.07.22",
			img: "https://cafe24.poxo.com/ec01/badgemall/UVTjSep0dwP4/wX7AtHyXOEbmR/izsmT9MqFaYuvpxwVgFX/Z51umynKwSmnYrwd14t/CZo2v7nIOjCuZneWQQ==/_/img/goldbadge2_m.png",
		},
		{
			id: 3,
			title: "친구랑 겨뤄서 3번 이기기",
			isAchieved: false,
			createdAt: null,
			img: "https://cafe24.poxo.com/ec01/badgemall/UVTjSep0dwP4/wX7AtHyXOEbmR/izsmT9MqFaYuvpxwVgFX/Z51umynKwSmnYrwd14t/CZo2v7nIOjCuZneWQQ==/_/img/goldbadge2_m.png",
		},
		{
			id: 4,
			title: "친구랑 겨뤄서 3번 이기기",
			isAchieved: false,
			createdAt: null,
			img: "https://cafe24.poxo.com/ec01/badgemall/UVTjSep0dwP4/wX7AtHyXOEbmR/izsmT9MqFaYuvpxwVgFX/Z51umynKwSmnYrwd14t/CZo2v7nIOjCuZneWQQ==/_/img/goldbadge2_m.png",
		},
	];
	
	// 챌린지 기록
	const challengeRecordList = [];

	return (
		<div className="ahcievement-page">
			<h2>개인 기록</h2>
            <div className="badge-container">
            {individualRecordList.length === 0 ||
			individualRecordList === null ? (
				<div>참여중인 챌린지가 없습니다.</div>
			) : (
				individualRecordList.map((record) => (
					<div className="badge" key={record.id}>
						<img
							src={record.img}
							alt="challenge-image"
							className={record.isAchieved ? "" : "grayscale"}
						/>
						<div className="column">
							<p>{record.title}</p>
							{record.isAchieved && <p>{record.createdAt}</p>}
						</div>
					</div>
				))
			)}
            </div>
            
			<Divider />
			<h2>챌린지</h2>
			{challengeRecordList.length === 0 ||
			challengeRecordList === null ? (
				<div className="challenge">획득한 챌린지 뱃지가 없습니다.</div>
			) : (
				challengeRecordList.map((record) => (
					<div className="badge" key={record.id}>
						<img
							src={record.img}
							alt="challenge-image"
							className={record.isAchieved ? "" : "grayscale"}
						/>
						<div className="column">
							<p>{record.title}</p>
							{record.isAchieved && <p>{record.createdAt}</p>}
						</div>
					</div>
				))
			)}
		</div>
	);
}
