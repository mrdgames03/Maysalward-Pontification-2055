import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import AddGiftModal from '../components/AddGiftModal';
import GiftCard from '../components/GiftCard';

const { FiGift, FiPlus, FiSearch, FiFilter, FiTag, FiStar, FiUsers, FiEye, FiCalendar, FiTrendingUp } = FiIcons;

const GiftsManagement = () => {
  const { 
    gifts, 
    giftRedemptions, 
    addGift, 
    updateGift, 
    deleteGift,
    getGiftRedemptions 
  } = useTrainee();

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRedemptions, setShowRedemptions] = useState(null);

  const giftTypes = ['all', 'gift', 'coupon', 'voucher', 'experience', 'digital'];
  const categories = [
    'all', 'General', 'Electronics', 'Books & Education', 'Food & Beverages', 
    'Fashion & Accessories', 'Sports & Fitness', 'Entertainment', 'Travel', 
    'Software & Apps', 'Courses & Training'
  ];

  // Filter gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || gift.type === filterType;
    const matchesCategory = filterCategory === 'all' || gift.category === filterCategory;
    
    let matchesStatus = true;
    const now = new Date();
    const isExpired = gift.expiryDate && new Date(gift.expiryDate) < now;
    const isOutOfStock = gift.totalRedeemed >= gift.availableQuantity;

    if (filterStatus === 'active') {
      matchesStatus = gift.status === 'active' && !isExpired && !isOutOfStock;
    } else if (filterStatus === 'expired') {
      matchesStatus = isExpired;
    } else if (filterStatus === 'out_of_stock') {
      matchesStatus = isOutOfStock;
    } else if (filterStatus === 'inactive') {
      matchesStatus = gift.status === 'inactive';
    }

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleAddGift = (giftData) => {
    if (editingGift) {
      updateGift(editingGift.id, giftData);
      setEditingGift(null);
    } else {
      addGift(giftData);
    }
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setShowGiftModal(true);
  };

  const handleDeleteGift = (giftId) => {
    if (window.confirm('Are you sure you want to delete this gift? This will also remove all redemption records.')) {
      deleteGift(giftId);
    }
  };

  const handleViewRedemptions = (gift) => {
    setShowRedemptions(gift);
  };

  const handleCloseModal = () => {
    setShowGiftModal(false);
    setEditingGift(null);
  };

  // Calculate stats
  const stats = {
    total: gifts.length,
    active: gifts.filter(g => g.status === 'active' && 
                             (!g.expiryDate || new Date(g.expiryDate) > new Date()) &&
                             g.totalRedeemed < g.availableQuantity).length,
    totalRedemptions: giftRedemptions.length,
    totalPointsRedeemed: giftRedemptions.reduce((sum, r) => sum + r.pointsDeducted, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gifts & Coupons</h1>
          <p className="text-gray-600">Create and manage gifts, coupons, and giveaways for trainees</p>
        </div>
        <motion.button
          onClick={() => setShowGiftModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Create Gift</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiGift} className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Total Gifts</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiTag} className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Active Gifts</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUsers} className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Total Redemptions</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalRedemptions}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiStar} className="text-yellow-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Points Redeemed</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.totalPointsRedeemed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGifts.length > 0 ? (
          filteredGifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GiftCard
                gift={gift}
                onEdit={handleEditGift}
                onDelete={handleDeleteGift}
                onViewRedemptions={handleViewRedemptions}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <SafeIcon icon={FiGift} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'No gifts found' 
                : 'No Gifts Created Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Create your first gift, coupon, or giveaway to get started'}
            </p>
            {!searchTerm && filterType === 'all' && filterCategory === 'all' && filterStatus === 'all' && (
              <motion.button
                onClick={() => setShowGiftModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Create First Gift</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Gift Modal */}
      <AddGiftModal
        isOpen={showGiftModal}
        onClose={handleCloseModal}
        onSave={handleAddGift}
        giftToEdit={editingGift}
      />

      {/* View Redemptions Modal */}
      {showRedemptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gift Redemptions</h2>
                <p className="text-gray-600">"{showRedemptions.title}" redemption history</p>
              </div>
              <button
                onClick={() => setShowRedemptions(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Redemptions List */}
            <div className="flex-1 overflow-y-auto">
              {(() => {
                const redemptions = getGiftRedemptions(showRedemptions.id);
                return redemptions.length > 0 ? (
                  <div className="space-y-3">
                    {redemptions.map(redemption => (
                      <div key={redemption.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{redemption.traineeName}</h3>
                            <p className="text-sm text-gray-600">{redemption.traineeSerial}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">-{redemption.pointsDeducted} pts</p>
                            <p className="text-sm text-gray-600">
                              {new Date(redemption.redeemedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <SafeIcon icon={FiGift} className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No redemptions yet</p>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 mt-6 border-t border-gray-200">
              <motion.button
                onClick={() => setShowRedemptions(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GiftsManagement;