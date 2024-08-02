import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Button, Flex } from 'antd';
import './CameraRecognitionPage.scss';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const maxHappyPercentageRef = useRef(0); // useRef 초기화
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 360,
    height: 360,
  });
  const [happyPercentage, setHappyPercentage] = useState(0);
  const [maxHappyPercentage, setMaxHappyPercentage] =
    useState(0);
  const [videoVisible, setVideoVisible] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [animationVisible, setAnimationVisible] =
    useState(false);

  // face-api 모델 로드 및 초기화 하는 거
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            MODEL_URL
          ),
          faceapi.nets.faceExpressionNet.loadFromUri(
            MODEL_URL
          ),
        ]);
        setModelsLoaded(true);
        console.log('모든 모델이 로드되었습니다.');
      } catch (error) {
        console.error('모델 로드 에러:', error);
      }
    };

    loadModels();
  }, []);

  // 실시간 행복 치수 -> 최대 행복 치수 업데이트
  useEffect(() => {
    if (happyPercentage > maxHappyPercentageRef.current) {
      maxHappyPercentageRef.current = happyPercentage; // useRef로 업데이트
      setMaxHappyPercentage(happyPercentage);
    }
  }, [happyPercentage]);

  // 최대 행복 치수 90% 이상일 때 흔들기 애니메이션
  useEffect(() => {
    if (maxHappyPercentageRef.current > 90) {
      videoRef.current.classList.add('distort-animation');
      const timer = setTimeout(() => {
        videoRef.current.classList.remove(
          'distort-animation'
        );
        setVideoVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [maxHappyPercentage]);

  // 비디오 시작
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener(
          'loadedmetadata',
          () => {
            setVideoDimensions({
              width: 360, // 고정된 너비
              height: 360, // 고정된 높이
            });
          }
        );
      })
      .catch((err) =>
        console.error('카메라 접근 에러:', err)
      );
  };

  // 비디오 재생 시 얼굴 인식
  const handleVideoOnPlay = async () => {
    if (!videoRef.current) return;

    const canvas = faceapi.createCanvasFromMedia(
      videoRef.current
    );
    canvasRef.current = canvas;
    const displaySize = {
      width: videoDimensions.width,
      height: videoDimensions.height,
    };
    faceapi.matchDimensions(canvas, displaySize);

    const detectFaces = async () => {
      if (!videoRef.current) return;
      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const context = canvas.getContext('2d');
        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        if (resizedDetections.length > 0) {
          setFaceDetected(true); // 얼굴이 인식됨
          const happy =
            resizedDetections[0].expressions.happy;
          setHappyPercentage((happy * 100).toFixed(0));
        } else {
          setFaceDetected(false); // 얼굴이 인식되지 않음
          setHappyPercentage(0);
        }
      } catch (error) {
        console.error('얼굴 인식 에러:', error);
      }
    };
    // 0.5초마다 얼굴 인식
    const intervalId = setInterval(detectFaces, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  };

  // 모델 로드 후 비디오 시작 및 얼굴 인식 시작
  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
      videoRef.current.addEventListener(
        'play',
        handleVideoOnPlay
      );
    }
  }, [modelsLoaded]);

  // 얼굴 감지 시 비디오 주변 원 생성 애니메이션 추가
  useEffect(() => {
    if (modelsLoaded && faceDetected) {
      setAnimationVisible(true);
      videoRef.current.classList.add('animate');
      const timer = setTimeout(() => {
        setAnimationVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (!faceDetected) {
      setAnimationVisible(false);
      videoRef.current.classList.remove('animate');
    }
  }, [modelsLoaded, faceDetected]);

  return (
    <div className="camera-recognition-container">
      {videoVisible ? (
        <>
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="video-box"
            />
            {animationVisible &&
              maxHappyPercentage < 90 && (
                <svg className="circle-animation">
                  <circle cx="185" cy="180" r="175" />
                </svg>
              )}
          </div>
          <div className="emotion-display">
            {/* <div className="happy-percentage">
             {happyPercentage}%
            </div> */}
            <div className="max-happy-percentage">
              {maxHappyPercentage}%
            </div>
            {/* <div className="detected-text">
              {faceDetected
                ? '얼굴이 인식되었습니다.'
                : '얼굴이 인식되지 않았습니다.'}
            </div> */}
            <div className="happy-text">
              {maxHappyPercentage > 90
                ? '행복한 얼굴이에요!'
                : maxHappyPercentage > 70
                ? '더 크게 웃어보아요!'
                : maxHappyPercentage > 50
                ? '입이 찢어지게! 흐하하하!'
                : maxHappyPercentage > 30
                ? '수줍은 미소네요! 더 크게!'
                : '오늘도 행복한 하루를 시작하는거에요!'}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="circle-container">
            <svg
              className="circle"
              width="320"
              height="320"
            >
              <circle cx="150" cy="160" r="140" />
            </svg>
            <svg className="checkmark" viewBox="0 0 52 52">
              <path d="M14 27 L22 35 L38 19" />
            </svg>
          </div>
          <button className="url-button">URL 보내기</button>
        </>
      )}
    </div>
  );
}
