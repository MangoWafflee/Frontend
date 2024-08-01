import React from "react";
import Smile from "../../assets/icons/smile_icon.png";
import "./Loading.scss";

export default function Loading() {
	return (
		<div className="loading">
			<div className="rotate">
				<img src={Smile} alt="" />
			</div>
			<span>정보를 가져오는 중입니다...</span>
		</div>
	);
}
