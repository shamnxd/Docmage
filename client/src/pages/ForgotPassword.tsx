import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import { authService } from '../services/authService';
import type { AxiosError } from 'axios';

import { forgotPasswordSchema, type ForgotPasswordForm } from '../utils/validation/authSchemas';

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('Password reset link sent to your email.');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Forgot password failed:', axiosError);
      const message = axiosError.response?.data?.message || 'Failed to send reset link.';
      if (message.toLowerCase().includes('email') || message.toLowerCase().includes('user not found')) {
        setError('email', { type: 'manual', message });
      } else {
        setError('root', { type: 'manual', message });
      }
    }
  };

  if (isSubmitSuccessful) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent a password reset link to your email address"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
            <Mail className="text-indigo-600" size={32} />
          </div>
          <p className="text-slate-600">
            Please click the link in the email to reset your password. If you don't see it, check your spam folder.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
          >
            <ArrowLeft size={18} /> Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="Enter your email to receive a password reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="email" 
              placeholder="name@company.com"
              {...register('email')}
              className={`auth-input ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
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
            <>Send Reset Link <Send size={16} /></>
          )}
        </button>

        <p className="text-center pt-4 text-xs font-bold text-slate-500">
          Remember your password? <Link to="/login" className="text-indigo-600 hover:underline ml-1">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
