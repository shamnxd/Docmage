import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ExtractionSuccess from './pages/ExtractionSuccess';
import { Toaster } from 'react-hot-toast';
const AppLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Loading DocMage...</p>
    </div>
  </div>
);
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  return user
    ? <>{children}</>
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};
function AppContent() {
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  if (!isInitialized) return <AppLoader />;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/success" 
          element={
            <ProtectedRoute>
              <ExtractionSuccess />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;