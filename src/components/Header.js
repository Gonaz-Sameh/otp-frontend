import React from 'react';
import { Shield, Smartphone } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Shield size={24} />
          <span>OTP Verification System</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <Smartphone size={20} />
          <span>Secure Authentication</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 