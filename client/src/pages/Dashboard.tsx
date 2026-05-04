import React from 'react';
import Navbar from '../components/common/Navbar';
import { useAppDispatch } from '../store/hooks';
import { setPdfFile, setGlobalFile } from '../store/pdfSlice';
import { FileText, Download, Trash2, Search, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pdfService } from '../services/pdfService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pdfs, setPdfs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ total: 0, count: 0, monthlyUsage: 0 });
  const [isDownloading, setIsDownloading] = React.useState<string | null>(null);
  const [isOpening, setIsOpening] = React.useState<string | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [pdfToDelete, setPdfToDelete] = React.useState<{ id: string, name: string } | null>(null);

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPdfs = async (search?: string) => {
    try {
      setLoading(true);
      const response = await pdfService.list({ search });
      setPdfs(response.data.pdfs);
      setStats({
        total: response.data.pagination.total,
        count: response.data.pdfs.length,
        monthlyUsage: 0
      });
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
      toast.error('Failed to load your documents');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when debounced search changes
  React.useEffect(() => {
    fetchPdfs(debouncedSearch);
  }, [debouncedSearch]);

  const handleDirectDownload = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    try {
      setIsDownloading(id);
      const blob = await pdfService.download(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download complete!');
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleEditFile = async (id: string, name: string) => {
    try {
      setIsOpening(id);
      const loadingToast = toast.loading('Loading document...');
      const blob = await pdfService.download(id);
      const file = new File([blob], name, { type: 'application/pdf' });
      setGlobalFile(file);
      dispatch(setPdfFile({ name: file.name }));
      toast.dismiss(loadingToast);
      navigate('/');
    } catch (error) {
      toast.error('Failed to load document for editing');
    } finally {
      setIsOpening(null);
    }
  };

  const confirmDelete = async () => {
    if (!pdfToDelete) return;

    try {
      setIsSubmitting(true);
      await pdfService.delete(pdfToDelete.id);
      toast.success('Document deleted');
      setShowDeleteModal(false);
      setPdfToDelete(null);
      fetchPdfs(debouncedSearch);
    } catch (error) {
      toast.error('Failed to delete document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setPdfToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

      <main className="container-custom pt-24 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">My Documents</h1>
            <p className="text-slate-500 font-medium text-sm">Manage and organize your PDF workspace.</p>
          </div>

          <Link to="/" className="btn-primary py-2.5">
            <Plus size={16} /> New Extraction
          </Link>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-md overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="p-5 border-b border-slate-200 bg-white/80 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold text-slate-900">Recent Files</h2>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">{stats.total} Total</span>
            </div>
            <div className="relative group">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all w-64 font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Document Name</th>
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Modified</th>
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">File Size</th>
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/40">
                {loading ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6 h-20 bg-white/30"></td>
                    </tr>
                  ))
                ) : pdfs.length > 0 ? (
                  pdfs.map(pdf => (
                    <tr
                      key={pdf.id}
                      className="group hover:bg-indigo-50/40 transition-colors cursor-pointer"
                      onClick={() => handleEditFile(pdf.id, pdf.originalName)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                            {isOpening === pdf.id ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{pdf.originalName}</p>
                            <p className="text-xs text-slate-400 font-bold">{pdf.pageCount} pages</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-500">{formatDate(pdf.createdAt)}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-500">{formatSize(pdf.size)}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleDirectDownload(e, pdf.id, pdf.originalName)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            title="Download"
                            disabled={isDownloading === pdf.id}
                          >
                            {isDownloading === pdf.id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, pdf.id, pdf.originalName)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-md flex items-center justify-center mx-auto mb-4">
                        <FileText size={24} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">
                        {searchTerm ? `No results for "${searchTerm}"` : 'No documents yet'}
                      </h3>
                      <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                        {searchTerm ? 'Try adjusting your search to find what you are looking for.' : 'Upload your first PDF to see it here and start managing your workspace.'}
                      </p>
                      <Link to="/" className="btn-primary inline-flex px-6 py-2">
                        Start an extraction
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-[340px] bg-white rounded-md p-6 shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="relative z-10 text-center">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-md flex items-center justify-center mb-4 mx-auto">
                  <Trash2 size={20} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">Delete document?</h3>
                <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                  Are you sure you want to delete <span className="text-slate-900">"{pdfToDelete?.name}"</span>?
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 rounded-md font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>Delete</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
