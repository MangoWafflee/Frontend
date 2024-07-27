import React from 'react';
import './Header.scss';
import {useNavigate} from 'react-router-dom';

export default function Header() {

  const navigate=useNavigate();

  return (
    <header>
      {/* 앱 로고 및 알림 아이콘 */}
      <div className="top_layer">
        <div className="logo">logo</div>
        <div onClick={()=>navigate('/app/notification')}>💡 </div>
      </div>
    </header>
  );
}
