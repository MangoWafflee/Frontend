import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import './App.scss';
import { useDispatch } from 'react-redux';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import AchievementPage from './pages/Achievement/AchievementPage';
import CameraRecognitionPage from './pages/CameraRecognition/CameraRecognitionPage';
import ChallengePage from './pages/Challenge/ChallengePage';
import FriendPage from './pages/Friend/FriendPage';
import IntroductionPage from './pages/Introduction/IntroductionPage';
import LoginRedirectPage from './pages/LoginRedirect/LoginRedirectPage';
import MainPage from './pages/Main/MainPage';
import NotificationCenterPage from './pages/NotificationCenter/NotificationCenterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileEditPage from './pages/ProfileEdit/ProfileEditPage';
import SmilePage from './pages/Smile/SmilePage';
import { loadUserFromLocalStorage } from './utils/authUtils';

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
  const dispatch = useDispatch();
  // 페이지 새로고침 시 로컬 스토리지에서 유저 정보를 불러옴
  useEffect(() => {
    loadUserFromLocalStorage(dispatch);
  }, [dispatch]);

  return (
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
        <Route
          path="/challenge"
          element={<ChallengePage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/camerarecognition"
          element={<CameraRecognitionPage />}
        />
        <Route
          path="/profile/edit"
          element={<ProfileEditPage />}
        />
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
  );
}

export default App;
