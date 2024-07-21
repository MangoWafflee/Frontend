import React from 'react';
import './App.css';
import { Route, Routes, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar/Navbar.jsx';
import MainPage from './pages/Main/MainPage.jsx';
import FriendPage from './pages/Friend/FriendPage.jsx';
import ChallengePage from './pages/Challenge/ChallengePage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import CameraRecognitionPage from './pages/CameraRecognition/CameraRecognitionPage.jsx';
import IntroductionPage from './pages/Introduction/IntroductionPage.jsx';

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
    <div className="main_box">
      <div className="wrap">
        <Outlet />
      </div>
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
      </Route>
    </Routes>
  );
}

export default App;
