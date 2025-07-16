import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { otpApi } from '../services/api';
import OtpRequestForm from './OtpRequestForm';
import OtpVerificationForm from './OtpVerificationForm';

const OtpSystem = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('otp_activeTab') || 'whatsapp');
  const [currentOtp, setCurrentOtp] = useState(() => {
    const saved = localStorage.getItem('otp_currentOtp');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Convert expiresAt back to Date if present
    if (parsed && parsed.expiresAt) parsed.expiresAt = new Date(parsed.expiresAt);
    return parsed;
  });
  const [isVerified, setIsVerified] = useState(() => localStorage.getItem('otp_isVerified') === 'true');
  const [loading, setLoading] = useState(false);
  // --- Loader state persisted ---
  const [showLoader, setShowLoader] = useState(() => {
    const loader = localStorage.getItem('otp_showLoader');
    return loader === 'true';
  });
  const [timer, setTimer] = useState(() => {
    const saved = localStorage.getItem('otp_timer');
    return saved ? parseInt(saved, 10) : 0;
  });
  // Hardcoded organizationId
  const organizationId = '6867106edec462968a5636cf';

  // --- Restore loader on mount if in progress ---
  useEffect(() => {
    if (showLoader) {
      const loaderStart = parseInt(localStorage.getItem('otp_loaderStart') || '0', 10);
      const now = Date.now();
      const elapsed = now - loaderStart;
      const remaining = 10000 - elapsed;
      if (remaining > 0) {
        setTimeout(() => {
          setShowLoader(false);
          localStorage.setItem('otp_showLoader', 'false');
          localStorage.removeItem('otp_loaderStart');
        }, remaining);
      } else {
        setShowLoader(false);
        localStorage.setItem('otp_showLoader', 'false');
        localStorage.removeItem('otp_loaderStart');
      }
    }
  }, []);

  // --- Persist state to localStorage ---
  useEffect(() => {
    localStorage.setItem('otp_activeTab', activeTab);
  }, [activeTab]);
  useEffect(() => {
    if (currentOtp) {
      localStorage.setItem('otp_currentOtp', JSON.stringify(currentOtp));
    } else {
      localStorage.removeItem('otp_currentOtp');
    }
  }, [currentOtp]);
  useEffect(() => {
    localStorage.setItem('otp_isVerified', isVerified);
  }, [isVerified]);
  useEffect(() => {
    localStorage.setItem('otp_timer', timer);
  }, [timer]);
  useEffect(() => {
    localStorage.setItem('otp_showLoader', showLoader);
  }, [showLoader]);
  // Removed organizationId persistence

  // --- Timer effect ---
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // --- OTP Request Handler with 10s loader ---
  const handleOtpRequest = async (channel, data) => {
    setLoading(true);
    setShowLoader(true);
    localStorage.setItem('otp_showLoader', 'true');
    localStorage.setItem('otp_loaderStart', Date.now().toString());
    const loaderPromise = new Promise((resolve) => setTimeout(resolve, 10000)); // 10s
    let apiResponse = null;
    let apiError = null;
    try {
      let response;
      if (channel === 'whatsapp') {
        response = await otpApi.requestWhatsappOtp(organizationId, data.number);
      } else {
        response = await otpApi.requestEmailOtp(organizationId, data.email);
      }
      const otpData = response.data?.data || response.data?.data?.data || response.data;
      apiResponse = otpData;
      // --- Set OTP state and persist immediately ---
      const otpObj = {
        id: otpData.otpId,
        channel,
        identifier: channel === 'whatsapp' ? data.number : data.email,
        expiresAt: otpData.expiresAt,
        remainingAttempts: otpData.remainingAttempts
      };
      setCurrentOtp(otpObj);
      localStorage.setItem('otp_currentOtp', JSON.stringify(otpObj));
      setTimer(90);
      setIsVerified(false);
    } catch (error) {
      apiError = error;
    }
    // Wait for both loader and API
    await loaderPromise;
    setShowLoader(false);
    localStorage.setItem('otp_showLoader', 'false');
    localStorage.removeItem('otp_loaderStart');
    setLoading(false);
    if (apiResponse) {
      toast.success(`${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} OTP sent successfully!`);
    } else {
      const errorMessage = apiError?.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
      // If failed, clear OTP state
      setCurrentOtp(null);
      localStorage.removeItem('otp_currentOtp');
    }
  };

  // --- OTP Verification Handler (with organizationId in query) ---
  const handleOtpVerification = async (otpValue) => {
    if (!currentOtp) return;
    setLoading(true);
    try {
      // The verify endpoint expects organizationId as query param
      const response = await otpApi.verifyOtpWithOrg(currentOtp.id, otpValue, organizationId);
      setIsVerified(true);
      setTimer(0);
      toast.success('OTP verified successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentOtp(null);
    setIsVerified(false);
    setTimer(0);
    setShowLoader(false);
    setLoading(false);
    localStorage.setItem('otp_showLoader', 'false');
    localStorage.removeItem('otp_loaderStart');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-system fade-in">
      <h1>OTP Verification System</h1>
      {/* Organization ID Input removed */}
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'whatsapp' ? 'active' : ''}`}
          onClick={() => setActiveTab('whatsapp')}
        >
          <MessageCircle size={16} />
          WhatsApp OTP
        </button>
        <button
          className={`tab ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          <Mail size={16} />
          Email OTP
        </button>
      </div>
      {/* Loader UX */}
      {showLoader && (
        <div className="status-card info" style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Clock size={20} className="spin" />
            <strong>Requesting OTP...</strong>
          </div>
          <div style={{ marginTop: '1rem' }}>This may take up to 10 seconds. Please wait...</div>
        </div>
      )}
      {/* Current OTP Status */}
      {!showLoader && currentOtp && (
        <div className="status-card info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertCircle size={16} />
            <strong>OTP Status</strong>
          </div>
          <p>Channel: {currentOtp.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}</p>
          <p>Target: {currentOtp.identifier}</p>
          <p>Remaining Attempts: {currentOtp.remainingAttempts}</p>
          {timer > 0 && (
            <div className="timer">
              <Clock size={16} />
              Time Remaining: {formatTime(timer)}
            </div>
          )}
          {timer === 0 && currentOtp && !isVerified && (
            <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
              OTP has expired
            </div>
          )}
        </div>
      )}
      {/* Success Message */}
      {!showLoader && isVerified && (
        <div className="status-card success">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} />
            <strong>OTP Verified Successfully!</strong>
          </div>
        </div>
      )}
      {/* Request Form */}
      {!showLoader && !currentOtp && (
        <OtpRequestForm
          channel={activeTab}
          onSubmit={handleOtpRequest}
          loading={loading}
        />
      )}
      {/* Verification Form */}
      {!showLoader && currentOtp && !isVerified && timer > 0 && (
        <OtpVerificationForm
          onSubmit={handleOtpVerification}
          loading={loading}
        />
      )}
      {/* Reset Button */}
      {!showLoader && currentOtp && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpSystem; 