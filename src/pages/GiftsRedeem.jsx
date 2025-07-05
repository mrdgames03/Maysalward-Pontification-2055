import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiGift, FiStar, FiSearch, FiFilter, FiTag, FiUsers, FiCheck, FiX, FiCalendar, FiClock } = FiIcons;

const GiftsRedeem = () => {
  const { 
    gifts, 
    trainees, 
    redeemGift, 
    getAvailableGiftsForTrainee,
    getTraineeRedemptions,
    getTraineeBySerial 
  } = useTrainee();

  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [traineeSearch, setTraineeSearch] = useState('');
  const [showRedeemModal, setShowRedeemModal] = useState(null);
  const [redeemResult, setRedeemResult] = useState(null);

  const giftTypes = ['all', 'gift', 'coupon', 'voucher', 'experience', 'digital'];
  const categories = [
    'all', 'General', 'Electronics', 'Books & Education', 'Food & Beverages', 
    'Fashion & Accessories', 'Sports & Fitness', 'Entertainment', 'Travel', 
    'Software & Apps', 'Courses & Training'
  ];

  // Get available gifts for selected trainee
  const availableGifts = selectedTrainee ? getAvailableGiftsForTrainee(selectedTrainee.id) : gifts.filter(g => g.status === 'active');

  // Filter gifts
  const filteredGifts = availableGifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || gift.type === filterType;
    const matchesCategory = filterCategory === 'all' || gift.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Filter trainees for selection
  const filteredTrainees = trainees.filter(trainee =>
    trainee.name.toLowerCase().includes(traineeSearch.toLowerCase()) ||
    trainee.serialNumber.toLowerCase().includes(traineeSearch.toLowerCase())
  );

  const handleTraineeSelect = (trainee) => {
    setSelectedTrainee(trainee);
    setTraineeSearch('');
  };

  const handleRedeemGift = async (gift) => {
    if (!selectedTrainee) {
      alert('Please select a trainee first');
      return;
    }

    const result = redeemGift(gift.id, selectedTrainee.id);
    setRedeemResult(result);
    setShowRedeemModal(null);

    // Auto close result after 3 seconds if successful
    if (result.success) {
      setTimeout(() => setRedeemResult(null), 3000);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'coupon': return FiTag;
      case 'voucher': return FiGift;
      case 'experience': return FiCalendar;
      case 'digital': return FiUsers;
      default: return FiGift;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'coupon': return 'bg-green-100 text-green-800';
      case 'voucher': return 'bg-purple-100 text-purple-800';
      case 'experience': return 'bg-orange-100 text-orange-800';
      case 'digital': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gift Redemption Center</h1>
        <p className="text-gray-600">Redeem gifts, coupons, and rewards with your points</p>
      </div>

      {/* Trainee Selection */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Trainee</h2>
        
        {!selectedTrainee ? (
          <div>
            <div className="relative mb-4">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trainee by name or serial number..."
                value={traineeSearch}
                onChange={(e) => setTraineeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
              {filteredTrainees.map(trainee => (
                <motion.div
                  key={trainee.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTraineeSelect(trainee)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUsers} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{trainee.name}</h3>
                      <p className="text-sm text-gray-600">{trainee.serialNumber}</p>
                      <p className="text-sm font-medium text-blue-600">{trainee.points} points</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTrainees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiUsers} className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No trainees found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUsers} className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTrainee.name}</h3>
                <p className="text-gray-600">{selectedTrainee.serialNumber}</p>
                <p className="text-lg font-bold text-blue-600">{selectedTrainee.points} points available</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTrainee(null)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiX} />
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {giftTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Gifts Info */}
      {selectedTrainee && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiGift} className="text-green-600" />
            <span className="text-green-800 font-medium">
              {availableGifts.length} gift{availableGifts.length !== 1 ? 's' : ''} available for {selectedTrainee.name}
            </span>
          </div>
        </div>
      )}

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.length > 0 ? (
          filteredGifts.map((gift, index) => {
            const canAfford = selectedTrainee ? selectedTrainee.points >= gift.pointsRequired : false;
            const isExpired = gift.expiryDate && new Date(gift.expiryDate) < new Date();
            const isOutOfStock = gift.totalRedeemed >= gift.availableQuantity;

            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-300 border ${
                  canAfford && !isExpired && !isOutOfStock
                    ? 'border-green-200 hover:shadow-xl'
                    : 'border-gray-200 opacity-75'
                }`}
              >
                {/* Gift Image */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                  {gift.photo ? (
                    <img
                      src={gift.photo}
                      alt={gift.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SafeIcon icon={getTypeIcon(gift.type)} className="text-white text-4xl" />
                  )}
                </div>

                {/* Gift Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{gift.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(gift.type)}`}>
                      {gift.type.charAt(0).toUpperCase() + gift.type.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{gift.description}</p>

                  {/* Points Required */}
                  <div className="flex items-center justify-center bg-blue-50 rounded-lg p-3">
                    <SafeIcon icon={FiStar} className="text-blue-600 mr-2" />
                    <span className="text-lg font-bold text-blue-600">{gift.pointsRequired} points</span>
                  </div>

                  {/* Stock Info */}
                  <div className="text-center text-sm text-gray-600">
                    {gift.availableQuantity - gift.totalRedeemed} of {gift.availableQuantity} available
                  </div>

                  {/* Expiry Info */}
                  {gift.expiryDate && (
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                      <SafeIcon icon={FiClock} className="text-xs" />
                      <span>Expires {new Date(gift.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: canAfford && !isExpired && !isOutOfStock ? 1.05 : 1 }}
                    whileTap={{ scale: canAfford && !isExpired && !isOutOfStock ? 0.95 : 1 }}
                    onClick={() => canAfford && !isExpired && !isOutOfStock && setShowRedeemModal(gift)}
                    disabled={!canAfford || isExpired || isOutOfStock || !selectedTrainee}
                    className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      canAfford && !isExpired && !isOutOfStock && selectedTrainee
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <SafeIcon icon={FiGift} />
                    <span>
                      {!selectedTrainee 
                        ? 'Select Trainee' 
                        : isExpired 
                        ? 'Expired' 
                        : isOutOfStock 
                        ? 'Out of Stock'
                        : !canAfford 
                        ? 'Insufficient Points' 
                        : 'Redeem Now'}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <SafeIcon icon={FiGift} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedTrainee ? 'No gifts available' : 'Select a trainee to view available gifts'}
            </h3>
            <p className="text-gray-600">
              {selectedTrainee 
                ? 'This trainee doesn\'t have enough points for any available gifts'
                : 'Choose a trainee to see what gifts they can redeem with their points'}
            </p>
          </div>
        )}
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiGift} className="text-green-600 text-2xl" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Redemption</h3>
              
              <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gift:</span>
                  <span className="font-medium">{showRedeemModal.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trainee:</span>
                  <span className="font-medium">{selectedTrainee?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Required:</span>
                  <span className="font-bold text-red-600">-{showRedeemModal.pointsRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Points:</span>
                  <span className="font-medium">{selectedTrainee?.points - showRedeemModal.pointsRequired}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleRedeemGift(showRedeemModal)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Confirm Redemption
                </button>
                <button
                  onClick={() => setShowRedeemModal(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Redemption Result */}
      <AnimatePresence>
        {redeemResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`p-4 rounded-lg shadow-lg ${
              redeemResult.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <SafeIcon 
                  icon={redeemResult.success ? FiCheck : FiX} 
                  className={redeemResult.success ? 'text-green-600' : 'text-red-600'} 
                />
                <span className={`font-medium ${
                  redeemResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {redeemResult.success ? 'Gift redeemed successfully!' : redeemResult.message}
                </span>
                <button
                  onClick={() => setRedeemResult(null)}
                  className={`ml-2 ${redeemResult.success ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftsRedeem;