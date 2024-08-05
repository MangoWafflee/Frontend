import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WeekCalendar from '../../features/weekCalendar/WeekCalendar';
import './MainPage.scss';
import { Progress, Card } from 'antd';
import RandomJoke from '../../components/RandomJoke/RandomJoke';
import axios from '../../app/axios';
import { useQuery } from '@tanstack/react-query';
import useFetchUserBadges from '../../hooks/useFetchUserBadges';

export default function MainPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [uid, setUid] = useState('');
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setToken(storedToken);
      setUid(storedUser.uid);
      setNickname(storedUser.nickname);
      setUserId(storedUser.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const { badgeList, smilecount, error } =
    useFetchUserBadges(uid, token);

  // 진행 중인 배지 중 가장 작은 requiredSmileCount를 가진 배지 찾기
  const inProgressBadge = badgeList
    .filter((badge) => badge.isAchieved === '진행중')
    .sort(
      (a, b) => a.requiredSmileCount - b.requiredSmileCount
    )[0];

  // 현재 진행중인 배지의 진행률 계산
  const progressPercent = inProgressBadge
    ? Math.min(
        (smilecount / inProgressBadge.requiredSmileCount) *
          100,
        100
      )
    : 0;

  // 현재 진행중인 배지의 이미지
  const badgeImage = inProgressBadge
    ? inProgressBadge.image
    : null;

  // 유저의 챌린지 정보를 가져오는 함수
  const getUserChallenges = async () => {
    const { data } = await axios.get(
      `/challenge/userchallenge/${userId}`
    );
    const categorizedChallenges = {
      // 참여중인 챌린지 데이터
      participatingChallengeList: data.filter(
        (challenge) =>
          challenge.participating === '참여' &&
          challenge.successStatus === null
      ),
    };
    return categorizedChallenges;
  };

  // useEffect를 사용하여 userId가 설정된 후에 쿼리 실행
  const {
    data: userChallenges,
    error: userChallengesError,
    isLoading: isUserChallengesLoading,
  } = useQuery({
    queryKey: ['mainPageUserChallenges', userId],
    queryFn: getUserChallenges,
    enabled: !!userId,
  });

  // useEffect를 사용하여 userChallenges와 ongoingChallenges를 콘솔에 출력
  useEffect(() => {
    if (userChallenges) {
      console.log('진행중인 챌린지:', userChallenges);
    }
  }, [userChallenges]);

  return (
    <div className="main-page">
      <WeekCalendar />
      <div className="main-menu circular">
        {/* 개인 기록 or 뱃지 */}
        <RandomJoke />
        <div className="challenge-container circular">
          <Card
            title="개인 기록 🚩"
            extra={
              <Link to={`/profile/achievement/${nickname}`}>
                {'More'}
              </Link>
            }
            styles={{ body: { padding: 10 } }}
          >
            {inProgressBadge ? (
              <div className="challenge circular">
                <>
                  {badgeImage && (
                    <img
                      src={badgeImage}
                      alt="badge"
                      className="badge-image"
                    />
                  )}
                </>
                <div className="flex-column">
                  <span>{inProgressBadge.title}</span>
                  {/* 뱃지 이미지 넣기 */}

                  <Progress
                    percent={progressPercent}
                    status="active"
                  />
                </div>
              </div>
            ) : (
              <div className="challenge">
                😎 모든 기록을 완료했습니다! 😎
              </div>
            )}
          </Card>
        </div>

        {/* 챌린지 */}
        <div className="challenge-container circular">
          <Card
            title="챌린지🔥"
            extra={<Link to="/challenge">{'More'}</Link>}
            styles={{ body: { padding: 10 } }}
          >
            {isUserChallengesLoading ? (
              <div>Loading...</div>
            ) : userChallengesError ? (
              <div>
                Error: {userChallengesError.message}
              </div>
            ) : userChallenges?.participatingChallengeList
                ?.length === 0 ? (
              <div className="challenge">
                참여중인 챌린지가 없습니다.
              </div>
            ) : (
              userChallenges?.participatingChallengeList?.map(
                (challenge) => (
                  <div
                    className="challenge circular"
                    key={challenge.id}
                  >
                    <img
                      src={challenge.challenge.img}
                      alt="challenge-image"
                      className="challenge-image"
                    />
                    <div>
                      <span>
                        {challenge.challenge.title}
                      </span>
                      <Progress
                        percent={challenge.completedAttempts ===0 ? 0 :
                          Math.floor((challenge.challenge.totalAttempts / challenge.completedAttempts) * 100)
                        }
                        status="active"
                      />
                    </div>
                  </div>
                )
              )
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
