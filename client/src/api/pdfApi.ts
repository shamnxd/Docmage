import api from './index';
import { API_ROUTES } from '../constants/apiRoutes';
export const pdfApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    const response = await api.post(API_ROUTES.PDF.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  extract: async (pdfId: string, pageIndices: number[], newFileName: string) => {
    const response = await api.post(API_ROUTES.PDF.extract(pdfId), { pageIndices, newFileName });
    return response.data;
  },
  download: async (pdfId: string) => {
    const response = await api.get(API_ROUTES.PDF.download(pdfId), {
      responseType: 'blob',
    });
    return response.data;
  },
  delete: async (pdfId: string) => {
    const response = await api.delete(API_ROUTES.PDF.delete(pdfId));
    return response.data;
  },
  list: async (params?: { search?: string; page?: number; limit?: number }) => {
    const response = await api.get(API_ROUTES.PDF.BASE, { params });
    return response.data;
  },
};