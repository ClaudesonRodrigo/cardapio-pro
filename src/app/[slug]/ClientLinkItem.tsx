'use client';

import React from 'react';
import Image from 'next/image';
import { LinkData } from '@/lib/pageService';
import { Plus } from 'lucide-react';

interface ClientLinkItemProps {
  link: LinkData;
  onSelect: (link: LinkData) => void; 
}

export default function ClientLinkItem({ link, onSelect }: ClientLinkItemProps) {
  return (
    <div 
      onClick={() => onSelect(link)} 
      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 items-center cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
    >
      {/* Imagem */}
      {link.imageUrl ? (
        <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {/* CORREÇÃO 3: Adicionado sizes="80px" para otimizar thumbnails */}
          <Image 
            src={link.imageUrl} 
            alt={link.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="80px"
          />
        </div>
      ) : (
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-gray-300">
           <span className="text-xs">Sem foto</span>
        </div>
      )}

      {/* Textos */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight mb-1 truncate">
          {link.title}
        </h3>
        
        {link.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
            {link.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto">
             <p className="font-bold text-green-600 text-sm">
                {link.price ? `R$ ${link.price}` : 'Consultar'}
             </p>
             <button className="w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Plus size={16} />
             </button>
        </div>
      </div>
    </div>
  );
}