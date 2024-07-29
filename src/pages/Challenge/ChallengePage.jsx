import React, { useState, useRef } from "react";
import { Divider, Modal, Button } from "antd";
import "./ChallengePage.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function ChallengePage() {
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 여부
	const [selectedChallenge, setSelectedChallenge] = useState(null); // 선택된 챌린지

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	// 날짜 차이를 계산하는 함수
	const calculateDateDifference = (endDateStr) => {
		const endDate = new Date(endDateStr);
		const currentDate = new Date();
		const timeDiff = endDate - currentDate;
		const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 차이를 일 단위로 변환
		return dayDiff;
	};

	// 참여중인 챌린지 더미 데이터
	const participatingChallengeList = [
		{
			id: 1,
			title: "[7월] 5일 웃기 챌린지",
			subTitle: "이번 달 5일 웃어보세요.",
      startDate: "2024-07-1",
			endDate: "2024-07-31",
			img: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
			participating: true,
			successStatus: null,
      participantCount:1230
		},
		{
			id: 2,
			title: "[7월] 7일 웃기 챌린지",
			subTitle: "이번 달 7일 웃어보세요.",
      startDate: "2024-07-1",
			endDate: "2024-07-31",
			img: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
			participating: true,
			successStatus: null,
      participantCount:1230
		},
	];

	// 참여할 수 있는 챌린지 더미 데이터
	const onGoingChallengeList = [
		{
			id: 3,
			title: "[7월] 20일 웃기 챌린지",
			subTitle: "이번 달 20일 웃어보세요.",
      startDate: "2024-07-1",
			endDate: "2024-07-31",
			img: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
			participating: false,
			successStatus: null,
      participantCount:1230
		},
		{
			id: 4,
			title: "[7월] 7일 출석 챌린지",
			subTitle: "이번 달 7일 출석해보세요.",
      startDate: "2024-07-1",
			endDate: "2024-07-31",
			img: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
			participating: false,
			successStatus: null,
      participantCount:1230
		},
	];

	// 참여했던 챌린지 더미 데이터
	const participatedChallengeList = [
		{
			id: 5,
			title: "[6월] 20일 웃기 챌린지",
			subTitle: "이번 달 20일 웃어보세요.",
      startDate: "2024-06-1",
			endDate: "2024-06-31",
			img: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
			participating: true,
			successStatus: true,
      participantCount:1230
		},
	];

	return (
		<div className="challenge-page">
			<h2>참여중인 챌린지</h2>
			{participatingChallengeList.length === 0 ||
			participatingChallengeList === null ? (
				<div>참여중인 챌린지가 없습니다.</div>
			) : (
				participatingChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
					>
						<img src={challenge.img} alt="challenge-image" />
						<div className="column">
							<h4>{challenge.title}</h4>
							<p>{challenge.subTitle}</p>
							<p>{`${calculateDateDifference(
								challenge.endDate
							)}일 남음`}</p>
						</div>
						<div className="icon-detail">
							<FontAwesomeIcon icon={faAngleRight} size={"xl"} />
						</div>
					</div>
				))
			)}

			<Divider />
			<h2>챌린지 참여하기</h2>
      {onGoingChallengeList.length === 0 ||
			onGoingChallengeList === null ? (
				<div>진행중인 챌린지가 없습니다.</div>
			) : (
				onGoingChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
					>
						<img src={challenge.img} alt="challenge-image" />
						<div className="column">
							<h4>{challenge.title}</h4>
							<p>{challenge.subTitle}</p>
							<p>{`${calculateDateDifference(
								challenge.endDate
							)}일 남음`}</p>
						</div>
						<div className="icon-detail">
							<FontAwesomeIcon icon={faAngleRight} size={"xl"} />
						</div>
					</div>
				))
			)}

			<Divider />
			<h2>이전 챌린지</h2>
      {participatedChallengeList.length === 0 ||
			participatedChallengeList === null ? (
				<div>진행중인 챌린지가 없습니다.</div>
			) : (
				participatedChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
					>
						<img src={challenge.img} alt="challenge-image" />
						<div className="column">
							<h4>{challenge.title}</h4>
							<p>{challenge.subTitle}</p>
							<p>{challenge.successStatus ? "성공":"실패"}</p>
						</div>
						<div className="icon-detail">
							<FontAwesomeIcon icon={faAngleRight} size={"xl"} />
						</div>
					</div>
				))
			)}

			{/* 모달 */}
			<Modal
				open={isModalOpen}
				onCancel={handleCancel}
				width={300} // 크기 수정 해야함
				footer={null}
			>
				{selectedChallenge && (
					<div>
						<div>이미지</div>
						{/* <img src={selectedChallenge.img} alt="challenge-image" /> */}
						<h3>{selectedChallenge.title}</h3>
						<p>{selectedChallenge.subTitle}</p>
						<p>{`종료일: ${selectedChallenge.endDate}`}</p>
						<p>{`${calculateDateDifference(
							selectedChallenge.endDate
						)}일 남음`}</p>
						<button
							className="modal-bottom-button"
							disabled={selectedChallenge.participating}
						>
							{selectedChallenge.participating ? "챌린지 참여 완료" : "챌린지 참여하기"}
						</button>
					</div>
				)}
			</Modal>
		</div>
	);
}
