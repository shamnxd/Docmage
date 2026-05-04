import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';
import AuthLayout from '../components/auth/AuthLayout';
import { useGoogleLogin } from '@react-oauth/google';

import { authService } from '../services/authService';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data);
      // Assuming response.data contains { token, user }
      dispatch(setCredentials({ accessToken: response.accessToken, user: response.user }));
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message;
      
      if (message === 'Account not verified. Please verify your email.') {
        // Redirect to verify page if account is unverified
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      
      toast.error(message || 'Login failed. Please check your credentials.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await authService.googleLogin(tokenResponse.access_token);
        dispatch(setCredentials({ accessToken: response.accessToken, user: response.user }));
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error('Google login failed:', error);
        toast.error(error.response?.data?.message || 'Google login failed.');
      }
    },
    onError: () => {
      toast.error('Google login failed.');
    },
  });

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your details to access your account"
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

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="password" 
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              className={`auth-input ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="auth-btn"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-md animate-spin"></div>
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </button>

        <div className="relative py-2 flex items-center">
           <div className="flex-1 border-t border-slate-100"></div>
           <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
           <div className="flex-1 border-t border-slate-100"></div>
        </div>

        <div className="space-y-3">
           <button 
             type="button" 
             onClick={() => googleLogin()}
             className="w-full py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-sm"
           >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
           </button>
        </div>

        <p className="text-center pt-4 text-xs font-bold text-slate-500">
          New to DocMage? <Link to="/register" state={{ from }} className="text-indigo-600 hover:underline ml-1">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
