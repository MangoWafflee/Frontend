import React from 'react';
import './FriendPage.scss';
import { useNavigate } from 'react-router-dom';

export default function FriendPage() {

  const navigate=useNavigate();

  return <div>
    <header>
      <h1>친구</h1>
      <div className='icons'>
      <span onClick={()=>navigate('/friend/search')}>search</span>
      <span>add-friend</span>
      <span>setting</span>
      </div>
      
    </header>
    <main>
      <div className="friend-tile">
      <img
							src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
							alt="유저 이미지"
						/>
						<div className="friend-info">
							<span>손흥민</span>
							<span>부가설명</span>
						</div>
      </div>
    </main>
    
  </div>;
}
