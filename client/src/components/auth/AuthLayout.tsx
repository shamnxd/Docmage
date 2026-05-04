import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden max-w-[1460px] mx-auto border-x border-slate-100">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-slate-50 -z-20" />
      <svg 
        className="absolute inset-0 w-full h-full -z-10" 
        width="1440" 
        height="720" 
        viewBox="0 0 1440 720" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
          <path stroke="#E2E8F0" strokeOpacity="1" strokeWidth="1" d="M-15.227 702.342H1439.7" />
          <circle cx="711.819" cy="372.562" r="308.334" stroke="#E2E8F0" strokeOpacity="1" strokeWidth="1" />
          <circle cx="16.942" cy="20.834" r="308.334" stroke="#E2E8F0" strokeOpacity="1" strokeWidth="1" />
          <path stroke="#E2E8F0" strokeOpacity="1" strokeWidth="1" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
          <circle cx="782.595" cy="411.166" r="308.334" stroke="#E2E8F0" strokeOpacity="1" strokeWidth="1" />
      </svg>

      {/* Left Content Side (Content Area) */}
      <div className="hidden lg:flex lg:w-[40%] p-12 lg:p-20 flex-col justify-center relative overflow-hidden border-r border-slate-200/50">
        <div className="relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-[1.2] tracking-tight">
              Powerful PDF management <br />
              <span className="text-indigo-600">made simple.</span>
            </h1>
            <p className="text-base text-slate-500 mb-10 max-w-md leading-relaxed">
              The professional workspace for your documents. Extract, rearrange, and optimize with ease.
            </p>

            <div className="space-y-4">
              <AuthFeatureItem icon={<ShieldCheck className="text-indigo-600" size={18} />} text="Bank-grade security" />
              <AuthFeatureItem icon={<Zap className="text-indigo-600" size={18} />} text="Lightning-fast processing" />
              <AuthFeatureItem icon={<CheckCircle2 className="text-indigo-600" size={18} />} text="Organized workspace" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex justify-center">
             <Link 
              to="/" 
              className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
          </div>

          <div>
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-black text-slate-900 mb-2">{title}</h1>
              <p className="text-sm font-medium text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthFeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 group">
    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
      {icon}
    </div>
    <span className="text-sm font-bold text-slate-600">{text}</span>
  </div>
);

export default AuthLayout;
