import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, FileText } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { pdfApi } from '../api/pdfApi';
const ExtractionSuccess: React.FC = () => {
  const location = useLocation();
  const fileName = location.state?.fileName || 'Extracted_Document.pdf';
  const pdfId = location.state?.pdfId;
  useEffect(() => {
    if (pdfId) {
      handleDownload();
    }
  }, [pdfId]);
  const handleDownload = async () => {
    try {
      const blob = await pdfApi.download(pdfId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col relative overflow-hidden">
      {}
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
        <path stroke="#E2E8F0" strokeOpacity="1" strokeWidth="1" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
      </svg>
      <Navbar />
      <main className="flex-1 flex items-center justify-center container-custom pt-32 pb-20">
        <div className="max-w-[340px] w-full text-center relative z-10">
          <div className="w-19 h-19 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Success!</h1>
          <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">
            Your document has been extracted and saved to your files.
          </p>
          <div className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-md p-3 flex items-center justify-between mb-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{fileName}</p>
                <p className="text-[10px] font-bold text-slate-400">Ready to view</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Link
              to="/dashboard"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-xs"
            >
              Go to My Files <ArrowRightIcon size={14} />
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 rounded-md font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-200 text-xs"
            >
              Extract Another
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
const ArrowRightIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);
export default ExtractionSuccess;