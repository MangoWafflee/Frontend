// src/hooks/useFetchUserBadges.js
import { useEffect, useState } from 'react';

const useFetchUserBadges = (uid) => {
  const [userBadges, setUserBadges] = useState({
    smilecount: 0,
    badges: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      let url = `https://mango.angrak.cloud/user/uid/${uid}`; // URL 확인
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data); // 응답 데이터 출력
          setUserBadges({
            smilecount: data.smilecount,
            badges: data.badges,
          });
        } else if (response.status === 404) {
          console.log('검색 결과가 없습니다.');
          setError('검색 결과가 없습니다.');
        } else {
          console.log('서버 오류');
          setError('서버 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('데이터 요청 오류:', error);
        setError('데이터 요청 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [uid]);

  return { userBadges, error };
};

export default useFetchUserBadges;
