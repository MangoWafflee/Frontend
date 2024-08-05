import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import "./AchievementPage.scss";
import useFetchUserBadges from "../../hooks/useFetchUserBadges";
import axios from "../../app/axios";
import { useQuery } from "@tanstack/react-query";

export default function AchievementPage() {
	const navigate = useNavigate();
	const [uid, setUid] = useState("");
	const [token, setToken] = useState("");
	const [userId, setUserId] = useState(null);
	const { badgeList, error } = useFetchUserBadges(uid, token);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		const storedToken = localStorage.getItem("token");
		if (storedUser) {
			setUid(storedUser.uid);
			setToken(storedToken);
			setUserId(storedUser.id);
		} else {
			navigate("/");
		}
	}, [navigate]);

	// 개인 기록
	const individualRecordList = badgeList.map((badge) => ({
		id: badge.id,
		title: badge.title,
		isAchieved: badge.isAchieved,
		achievedAt: badge.achievedAt,
		img: badge.image,
	}));

	// 해당 유저의 참여했던 챌린지 정보 받아오는 api Query
	const getUserChallenges = async () => {
		const { data } = await axios.get(`/challenge/userchallenge/${userId}`);
		const categorizedChallenges = {
			// 참여했던 챌린지 데이터
			participatedChallengeList: data.filter(
				(challenge) =>
					challenge.participating === "참여" &&
					challenge.successStatus === "성공"
			),
		};
		return categorizedChallenges;
	};

	// useQuery 훅으로 유저의 참여중인 챌린지/참여했던 챌린지 정보 가져오기
	const {
		data: userChallenges,
		error: userChallengesError,
		isLoading: isUserChallengesLoading,
	} = useQuery({
		queryKey: ["userChallenges", userId],
		queryFn: getUserChallenges,
		enabled: !!userId,
	});

	return (
		<div className="ahcievement-page">
			<h2>개인 기록</h2>
			<div className="badge-container">
				{individualRecordList.length === 0 ||
				individualRecordList === null ? (
					<div>참여중인 챌린지가 없습니다.</div>
				) : (
					individualRecordList.map((record) => (
						<div className="badge" key={`individual-${record.id}`}>
							<img
								src={record.img}
								alt="challenge-image"
								className={
									record.isAchieved === "성공"
										? ""
										: "grayscale"
								}
							/>
							<div className="column">
								<p>{record.title}</p>
								{record.isAchieved && (
									<p>{record.achievedAt}</p>
								)}
							</div>
						</div>
					))
				)}
			</div>

			<Divider />
			<h2>챌린지</h2>
			<div className="badge-container">
				{isUserChallengesLoading ? (
					<div>Loading...</div>
				) : userChallengesError ? (
					<div>Error: {userChallengesError.message}</div>
				) : userChallenges?.participatingChallengeList?.length === 0 ? (
					<div className="challenge">성공했던 챌린지가 없습니다.</div>
				) : (
					userChallenges?.participatingChallengeList?.map(
						(challenge) => (
							<div className="badge" key={challenge.id}>
								<img
									src={challenge.challenge.img}
									alt="challenge-image"
									className="challenge-badge"
								/>
								<span>{challenge.challenge.title}</span>
							</div>
						)
					)
				)}
			</div>
		</div>
	);
}
