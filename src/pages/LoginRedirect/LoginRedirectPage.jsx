import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../app/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./LoginRedirectPage.scss";
import Loading from "../../components/Loading/Loading";
import { Input, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
	login,
	selectUser,
	selectIsLoggedIn,
	selectToken,
} from "../../features/auth/authSlice";

const { Search } = Input;

export default function LoginRedirectPage() {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const token = useSelector(selectToken);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [hasNickname, setHasNickname] = useState(true); // 유저의 닉네임 여부
	const [searchText, setSearchText] = useState(""); // 닉네임칸에 적는 텍스트
	const [isAvailableNickname, setIsAvailableNickname] = useState(false); // 사용 가능한 닉네임 여부

	// 닉네임 중복 체크 버튼 클릭 시
	const handleSearch = () => {
		checkNicknameMutation.mutate(); // 닉네임 중복 체크 api 실행
	};

	// 닉네임 칸 내용 변경될 시
	const handleChange = (e) => {
		setSearchText(e.target.value);
		setIsAvailableNickname(false);
	};

	// 닉네임 등록 클릭
	const handleRegister = async () => {
		registerNicknameMutation.mutate(); // 닉네임 등록 api 실행
	};

	// 닉네임 중복 체크 api
	const checkNickname = async () => {
		const response = await axios
			.post(`/user/check-nickname`, {
				nickname: searchText,
			})
		return response;
	};

	// 닉네임 중복 체크 api Mutation
	const checkNicknameMutation = useMutation({
		mutationFn: checkNickname,
		onSuccess: (response) => {
			console.log(response)
			// 해당 닉네임 존재
			if (response.data.message === "해당 닉네임은 존재합니다.") {
				message.error(response.data.message);
			} 
			// 해당 닉네임 사용 가능
			else if (
				response.data.message === "사용 가능합니다."
			) {
				setIsAvailableNickname(true);
				message.success(response.data.message);
			}
		},
		onError: (error) => {
			console.log(`네트워크를 확인해주세요 : ${error}`);
			navigate("/");
		},
	});

	// 닉네임 등록 api
	const registerNickname = async () => {
		const uid = user.uid;
		const response = await axios
			.post(
				`/nickname/${uid}`,
				{
					nickname: searchText,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			)
		return response;
	};

	// 닉네임 등록 api Mutation
	const registerNicknameMutation = useMutation({
		mutationFn: registerNickname,
		onSuccess: (response) => {
			console.log(response)
			navigate("/app");
		},
		onError: (error) => {
			alert(`문제 발생 : ${error}`)
			navigate("/");
		},
	});

	// 서버로 인가코드 보내고 토큰 받는 api
	const getTokenAndUserData = async (code) => {
		const response = await axios
			.post(`/user/oauth2/code/kakao`, {
				code: code,
			})
		return response;
	};

	// 서버로 인가코드 보내고 토큰 받는 api Mutation
	const getTokenAndUserDataMutation = useMutation({
		mutationFn: getTokenAndUserData,
		onSuccess: (response) => {
			console.log(response)
			// 유저 정보 저장
			dispatch(login(response.data));
			// 닉네임 null 이면 닉네임 설정 창 띄우기
			if (response.data.user.nickname === null) {
				setHasNickname(false);
			} 
			// null이 아니면 메인 페이지로
			else{
				navigate('/app');
			}
		},
		onError: (error) => {
			alert("인가코드 오류입니다. 다시 로그인해주세요.")
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

		// 인가 코드 보내고 토큰 및 유저 정보 받아오기
		getTokenAndUserDataMutation.mutate(code); // 토큰, 사용자 정보 받아오는 api 실행
	}, []);

	return (
		<div className="login-redirect-page">
			<div className="overlay"></div>
			<div className="container">
				{hasNickname ? (
					<Loading />
				) : (
					<div>
						<h2>환영합니다.</h2>
						<h3>닉네임을 등록해주세요</h3>
						<Search
							placeholder="닉네임을 입력하세요."
							enterButton="중복 확인"
							size="large"
							onSearch={handleSearch}
							onChange={handleChange}
							value={searchText}
						/>
						<p>4 ~ 12 자 이하요</p>
						<Button
							type="primary"
							size="large"
							disabled={!isAvailableNickname}
							onClick={handleRegister}
						>
							등록
						</Button>	
					</div>
				)}
			</div>
		</div>
	);
}
