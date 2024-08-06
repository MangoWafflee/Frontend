import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Progress } from 'antd';
import './RandomJoke.scss';

const jokes = [
  {
    question: '타이타닉의 구명보트는 몇 명이 탈수 있을까?',
    answer: '9명',
  },
  {
    question: '한국에서 가장 급하게 만든 떡은 ?',
    answer: '헐레벌떡',
  },
  {
    question: '개가 사람을 가르친다를 네 글자로 하면?',
    answer: '개인지도',
  },
  {
    question: '거지가 빨간색 말을 타고 가는 것은?',
    answer: '새빨간 거짓말',
  },
  {
    question: '새 중에서 가장 빠른 새는?',
    answer: '눈 깜작할 새',
  },
  {
    question: '도둑이 가장 싫어하는 아이스크림은?',
    answer: '누가바',
  },
  {
    question: '미소의 반대말은?',
    answer: '당기소!',
  },
  {
    question: '호주의 돈을 뭐라고 하는가?',
    answer: '호주머니',
  },
  {
    question: '텔레토비가 차린 안경점 이름은?',
    answer: '아이조아',
  },
  {
    question: '학생들이 싫어하는 피자는',
    answer: '책 피자',
  },
  {
    question: '공이 웃으면?',
    answer: '풋볼!',
  },
  {
    question: '세상에서 제일 뜨거운 과일은?',
    answer: '천도복숭아',
  },
];

const RandomJoke = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentJoke, setCurrentJoke] = useState(
    getRandomJoke()
  );

  function getRandomJoke() {
    const randomIndex = Math.floor(
      Math.random() * jokes.length
    );
    return jokes[randomIndex];
  }

  const handleNewJoke = () => {
    setCurrentJoke(getRandomJoke());
    setShowAnswer(false);
  };

  return (
    <div className="joke-card">
      <Card
        title="웃음을 위한 농담"
        extra={<Link onClick={handleNewJoke}>농담</Link>}
        styles={{
          body: { padding: 10 },
        }}
      >
        <div className="box">
          <p>{currentJoke.question}</p>
          <Button
            style={{ marginTop: '10px' }}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? '숨기기' : '답변 보기'}
          </Button>
          {showAnswer && (
            <p style={{ marginTop: '10px', color: 'blue' }}>
              {currentJoke.answer}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RandomJoke;
