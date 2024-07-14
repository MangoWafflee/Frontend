import React from 'react';
import './Navbar.scss';

export default function Navbar() {
  return (
    <nav className='nav_container'>
      <ul className='nav_bar'>
        <li>홈</li>
        <li>친구</li>
        <li>챌린지</li>
        <li>마이</li>
      </ul>
    </nav>
  )
}
