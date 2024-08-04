import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../app/axios';
import { useMutation } from '@tanstack/react-query';
import './LoginRedirectPage.scss';
import Loading from '../../components/Loading/Loading';
import { Input, Button, message } from 'antd';

const { Search } = Input;

export default function LoginRedirectPage() {
  const navigate = useNavigate();
  const [hasNickname, setHasNickname] = useState(true); // 유저의 닉네임 여부
  const [searchText, setSearchText] = useState(''); // 닉네임칸에 적는 텍스트
  const [isAvailableNickname, setIsAvailableNickname] =
    useState(false); // 사용 가능한 닉네임 여부

  const getUserFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    return { user, token };
  };

  const saveUserToLocalStorage = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  // 닉네임 중복 체크 버튼 클릭 시
  const handleSearch = () => {
    checkNicknameMutation.mutate(searchText); // 닉네임 중복 체크 api 실행
  };

  // 닉네임 칸 내용 변경될 시
  const handleChange = (e) => {
    setSearchText(e.target.value);
    setIsAvailableNickname(false);
  };

  // 닉네임 등록 클릭
  const handleRegister = async () => {
    registerNicknameMutation.mutate(searchText); // 닉네임 등록 api 실행
  };

  // 닉네임 중복 체크 api
  const checkNickname = async (nickname) => {
    const response = await axios.post(
      `/user/check-nickname`,
      {
        nickname: nickname,
      }
    );
    return response;
  };

  // 닉네임 중복 체크 api Mutation
  const checkNicknameMutation = useMutation({
    mutationFn: checkNickname,
    onSuccess: (response) => {
      console.log(response);
      // 해당 닉네임 존재
      if (
        response.data.message ===
        '해당 닉네임은 존재합니다.'
      ) {
        message.error(response.data.message);
      }
      // 해당 닉네임 사용 가능
      else if (
        response.data.message === '사용 가능합니다.'
      ) {
        setIsAvailableNickname(true);
        message.success(response.data.message);
      }
    },
    onError: (error) => {
      console.log(`네트워크를 확인해주세요 : ${error}`);
      navigate('/');
    },
  });

  // 닉네임 등록 api
  const registerNickname = async (nickname) => {
    const { user, token } = getUserFromLocalStorage();
    const uid = user.uid;
    const response = await axios.post(
      `/user/nickname/${uid}`,
      { nickname: nickname },
      {
        headers: { Authorization: token },
      }
    );
    return response;
  };

  // 닉네임 등록 api Mutation
  const registerNicknameMutation = useMutation({
    mutationFn: registerNickname,
    onSuccess: (response) => {
      const { user, token } = getUserFromLocalStorage();
      user.nickname = searchText;
      saveUserToLocalStorage(user, token);
      console.log(response);
      navigate('/app');
    },
    onError: (error) => {
      alert(`문제 발생 : ${error}`);
      navigate('/');
    },
  });

  // 서버로 인가코드 보내고 토큰 받는 api
  const getTokenAndUserData = async (code) => {
    const response = await axios.post(
      `/user/oauth2/code/kakao`,
      { code: code }
    );
    return response;
  };

  // 서버로 인가코드 보내고 토큰 받는 api Mutation
  const getTokenAndUserDataMutation = useMutation({
    mutationFn: getTokenAndUserData,
    onSuccess: (response) => {
      console.log(response);
      // 유저 정보 저장
      const { user, token } = response.data;
      saveUserToLocalStorage(user, token);
      // 닉네임 null 이면 닉네임 설정 창 띄우기
      if (user.nickname === null) {
        setHasNickname(false);
      }
      // null이 아니면 메인 페이지로
      else {
        navigate('/app');
      }
    },
    onError: (error) => {
      console.error('Error details:', error);

      // 에러 메시지 추출
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error';
      alert(`인가코드 오류 : ${errorMessage}`);

      navigate('/');
    },
  });

  useEffect(() => {
    // 인가코드
    const code = new URL(
      window.location.href
    ).searchParams.get('code');
    // 인가코드 없을 시
    if (code === '' || code === null) {
      alert('잘못된 접근 입니다.');
      navigate('/');
    }
    // 인가 코드 보내고 토큰 및 유저 정보 받아오기
    getTokenAndUserDataMutation.mutate(code); // 토큰, 사용자 정보 받아오는 api 실행
  }, []);

  return (
    <div className="login-redirect-page">
      <div className="overlay"></div>
      <div className="container">
        {hasNickname ? (
          <Loading />
        ) : (
          <div className="nickname-container">
            <h2>😆Welcome to SmileHub</h2>
            <h3>닉네임을 입력하세요.</h3>
            <div>
              <Search
                placeholder="닉네임을 입력하세요."
                enterButton="중복 확인"
                size="large"
                onSearch={handleSearch}
                onChange={handleChange}
                value={searchText}
              />
              <p>
                ㆍ닉네임은 최대 12자까지 가능합니다.
                <br />
                ㆍ닉네임은 후에 변경 가능합니다.
              </p>
            </div>

            <button
              disabled={!isAvailableNickname}
              onClick={handleRegister}
              className={
                isAvailableNickname
                  ? 'register-button'
                  : 'grey-button'
              }
            >
              등록
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
