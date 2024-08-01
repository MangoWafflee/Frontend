import React, { useState } from "react";
import { Divider, Modal, message } from "antd";
import "./ChallengePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "../../app/axios";
import { useQuery } from "@tanstack/react-query";
import challenge1 from '../../assets/challenges/challenge1.png';
import challenge2 from '../../assets/challenges/challenge2.png';
import challenge3 from '../../assets/challenges/challenge3.png';
import challenge_24_07_7 from '../../assets/challenges/challenge_24_07_7.png';


// 챌린지 정보 백엔드에서 받아오는 api
	// const getChallenges=async()=>{
	// 	const response= await axios.get('api주소');
	// 	return response.data;
	// }

export default function ChallengePage() {
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 여부
	const [selectedChallenge, setSelectedChallenge] = useState(null); // 선택된 챌린지

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleParticipate = () => {
		message.success("챌린지에 참가되었습니다.");
	};

	// const {
	// 	data,
	// 	error,
	// 	isLoading,
	// } = useQuery({
	// 	queryKey: ["challenges"],
	// 	queryFn: getChallenges,
	// });

	// if (isLoading) return <div>Loading...</div>;
	// if (error) return <div>An error occurred: {error.message}</div>;

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
	  title: "[8월] 7일 웃기 챌린지",
	  subTitle: "이번 달 7일 웃어보세요.",
	  startDate: "2024-08-01",
	  endDate: "2024-08-31",
	  img: challenge1,
	  participating: true,
	  successStatus: null,
	  participantCount: 1230,
	  totalAttempts: 5,
	  completedAttempts: 3,
	},
	{
	  id: 2,
	  title: "[8월] 14일 웃기 챌린지",
	  subTitle: "이번 달 14일 웃어보세요.",
	  startDate: "2024-08-01",
	  endDate: "2024-08-31",
	  img: challenge2,
	  participating: true,
	  successStatus: null,
	  participantCount: 2615,
	  totalAttempts: 7,
	  completedAttempts: 0,
	},
  ];
  
  // 참여할 수 있는 챌린지 더미 데이터
  const onGoingChallengeList = [
	{
	  id: 3,
	  title: "[8월] 20일 웃기 챌린지",
	  subTitle: "이번 달 20일 웃어보세요.",
	  startDate: "2024-08-01",
	  endDate: "2024-08-31",
	  img: challenge3,
	  participating: false,
	  successStatus: null,
	  participantCount: 956,
	  totalAttempts: 20,
	  completedAttempts: 0,
	},
  ];
  
  // 참여했던 챌린지 더미 데이터
  const participatedChallengeList = [
	{
	  id: 5,
	  title: "[6월] 20일 웃기 챌린지", // 챌린지 타이틀
	  subTitle: "이번 달 20일 웃어보세요.", //
	  startDate: "2024-06-01",
	  endDate: "2024-06-30",
	  img: challenge_24_07_7,
	  participating: true, // 참여 여부
	  successStatus: true, // 성공 여부
	  participantCount: 2500, // 참가자 수
	  totalAttempts: 20, // 완료까지 수행할 횟수
	  completedAttempts: 20, // 수행한 횟수
	},
  ];
  

	return (
		<div className="challenge-page">
			<h2>나의 챌린지</h2>
			{participatingChallengeList.length === 0 ||
			participatingChallengeList === null ? (
				<div className="challenge">참여중인 챌린지가 없습니다.</div>
			) : (
				participatingChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
						key={challenge.id}
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
				<div className="challenge">진행중인 챌린지가 없습니다.</div>
			) : (
				onGoingChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
						key={challenge.id}
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
				<div className="challenge">참여했던 챌린지가 없습니다.</div>
			) : (
				participatedChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
						key={challenge.id}
					>
						<img src={challenge.img} alt="challenge-image" />
						<div className="column">
							<h4>{challenge.title}</h4>
							<p>{challenge.subTitle}</p>
							<p>{challenge.successStatus ? "성공" : "실패"}</p>
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
				styles={{
					body: { padding: 0,
						margin:0
					 }
				  }}
			>
				{selectedChallenge && (
					<div >
						<div className="background-badge">
							<img
								src={selectedChallenge.img}
								alt="challenge-image"
							/>
						</div>
						<h3>{selectedChallenge.title}</h3>
						<br />
						<p>{selectedChallenge.subTitle}</p>
						<br />
						<p>
							챌린지에 참가해볼 시간입니다! 이번 달에 ~를 하고
							챌린지를 성공해보세요!
						</p>
						<br />
						<div className="challenge-info">
							<p>
								<span>기간</span>
								<span>{` ~ ${selectedChallenge.endDate}`}</span>
							</p>
							<p>
								<span>참가자</span>
								<span>{`${selectedChallenge.participantCount}`}</span>
							</p>
							{selectedChallenge.participating ? (
								<p>
									<span>진행</span>
									<span>{`${selectedChallenge.completedAttempts} / ${selectedChallenge.totalAttempts}`}</span>
								</p>
							) : (
								<p>
									<span>횟수</span>
									<span>{`${selectedChallenge.totalAttempts}`}</span>
								</p>
							)}
						</div>

						{!selectedChallenge.participating && (
							<button
								className="modal-bottom-button"
								onClick={() => {
									// 챌린지 참가 API
									handleParticipate();
									setIsModalOpen(false);
								}}
							>
								챌린지 참여하기
							</button>
						)}
					</div>
				)}
			</Modal>
		</div>
	);
}
