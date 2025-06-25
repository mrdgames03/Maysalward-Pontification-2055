import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QrScanner from 'qr-scanner';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import { format } from 'date-fns';

const { FiCamera, FiCameraOff, FiCheckCircle, FiAlertCircle, FiUser, FiStar } = FiIcons;

const Scanner = () => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(true);
  const { checkInTrainee, getTraineeBySerial } = useTrainee();

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError('');
      setScanResult(null);
      
      if (!videoRef.current) return;

      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setHasCamera(false);
        setError('No camera found on this device');
        return;
      }

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      );

      await qrScannerRef.current.start();
      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please check permissions.');
      setHasCamera(false);
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = (data) => {
    try {
      stopScanner();
      
      // Try to parse as JSON first (for our QR codes)
      let scanData;
      try {
        scanData = JSON.parse(data);
      } catch {
        // If not JSON, treat as plain serial number
        scanData = { serialNumber: data };
      }

      if (!scanData.serialNumber) {
        throw new Error('Invalid QR code format');
      }

      // Check if trainee exists
      const trainee = getTraineeBySerial(scanData.serialNumber);
      if (!trainee) {
        setScanResult({
          success: false,
          message: 'Trainee not found',
          data: scanData
        });
        return;
      }

      // Perform check-in
      const result = checkInTrainee(scanData.serialNumber);
      setScanResult({
        success: true,
        message: 'Check-in successful!',
        trainee: result.trainee,
        checkIn: result.checkIn,
        data: scanData
      });

    } catch (err) {
      console.error('Error processing scan result:', err);
      setScanResult({
        success: false,
        message: err.message || 'Failed to process QR code',
        data: { serialNumber: data }
      });
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError('');
  };

  // Manual input for testing
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScanResult(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">
          Scan trainee QR codes to check them in and award points
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera Scanner</h2>
          
          <div className="space-y-4">
            {/* Video Container */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                  <div className="text-center text-white">
                    <SafeIcon icon={FiCamera} className="text-4xl mx-auto mb-2" />
                    <p>Camera not active</p>
                  </div>
                </div>
              )}

              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse">
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-500"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-500"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-500"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex gap-3">
              {!isScanning ? (
                <motion.button
                  onClick={startScanner}
                  disabled={!hasCamera}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiCamera} />
                  <span>Start Scanner</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={stopScanner}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiCameraOff} />
                  <span>Stop Scanner</span>
                </motion.button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAlertCircle} className="text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Manual Input & Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Manual Input */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Input</h2>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter trainee serial number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Check In Manually
              </button>
            </form>
          </div>

          {/* Scan Results */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${
                  scanResult.success ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    scanResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <SafeIcon 
                      icon={scanResult.success ? FiCheckCircle : FiAlertCircle} 
                      className="text-lg" 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      scanResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {scanResult.message}
                    </h3>
                    
                    {scanResult.success && scanResult.trainee && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <SafeIcon icon={FiUser} className="text-blue-600 text-lg" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {scanResult.trainee.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {scanResult.trainee.serialNumber}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Points Earned</p>
                              <p className="font-semibold text-green-600">
                                +{scanResult.checkIn.points}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Points</p>
                              <p className="font-semibold text-blue-600">
                                {scanResult.trainee.points}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-600">Check-in Time</p>
                              <p className="font-semibold">
                                {format(new Date(scanResult.checkIn.timestamp), 'PPp')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={resetScanner}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Scan Another
                      </button>
                      {!isScanning && hasCamera && (
                        <button
                          onClick={startScanner}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Start Scanner
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Scanner;