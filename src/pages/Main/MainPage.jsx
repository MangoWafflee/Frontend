import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import WeekCalendar from "../../features/weekCalendar/WeekCalendar";
import "./MainPage.scss";
import { Progress, Card } from "antd";
import RandomJoke from "../../components/RandomJoke/RandomJoke";
import axios from "../../app/axios";
import { useQuery } from "@tanstack/react-query";

export default function MainPage() {
	const navigate = useNavigate();
	const [user, setUser] = React.useState(null);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		const storedToken = localStorage.getItem("token");
		if (storedUser && storedToken) {
			setUser(storedUser);
		} else {
			navigate("/");
		}
	}, [navigate]);

	const nickname = user ? user.nickname : "test"; // 닉네임 꺼내 쓰기
	const userId = user ? user.id : 0; // 유저 아이디

	// 해당 유저의 참여중인 챌린지/참여했던 챌린지 정보 받아오는 api Query
	const getUserChallenges = async () => {
		const userId = user.uid;
		const { data } = await axios.get(`/challenge/userchallenge/${userId}`);
		const categorizedChallenges = {
			// 참여중인 챌린지 데이터
			participatingChallengeList: data.filter(
				(challenge) =>
					challenge.participating === true &&
					challenge.success_status === null
			),
			// 참여했던 챌린지 데이터
			participatedChallengeList: data.filter(
				(challenge) =>
					challenge.participating === true &&
					challenge.success_status !== null
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
		queryKey: ["userChallenges"],
		queryFn: getUserChallenges,
	});

	// 유저 개인기록 뱃지 조회
	useEffect(() => {
		if (!user) return;

		const fetchData = async () => {
			let url = `https://mango.angrak.cloud/userbadge/${userId}`; // URL 확인
			try {
				const response = await fetch(url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status === 200) {
					const data = await response.json();
					console.log(data); // 응답 데이터 출력
				} else if (response.status === 404) {
					console.log("검색 결과가 없습니다.");
				} else {
					console.log("서버 오류");
				}
			} catch (error) {
				console.error("데이터 요청 오류:", error);
			}
		};
		fetchData();
	}, [user, userId]);

	return (
		<div className="main-page">
			<WeekCalendar />
			<div className="main-menu circular">
				{/* 개인 기록 or 뱃지 */}
				<RandomJoke />
				<div className="challenge-container circular">
					<Card
						title="개인 기록 🚩"
						extra={
							<Link to={`/profile/achievement/${nickname}`}>
								{"More"}
							</Link>
						}
						styles={{
							body: { padding: 10 },
						}}
					>
						<div className="challenge circular">
							<span>15일 웃기</span>
							<Progress
								percent={60}
								status="active"
								style={{ width: "80%" }}
							/>
						</div>
					</Card>
				</div>

				{/* 챌린지 */}
				<div className="challenge-container circular">
					<Card
						title="챌린지🔥"
						extra={<Link to="/challenge">{"More"}</Link>}
						styles={{
							body: { padding: 10 },
						}}
					>
						{isUserChallengesLoading ? (
							<div>Loading...</div>
						) : userChallengesError ? (
							<div>Error: {userChallengesError.message}</div>
						) : userChallenges.participatingChallengeList.length ===
						  0 ? (
							<div className="challenge">
								참여중인 챌린지가 없습니다.
							</div>
						) : (
							userChallenges.participatingChallengeList.map(
								(challenge) => (
									<div
										className="challenge circular"
										key={challenge.id}
									>
										<span>{challenge.title}</span>
										<Progress
											percent={75}
											status="active"
											style={{ width: "80%" }}
										/>
									</div>
								)
							)
						)}
					</Card>
				</div>
			</div>
		</div>
	);
}
