import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/authService';
import AuthLayout from '../components/auth/AuthLayout';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

const VerifyOtp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    if (!email) navigate('/register');
    
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const response = await authService.verify({ email, otp: otpString });
      dispatch(setCredentials({ accessToken: response.accessToken, user: response.user }));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await authService.resendOtp(email);
      setTimer(60);
      toast.success('Verification code resent!');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify Account" 
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 px-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            <p className="text-[10px] font-bold text-red-500 leading-tight">{error}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="auth-btn"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Verify Account <ArrowRight size={16} /></>}
        </button>

        <div className="text-center space-y-4">
          <p className="text-sm font-bold text-slate-500">
            Didn't receive the code?
          </p>
          <button
            type="button"
            disabled={timer > 0 || isResending}
            onClick={handleResend}
            className={`inline-flex items-center gap-2 text-sm font-black transition-colors ${
              timer > 0 ? 'text-slate-300' : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            {isResending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
