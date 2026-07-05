import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface PageItem {
  id: string; 
  originalIndex: number; 
}
interface PdfState {
  numPages: number;
  selectedPages: number[]; 
  pageOrder: PageItem[]; 
  isProcessing: boolean;
  fileName: string | null;
}
let _persistedFile: File | null = null;
export const setGlobalFile = (file: File | null) => {
  _persistedFile = file;
};
export const getGlobalFile = () => _persistedFile;
const initialState: PdfState = {
  numPages: 0,
  selectedPages: [],
  pageOrder: [],
  isProcessing: false,
  fileName: null,
};
const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    setPdfFile(state, action: PayloadAction<{ name: string } | null>) {
      if (action.payload) {
        state.fileName = action.payload.name;
      } else {
        state.fileName = null;
        state.numPages = 0;
        state.selectedPages = [];
        state.pageOrder = [];
      }
    },
    setNumPages(state, action: PayloadAction<number>) {
      state.numPages = action.payload;
      state.pageOrder = Array.from({ length: action.payload }, (_, i) => ({
        id: `page-${i + 1}`,
        originalIndex: i + 1,
      }));
    },
    togglePageSelection(state, action: PayloadAction<number>) {
      const index = action.payload;
      const isSelected = state.selectedPages.includes(index);
      if (isSelected) {
        state.selectedPages = state.selectedPages.filter(p => p !== index);
      } else {
        state.selectedPages.push(index);
      }
    },
    setPageOrder(state, action: PayloadAction<PageItem[]>) {
      state.pageOrder = action.payload;
    },
    clearSelection(state) {
      state.selectedPages = [];
    },
    setIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload;
    },
    resetPdf() {
      return initialState;
    },
  },
});
export const { 
  setPdfFile, 
  setNumPages, 
  togglePageSelection, 
  setPageOrder, 
  clearSelection, 
  setIsProcessing, 
  resetPdf 
} = pdfSlice.actions;
export default pdfSlice.reducer;