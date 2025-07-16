import React, { useState, useRef, useEffect } from 'react';
import { Check, Key } from 'lucide-react';

const OtpVerificationForm = ({ onSubmit, loading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^[0-9]*$/.test(value)) return;

    let newOtp = [...otp];
    // If user enters more than one digit (e.g., paste or fast typing), spread across fields
    if (value.length > 1) {
      const digits = value.split('').filter((d) => /\d/.test(d));
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);
      // Focus the last filled input
      const lastIndex = Math.min(index + digits.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    // Auto-submit when all digits are filled
    // if (newOtp.every(digit => digit !== '')) {
    //   handleSubmit();
    // }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const validateOtp = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit OTP' });
      return false;
    }
    
    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ otp: 'OTP must contain only digits' });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateOtp()) {
      const otpString = otp.join('');
      onSubmit(otpString);
    }
  };

  const handleResend = () => {
    // This would typically trigger a resend OTP request
    // For now, we'll just reset the form
    setOtp(['', '', '', '', '', '']);
    setErrors({});
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fade-in">
      <div className="form-group">
        <label htmlFor="otp" style={{ textAlign: 'center', display: 'block', marginBottom: '1rem' }}>
          <Key size={16} style={{ marginRight: '0.5rem' }} />
          Enter 6-Digit OTP
        </label>
        
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className={`otp-input ${errors.otp ? 'error' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              autoComplete="one-time-code"
            />
          ))}
        </div>
        
        {errors.otp && (
          <div className="error-message" style={{ textAlign: 'center' }}>
            {errors.otp}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={loading || otp.join('').length !== 6}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Verifying...
            </>
          ) : (
            <>
              <Check size={16} />
              Verify OTP
            </>
          )}
        </button>
      </div>

      <div className="attempts-info">
        <p>Enter the 6-digit code sent to your {otp.length === 6 ? 'device' : 'phone/email'}</p>
        <p>You have 4 attempts remaining</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleResend}
          disabled={loading}
          style={{ fontSize: '0.875rem' }}
        >
          Didn't receive? Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationForm; 