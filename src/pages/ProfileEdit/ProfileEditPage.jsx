import React, { useState, useEffect } from 'react';
import './ProfileEditPage.scss';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import UserDefaultImage from '../../assets/images/UserDefaultImage.png';
import { Input, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import axios from '../../app/axios';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [name, setName] = useState('test');
  const [nickname, setNickname] = useState('test');
  const [uid, setUid] = useState(0);
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  const [changeImage, setChangeImage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [previewImage, setPreviewImage] = useState(
    UserDefaultImage
  );

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      setName(storedUser.name || 'test');
      setNickname(storedUser.nickname || 'test');
      setUid(storedUser.uid || 0);
      setEmail(storedUser.email || '');
      if (storedUser.image == null) {
        setImage(UserDefaultImage);
        setPreviewImage(UserDefaultImage);
      } else {
        setImage(storedUser.image);
        setPreviewImage(storedUser.image);
      }
      setSearchText(storedUser.nickname || '');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.value.length <= 12) {
      setSearchText(e.target.value);
    } else {
      message.warning('닉네임은 최대 12자까지 가능합니다.');
    }
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
      } else if (
        response.data.message ===
        '사용 가능한 닉네임입니다.'
      ) {
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
                setUser(updatedUser);
                localStorage.setItem(
                  'user',
                  JSON.stringify(updatedUser)
                );
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
    formData.append('image', changeImage);
    console.log('변화 이미지', changeImage);
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
          image: changeImage, // 서버에서 반환된 실제 이미지 URL 사용
        };
        setUser(updatedUser);
        localStorage.setItem(
          'user',
          JSON.stringify(updatedUser)
        );
        console.log(updatedUser); // 업데이트된 user 객체를 출력
        message.success(
          '프로필이 성공적으로 업데이트되었습니다.'
        );
        navigate('/profile');
      } else {
        throw new Error('네트워크 응답이 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      message.error('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setChangeImage(file); // 파일 객체를 저장
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 URL 설정
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
