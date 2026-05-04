import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Page } from 'react-pdf';
import { CheckCircle2, GripVertical } from 'lucide-react';

interface DraggablePageProps {
  id: string;
  originalIndex: number;
  isSelected: boolean;
  onToggle: () => void;
}

const DraggablePage: React.FC<DraggablePageProps> = ({ id, originalIndex, isSelected, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  const [pageWidth, setPageWidth] = React.useState(window.innerWidth < 640 ? 140 : 180);

  React.useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth < 640 ? 140 : 180);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative group bg-white rounded-xl p-3 border-2 transition-all shadow-sm ${
        isDragging ? 'opacity-50 scale-105 shadow-2xl ring-2 ring-indigo-500/20 z-50' : 
        isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-transparent hover:border-indigo-100 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
           <div 
             {...attributes} 
             {...listeners} 
             className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors"
           >
              <GripVertical size={16} />
           </div>
           <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>Page {originalIndex}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-5 h-5 rounded-xl flex items-center justify-center transition-all ${
            isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-transparent hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 size={12} />
        </button>
      </div>

      <div 
        className="rounded-xl overflow-hidden bg-slate-50 flex justify-center border border-slate-100 cursor-pointer"
        onClick={onToggle}
      >
        <Page 
          pageNumber={originalIndex} 
          width={pageWidth} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={<div className={`h-[${pageWidth * 1.4}px] w-[${pageWidth}px] flex items-center justify-center bg-slate-50 text-[10px] text-slate-300`}>Rendering...</div>}
        />
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 flex items-center justify-center pointer-events-none">
           <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-white scale-75">
              <CheckCircle2 size={16} />
           </div>
        </div>
      )}
    </div>
  );
};

export default DraggablePage;
