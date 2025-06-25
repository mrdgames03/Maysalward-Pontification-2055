import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QrScanner from 'qr-scanner';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiX, FiUserPlus, FiUsers, FiSearch, FiCheck, FiCamera, FiCameraOff, FiCheckCircle, FiAlertCircle } = FiIcons;

const AddAttendeesModal = ({ isOpen, onClose, course, onAddAttendees }) => {
  const { trainees } = useTrainee();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'scan'
  
  // QR Scanner states
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [hasCamera, setHasCamera] = useState(true);

  // Clean up scanner on unmount or modal close
  useEffect(() => {
    if (!isOpen && qrScannerRef.current) {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  // Filter trainees that are not already attendees
  const existingAttendeeIds = course?.attendees ? course.attendees.map(a => a.id) : [];
  const availableTrainees = trainees.filter(trainee =>
    !existingAttendeeIds.includes(trainee.id) &&
    (trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     trainee.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     trainee.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTraineeToggle = (trainee) => {
    setSelectedTrainees(prev => {
      const isSelected = prev.find(t => t.id === trainee.id);
      if (isSelected) {
        return prev.filter(t => t.id !== trainee.id);
      } else {
        return [...prev, trainee];
      }
    });
  };

  const handleAddSelected = () => {
    if (selectedTrainees.length > 0) {
      onAddAttendees(course.id, selectedTrainees);
      setSelectedTrainees([]);
      setSearchTerm('');
      onClose();
    }
  };

  // QR Scanner functions
  const startScanner = async () => {
    try {
      setScanError('');
      setScanResult(null);

      if (!videoRef.current) return;

      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setHasCamera(false);
        setScanError('No camera found on this device');
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
      setScanError('Failed to start camera. Please check permissions.');
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

      // Find trainee by serial number
      const trainee = trainees.find(t => t.serialNumber === scanData.serialNumber);
      if (!trainee) {
        setScanResult({
          success: false,
          message: 'Trainee not found',
          data: scanData
        });
        return;
      }

      // Check if trainee is already an attendee
      if (existingAttendeeIds.includes(trainee.id)) {
        setScanResult({
          success: false,
          message: 'Trainee is already enrolled in this course',
          trainee,
          data: scanData
        });
        return;
      }

      // Check if trainee is already selected
      const isAlreadySelected = selectedTrainees.find(t => t.id === trainee.id);
      if (isAlreadySelected) {
        setScanResult({
          success: false,
          message: 'Trainee is already selected',
          trainee,
          data: scanData
        });
        return;
      }

      // Add trainee to selected list
      setSelectedTrainees(prev => [...prev, trainee]);
      setScanResult({
        success: true,
        message: 'Trainee added to selection!',
        trainee,
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
    setScanError('');
  };

  const availableSpots = course ? course.maxAttendees - (course.attendees ? course.attendees.length : 0) : 0;
  const canAddMore = selectedTrainees.length <= availableSpots;

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Attendees</h2>
            <p className="text-gray-600">
              Add trainees to "{course.title}" ({availableSpots} spots available)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setActiveTab('search');
              stopScanner();
              resetScanner();
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiSearch} />
              <span>Search Trainees</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('scan');
              resetScanner();
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'scan'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCamera} />
              <span>Scan QR Code</span>
            </div>
          </button>
        </div>

        {/* Selected Count */}
        {selectedTrainees.length > 0 && (
          <div className={`mb-4 p-3 rounded-lg ${
            canAddMore ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUsers} className={canAddMore ? 'text-green-600' : 'text-red-600'} />
              <span className={`text-sm font-medium ${
                canAddMore ? 'text-green-800' : 'text-red-800'
              }`}>
                {selectedTrainees.length} selected
                {!canAddMore && ` (exceeds available spots: ${availableSpots})`}
              </span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'search' && (
            <div className="h-full flex flex-col">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trainees by name, serial number, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Trainee List */}
              <div className="flex-1 overflow-y-auto">
                {availableTrainees.length > 0 ? (
                  <div className="space-y-3">
                    {availableTrainees.map((trainee) => {
                      const isSelected = selectedTrainees.find(t => t.id === trainee.id);
                      return (
                        <motion.div
                          key={trainee.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleTraineeToggle(trainee)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {isSelected ? (
                                  <SafeIcon icon={FiCheck} />
                                ) : (
                                  <SafeIcon icon={FiUsers} />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{trainee.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{trainee.serialNumber}</span>
                                  <span>{trainee.email}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{trainee.points} pts</p>
                              <p className="text-xs text-gray-600">Current Points</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <SafeIcon icon={FiUsers} className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>
                      {searchTerm
                        ? 'No trainees found matching your search'
                        : 'All trainees are already enrolled in this course'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="h-full flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Scanner Section */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Scanner</h3>
                  
                  {/* Video Container */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4 flex-1 min-h-[300px]">
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
                        <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg animate-pulse">
                          <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-indigo-500"></div>
                          <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-indigo-500"></div>
                          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-indigo-500"></div>
                          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-indigo-500"></div>
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
                        className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
                  {scanError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiAlertCircle} className="text-red-600" />
                        <p className="text-red-800">{scanError}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan Results Section */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Results</h3>
                  
                  <div className="flex-1">
                    <AnimatePresence>
                      {scanResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`p-4 rounded-lg border-l-4 ${
                            scanResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              scanResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              <SafeIcon icon={scanResult.success ? FiCheckCircle : FiAlertCircle} className="text-lg" />
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-lg font-semibold ${
                                scanResult.success ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {scanResult.message}
                              </h4>
                              
                              {scanResult.trainee && (
                                <div className="mt-3 bg-white rounded-lg p-3 border">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <SafeIcon icon={FiUsers} className="text-indigo-600" />
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-900">{scanResult.trainee.name}</h5>
                                      <p className="text-sm text-gray-600">{scanResult.trainee.serialNumber}</p>
                                      <p className="text-sm text-gray-600">{scanResult.trainee.points} points</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 flex gap-3">
                                <button
                                  onClick={resetScanner}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                  Scan Another
                                </button>
                                {!isScanning && hasCamera && (
                                  <button
                                    onClick={startScanner}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                  >
                                    Continue Scanning
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!scanResult && (
                      <div className="text-center py-12 text-gray-500">
                        <SafeIcon icon={FiCamera} className="text-4xl mx-auto mb-2 opacity-50" />
                        <p>Start scanning to add trainees</p>
                        <p className="text-sm mt-1">Point your camera at a trainee's QR code</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 mt-6 border-t border-gray-200">
          <motion.button
            onClick={handleAddSelected}
            disabled={selectedTrainees.length === 0 || !canAddMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiUserPlus} />
            <span>
              Add {selectedTrainees.length} Attendee{selectedTrainees.length !== 1 ? 's' : ''}
            </span>
          </motion.button>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddAttendeesModal;