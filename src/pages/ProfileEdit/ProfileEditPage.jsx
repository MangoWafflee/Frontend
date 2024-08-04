import React, { useState, useEffect } from 'react';
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
  login,
} from '../../features/auth/authSlice';
import { useMutation } from '@tanstack/react-query';
import axios from '../../app/axios';
import { Input, message } from 'antd';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const name = user?.name || 'test';
  const nickname = user?.nickname || 'test';
  const uid = user?.uid || 0;
  const email = user?.email || '';
  const image = user?.image || UserDefaultImage;

  const [changeImage, setChangeImage] = useState(null);
  const [searchText, setSearchText] = useState(nickname);
  const [previewImage, setPreviewImage] = useState(image);
  const [isAvailableNickname, setIsAvailableNickname] =
    useState(false);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    setIsAvailableNickname(false);
  };

  const checkNickname = async (nickname) => {
    const response = await axios.post(
      '/user/check-nickname',
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
        '사용 가능한 닉네임입니다.'
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      searchText === user.nickname &&
      (changeImage === null || changeImage === user.image)
    ) {
      message.error('변경된 사항이 없습니다.');
      return;
    }
    if (searchText !== user.nickname) {
      updateNickname();
    } else if (changeImage !== user.image) {
      updateImageData();
    } else if (
      searchText !== user.nickname &&
      changeImage !== user.image
    ) {
      updateNickname();
      updateImageData();
    }
  };

  const updateNickname = async () => {
    // 닉네임이 변경되지 않았으면 중복 체크 생략
    checkNicknameMutation.mutate(searchText, {
      onSuccess: (response) => {
        if (response.data.message === '사용 가능합니다.') {
          fetch(
            `https://mango.angrak.cloud/user/nickname/${uid}`,
            {
              method: 'POST',
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nickname: searchText,
              }),
            }
          )
            .then((response) => {
              if (response.ok) {
                const updatedUser = {
                  ...user,
                  nickname: searchText,
                };
                dispatch(updateProfile(updatedUser));
                message.success(
                  '닉네임이 성공적으로 업데이트되었습니다.'
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

  const updateImageData = async () => {
    const formData = new FormData();

    if (changeImage) {
      formData.append('image', changeImage);
    }

    try {
      const response = await fetch(
        `https://mango.angrak.cloud/user/${uid}`,
        {
          method: 'PUT',
          headers: { Authorization: `${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedUser = {
          ...user,
          image: changeImage || user.image,
        };
        dispatch(updateProfile(updatedUser));

        message.success(
          '프로필이 성공적으로 업데이트되었습니다.'
        );
        navigate('/profile');
      } else {
        throw new Error('네트워크 응답이 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setChangeImage(
        URL.createObjectURL(e.target.files[0])
      );
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
