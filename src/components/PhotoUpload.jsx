import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCamera, FiUpload, FiX, FiUser, FiVideo, FiVideoOff, FiRotateCcw } = FiIcons;

const PhotoUpload = ({ photo, onPhotoChange, className = "", type = "trainee" }) => {
  const [dragOver, setDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoChange(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      setShowCamera(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      setCameraError('Camera not available or permission denied');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setShowCamera(false);
    setCameraError('');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      onPhotoChange(dataURL);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    onPhotoChange(null);
    startCamera();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {type === 'instructor' ? 'Instructor Photo' : 'Profile Photo'}
      </label>
      
      <div className="relative">
        {photo && !showCamera ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300 mx-auto">
              <img 
                src={photo} 
                alt={type === 'instructor' ? 'Instructor' : 'Profile'} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex justify-center space-x-2 mt-2">
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                title="Remove Photo"
              >
                <SafeIcon icon={FiX} className="text-sm" />
              </button>
              <button
                type="button"
                onClick={handleClick}
                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                title="Change Photo"
              >
                <SafeIcon icon={FiUpload} className="text-sm" />
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
                title="Take New Photo"
              >
                <SafeIcon icon={FiCamera} className="text-sm" />
              </button>
            </div>
          </motion.div>
        ) : showCamera ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="w-80 max-w-full mx-auto">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-60 object-cover"
                  playsInline
                  muted
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="text-center text-white">
                      <SafeIcon icon={FiVideo} className="text-4xl mx-auto mb-2" />
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {cameraError ? (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{cameraError}</p>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Close Camera
                  </button>
                </div>
              ) : (
                <div className="flex justify-center space-x-3 mt-4">
                  <motion.button
                    type="button"
                    onClick={capturePhoto}
                    disabled={!isCameraActive}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiCamera} />
                    <span>Capture</span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiVideoOff} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-32 h-32 mx-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <SafeIcon icon={FiUpload} className="text-2xl text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 text-center px-2">
              Click or drag photo
            </span>
          </motion.div>
        )}
      </div>

      {!photo && !showCamera && (
        <div className="mt-3 flex justify-center space-x-2">
          <motion.button
            type="button"
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2 text-sm"
          >
            <SafeIcon icon={FiUpload} className="text-sm" />
            <span>Upload</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={startCamera}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-100 text-green-600 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2 text-sm"
          >
            <SafeIcon icon={FiCamera} className="text-sm" />
            <span>Camera</span>
          </motion.button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        Recommended: Square image, max 5MB
      </p>
    </div>
  );
};

export default PhotoUpload;