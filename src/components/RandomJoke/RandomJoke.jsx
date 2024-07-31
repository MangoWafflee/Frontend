import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Progress } from 'antd';
import './RandomJoke.scss';

const jokes = [
  {
    question: '왜 수학책은 항상 슬플까요?',
    answer: '문제투성이니까요!',
  },
  {
    question:
      '벽에 걸린 시계가 수영을 배우려고 하면 뭐가 될까요?',
    answer: '타이머!',
  },
  {
    question: '바나나가 자꾸 넘어지는 이유는 뭘까요?',
    answer: '껍질을 벗고 있어서요!',
  },
  {
    question: '왜 달팽이는 항상 집을 가지고 다닐까요?',
    answer: '집 없으면 고달프니까요!',
  },
  {
    question: '한 소가 다른 소에게 뭐라고 했을까요?',
    answer: '"무~~~!"',
  },
  {
    question: '왜 과학자는 책을 먹었을까요?',
    answer: '지식을 소화하려고요!',
  },
  {
    question: '왜 컴퓨터는 바다를 싫어할까요?',
    answer: '바이러스에 감염될까봐요!',
  },
  {
    question: '커피는 왜 경찰을 좋아할까요?',
    answer: '항상 잡아주니까요!',
  },
  {
    question: '왜 집이 웃을 수 있을까요?',
    answer: '창문이 있어서요!',
  },
  {
    question: '왜 수박은 결혼할 수 없을까요?',
    answer: '씨가 있어서요!',
  },
  {
    question: '왜 피아노는 항상 잠을 잘 자요?',
    answer: '건반이 있어서요!',
  },
  {
    question: '왜 바다에서는 수영을 할 수 없을까요?',
    answer: '물이 다 짜서요!',
  },
  {
    question: '왜 코끼리는 컴퓨터를 싫어할까요?',
    answer: '너무 무겁게 느껴져서요!',
  },
  {
    question: '왜 도넛은 경찰을 좋아할까요?',
    answer: '항상 반갑게 맞아주니까요!',
  },
  {
    question: '왜 숟가락은 항상 웃을까요?',
    answer: '자꾸 떠서요!',
  },
  {
    question: '왜 개구리는 항상 행복할까요?',
    answer: '팔다리가 있어서요!',
  },
  {
    question: '왜 비는 항상 노래를 부를까요?',
    answer: '물방울들이 춤을 추니까요!',
  },
  {
    question: '왜 초콜릿은 항상 달콤할까요?',
    answer: '자꾸 녹아서요!',
  },
  {
    question: '왜 거북이는 항상 느릴까요?',
    answer: '집을 등에 메고 있어서요!',
  },
  {
    question: '왜 유령은 수학을 좋아할까요?',
    answer: '항상 소수점에 집착하니까요!',
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
