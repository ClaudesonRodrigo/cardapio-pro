// src/app/[slug]/ClientLinkItem.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductDetailsModal } from '@/components/ProductDetailsModal'; // <--- Import novo

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
  const { addToCart, removeFromCart, cart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do Modal

  const cartItem = cart.find(i => i.title === link.title);
  const quantity = cartItem ? cartItem.quantity : 0;
  const priceNumber = link.price ? parseFloat(link.price.replace(',', '.')) : 0;
  const hasPrice = priceNumber > 0;

  return (
    <>
        <ProductDetailsModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            product={link} 
        />

        <div 
            onClick={() => setIsModalOpen(true)} // Clicar no card abre o modal
            className={`p-3 rounded-xl flex items-center gap-3 shadow-sm transition-all cursor-pointer ${cardClass} ${quantity > 0 ? 'ring-2 ring-green-500 bg-green-50/10' : ''}`}
        >
          {/* Imagem */}
          <div className="w-20 h-20 bg-black/10 rounded-lg relative overflow-hidden shrink-0 border border-white/10">
            {link.imageUrl ? (
                <Image src={link.imageUrl} alt={link.title} fill className="object-cover" sizes="80px" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={20} /></div>
            )}
            {quantity > 0 && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-bl-lg shadow">
                    {quantity}
                </div>
            )}
          </div>

          {/* Info + Controles */}
          <div className="flex-1 min-w-0 flex flex-col h-20 justify-between py-0.5">
            <div>
                <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-sm truncate leading-tight ${textClass}`}>{link.title}</h4>
                </div>
                {/* Descrição truncada visualmente, mas abre completa no modal */}
                {link.description && <p className={`text-xs truncate mt-0.5 opacity-80 ${subClass}`}>{link.description}</p>}
            </div>

            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-green-500">
                    {hasPrice ? `R$ ${link.price}` : 'Consulte'}
                </span>

                {/* CONTROLES (com stopPropagation para não abrir o modal ao clicar neles) */}
                {hasPrice && (
                    <div className="flex items-center gap-3 bg-gray-100/10 rounded-lg p-1 backdrop-blur-sm border border-white/10" onClick={(e) => e.stopPropagation()}>
                        {quantity > 0 && (
                            <>
                                <button onClick={() => removeFromCart(link.title)} className={`w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-red-500 hover:text-white transition ${textClass}`}>
                                    <Minus size={14} />
                                </button>
                                <span className={`text-xs font-bold w-3 text-center ${textClass}`}>{quantity}</span>
                            </>
                        )}
                        <button onClick={() => addToCart({ title: link.title, price: priceNumber })} className={`w-6 h-6 flex items-center justify-center rounded bg-green-600 text-white hover:bg-green-700 transition shadow-sm`}>
                            <Plus size={14} />
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
    </>
  );
}