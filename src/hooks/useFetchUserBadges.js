import { useEffect, useState } from 'react';
import level1 from '../assets/badges/level1.png';
import level2 from '../assets/badges/level2.png';
import level3 from '../assets/badges/level3.png';
import level4 from '../assets/badges/level4.png';
import level5 from '../assets/badges/level5.png';
import level6 from '../assets/badges/level6.png';
import level7 from '../assets/badges/level7.png';
import level8 from '../assets/badges/level8.png';
import level9 from '../assets/badges/level9.png';

const useFetchUserBadges = (uid, token) => {
  const [badgeList, setBadgeList] = useState([]);
  const [smilecount, setSmilecount] = useState(0);
  const [error, setError] = useState(null);

  const badgeImages = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
  ];

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      let url = `https://mango.angrak.cloud/user/uid/${uid}`; // URL 확인
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data); // 응답 데이터 출력

          // badgeList에 이미지를 추가
          const badgesWithImages = data.badges.map(
            (badge, index) => ({
              ...badge,
              image:
                badgeImages[index % badgeImages.length],
            })
          );

          setBadgeList(badgesWithImages); // 뱃지에 대한 배열 데이터만 저장
          setSmilecount(data.smilecount); // smilecount 저장
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
  }, [uid, token]);

  return { badgeList, smilecount, error };
};

export default useFetchUserBadges;
