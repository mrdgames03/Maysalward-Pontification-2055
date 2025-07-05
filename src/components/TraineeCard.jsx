import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ProgressionBadge from './ProgressionBadge';
import ProgressionProgress from './ProgressionProgress';
import { getCurrentLevel } from '../utils/progressionSystem';

const { FiDownload, FiMail, FiUser, FiCalendar, FiHash, FiStar, FiShare2, FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiCopy, FiX, FiCheck } = FiIcons;

const TraineeCard = ({ trainee, showActions = false }) => {
  const cardRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  React.useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          serialNumber: trainee.serialNumber,
          name: trainee.name,
          id: trainee.id
        });
        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [trainee]);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Credit card size
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      pdf.save(`${trainee.name}-membership-card.pdf`);
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  const downloadCardAsImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${trainee.name}-membership-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const generateShareImage = async () => {
    if (!cardRef.current) return '';

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating share image:', error);
      return '';
    }
  };

  const shareByEmail = () => {
    const level = getCurrentLevel(trainee.points);
    const subject = `My Maysalward Training Hub Membership Card - ${trainee.name}`;
    const body = `
Hello!

I'm excited to share my Maysalward Training Hub membership card with you! 

🎓 **My Training Journey:**
- Name: ${trainee.name}
- Member ID: ${trainee.serialNumber}
- Current Level: ${level.emoji} ${level.name}
- Points Earned: ${trainee.points}
- Member Since: ${format(new Date(trainee.registrationDate), 'PPP')}

${level.description}

I'm actively participating in professional development and training programs at Maysalward Training Hub. The points system helps track my progress and achievements!

Best regards,
${trainee.name}

---
Maysalward Training Hub - Professional Development Excellence
    `;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleShare = async () => {
    const imageUrl = await generateShareImage();
    setShareImageUrl(imageUrl);
    setShowShareModal(true);
  };

  const shareToSocialMedia = (platform) => {
    const level = getCurrentLevel(trainee.points);
    const text = `🎓 Proud to be a ${level.name} level member at Maysalward Training Hub! 💪 Currently at ${trainee.points} points and growing! #MaysalwardTraining #ProfessionalDevelopment #Learning`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`,
      instagram: '' // Instagram doesn't support direct URL sharing
    };

    if (platform === 'instagram') {
      // For Instagram, we'll copy the text and prompt user to paste
      navigator.clipboard.writeText(text).then(() => {
        alert('Caption copied to clipboard! You can now paste it when sharing your membership card image on Instagram.');
      });
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    const level = getCurrentLevel(trainee.points);
    const text = `🎓 Proud to be a ${level.name} level member at Maysalward Training Hub! 💪 Currently at ${trainee.points} points and growing! #MaysalwardTraining #ProfessionalDevelopment #Learning`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const currentLevel = getCurrentLevel(trainee.points);

  return (
    <div className="space-y-4">
      {/* Digital Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden"
        style={{ width: '400px', height: '250px', margin: '0 auto' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center p-2">
                <img
                  src="/logo.png"
                  alt="Maysalward Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <SafeIcon icon={FiUser} className="text-xl hidden" />
              </div>
              <div>
                <h3 className="text-lg font-bold">MEMBERSHIP CARD</h3>
                <p className="text-blue-100 text-sm">Maysalward Training Hub</p>
              </div>
            </div>

            {/* Level Badge on Card */}
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
              <span className="text-lg">{currentLevel.emoji}</span>
              <div>
                <p className="text-xs font-medium text-blue-100">Level</p>
                <p className="text-sm font-bold">{currentLevel.name}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex justify-between items-end">
            <div className="flex items-start space-x-4">
              {/* Profile Photo on Card */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/30 bg-white/20 flex-shrink-0">
                {trainee.photo ? (
                  <img 
                    src={trainee.photo} 
                    alt={trainee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="text-white/60 text-xl" />
                  </div>
                )}
              </div>

              {/* Trainee Details */}
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wide">Name</p>
                  <p className="text-lg font-semibold truncate">{trainee.name}</p>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wide">Member ID</p>
                    <p className="text-sm font-mono">{trainee.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wide">Points</p>
                    <p className="text-sm font-bold">{trainee.points}</p>
                  </div>
                </div>
                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wide">Member Since</p>
                  <p className="text-sm">{format(new Date(trainee.registrationDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="ml-4">
              {qrCodeUrl && (
                <div className="bg-white p-2 rounded-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trainee Info */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Profile Photo in Info Section */}
            {trainee.photo && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={trainee.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profile Photo</p>
                  <p className="font-medium text-gray-900">Uploaded</p>
                </div>
              </div>
            )}

            {/* Progression Badge and Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <ProgressionBadge points={trainee.points} size="lg" showLabel={true} />
              </div>
              <ProgressionProgress points={trainee.points} showDetails={true} />
            </div>

            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUser} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{trainee.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiHash} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member ID</p>
                <p className="font-mono text-sm">{trainee.serialNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{format(new Date(trainee.dateOfBirth), 'PPP')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMail} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{trainee.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiStar} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Current Points</p>
                <p className="font-medium text-blue-600">{trainee.points} points</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Education</p>
              <p className="text-sm bg-gray-50 p-2 rounded">{trainee.education}</p>
            </div>

            {/* Level Perks Preview */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Level Perks:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {currentLevel.perks.slice(0, 3).map((perk, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <SafeIcon icon={FiStar} className="text-yellow-500 text-xs mt-0.5 flex-shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
                {currentLevel.perks.length > 3 && (
                  <li className="text-gray-500">+{currentLevel.perks.length - 3} more perks</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.button
            onClick={downloadCard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiDownload} />
            <span>Download PDF</span>
          </motion.button>

          <motion.button
            onClick={downloadCardAsImage}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiDownload} />
            <span>Save as Image</span>
          </motion.button>

          <motion.button
            onClick={shareByEmail}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiMail} />
            <span>Email Card</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiShare2} />
            <span>Share</span>
          </motion.button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Your Membership Card</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Share Text */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 mb-2">Share text:</p>
                <div className="bg-white border rounded p-2 text-xs text-gray-600 max-h-20 overflow-y-auto">
                  🎓 Proud to be a {currentLevel.name} level member at Maysalward Training Hub! 💪 Currently at {trainee.points} points and growing! #MaysalwardTraining #ProfessionalDevelopment #Learning
                </div>
                <button
                  onClick={copyToClipboard}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <SafeIcon icon={copySuccess ? FiCheck : FiCopy} />
                  <span>{copySuccess ? 'Copied!' : 'Copy text'}</span>
                </button>
              </div>

              {/* Social Media Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareToSocialMedia('twitter')}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <SafeIcon icon={FiTwitter} />
                  <span>Twitter</span>
                </button>

                <button
                  onClick={() => shareToSocialMedia('facebook')}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <SafeIcon icon={FiFacebook} />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={() => shareToSocialMedia('linkedin')}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiLinkedin} />
                  <span>LinkedIn</span>
                </button>

                <button
                  onClick={() => shareToSocialMedia('instagram')}
                  className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <SafeIcon icon={FiInstagram} />
                  <span>Instagram</span>
                </button>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                <p>💡 <strong>Tip:</strong> Save your membership card as an image first, then share it along with the text!</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TraineeCard;