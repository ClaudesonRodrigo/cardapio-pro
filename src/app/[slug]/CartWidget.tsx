// src/app/[slug]/CartWidget.tsx
'use client';

import { CartProvider, useCart } from '@/context/CartContext';
import { ShoppingBag, MessageCircle, X, Trash2, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// --- MODAL DE CHECKOUT (SACOLA) ---
function CartModal({ 
    isOpen, 
    onClose, 
    whatsapp, 
    restaurantName, 
    pixKey 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    whatsapp?: string, 
    restaurantName: string,
    pixKey?: string
}) {
  const { cart, total, removeFromCart, clearCart } = useCart();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!whatsapp) return alert("Este restaurante não configurou o WhatsApp!");

    let message = `Olá *${restaurantName}*! Gostaria de fazer um pedido:\n\n`;
    cart.forEach(item => {
      message += `${item.quantity}x ${item.title} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${total.toFixed(2)}*`;
    
    if (pixKey) {
        message += `\n\n(Pagamento via Pix)`;
    }
    
    message += `\n\n(Enviado pelo Cardápio Digital)`;

    // Abre o WhatsApp
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Opcional: Limpar carrinho após envio? Por enquanto não, pra ele ver o que pediu.
    // clearCart(); 
    // onClose();
  };

  const handleCopyPix = () => {
      if (pixKey) {
          navigator.clipboard.writeText(pixKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho */}
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><ShoppingBag size={20} className="text-orange-500"/> Sua Sacola</h3>
            <button onClick={onClose} className="bg-gray-200 p-1.5 rounded-full text-gray-600 hover:bg-gray-300 transition"><X size={18}/></button>
        </div>

        {/* Lista de Itens */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Sua sacola está vazia.</p>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                        <div>
                            <p className="font-bold text-sm text-gray-800">{item.quantity}x {item.title}</p>
                            <p className="text-xs text-gray-500">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.title)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                    </div>
                ))
            )}
        </div>

        {/* Área de Pagamento e Total */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-4">
            
            {/* PIX DO RESTAURANTE (Se tiver) */}
            {pixKey && cart.length > 0 && (
                <div className="bg-white border border-green-200 rounded-xl p-3 shadow-sm">
                    <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Pagamento via Pix
                    </p>
                    <div className="flex gap-2">
                        <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-xs text-gray-600 flex-1 truncate font-mono select-all">
                            {pixKey}
                        </div>
                        <button 
                            onClick={handleCopyPix}
                            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1 ${copied ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                            {copied ? <CheckCircle size={14}/> : <Copy size={14}/>} {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 text-center">Copie a chave, pague no seu banco e envie o comprovante no WhatsApp.</p>
                </div>
            )}

            <div className="flex justify-between items-end">
                <span className="text-sm text-gray-500">Total do Pedido</span>
                <span className="text-2xl font-black text-gray-900">R$ {total.toFixed(2)}</span>
            </div>

            <button 
                onClick={handleFinish}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition active:scale-95"
            >
                <MessageCircle size={20} />
                Enviar Pedido no WhatsApp
            </button>
        </div>

      </div>
    </div>
  );
}

// --- BARRA FLUTUANTE ---
function FloatingCartBar({ 
    whatsapp, 
    restaurantName, 
    pixKey 
}: { 
    whatsapp?: string, 
    restaurantName: string, 
    pixKey?: string 
}) {
  const { cart, total } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (cart.length === 0) return null;

  return (
    <>
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
        <button 
            onClick={() => setIsModalOpen(true)} // Abre o Modal em vez de mandar direto
            className="w-full bg-green-600 text-white p-4 rounded-xl shadow-xl flex justify-between items-center hover:bg-green-700 transition active:scale-95 border border-green-500/50 backdrop-blur-md"
        >
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-full relative">
                    <ShoppingBag size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                </div>
                <div className="text-left">
                    <p className="text-xs font-light opacity-90">Total (Ver Sacola)</p>
                    <p className="font-bold text-lg leading-none">R$ {total.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm bg-black/20 px-4 py-2 rounded-lg">
                Ver Sacola
            </div>
        </button>
        </div>

        <CartModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            whatsapp={whatsapp}
            restaurantName={restaurantName}
            pixKey={pixKey}
        />
    </>
  );
}

// Wrapper Principal
export default function CartWidget({ 
  children, 
  whatsapp, 
  restaurantName,
  pixKey // Recebe a chave Pix
}: { 
  children: React.ReactNode, 
  whatsapp?: string, 
  restaurantName: string,
  pixKey?: string
}) {
  return (
    <CartProvider>
      {children}
      <FloatingCartBar whatsapp={whatsapp} restaurantName={restaurantName} pixKey={pixKey} />
    </CartProvider>
  );
}