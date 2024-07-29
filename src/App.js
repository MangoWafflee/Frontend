import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import CameraRecognitionPage from "./pages/CameraRecognition/CameraRecognitionPage";
import ChallengePage from "./pages/Challenge/ChallengePage";
import FriendPage from "./pages/Friend/FriendPage";
import FriendSearchPage from "./pages/FriendSearch/FriendSearchPage";
import IntroductionPage from "./pages/Introduction/IntroductionPage";
import MainPage from "./pages/Main/MainPage";
import NotificationCenterPage from "./pages/NotificationCenter/NotificationCenterPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import LoginRedirectPage from "./pages/LoginRedirect/LoginRedirectPage";
import AchievementPage from "./pages/Achievement/AchievementPage";

const Layout = () => (
	<div className="page">
		<Header />
		<div className="wrap is_nav">
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
	return (
		<Routes>
			<Route element={<IntroductionLayout />}>
				<Route path="/" element={<IntroductionPage />} />
			</Route>
			<Route element={<Layout />}>
				<Route path="/login/oauth2/code/kakao" component={<LoginRedirectPage/>} />
				<Route path="/app" element={<MainPage />} />
				<Route
					path="/app/notification"
					element={<NotificationCenterPage />}
				/>
				<Route path="/friend" element={<FriendPage />} />
				<Route path="/friend/search" element={<FriendSearchPage />} />
				<Route path="/challenge" element={<ChallengePage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route
					path="/camerarecognition"
					element={<CameraRecognitionPage />}
				/>
        <Route
					path="/achievement"
					element={<AchievementPage />}
				/>
			</Route>
		</Routes>
	);
}

export default App;
