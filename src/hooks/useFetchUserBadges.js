// src/hooks/useFetchUserBadges.js
import { useEffect, useState } from 'react';

const useFetchUserBadges = (uid, token) => {
  const [badgeList, setBadgeList] = useState([]);
  const [smilecount, setSmilecount] = useState(0); // smilecount 추가
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      let url = `https://mango.angrak.cloud/user/uid/${uid}`; // URL 확인
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data); // 응답 데이터 출력
          setBadgeList(data.badges); // 뱃지에 대한 배열 데이터만 저장
          setSmilecount(data.smilecount); // smilecount 저장
        } else if (response.status === 404) {
          console.log('검색 결과가 없습니다.');
          setError('검색 결과가 없습니다.');
        } else {
          console.log('서버 오류');
          console.log(response.status);
          setError('서버 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('데이터 요청 오류:', error);
        setError('데이터 요청 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [uid]);

  return { badgeList, smilecount, error };
};

export default useFetchUserBadges;
