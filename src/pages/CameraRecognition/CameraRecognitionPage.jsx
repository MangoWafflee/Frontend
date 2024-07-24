import React, { useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    setModelsLoaded(true);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) =>
        console.error('Error accessing camera: ', err)
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
        console.error('Error detecting faces: ', error);
      }
      requestAnimationFrame(detectFaces);
    };

    detectFaces();
  };

  const handleStartButtonClick = async () => {
    await loadModels();
    startVideo();
    videoRef.current.addEventListener(
      'play',
      handleVideoOnPlay
    );
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
        width="720"
        height="560"
      />
    </div>
  );
}
