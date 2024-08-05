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
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState('');
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState(0);

  const { badgeList, error } = useFetchUserBadges(uid);
  // 진행 중인 배지 중 가장 작은 requiredSmileCount를 가진 배지 찾기
  const inProgressBadge = badgeList.badges
    .filter((badge) => badge.isAchieved === '진행중')
    .sort(
      (a, b) => a.requiredSmileCount - b.requiredSmileCount
    )[0];

  const progressPercent = inProgressBadge
    ? Math.min(
        (badgeList.smilecount /
          inProgressBadge.requiredSmileCount) *
          100,
        100
      )
    : 0;
  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setUid(storedUser.uid);
      setNickname(storedUser.nickname);
      setUserId(storedUser.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 해당 유저의 참여중인 챌린지/참여했던 챌린지 정보 받아오는 api Query
  const getUserChallenges = async () => {
    const userId = user.uid;
    const { data } = await axios.get(
      `/challenge/userchallenge/${userId}`
    );
    const categorizedChallenges = {
      // 참여중인 챌린지 데이터
      participatingChallengeList: data.filter(
        (challenge) =>
          challenge.participating === true &&
          challenge.success_status === null
      ),
      // 참여했던 챌린지 데이터
      participatedChallengeList: data.filter(
        (challenge) =>
          challenge.participating === true &&
          challenge.success_status !== null
      ),
    };
    return categorizedChallenges;
  };

  // useQuery 훅으로 유저의 참여중인 챌린지/참여했던 챌린지 정보 가져오기
  const {
    data: userChallenges,
    error: userChallengesError,
    isLoading: isUserChallengesLoading,
  } = useQuery({
    queryKey: ['userChallenges'],
    queryFn: getUserChallenges,
  });

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
            styles={{
              body: { padding: 10 },
            }}
          >
            <div className="challenge circular">
              <span>{inProgressBadge.title}</span>
              <Progress
                percent={progressPercent}
                status="active"
                style={{ width: '80%' }}
              />
            </div>
          </Card>
        </div>

        {/* 챌린지 */}
        <div className="challenge-container circular">
          <Card
            title="챌린지🔥"
            extra={<Link to="/challenge">{'More'}</Link>}
            styles={{
              body: { padding: 10 },
            }}
          >
            {isUserChallengesLoading ? (
              <div>Loading...</div>
            ) : userChallengesError ? (
              <div>
                Error: {userChallengesError.message}
              </div>
            ) : userChallenges.participatingChallengeList
                .length === 0 ? (
              <div className="challenge">
                참여중인 챌린지가 없습니다.
              </div>
            ) : (
              userChallenges.participatingChallengeList.map(
                (challenge) => (
                  <div
                    className="challenge circular"
                    key={challenge.id}
                  >
                    <span>{challenge.title}</span>
                    <Progress
                      percent={75}
                      status="active"
                      style={{ width: '80%' }}
                    />
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
