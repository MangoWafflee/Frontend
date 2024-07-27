import React from "react";
import "./ProfilePage.scss";

export default function ProfilePage() {
	return (
		<div id="profile-page">
			{/* 뒷 배경 */}
			<div className="background-image">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWdvPZnRnpX31ruZmECZRI4jRA1YuZdIBdzw&s"
					alt=""
				/>
			</div>
			{/* 유저 이미지 */}
			<div className="user-image">
				<img
					src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
					alt=""
				/>
        <p>이상현</p>
			</div>
      {/* 유저 관련 포인트? */}
      <div className="user-point">
        <div>
          <p>획득 배지</p>
          <p>11</p>
        </div>
        <div>
          <p>웃은 횟수</p>
          <p>100</p>
        </div>
        <div>
          <p>미정</p>
          <p>??</p>
        </div>
      </div>
      {/* 메뉴? */}
      <div className="menus">
        <div className="menu">
          <span>🐛 고객센터</span>
          <span>{'>'}</span>
        </div>
        <h3>내 정보</h3>
        <div className="menu2">
          <span>🐛 프로필 편집</span>
          <span>{'>'}</span>
        </div>
      </div>
		</div>
	);
}
