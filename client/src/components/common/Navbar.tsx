import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, FileText, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCredentials } from '../../store/authSlice';
import { authService } from '../../services/authService';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      dispatch(clearCredentials());
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
            <FileText size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">DocMage</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="btn-ghost">
                 <User size={16} /> My Files
              </Link>
              <button 
                onClick={handleLogout}
                className="btn-secondary py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/login" 
                className="btn-ghost"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn-primary py-1.5"
              >
                Get Started <ChevronRight size={14} />
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-slate-900 bg-slate-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" className="font-bold text-slate-900 px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>My Files</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn-primary w-full py-3">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="btn-secondary w-full py-3" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn-primary w-full py-3" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
