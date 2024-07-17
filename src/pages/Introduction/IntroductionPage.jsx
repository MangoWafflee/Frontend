import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./IntroductionPage.scss";
import kakaoLoginImage from '../../assets/kakao_login_large_wide.png';

export default function IntroductionPage() {
	return (
		<div className="introduction-page">
			<div className="top-layer">
				<div className="logo">logo</div>
				<div>??</div>
			</div>
			<Swiper
				pagination={{
					dynamicBullets: true,
				}}
				modules={[Pagination]}
				className="mySwiper"
			>
				<SwiperSlide>Slide 1</SwiperSlide>
				<SwiperSlide>Slide 2</SwiperSlide>
				<SwiperSlide>Slide 3</SwiperSlide>
				<SwiperSlide>Slide 4</SwiperSlide>
				<SwiperSlide>Slide 5</SwiperSlide>
				<SwiperSlide>Slide 6</SwiperSlide>
			</Swiper>
            <div className="kakao-login-button">
                <img src={kakaoLoginImage} alt="카카오 로그인 버튼" />
            </div>
            <div>
                <h1>s</h1>
                <h1>s</h1>
                <h1>s</h1>
            </div>
		</div>
	);
}
