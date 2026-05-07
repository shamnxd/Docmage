import React, { useState } from 'react';
import { Download, X, Loader2, Sparkles, FileEdit } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearSelection, setIsProcessing, getGlobalFile } from '../../store/pdfSlice';
import { pdfService } from '../../services/pdfService';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const SelectionBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const pdfState = useAppSelector((state) => state.pdf);
  const { selectedPages, isProcessing, pageOrder } = pdfState;
  const file = getGlobalFile();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  
  const [newFileName, setNewFileName] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (selectedPages.length === 0 || !file) return null;

  const handleExport = async () => {
    setError(null);
    if (!isAuthenticated) {
      toast('Please sign in to export your PDF', { icon: '🔑' });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!showDownloadModal) {
      setShowDownloadModal(true);
      return;
    }

    if (!newFileName) {
      setError('Please enter a file name');
      return;
    }

    try {
      dispatch(setIsProcessing(true));
      const loadingToast = toast.loading('Preparing your PDF...');

      // 1. Upload the PDF first
      const uploadResult = await pdfService.upload(file);
      const pdfId = uploadResult.data.id;

      // 2. Prepare the page indices in the current UI order
      const pageIndicesToExtract = pageOrder
        .filter(item => selectedPages.includes(item.originalIndex))
        .map(item => item.originalIndex - 1);

      // 3. Request extraction
      const extractionResult = await pdfService.extract(pdfId, pageIndicesToExtract, newFileName);
      const newPdfId = extractionResult.data.id;

      toast.dismiss(loadingToast);
      toast.success('PDF extracted successfully!', { duration: 5000 });
      setShowDownloadModal(false);
      setNewFileName('');
      
      // Clear PDF state and navigate to success page
      dispatch(clearSelection());
      navigate('/success', { 
        state: { 
          pdfId: newPdfId,
          fileName: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`
        } 
      });
    } catch (err: any) {
      console.error('Export failed:', err);
      setError(err.response?.data?.message || 'Failed to export PDF');
      toast.dismiss(); // Dismiss the loading toast if error
    } finally {
      dispatch(setIsProcessing(false));
    }
  };

  return (
    <AnimatePresence>
      {/* Download Name Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDownloadModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-[340px] bg-white rounded-md p-6 shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="relative z-10 text-center">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center mb-4 mx-auto">
                <FileEdit size={20} />
              </div>
              
              <h3 className="text-base font-bold text-slate-900 mb-1">Name your PDF</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Enter a filename for your extraction.</p>
              
              <div className="space-y-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Filename" 
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExport()}
                    autoFocus
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-900 pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">.pdf</div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <p className="text-[10px] font-bold text-red-500 leading-tight">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowDownloadModal(false)}
                    className="flex-1 py-2 rounded-md font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleExport}
                    disabled={isProcessing}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>Download</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 md:px-6 z-[100]"
      >
        <div className="bg-slate-900 text-white p-3 md:p-4 pl-5 md:pl-6 rounded-xl flex flex-col gap-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-base md:text-lg shadow-lg shadow-indigo-500/20">
                  {selectedPages.length}
                </div>
                <div className="absolute -top-1 -right-1 bg-white text-indigo-600 rounded-md p-0.5 shadow-md">
                    <Sparkles size={8} fill="currentColor" />
                </div>
              </div>
              <div>
                <p className="font-black text-sm md:text-base leading-none mb-0.5">pages selected</p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAuthenticated ? 'Ready to export' : 'Sign in to export'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 md:gap-3">
              <button 
                className="hidden sm:flex btn-ghost text-slate-400 hover:text-white px-3 md:px-4 py-2" 
                onClick={() => dispatch(clearSelection())} 
                disabled={isProcessing}
              >
                <X size={16} /> Clear
              </button>
              <button 
                className="btn-primary px-4 md:px-8 py-2 md:py-2.5 text-xs md:text-sm" 
                onClick={handleExport} 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> <span className="hidden sm:inline">Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isAuthenticated ? 'Export PDF' : 'Sign in'}</span> <Download size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionBar;
