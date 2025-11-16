import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../pages/Login.css';
const ForgotPasswordPage = () => {
  const [step, setStep] = useState('email'); // 'otp', 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      await axios.post('https://pc-parts-marketplace-website.onrender.com/api/auth/request-reset', { email });
      setStep('otp');
      setMessage('OTP sent to your email 📩');
    } catch (err) {
      setMessage('Failed to send OTP ❌');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('https://pc-parts-marketplace-website.onrender.com/api/auth/verify-otp', { email, otp });
      setStep('reset');
      setMessage('OTP verified ✅');
    } catch (err) {
      setMessage('Invalid or expired OTP ❌');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('http://pc-parts-marketplace-website.onrender.com/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setMessage('Password reset successful ✅');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Failed to reset password ❌');
    }
  };

  return (
    <div className="login-container">
      <h2>Password Reset</h2>
      {step === 'email' && (
        <>
          <input type="email" placeholder="Enter your email" value={email}
            onChange={e => setEmail(e.target.value)} />
          <button onClick={requestOtp}>Send OTP</button>
        </>
      )}
      {step === 'otp' && (
        <>
          <input type="text" placeholder="Enter OTP" value={otp}
            onChange={e => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
      {step === 'reset' && (
        <>
          <input type="password" placeholder="New Password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)} />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
