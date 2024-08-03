import React, { useState } from 'react';
import './ProfileEditPage.scss';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import UserDefaultImage from '../../assets/images/UserDefaultImage.png';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  selectToken,
  updateProfile,
} from '../../features/auth/authSlice';
import { useMutation } from '@tanstack/react-query';
import axios from '../../app/axios';
import { Input, message } from 'antd';

const { Search } = Input;

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const name = user ? user.name : 'test';
  const nickname = user ? user.nickname : 'test';
  const userId = user ? user.id : 0;
  const uid = user ? user.uid : 0;
  const email = user ? user.email : '';
  const image =
    user && user.image ? user.image : UserDefaultImage;
  const [changeImage, setChangeImage] = useState(image);
  const [changeNickname, setChangeNickname] =
    useState(nickname);
  const [previewImage, setPreviewImage] = useState(image);

  const [searchText, setSearchText] = useState('');
  const [isAvailableNickname, setIsAvailableNickname] =
    useState(false);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    setIsAvailableNickname(false);
  };

  const checkNickname = async (nickname) => {
    const response = await axios.post(
      `/user/check-nickname`,
      { nickname }
    );
    return response;
  };

  const checkNicknameMutation = useMutation({
    mutationFn: checkNickname,
    onSuccess: (response) => {
      if (
        response.data.message ===
        '해당 닉네임은 존재합니다.'
      ) {
        message.error(response.data.message);
        setIsAvailableNickname(false);
      } else if (
        response.data.message ===
        '닉네임이 성공적으로 저장되었습니다.'
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

  const registerNickname = async (nickname) => {
    const response = await axios.post(
      `/user/nickname/${uid}`,
      { nickname },
      {
        headers: { Authorization: token },
      }
    );
    return response;
  };

  const registerNicknameMutation = useMutation({
    mutationFn: registerNickname,
    onSuccess: (response) => {
      dispatch(updateProfile({ nickname: searchText }));
      message.success(
        '닉네임이 성공적으로 저장되었습니다.'
      );
      navigate('/profile');
    },
    onError: (error) => {
      alert(`문제 발생 : ${error}`);
      navigate('/');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 닉네임 중복 체크 먼저 수행
    checkNicknameMutation.mutate(searchText, {
      onSuccess: (response) => {
        if (
          response.data.message ===
          '닉네임이 성공적으로 저장되었습니다.'
        ) {
          var formData = new FormData();
          formData.append(
            'userData',
            JSON.stringify({ nickname: searchText })
          );
          formData.append('image', changeImage);

          fetch(`https://mango.angrak.cloud/user/${uid}`, {
            method: 'PUT',
            headers: { Authorization: `${token}` },
            body: formData,
          })
            .then((response) => {
              if (response.ok) {
                dispatch(
                  updateProfile({
                    nickname: searchText,
                    image: changeImage,
                  })
                );

                navigate('/profile');
                return response.json();
              }
              throw new Error(
                '네트워크 응답이 실패했습니다.'
              );
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          message.error(response.data.message);
        }
      },
      onError: (error) => {
        console.log(`네트워크를 확인해주세요 : ${error}`);
        navigate('/');
      },
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setChangeImage(e.target.files[0]);
      setPreviewImage(
        URL.createObjectURL(e.target.files[0])
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit">
      <div className="userEdit-image">
        <img src={previewImage} alt="프로필 사진" />
        <label className="edit-icon">
          <FontAwesomeIcon icon={faCamera} />
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="userEdit-info-container">
        <label>이름</label>
        <div className="no-input">{name}</div>

        <label>로그인 된 아이디</label>
        <div className="no-input">{email}</div>

        <label>닉네임</label>
        <div className="userEdit-nickname">
          <Input
            placeholder="닉네임을 입력하세요."
            size="large"
            onChange={handleChange}
            value={searchText}
          />
        </div>
      </div>
      <div className="submit-button-container">
        <button className="submit-button" type="submit">
          저장하기
        </button>
      </div>
    </form>
  );
}
