import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiMail, FiUser, FiCalendar, FiHash, FiStar } = FiIcons;

const TraineeCard = ({ trainee, showActions = false }) => {
  const cardRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState('');

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
      pdf.save(`${trainee.name}-trainee-card.pdf`);
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  const shareByEmail = () => {
    const subject = `Trainee Card - ${trainee.name}`;
    const body = `
Dear ${trainee.name},

Congratulations! You have been successfully registered in our training program at Maysalward Training Hub.

Your Details:
- Name: ${trainee.name}
- Serial Number: ${trainee.serialNumber}
- Registration Date: ${format(new Date(trainee.registrationDate), 'PPP')}

Please keep your trainee card safe and present it during check-ins.

Best regards,
Maysalward Training Hub Team
    `;
    
    const mailtoUrl = `mailto:${trainee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

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
                <h3 className="text-lg font-bold">TRAINEE CARD</h3>
                <p className="text-blue-100 text-sm">Maysalward Training Hub</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="space-y-2">
                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wide">Name</p>
                  <p className="text-lg font-semibold truncate">{trainee.name}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wide">Serial Number</p>
                  <p className="text-sm font-mono">{trainee.serialNumber}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wide">Registered</p>
                  <p className="text-sm">{format(new Date(trainee.registrationDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="ml-4">
              {qrCodeUrl && (
                <div className="bg-white p-2 rounded-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-16 h-16"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trainee Info */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
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
                <p className="text-sm text-gray-600">Serial Number</p>
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

          <div className="space-y-3">
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
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={downloadCard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiDownload} />
            <span>Download Card</span>
          </motion.button>
          
          <motion.button
            onClick={shareByEmail}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiMail} />
            <span>Share by Email</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TraineeCard;