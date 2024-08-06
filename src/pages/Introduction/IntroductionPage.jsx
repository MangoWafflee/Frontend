import React, { useEffect, useState } from "react";
import "./IntroductionPage.scss";
import kakaoLoginImage from "../../assets/kakao_login_large_wide.png";
import useNotification from "../../hooks/useNotification";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import individualRecordImage from "../../assets/images/소개_개인기록.png";
import notificationImage from "../../assets/images/소개_알림기능.png";
import smileCalendarImage from "../../assets/images/소개_웃음달력.png";
import challengeImage from "../../assets/images/소개_챌린지.png";
import friendImage from "../../assets/images/소개_친구기능.png";
import introduceVideo from '../../assets/videos/소개_영상.mp4';

export default function IntroductionPage() {
	const navigate = useNavigate();
	const notify = useNotification();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// 메뉴버튼 클릭
	const handleClick = () => {
		setIsMenuOpen((prev) => !prev);
	};

	// 스크롤 맨 위로
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			// behavior: "smooth",
		});
	};
	// netlify에 등록한 환경변수 사용
	// 카카오 리다이렉트 URI, REST_API_KEY
	const kakaoRedirectURI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
	const kakaoRestApiKey = process.env.REACT_APP_REST_API_KEY;

  const loginUrl = `https://mango.angrak.cloud/oauth2/authorization/kakao`;

	// 카카오 로그인 버튼 누를 시
	const handleLogin = async () => {
		window.location.href = loginUrl;
		console.log(loginUrl);
	};

	// 로그인 여부 확인 후 로그인 되어 있으면 메인페이지로 이동
	useEffect(() => {
		if (false) navigate("/app");
	}, [navigate]);

	return (
		<div className="introduction_page">
			{/* 메뉴바 */}
			{isMenuOpen && (
				<div className="menu">
					<button>
						<FontAwesomeIcon
							icon={faX}
							style={{ justifySelf: "flex-end" }}
							onClick={handleClick}
							size="xl"
						/>
					</button>
					<ul>
						<li>
							<span
								onClick={() => {
									handleClick();
									scrollToTop();
								}}
							>
								서비스 소개
							</span>
						</li>
						<li>
							<span onClick={handleLogin}>로그인 / 회원가입</span>
						</li>
					</ul>
				</div>
			)}
			{isMenuOpen && <div className="overlay"></div>}
			{/* 상단바 */}
			<header>
				<span>😆SmileHub</span>
				<FontAwesomeIcon
					icon={faBars}
					style={{ cursor: "pointer" }}
					onClick={handleClick}
				/>
			</header>
			<div className="empty"></div>
			{/* 소개 메인 */}
			<section>
				<div className="container"></div>
				<h2>스마일 허브</h2>
				<h2 className="gradient-text">웃음을 기록하다</h2>
				<video width="340" height="360" autoPlay muted loop>
					<source src={introduceVideo} type="video/mp4" />
				</video>
			</section>
			{/* 앱 기능 소개 */}
			<section id="app-functions">
				<h2>앱의 주요 기능들</h2>
				<ul>
					{/* 웃음 달력 기능 */}
					<li className="function">
						<div className="container">
							<strong className="function-title">
								웃음 달력
							</strong>
							<p className="function-content">
								웃은 횟수와 웃은 퍼센트를 기록해줘요.
							</p>
							<img src={smileCalendarImage} alt="관련 이미지" />
						</div>
					</li>
					{/* 친구 기능 */}
					<li className="function">
						<div className="container">
							<strong className="function-title">
								친구 기능
							</strong>
							<p className="function-content">
								친구들의 웃음의 기록을 볼 수 있어요.
							</p>
							<img src={friendImage} alt="관련 이미지" />
						</div>
					</li>
					{/* 알림기능 */}
					<li className="function">
						<div className="container">
							<strong className="function-title">
								알림 기능
							</strong>
							<p className="function-content">
								친구들의 웃음을 실시간으로 보며 선의의 경쟁을
								해봐요.
							</p>
							<img src={notificationImage} alt="관련 이미지" />
						</div>
					</li>
					{/* 개인 기록 */}
					<li className="function">
						<div className="container">
							<strong className="function-title">
								기록 달성
							</strong>
							<p className="function-content">
								개인 기록을 달성해봐요.
							</p>
							<img
								src={individualRecordImage}
								alt="관련 이미지"
							/>
						</div>
					</li>
					{/* 챌린지 */}
					<li className="function">
						<div className="container">
							<strong className="function-title">챌린지</strong>
							<p className="function-content">
								다양한 사람들과 챌린지를 도전하며 웃어봐요.
							</p>
							<img src={challengeImage} alt="관련 이미지" />
						</div>
					</li>
				</ul>
			</section>

			{/* 카카오 로그인 버튼 */}
			<img
				className="kakao_login_button"
				src={kakaoLoginImage}
				alt="카카오 로그인 버튼"
				onClick={handleLogin}
			/>
		</div>
	);
}
