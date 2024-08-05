import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import './CameraRecognitionPage.scss';

export default function CameraRecognitionPage() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('test');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const happyPercentageRef = useRef(0);
  const maxHappyPercentageRef = useRef(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [animationVisible, setAnimationVisible] =
    useState(false);
  const location = useLocation();
  const intervalRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    );
    if (storedUser) {
      setUser(storedUser);
      setNickname(storedUser.nickname);
    }
  }, []);

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
    if (
      happyPercentageRef.current >
      maxHappyPercentageRef.current
    ) {
      maxHappyPercentageRef.current =
        happyPercentageRef.current;
    }
  }, [happyPercentageRef.current]);

  useEffect(() => {
    if (maxHappyPercentageRef.current > 90) {
      const fetchData = async () => {
        let url = `https://mango.angrak.cloud/smile/save`;
        const smileData = {
          smilePercentage: maxHappyPercentageRef.current,
          date: new Date()
            .toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/. /g, '-')
            .replace('.', '')
            .replace('.', ''),
          time: new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date()),
          nickname: nickname,
        };

        console.log(smileData);
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(smileData),
          });

          if (response.status === 201) {
            console.log('웃음 저장 성공');
          } else if (response.status === 404) {
            console.log('웃음 실패');
          } else {
            console.log('서버 오류');
          }
        } catch (error) {
          console.error('데이터 요청 오류:', error);
        }
      };

      videoRef.current.classList.add('distort-animation');
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.classList.remove(
            'distort-animation'
          );
        }
        setVideoVisible(false);
      }, 5000);
      fetchData();
      return () => clearTimeout(timer);
    }
  }, [maxHappyPercentageRef.current]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener(
          'loadedmetadata',
          () => {
            videoRef.current.play();
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
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
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
          setFaceDetected(true);
          const happy =
            resizedDetections[0].expressions.happy;
          happyPercentageRef.current = (
            happy * 100
          ).toFixed(0);
        } else {
          setFaceDetected(false);
        }
      } catch (error) {
        console.error('얼굴 인식 에러:', error);
      }
    };

    intervalRef.current = setInterval(detectFaces, 500);
  };

  const stopFaceApiAndStream = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
      videoRef.current.addEventListener(
        'play',
        handleVideoOnPlay
      );
    }

    return () => {
      stopFaceApiAndStream();
    };
  }, [modelsLoaded]);

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

  // location 변경 시 카메라 스트림 정리
  useEffect(() => {
    return () => {
      stopFaceApiAndStream();
    };
  }, [location]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '어때? 한번 웃어볼래?!',
          text: '',
          url: 'https://hahasmile.netlify.app/',
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert(
        'Web Share API is not supported in your browser.'
      );
    }
  };

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
              maxHappyPercentageRef.current < 90 && (
                <svg className="circle-animation">
                  <circle cx="185" cy="180" r="175" />
                </svg>
              )}
          </div>
          <div className="emotion-display">
            <div className="max-happy-percentage">
              {maxHappyPercentageRef.current}%
            </div>
            <div className="happy-text">
              {maxHappyPercentageRef.current > 90
                ? '행복한 얼굴이에요!'
                : maxHappyPercentageRef.current > 70
                ? '더 크게 웃어보아요!'
                : maxHappyPercentageRef.current > 50
                ? '입이 찢어지게! 흐하하하!'
                : maxHappyPercentageRef.current > 30
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
          <button
            className="url-button"
            onClick={handleShare}
          >
            URL 보내기
          </button>
        </>
      )}
    </div>
  );
}
