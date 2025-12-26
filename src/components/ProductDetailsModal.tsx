// src/components/ProductDetailsModal.tsx
'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    description?: string;
    price?: string;
    imageUrl?: string;
  };
}

export function ProductDetailsModal({ isOpen, onClose, product }: Props) {
  const { addToCart, removeFromCart, cart } = useCart();
  const [quantity, setQuantity] = useState(0);

  // Sincroniza a quantidade local com o carrinho global
  useEffect(() => {
    if (isOpen) {
        const itemInCart = cart.find(i => i.title === product.title);
        setQuantity(itemInCart ? itemInCart.quantity : 0);
    }
  }, [isOpen, cart, product.title]);

  if (!isOpen) return null;

  const priceNumber = product.price ? parseFloat(product.price.replace(',', '.')) : 0;
  const hasPrice = priceNumber > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 backdrop-blur-md">
            <X size={20} />
        </button>

        {/* Imagem Grande */}
        <div className="relative w-full h-64 sm:h-72 shrink-0 bg-gray-100">
            {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag size={48} />
                </div>
            )}
        </div>

        {/* Conteúdo */}
        <div className="p-6 flex flex-col flex-1 overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">{product.title}</h2>
                {hasPrice && <span className="text-xl font-bold text-green-600 shrink-0">R$ {product.price}</span>}
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                {product.description || "Sem descrição detalhada."}
            </p>

            {/* Controles de Ação */}
            {hasPrice ? (
                <div className="flex items-center gap-4 mt-auto">
                    <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-2 bg-gray-50">
                        <button 
                            onClick={() => removeFromCart(product.title)} 
                            disabled={quantity === 0}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="text-xl font-bold w-6 text-center text-gray-800">{quantity}</span>
                        <button 
                            onClick={() => addToCart({ title: product.title, price: priceNumber })} 
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-green-200 transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        Confirmar
                    </button>
                </div>
            ) : (
                <div className="mt-auto bg-gray-100 p-3 rounded-lg text-center text-gray-500 text-sm">
                    Produto indisponível para compra direta.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}