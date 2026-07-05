import React, { useCallback } from 'react';
import { Cloud, Plus } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setPdfFile, setGlobalFile } from '../../store/pdfSlice';
const FileUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = React.useState<string | null>(null);
  const handleFile = (file: File) => {
    setError(null);
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    setGlobalFile(file);
    dispatch(setPdfFile({ name: file.name }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [dispatch]);
  return (
    <div 
      className="relative group cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        id="pdf-upload" 
        accept=".pdf" 
        onChange={handleFileChange} 
        hidden 
      />
      <label 
        htmlFor="pdf-upload" 
        className="block bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center transition-all group-hover:border-indigo-600 group-hover:bg-indigo-50/20 cursor-pointer shadow-sm group-hover:shadow-lg group-hover:-translate-y-1"
      >
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform group-hover:bg-indigo-600 group-hover:text-white shadow-lg shadow-indigo-100">
          <Cloud size={28} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Upload your PDF</h3>
        <p className="text-base text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
          Drag and drop your file here, or click to browse from your computer.
        </p>
        <div className="btn-primary py-3 px-10 inline-flex rounded-xl">
          <Plus size={18} strokeWidth={3} /> Choose PDF File
        </div>
        {error && (
          <div className="mt-6 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            <p className="text-[10px] font-bold text-red-500 leading-tight tracking-wide uppercase">{error}</p>
          </div>
        )}
      </label>
    </div>
  );
};
export default FileUpload;