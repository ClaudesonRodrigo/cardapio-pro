// src/app/[slug]/ClientLinkItem.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';

interface LinkData {
  title: string;
  url?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}

interface Props {
  link: LinkData;
  pageSlug: string;
  cardClass: string;
  textClass: string;
  subClass: string;
}

export default function ClientLinkItem({ link, cardClass, textClass, subClass }: Props) {
  return (
    <div className={`p-3 rounded-xl flex items-center gap-3 shadow-sm transition-transform active:scale-95 ${cardClass}`}>
      {/* Imagem do Produto */}
      <div className="w-16 h-16 bg-black/10 rounded-lg relative overflow-hidden shrink-0 border border-white/10">
        {link.imageUrl ? (
            <Image 
              src={link.imageUrl} 
              alt={link.title} 
              fill 
              className="object-cover" 
              sizes="64px" 
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
                <FaImage size={18} />
            </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <h4 className={`font-bold text-sm truncate leading-tight ${textClass}`}>
                {link.title}
            </h4>
            
            {link.price && (
                <span className="text-sm font-bold text-green-500 shrink-0 ml-2">
                    R$ {link.price}
                </span>
            )}
        </div>

        {link.description && (
            <p className={`text-xs truncate mt-0.5 ${subClass}`}>
                {link.description}
            </p>
        )}
      </div>
    </div>
  );
}