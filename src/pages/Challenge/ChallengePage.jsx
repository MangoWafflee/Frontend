import React, { useState, useEffect } from "react";
import { Divider, Modal, message } from "antd";
import "./ChallengePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "../../app/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";

export default function ChallengePage() {
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 여부
	const [selectedChallenge, setSelectedChallenge] = useState(null); // 선택된 챌린지
	const [isParticipatingChallenge, setIsParticipatingChallenge] =
		useState(null);
	const user = JSON.parse(localStorage.getItem("user")); // localStorage에서 user 정보 가져오기
	const token = localStorage.getItem("token"); // localStorage에서 token 정보 가져오기
	const queryClient = useQueryClient(); // react-query queryClient 생성

	// 챌린지 모달 창 제거
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	// 챌린지 참여 버튼
	const handleParticipate = () => {
		participateChallengeMutation.mutate();
	};

	// 챌린지 참여 api
	const participateChallenge = async () => {
		console.log("유저 id", user.id);
		console.log("선택한 챌린지 id", selectedChallenge.id);
		const response = await axios.post(
			"/challenge/userchallenge/participate",
			{
				user: {
					id: user.id,
				},
				challenge: {
					id: selectedChallenge.id,
				},
			},
			{
				headers: { Authorization: token },
			}
		);
		return response;
	};

	// 챌린지 참여 api Mutation
	const participateChallengeMutation = useMutation({
		mutationFn: participateChallenge,
		onSuccess: (response) => {
			console.log(response);
			message.success("챌린지에 참가되었습니다.");
			queryClient.invalidateQueries(["userChallenges", user.uid]); // 참여한 챌린지 목록 업데이트
			queryClient.invalidateQueries(["ongoingChallenges"]); // 진행중인 챌린지 목록 업데이트
		},
		onError: (error) => {
			console.log(error);
			alert("문제가 생겼습니다. 다시 시도해주세요.");
		},
	});

	// 해당 유저의 참여중인 챌린지/참여했던 챌린지 정보 받아오는 api Query
	const getUserChallenges = async () => {
		const userId = user.id;
		const { data } = await axios.get(`/challenge/userchallenge/${userId}`);
		const categorizedChallenges = {
			// 참여중인 챌린지 데이터
			participatingChallengeList: data.filter(
				(challenge) =>
					challenge.participating === "참여" &&
					challenge.successStatus === null
			),
			// 참여했던 챌린지 데이터
			participatedChallengeList: data.filter(
				(challenge) =>
					challenge.participating === "참여" &&
					challenge.successStatus !== null
			),
		};
		return categorizedChallenges;
	};

	// 진행중인 챌린지 정보 받아오기
	const getOngoingChallenges = async (userChallenges) => {
		const { data } = await axios.get("/challenge/going");
		const ongoingChallenges = data.filter((challenge) => {
			// userChallenges.participatingChallengeList에 포함되지 않는 항목만 남기기
			return !userChallenges.participatingChallengeList.some(
				(participatingChallenge) =>
					participatingChallenge.challenge.id === challenge.id
			);
		});

		return ongoingChallenges;
	};

	// useQuery 훅으로 유저의 참여중인 챌린지/참여했던 챌린지 정보 가져오기
	const {
		data: userChallenges,
		error: userChallengesError,
		isLoading: isUserChallengesLoading,
	} = useQuery({
		queryKey: ["userChallenges", user.uid],
		queryFn: getUserChallenges,
	});

	// getUserChallenges가 완료된 후에만 getOngoingChallenges를 호출하도록 설정
	const {
		data: ongoingChallenges,
		error: ongoingChallengesError,
		isLoading: isOngoingChallengesLoading,
	} = useQuery({
		queryKey: ["ongoingChallenges"],
		queryFn: () => getOngoingChallenges(userChallenges),
		enabled: !!userChallenges, // userChallenges 데이터가 존재할 때만 실행
	});

	// 날짜 차이를 계산하는 함수
	const calculateDateDifference = (endDateStr) => {
		const endDate = new Date(endDateStr);
		const currentDate = new Date();
		const timeDiff = endDate - currentDate;
		const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 차이를 일 단위로 변환
		return dayDiff;
	};

	// useEffect를 사용하여 userChallenges와 ongoingChallenges를 콘솔에 출력
	useEffect(() => {
		if (userChallenges) {
			console.log("User Challenges:", userChallenges);
		}
	}, [userChallenges]);

	useEffect(() => {
		if (ongoingChallenges) {
			console.log("Ongoing Challenges:", ongoingChallenges);
		}
	}, [ongoingChallenges]);

	// 로딩 중 화면
	if (isUserChallengesLoading || isOngoingChallengesLoading) {
		return (
			<div className="center">
				<Loading />
			</div>
		);
	}

	// 에러시 화면
	if (userChallengesError || ongoingChallengesError) {
		return (
			<div>
				유저 관련 챌린지 정보 오류 {userChallengesError} <br /> 진행중인
				챌린지 정보 오류 {ongoingChallengesError}
			</div>
		);
	}

	// api 정상적으로 작동 시 화면
	return (
		<div className="challenge-page">
			{/* 현재 유저가 참여하고 있는 챌린지들 */}
			<h2>나의 챌린지</h2>
			{userChallenges.participatingChallengeList === null ||
			userChallenges.participatingChallengeList.length === 0 ? (
				<div className="challenge">참여중인 챌린지가 없습니다.</div>
			) : (
				userChallenges.participatingChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setIsParticipatingChallenge(true);
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
						key={challenge.challenge.id}
					>
						<img
							src={challenge.challenge.img}
							alt="challenge-image"
						/>
						<div className="column">
							<h4>{challenge.challenge.title}</h4>
							<p>{challenge.challenge.subTitle}</p>
							<p>{`${calculateDateDifference(
								challenge.challenge.endDate
							)}일 남음`}</p>
						</div>
						<div className="icon-detail">
							<FontAwesomeIcon icon={faAngleRight} size={"xl"} />
						</div>
					</div>
				))
			)}

			<Divider />
			{/* 진행중인 챌린지 중에 참여 안한 것들 */}
			<h2>챌린지 참여하기</h2>
			{ongoingChallenges === null || ongoingChallenges.length === 0 ? (
				<div className="challenge">진행중인 챌린지가 없습니다.</div>
			) : (
				ongoingChallenges.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setIsParticipatingChallenge(false);
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
			{/* 유저가 참여했던 챌린지 중 기간이 지난 것 */}
			<h2>이전 챌린지</h2>
			{userChallenges.participatedChallengeList === null ||
			userChallenges.participatedChallengeList.length === 0 ? (
				<div className="challenge">참여했던 챌린지가 없습니다.</div>
			) : (
				userChallenges.participatedChallengeList.map((challenge) => (
					<div
						className="challenge"
						onClick={() => {
							setIsParticipatingChallenge(true);
							setSelectedChallenge(challenge);
							setIsModalOpen(true);
						}}
						key={challenge.challenge.id}
					>
						<img
							src={challenge.challenge.img}
							alt="challenge-image"
						/>
						<div className="column">
							<h4>{challenge.challenge.title}</h4>
							<p>{challenge.challenge.subTitle}</p>
							<p>{challenge.successStatus}</p>
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
					body: { padding: 0, margin: 0 },
				}}
			>
				{selectedChallenge &&
					(isParticipatingChallenge ? (
						// 참여중이거나 참여했던 챌린지
						<div>
							<div className="background-badge">
								<img
									src={selectedChallenge.challenge.img}
									alt="challenge-image"
								/>
							</div>
							<h3>{selectedChallenge.challenge.title}</h3>
							<br />
							<p>{selectedChallenge.challenge.subTitle}</p>
							<br />
							<p>{selectedChallenge.challenge.content}</p>
							<br />
							<div className="challenge-info">
								<p>
									<span>기간</span>
									<span>{` ~ ${selectedChallenge.challenge.endDate}`}</span>
								</p>
								<p>
									<span>참가자</span>
									<span>{`${selectedChallenge.challenge.count}`}</span>
								</p>

								<p>
									<span>진행</span>
									<span>{`${selectedChallenge.completedAttempts} / ${selectedChallenge.challenge.totalAttempts}`}</span>
								</p>
							</div>
						</div>
					) : (
						// 진행중이고 참여하지 않은 챌린지
						<div>
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
							<p>{selectedChallenge.content}</p>
							<br />
							<div className="challenge-info">
								<p>
									<span>기간</span>
									<span>{` ~ ${selectedChallenge.endDate}`}</span>
								</p>
								<p>
									<span>참가자</span>
									<span>{`${selectedChallenge.count}`}</span>
								</p>
								{selectedChallenge.participating === "참여" ? (
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
									<strong>챌린지 참여하기</strong>
								</button>
							)}
						</div>
					))}
			</Modal>
		</div>
	);
}
