import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import { authService } from '../services/authService';
import type { AxiosError } from 'axios';

import { resetPasswordSchema, type ResetPasswordForm } from '../utils/validation/authSchemas';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, setError, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Invalid or missing token.');
      return;
    }

    try {
      await authService.resetPassword({ token, password: data.password });
      toast.success('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Reset password failed:', axiosError);
      const message = axiosError.response?.data?.message || 'Failed to reset password.';
      if (message.toLowerCase().includes('password')) {
        setError('password', { type: 'manual', message });
      } else {
        setError('root', { type: 'manual', message });
      }
    }
  };

  if (!token) {
    return (
      <AuthLayout 
        title="Invalid Link" 
        subtitle="The password reset link is invalid or has expired"
      >
        <div className="text-center py-8">
           <p className="text-slate-600 mb-8">Please request a new password reset link.</p>
           <button 
             onClick={() => navigate('/forgot-password')}
             className="auth-btn"
           >
             Go to Forgot Password
           </button>
        </div>
      </AuthLayout>
    );
  }

  if (isSubmitSuccessful) {
    return (
      <AuthLayout 
        title="Password Updated" 
        subtitle="Your password has been successfully reset"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <p className="text-slate-600">
            You will be redirected to the login page in a few seconds.
          </p>
          <button 
             onClick={() => navigate('/login')}
             className="auth-btn"
           >
             Login Now
           </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="password" 
              placeholder="••••••••"
              {...register('password')}
              className={`auth-input ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">Confirm New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="password" 
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`auth-input ${errors.confirmPassword ? 'border-red-500 bg-red-50' : ''}`}
            />
          </div>
          {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
        </div>

        {errors.root && (
          <div className="flex items-center gap-2 px-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            <p className="text-[10px] font-bold text-red-500 leading-tight">{errors.root.message}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="auth-btn"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-md animate-spin"></div>
          ) : (
            <>Update Password <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
