import React from 'react';
import Navbar from '../components/common/Navbar';
import SortablePageGrid from '../components/pdf/SortablePageGrid';
import SelectionBar from '../components/pdf/SelectionBar';
import FileUpload from '../components/pdf/FileUpload';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { resetPdf, getGlobalFile } from '../store/pdfSlice';
import { Sparkles, FileText, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const pdfState = useAppSelector((state) => state.pdf);
  const file = getGlobalFile();
  const { numPages, selectedPages } = pdfState;

  const handleReset = () => {
    dispatch(resetPdf());
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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
      
      <Navbar />
      
      <main className="container-custom min-h-screen flex items-center py-20">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-10"
            >
              <div className="flex-1 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold mb-6"
                >
                  <Sparkles size={14} /> Fast. Simple. Secure.
                </motion.div>
                <h1 className="text-4xl lg:text-6xl font-[900] text-slate-900 mb-6 tracking-tight leading-[1.1]">
                  Organize your PDF <br />
                  <span className="text-indigo-600">like a pro.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl leading-relaxed mb-10">
                  The ultimate workspace to extract, rearrange, and optimize your PDF pages. Just drag, drop, and export your professional documents in seconds.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 text-slate-400">
                  <div className="flex items-center gap-2 font-bold text-sm"><div className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-indigo-600"><FileText size={16} /></div> No limits</div>
                  <div className="flex items-center gap-2 font-bold text-sm"><div className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-indigo-600"><Layout size={16} /></div> Drag & Drop</div>
                  <div className="flex items-center gap-2 font-bold text-sm"><div className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-indigo-600"><Sparkles size={16} /></div> 100% Free</div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-xl">
                <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                   <FileUpload />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <button 
                    onClick={handleReset}
                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 mb-2 flex items-center gap-2 transition-colors"
                  >
                    ← Back to upload
                  </button>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 break-all">
                    {file?.name}
                  </h1>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Pages</p>
                    <p className="text-lg font-black text-slate-900">{numPages}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Selected</p>
                    <p className="text-lg font-black text-indigo-600">{selectedPages.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100/50 rounded-xl p-4 md:p-10 border border-slate-200/50 min-h-[500px]">
                 <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Editor Canvas</h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-md shadow-sm">
                       <Layout size={12} /> Drag pages to reorder
                    </div>
                 </div>
                 <SortablePageGrid />
              </div>
              
              <SelectionBar />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
