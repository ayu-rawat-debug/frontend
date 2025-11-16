import React, { useState } from 'react';
import axios from 'axios';
import '../../pages/Login.css'; // optional separate styling

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    try {
      console.log('Sending OTP to:', email); 
      await axios.post('https://pc-parts-marketplace-website.onrender.com/api/auth/request-reset', { email });
      setStep('otp');
      setMessage('OTP sent to your email 📩');
    } catch(err) {
      console.error('❌ OTP request failed:', err.response?.data || err.message);
      setMessage('Failed to send OTP ❌');
      console.error('OTP request failed:', err);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('https://pc-parts-marketplace-website.onrender.com/api/auth/verify-otp', { email, otp });
      setStep('reset');
      setMessage('OTP verified ✅');
    } catch {
      setMessage('Invalid or expired OTP ❌');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('https://pc-parts-marketplace-website.onrender.com/api/auth/reset-password', { email, otp, newPassword });
      setMessage('Password reset successful ✅');
      setTimeout(onClose, 2000);
    } catch {
      setMessage('Failed to reset password ❌');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reset Password</h2>
        {step === 'email' && (
          <>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={requestOtp}>Send OTP</button>
          </>
        )}
        {step === 'otp' && (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}
        {step === 'reset' && (
          <>
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}
        {message && <p>{message}</p>}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
