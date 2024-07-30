import React,{useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function LoginRedirectPage() {
  const navigate=useNavigate();

  useEffect(()=>{
    // 인가코드
    const code = new URL(window.location.href).searchParams.get("code");

    // 인가코드 없을 시
    if(code ==="" || code===null){
      alert("잘못된 접근 입니다.");
      navigate('/');
    }

    console.log(code);

    // 서버로 인가코드 보내고 토큰 받기
    // axios.post("https://mango.angrak.cloud/user/oauth2/code/kakao",{
    //   code:code
    // }).then((response)=>console.log("response",response))

  },[navigate])

  return (
    <div>
      <h1>로그인 중...</h1>
    </div>
  )
}
