// import React from "react";
// import { ReactComponent as SearchSVG } from '../../assets/icons/Search.svg';
// import { useNavigate } from "react-router-dom";
// import './FriendSearchPage.scss'

// export default function FriendSearchPage() {
// 	const navigate = useNavigate();
// 	return (
// 		<div>
// 			<header>
//                 <div className="search-bar">
// 					{/* 크기 조정 필요 */}
//                     <SearchSVG/>
//                     <input type="text" placeholder="검색" maxLength={20}/>
//                 </div>
// 				<span onClick={() => navigate(-1)}>취소</span>
// 			</header>
// 			<main>
// 				<div className="friend-tile">
// 					<img
// 						src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
// 						alt="유저 이미지"
// 					/>
// 					<div className="friend-info">
// 						<span>손흥민</span>
// 						<span>부가설명</span>
// 					</div>
//                     <button className="friend-request-button">친구 추가</button>
// 				</div>
// 			</main>
// 		</div>
// 	);
// }
