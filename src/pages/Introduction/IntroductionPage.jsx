import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./IntroductionPage.scss";
import kakaoLoginImage from "../../assets/kakao_login_large_wide.png";
import Header from "../../components/Header/Header";
import useNotification from "../../hooks/useNotification";
import { useNavigate, Link } from "react-router-dom";

export default function IntroductionPage() {
	// 로그인 여부 확인 후 로그인 되어 있으면 메인페이지로 이동

	const navigate = useNavigate();
	const notify = useNotification();

	useEffect(() => {
		if (false) navigate("/app");
	}, [navigate]);

	return (
		<div className="introduction_page">
			<Header />
			<Swiper
				pagination={{
					dynamicBullets: true,
				}}
				modules={[Pagination]}
			>
				<SwiperSlide>Slide 1</SwiperSlide>
				<SwiperSlide>Slide 2</SwiperSlide>
				<SwiperSlide>Slide 3</SwiperSlide>
				<SwiperSlide>Slide 4</SwiperSlide>
				<SwiperSlide>Slide 5</SwiperSlide>
				<SwiperSlide>Slide 6</SwiperSlide>
			</Swiper>
			<div className="kakao_login_button">
				<a href="https://mango.angrak.cloud">
					<img src={kakaoLoginImage} alt="카카오 로그인 버튼" />
				</a>
			</div>

			<div className="to_main" onClick={() => navigate("/app")}>메인 페이지로!</div>

			<div
				onClick={() => {
					notify("Hello!", {
						body: "This is a notification",
					});
				}}
			>
				알림 버튼 알림 버튼 알림 버튼 알림 버튼
			</div>
		</div>
	);
}
