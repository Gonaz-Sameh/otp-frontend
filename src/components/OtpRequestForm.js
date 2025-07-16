import React, { useState } from 'react';
import { Send, Mail, MessageCircle, AlertCircle } from 'lucide-react';

const OtpRequestForm = ({ channel, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    number: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (channel === 'whatsapp') {
      if (!formData.number) {
        newErrors.number = 'Phone number is required';
      } else if (!/^[0-9]{10,15}$/.test(formData.number)) {
        newErrors.number = 'Phone number must be 10-15 digits';
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const data = channel === 'whatsapp' 
        ? { number: formData.number }
        : { email: formData.email };
      
      onSubmit(channel, data);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      <div className="form-group">
        <label htmlFor={channel === 'whatsapp' ? 'number' : 'email'}>
          {channel === 'whatsapp' ? 'Phone Number' : 'Email Address'}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={channel === 'whatsapp' ? 'tel' : 'email'}
            id={channel === 'whatsapp' ? 'number' : 'email'}
            className={`form-control ${errors[channel === 'whatsapp' ? 'number' : 'email'] ? 'error' : ''}`}
            value={channel === 'whatsapp' ? formData.number : formData.email}
            onChange={(e) => handleInputChange(channel === 'whatsapp' ? 'number' : 'email', e.target.value)}
            placeholder={channel === 'whatsapp' ? 'Enter phone number (e.g., 1234567890)' : 'Enter email address'}
            disabled={loading}
          />
          <div style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6b7280'
          }}>
            {channel === 'whatsapp' ? <MessageCircle size={16} /> : <Mail size={16} />}
          </div>
        </div>
        {errors[channel === 'whatsapp' ? 'number' : 'email'] && (
          <div className="error-message">
            {errors[channel === 'whatsapp' ? 'number' : 'email']}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Sending OTP...
            </>
          ) : (
            <>
              <Send size={16} />
              Send {channel === 'whatsapp' ? 'WhatsApp' : 'Email'} OTP
            </>
          )}
        </button>
      </div>

      <div className="status-card info" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={16} />
          <strong>Important Notes:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
          <li>OTP will be valid for 90 seconds</li>
          <li>You have 4 attempts to enter the correct OTP</li>
          <li>Make sure to enter the {channel === 'whatsapp' ? 'phone number' : 'email'} correctly</li>
          {channel === 'whatsapp' && (
            <li>WhatsApp must be authenticated for the organization</li>
          )}
        </ul>
      </div>
    </form>
  );
};

export default OtpRequestForm; 