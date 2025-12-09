// src/components/SortableLinkItem.tsx
'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaGripVertical, FaTag, FaUtensils } from 'react-icons/fa';
import { LinkData } from '@/lib/pageService';
import Image from 'next/image';

interface Props {
  link: LinkData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  editingIndex: number | null;
}

export function SortableLinkItem({ link, index, onEdit, onDelete, editingIndex }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: (link.url || link.title) + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  const isEditing = editingIndex === index;

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 bg-orange-50 rounded-lg border-2 border-orange-400 mb-3 relative opacity-80">
         <div className="flex items-center gap-2 justify-center text-orange-700 font-bold">
            <FaUtensils /> Editando este item...
         </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md mb-3 flex items-center gap-4 transition-all"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-gray-600 p-2 touch-none">
        <FaGripVertical size={16} />
      </div>

      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
        {link.imageUrl ? (
            <Image 
              src={link.imageUrl} 
              alt={link.title} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 56px"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300"><FaUtensils /></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="font-bold text-gray-800 text-sm truncate">{link.title}</p>
                {link.category && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded w-fit mt-0.5 flex items-center gap-1">
                        <FaTag size={8}/> {link.category}
                    </span>
                )}
            </div>
            {link.price && (
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                    R$ {link.price}
                </span>
            )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{link.description || "Sem descrição"}</p>
      </div>

      <div className="flex flex-col gap-1">
        <button onClick={onEdit} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">Editar</button>
        <button onClick={onDelete} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">Excluir</button>
      </div>
    </div>
  );
}