import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Button, Flex } from 'antd';
import './CameraRecognitionPage.scss';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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

  useEffect(() => {
    if (happyPercentage > maxHappyPercentage) {
      setMaxHappyPercentage(happyPercentage);
    }

    if (maxHappyPercentage > 70) {
      const timer = setTimeout(() => {
        setVideoVisible(false);
      }, 3000);
      return () => clearTimeout(timer); // 타이머를 정리합니다.
    }
  }, [happyPercentage, maxHappyPercentage]);

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
          if (happy > maxHappyPercentage) {
            setHappyPercentage((happy * 100).toFixed(0));
          }
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

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
      videoRef.current.addEventListener(
        'play',
        handleVideoOnPlay
      );
    }
  }, [modelsLoaded]);

  useEffect(() => {
    if (modelsLoaded && faceDetected) {
      setAnimationVisible(true);
      const timer = setTimeout(
        () => setAnimationVisible(false),
        3000
      );
      return () => clearTimeout(timer);
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
            {animationVisible && (
              <svg className="circle-animation">
                <circle cx="185" cy="180" r="175" />
              </svg>
            )}
          </div>
          <div className="emotion-display">
            <div className="happy-percentage">
              현재 행복도: {happyPercentage}%
            </div>
            <div className="max-happy-percentage">
              최고 행복도: {maxHappyPercentage}%
            </div>
            <div>
              얼굴 인식 상태:{' '}
              {faceDetected
                ? '얼굴이 인식되었습니다.'
                : '얼굴이 인식되지 않았습니다.'}
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
          <Flex gap="small" wrap>
            <Button type="primary">
              {'링크 URL 보내기'}
            </Button>
          </Flex>
        </>
      )}
    </div>
  );
}
