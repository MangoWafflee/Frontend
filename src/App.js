import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import Friend from "./pages/Friend/Friend.jsx";
import Challenge from "./pages/Challenge/Challenge.jsx";
import Mypage from "./pages/Mypage/Mypage.jsx";

function App() {
	return (
		<div className="page">
			<div className="main_box">
				<div className="wrap">
					<Routes>
						<Route path="/app" element={<Main />} />
            <Route path="/friend" element={<Friend />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/mypage" element={<Mypage />} />
					</Routes>
				</div>
				<Navbar />
			</div>
		</div>
	);
}
export default App;
