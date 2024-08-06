import React, { useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import AchievementPage from "./pages/Achievement/AchievementPage";
import CameraRecognitionPage from "./pages/CameraRecognition/CameraRecognitionPage";
import ChallengePage from "./pages/Challenge/ChallengePage";
import FriendPage from "./pages/Friend/FriendPage";
import IntroductionPage from "./pages/Introduction/IntroductionPage";
import LoginRedirectPage from "./pages/LoginRedirect/LoginRedirectPage";
import MainPage from "./pages/Main/MainPage";
import NotificationCenterPage from "./pages/NotificationCenter/NotificationCenterPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProfileEditPage from "./pages/ProfileEdit/ProfileEditPage";
import SmilePage from "./pages/Smile/SmilePage";
import { Divider, Modal, message } from "antd";

const Layout = () => (
	<div className="page">
		<Header />
		<div className="is_nav">
			<Outlet />
		</div>
		<Navbar />
	</div>
);

const IntroductionLayout = () => (
	<div className="page">
		<Outlet />
	</div>
);

function App() {
	// state를 사용하여 deferredPrompt와 isInstallable 값을 관리
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [isInstallable, setIsInstallable] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		// beforeinstallprompt 이벤트를 처리하는 함수
		const handleBeforeInstallPrompt = (e) => {
			// 기본 행동 방지
			e.preventDefault();
			// deferredPrompt에 이벤트 저장
			setDeferredPrompt(e);
			// 설치 버튼을 표시하기 위해 isInstallable 상태를 true로 설정
			setIsInstallable(true);
			// 모달을 열도록 설정
			setIsModalOpen(true);
		};

		// beforeinstallprompt 이벤트 리스너 추가
		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt
		);

		// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
		};
	}, []);

	// 설치 버튼 클릭 시 호출되는 함수
	const handleInstallClick = () => {
		if (deferredPrompt) {
			// 설치 프롬프트 표시
			deferredPrompt.prompt();
			// 사용자가 설치 프롬프트에 응답한 결과 처리
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the install prompt");
				} else {
					console.log("User dismissed the install prompt");
				}
				// deferredPrompt와 isInstallable 상태를 초기화
				setDeferredPrompt(null);
				setIsInstallable(false);
			});
		}
		setIsModalOpen(false); // 모달을 닫도록 설정
	};

	const handleCancel = () => {
		setIsModalOpen(false); // 모달을 닫도록 설정
	};

	return (
		<>
			<Modal
				title="웹을 앱처럼 사용해보세요"
				open={isModalOpen}
				onOk={handleInstallClick}
				onCancel={handleCancel}
				okText="설치"
				cancelText="취소"
			>
				<p>
					이 웹사이트를 앱처럼 사용해보세요.
					<br /> 홈 화면에 추가하여 간편하게 접근할 수 있습니다.
				</p>
			</Modal>
			<Routes>
				<Route element={<IntroductionLayout />}>
					<Route path="/" element={<IntroductionPage />} />
					<Route
						path="/user/oauth2/code/kakao"
						element={<LoginRedirectPage />}
					/>
				</Route>
				<Route element={<Layout />}>
					<Route path="/app" element={<MainPage />} />
					<Route
						path="/app/notification"
						element={<NotificationCenterPage />}
					/>
					<Route path="/friend" element={<FriendPage />} />
					<Route path="/challenge" element={<ChallengePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route
						path="/camerarecognition"
						element={<CameraRecognitionPage />}
					/>
					<Route path="/profile/edit" element={<ProfileEditPage />} />
					<Route
						path="/profile/smile/:nickname"
						element={<SmilePage />}
					/>
					<Route
						path="/profile/achievement/:nickname"
						element={<AchievementPage />}
					/>
				</Route>
			</Routes>
		</>
	);
}

export default App;
