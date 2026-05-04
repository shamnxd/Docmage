import React from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Document, pdfjs } from 'react-pdf';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setPageOrder, setNumPages, togglePageSelection, getGlobalFile } from '../../store/pdfSlice';
import DraggablePage from './DraggablePage';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const SortablePageGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const pdfState = useAppSelector((state) => state.pdf);
  const file = getGlobalFile();
  const { selectedPages, pageOrder } = pdfState;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pageOrder.findIndex(item => item.id === active.id);
      const newIndex = pageOrder.findIndex(item => item.id === over.id);
      dispatch(setPageOrder(arrayMove(pageOrder, oldIndex, newIndex)));
    }
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    dispatch(setNumPages(numPages));
  }

  if (!file) return null;

  return (
    <div className="mt-12">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
        loading={
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
             <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-md animate-spin"></div>
             <p className="font-bold">Analyzing PDF document...</p>
          </div>
        }
      >
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-32 w-full">
            <SortableContext 
              items={pageOrder.map(p => p.id)}
              strategy={rectSortingStrategy}
            >
              {pageOrder.map((page) => (
                <DraggablePage 
                  key={page.id} 
                  id={page.id} 
                  originalIndex={page.originalIndex}
                  isSelected={selectedPages.includes(page.originalIndex)}
                  onToggle={() => dispatch(togglePageSelection(page.originalIndex))}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </Document>
    </div>
  );
};

export default SortablePageGrid;
