import React from 'react';
import './Header.scss';

export default function Header() {
  return (
    <header>
      {/* 앱 로고 및 알림 아이콘 */}
      <div className="top_layer">
        <div className="logo">logo</div>
        <div>notification</div>
      </div>
    </header>
  );
}
