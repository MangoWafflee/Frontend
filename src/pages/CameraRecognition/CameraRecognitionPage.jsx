import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

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
      } catch (error) {
        console.error('얼굴 인식 에러:', error);
      }
      requestAnimationFrame(detectFaces);
    };

    detectFaces();
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
    <div>
      <button
        onClick={handleStartButtonClick}
        disabled={!modelsLoaded}
      >
        Start Video
      </button>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="400px"
        height="400px"
      />
    </div>
  );
}
