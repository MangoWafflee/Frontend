import React, { useRef } from 'react';
import * as faceapi from 'face-api.js';

export default function CameraRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener(
          'play',
          handleVideoOnPlay
        );
      })
      .catch((err) =>
        console.error('Error accessing camera: ', err)
      );
  };

  const handleVideoOnPlay = () => {
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
      context.clearRect(0, 0, canvas.width, canvas.height);
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
    };

    videoRef.current.addEventListener('play', () => {
      setInterval(detectFaces, 100);
    });
  };

  const handleStartButtonClick = async () => {
    await loadModels();
    startVideo();
  };

  return (
    <div>
      <button onClick={handleStartButtonClick}>
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
