import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyOTP, resendOTP } from '../../redux/slices/authSlice';

export default function OTPVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingUserId, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const inputs = useRef([]);

  useEffect(() => {
    if (!pendingUserId) navigate('/register');
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [pendingUserId, navigate]);

  const handleChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
    if (paste.every((c) => /[0-9]/.test(c))) {
      const newOtp = [...paste, ...Array(6 - paste.length).fill('')];
      setOtp(newOtp.slice(0, 6));
      inputs.current[Math.min(paste.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return;
    const result = await dispatch(verifyOTP({ userId: pendingUserId, otp: otpString }));
    if (!result.error) navigate('/');
  };

  const handleResend = async () => {
    if (!pendingUserId) return;
    const result = await dispatch(resendOTP({ userId: pendingUserId }));
    if (!result.error) {
      setTimeLeft(600);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    }
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-display font-bold text-forest-green dark:text-white">Verify Your Email</h2>
        <p className="text-gray-500 text-sm mt-2">We've sent a 6-digit OTP to your email address.</p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all
              ${digit ? 'border-dark-olive bg-dark-olive/5 text-dark-olive' : 'border-gray-200 dark:border-gray-600'}
              focus:outline-none focus:border-dark-olive focus:ring-2 focus:ring-dark-olive/20`}
          />
        ))}
      </div>

      {/* Timer / Resend */}
      <div className="text-center text-sm text-gray-500 mb-6">
        {timeLeft > 0 ? (
          <p>OTP expires in <strong className="text-warm-brown">{mins}:{secs}</strong></p>
        ) : null}
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="mt-2 text-dark-olive font-semibold hover:text-forest-green underline disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>

      <button onClick={handleVerify} disabled={loading || otp.join('').length !== 6}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
}
