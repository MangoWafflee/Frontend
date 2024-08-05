// src/contexts/CameraStatusContext.js
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const CameraStatusContext = createContext();

export const useCameraStatus = () => {
  return useContext(CameraStatusContext);
};

export const CameraStatusProvider = ({ children }) => {
  const [isCameraActive, setIsCameraActive] =
    useState(false);

  return (
    <CameraStatusContext.Provider
      value={{ isCameraActive, setIsCameraActive }}
    >
      {children}
    </CameraStatusContext.Provider>
  );
};
