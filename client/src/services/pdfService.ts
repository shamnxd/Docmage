import api from './api';

export const pdfService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    const response = await api.post('/pdfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  extract: async (pdfId: string, pageIndices: number[], newFileName: string) => {
    const response = await api.post(`/pdfs/${pdfId}/extract`, { pageIndices, newFileName });
    return response.data;
  },
  download: async (pdfId: string) => {
    const response = await api.get(`/pdfs/${pdfId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
  delete: async (pdfId: string) => {
    const response = await api.delete(`/pdfs/${pdfId}`);
    return response.data;
  },
  list: async (params?: { search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/pdfs', { params });
    return response.data;
  },
};
