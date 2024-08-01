import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../app/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./LoginRedirectPage.scss";
import Loading from "../../components/Loading/Loading";

export default function LoginRedirectPage() {
	const navigate = useNavigate();
	const [hasNickname, setHasNickname] = useState(true);

	// 서버로 인가코드 보내고 토큰 받기
	const getTokenAndUserData = async (code) => {
		const response = axios
			.post(`/user/oauth2/code/kakao`, {
				code: code,
			})
			.then((response) => console.log("response", response));
		return response;
	};

	const uploadProductMutation = useMutation({
		mutationFn: getTokenAndUserData,
		onSuccess: (response) => {
			console.log(response);
			// 닉네임 null 이면 창 띄워서 등록

			navigate("/app");
		},
		onError: (error) => {
			console.log(`로그인 오류 : ${error}`);
			navigate("/");
		},
	});

	useEffect(() => {
		// 인가코드
		const code = new URL(window.location.href).searchParams.get("code");

		// 인가코드 없을 시
		if (code === "" || code === null) {
			alert("잘못된 접근 입니다.");
			navigate("/");
		}

		console.log(code);
		console.log(process.env.REACT_APP_REST_API_KEY);
		console.log(process.env.REACT_APP_KAKAO_SECRET);
		console.log(process.env.REACT_APP_KAKAO_REDIRECT_URI);

		// 인가 코드 보내고 토큰 및 유저 정보 받아오기
		// uploadProductMutation.mutate();

		// 테스트용 나중에 지울거
		axios
			.post("/user/oauth2/code/kakao", {
				code: code,
			})
			.then((response) => console.log("response", response));
	}, [navigate]);

	return (
		<div className="login-redirect-page">
			<div className="overlay"></div>
			<Loading />
			{!hasNickname && <div></div>}
		</div>
	);
}
