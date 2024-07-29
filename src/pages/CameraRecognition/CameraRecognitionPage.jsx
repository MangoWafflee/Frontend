import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Button, Flex } from 'antd';
import './CameraRecognitionPage.scss';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] =
    useState(false);
  const [emotions, setEmotions] = useState({});
  let animationFrameId;

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            MODEL_URL
          ),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(
            MODEL_URL
          ),
          faceapi.nets.faceRecognitionNet.loadFromUri(
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

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) =>
        console.error('카메라 접근 에러: ', err)
      );
  };

  const handleVideoOnPlay = async () => {
    if (!videoRef.current) return;

    const canvas = faceapi.createCanvasFromMedia(
      videoRef.current
    );
    canvasRef.current = canvas;
    document.body.append(canvas);
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
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
          .withFaceLandmarks(true)
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
        faceapi.draw.drawDetections(
          canvas,
          resizedDetections
        );
        faceapi.draw.drawFaceLandmarks(
          canvas,
          resizedDetections
        );
        faceapi.draw.drawFaceExpressions(
          canvas,
          resizedDetections
        );

        if (detections.length > 0) {
          const emotions = detections[0].expressions;
          setEmotions(emotions);
        } else {
          setEmotions({});
        }
      } catch (error) {
        console.error('얼굴 인식 에러:', error);
      }
      animationFrameId = requestAnimationFrame(detectFaces);
    };

    detectFaces();
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };

  const handleStartButtonClick = () => {
    if (modelsLoaded) {
      if (isVideoPlaying) {
        stopVideo();
        setIsVideoPlaying(false);
      } else {
        startVideo();
        videoRef.current.addEventListener(
          'play',
          handleVideoOnPlay
        );
        setIsVideoPlaying(true);
      }
    } else {
      console.error('모델이 아직 로드되지 않았습니다.');
    }
  };

  return (
    <div className="camera-recognition-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="video-box"
      />
      <div className="emotion-display">
        {Object.entries(emotions).map(
          ([emotion, value]) => (
            <p key={emotion}>
              {emotion}: {(value * 100).toFixed(2)}%
            </p>
          )
        )}
      </div>
      <Flex gap="small" wrap>
        <Button
          onClick={handleStartButtonClick}
          disabled={!modelsLoaded}
          type="primary"
        >
          {isVideoPlaying ? '멈추기' : '실행'}
        </Button>
      </Flex>
    </div>
  );
}
