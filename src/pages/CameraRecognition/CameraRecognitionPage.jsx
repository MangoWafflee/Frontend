import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Button, Flex } from 'antd';
import './CameraRecognitionPage.scss';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 1,
    height: 1,
  });
  const [happyPercentage, setHappyPercentage] = useState(0);
  const [maxHappyPercentage, setMaxHappyPercentage] =
    useState(0);
  const [videoVisible, setVideoVisible] = useState(true);

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
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
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
          const happy =
            resizedDetections[0].expressions.happy;
          setHappyPercentage((happy * 100).toFixed(0));
        } else {
          setHappyPercentage(0);
        }
      } catch (error) {
        console.error('얼굴 인식 에러:', error);
      }
    };
    // 1초마다 얼굴 인식
    const intervalId = setInterval(detectFaces, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  };

  const handleStartButtonClick = () => {
    if (modelsLoaded) {
      startVideo();
      videoRef.current.addEventListener(
        'play',
        handleVideoOnPlay
      );
    } else {
      console.error('모델이 아직 로드되지 않았습니다.');
    }
  };

  return (
    <div className="camera-recognition-container">
      {videoVisible ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            className={`video-box ${
              maxHappyPercentage > 70 ? 'animate' : ''
            }`}
          />
          <div className="happy-percentage">
            현재 행복도: {happyPercentage}%
          </div>
          <div className="max-happy-percentage">
            최고 행복도: {maxHappyPercentage}%
          </div>
          <Flex gap="small" wrap>
            <Button
              onClick={handleStartButtonClick}
              disabled={!modelsLoaded}
              type="primary"
            >
              {'실행'}
            </Button>
          </Flex>
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
            <Button onClick type="primary">
              {'링크 URL 보내기'}
            </Button>
          </Flex>
        </>
      )}
    </div>
  );
}
