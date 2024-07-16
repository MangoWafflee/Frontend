import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar.jsx';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/Main/MainPage.jsx';
import FriendPage from './pages/Friend/FriendPage.jsx';
import ChallengePage from './pages/Challenge/ChallengePage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import CameraRecognitionPage from './pages/CameraRecognition/CameraRecognitionPage.jsx';

function App() {
  return (
    <div className="page">
      <div className="main_box">
        <div className="wrap">
          <Routes>
            <Route path="/app" element={<MainPage />} />
            <Route
              path="/friend"
              element={<FriendPage />}
            />
            <Route
              path="/challenge"
              element={<ChallengePage />}
            />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
            <Route
              path="/camerarecognition"
              element={<CameraRecognitionPage />}
            />
          </Routes>
        </div>
        <Navbar />
      </div>
    </div>
  );
}
export default App;
