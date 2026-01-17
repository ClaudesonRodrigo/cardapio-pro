// src/app/[slug]/ClientLinkItem.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductDetailsModal } from '@/components/ProductDetailsModal';
import { motion } from 'framer-motion'; // <--- Import da animação

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        <motion.div 
            whileTap={{ scale: 0.98 }} // Efeito sutil ao clicar no card inteiro
            onClick={() => setIsModalOpen(true)}
            className={`p-3 rounded-xl flex items-center gap-3 shadow-sm transition-all cursor-pointer border border-transparent hover:border-black/5 ${cardClass} ${quantity > 0 ? 'ring-2 ring-green-500 bg-green-50/50' : ''}`}
        >
          {/* Imagem */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg relative overflow-hidden shrink-0 border border-black/5">
            {link.imageUrl ? (
                <Image src={link.imageUrl} alt={link.title} fill className="object-cover" sizes="80px" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
            )}
            {quantity > 0 && (
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-bl-lg shadow-md z-10"
                >
                    {quantity}
                </motion.div>
            )}
          </div>

          {/* Info + Controles */}
          <div className="flex-1 min-w-0 flex flex-col h-20 justify-between py-0.5">
            <div>
                <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-sm truncate leading-tight ${textClass}`}>{link.title}</h4>
                </div>
                {link.description && <p className={`text-xs truncate mt-0.5 opacity-80 ${subClass}`}>{link.description}</p>}
            </div>

            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                    {hasPrice ? `R$ ${link.price}` : 'Ver'}
                </span>

                {/* CONTROLES (Stepper com animação) */}
                {hasPrice && (
                    <div className="flex items-center gap-3 bg-white shadow-sm rounded-lg p-1 border border-gray-100" onClick={(e) => e.stopPropagation()}>
                        {quantity > 0 && (
                            <>
                                <motion.button 
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => removeFromCart(link.title)} 
                                    className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500 transition"
                                >
                                    <Minus size={14} />
                                </motion.button>
                                <span className="text-xs font-bold w-4 text-center text-gray-800">{quantity}</span>
                            </>
                        )}
                        <motion.button 
                            whileTap={{ scale: 0.8, rotate: 90 }} // Gira e encolhe ao clicar!
                            onClick={() => addToCart({ title: link.title, price: priceNumber })} 
                            className="w-7 h-7 flex items-center justify-center rounded bg-green-500 text-white hover:bg-green-600 transition shadow-sm"
                        >
                            <Plus size={14} />
                        </motion.button>
                    </div>
                )}
            </div>
          </div>
        </motion.div>
    </>
  );
}