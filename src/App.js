import React from 'react';
import './App.css';
import { Route, Routes, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar/Navbar';
import MainPage from './pages/Main/MainPage';
import FriendPage from './pages/Friend/FriendPage';
import ChallengePage from './pages/Challenge/ChallengePage';
import ProfilePage from './pages/Profile/ProfilePage';
import CameraRecognitionPage from './pages/CameraRecognition/CameraRecognitionPage';
import IntroductionPage from './pages/Introduction/IntroductionPage';
import NotificationCenterPage from './pages/NotificationCenter/NotificationCenterPage';
import FriendSearchPage from './pages/FriendSearch/FriendSearchPage';

const Layout = () => (
  <div className="page">
    <div className="wrap is_nav">
      <Outlet />
    </div>
    <Navbar />
  </div>
);

const IntroductionLayout = () => (
  <div className="page">
    <div className="wrap">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<IntroductionLayout />}>
        <Route path="/" element={<IntroductionPage />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/notification" element={<NotificationCenterPage/>} />
        <Route path="/friend" element={<FriendPage />} />
        <Route path="/friend/search" element={<FriendSearchPage />} />
        <Route
          path="/challenge"
          element={<ChallengePage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/camerarecognition"
          element={<CameraRecognitionPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
