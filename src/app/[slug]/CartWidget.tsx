// src/app/[slug]/CartWidget.tsx
'use client';

import { CartProvider, useCart } from '@/context/CartContext';
import { ShoppingBag, MessageCircle, X, Trash2, Copy, CheckCircle, ArrowRight, Loader2, User, Tag, Bike, Store, MapPin, LogIn, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { createOrder, OrderData, CouponData } from '@/lib/pageService';
import { useParams } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebaseClient';

const auth = getAuth(app);

const triggerSuccessConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

function CartModal({ isOpen, onClose, whatsapp, restaurantName, pixKey, coupons }: { isOpen: boolean, onClose: () => void, whatsapp?: string, restaurantName: string, pixKey?: string, coupons?: CouponData[] }) {
  const { cart, total, removeFromCart, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // LOGIN CLIENTE
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // DADOS DO CLIENTE E ENTREGA
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // ENDEREÇO
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressComplement, setAddressComplement] = useState('');

  // CUPOM
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [couponError, setCouponError] = useState('');

  const params = useParams();
  const slug = params?.slug as string;

  // Monitorar Auth (Verifica se já está logado)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
            setCurrentUser(user);
            if(user.displayName) setCustomerName(user.displayName);
        } else {
            setCurrentUser(null);
        }
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  // Lógica de Login com Google
  const handleLogin = async () => {
      try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
      } catch (error) {
          console.error("Erro login google", error);
          alert("Erro ao conectar com Google. Tente novamente.");
      }
  };

  // Calcula Desconto
  let discountAmount = 0;
  if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
          discountAmount = (total * appliedCoupon.value) / 100;
      } else {
          discountAmount = appliedCoupon.value;
      }
      if (discountAmount > total) discountAmount = total; 
  }
  const finalTotal = total - discountAmount;

  const handleApplyCoupon = () => {
      setCouponError('');
      if (!coupons || coupons.length === 0) return setCouponError('Este restaurante não tem cupons ativos.');
      const found = coupons.find(c => c.code === couponCode.toUpperCase().trim() && c.active);
      if (!found) return setCouponError('Cupom inválido ou expirado.');
      setAppliedCoupon(found);
      setCouponError('');
  };

  const handleRemoveCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode('');
  };

  const handleFinish = async () => {
    if (!whatsapp) return alert("Erro: WhatsApp não configurado.");
    if (!customerName.trim()) return alert("Por favor, digite seu nome.");
    
    // Validação Endereço
    if (deliveryMethod === 'delivery') {
        if (!addressStreet.trim() || !addressNumber.trim() || !addressNeighborhood.trim()) {
            return alert("Para entrega, preencha Rua, Número e Bairro.");
        }
    }

    setIsSending(true);

    try {
        const fullAddress = deliveryMethod === 'delivery' 
            ? `${addressStreet}, ${addressNumber} - ${addressNeighborhood} ${addressComplement ? `(${addressComplement})` : ''}`
            : 'Retirada no Local';

        const newOrder: OrderData = {
            pageSlug: slug,
            customerName: customerName,
            customerId: currentUser?.uid, // Salva ID se logado
            items: cart,
            total: finalTotal, 
            status: 'pending', 
            createdAt: null, 
            paymentMethod: pixKey ? 'pix' : 'money',
            deliveryMethod: deliveryMethod,
            deliveryAddress: fullAddress
        };

        const orderId = await createOrder(newOrder);
        triggerSuccessConfetti();

        const trackingLink = `${window.location.origin}/${slug}/pedido/${orderId}`;

        // MENSAGEM WHATSAPP
        let message = `Olá *${restaurantName}*! Sou *${customerName}* e gostaria de fazer um pedido:\n\n`;
        
        // Tipo de Entrega
        message += `🛵 *${deliveryMethod === 'delivery' ? 'ENTREGA' : 'RETIRADA'}*\n`;
        if (deliveryMethod === 'delivery') {
            message += `📍 ${fullAddress}\n`;
        }
        message += `-------------------------------\n`;

        cart.forEach(item => {
          message += `${item.quantity}x ${item.title} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\nSubtotal: R$ ${total.toFixed(2)}`;
        
        if (appliedCoupon) {
            message += `\n🎟️ Cupom (${appliedCoupon.code}): -R$ ${discountAmount.toFixed(2)}`;
        }

        message += `\n*Total Final: R$ ${finalTotal.toFixed(2)}*`;
        if (pixKey) message += `\n(Pagamento via Pix)`;
        
        message += `\n\n📌 *Acompanhar Pedido:* ${trackingLink}`;

        setTimeout(() => {
            window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
            clearCart();
            setAppliedCoupon(null); 
            onClose();
            setIsSending(false);
        }, 1000);

    } catch (error) {
        console.error(error);
        alert("Erro ao enviar pedido. Tente novamente.");
        setIsSending(false);
    }
  };

  const handleCopyPix = () => {
      if (pixKey) {
          navigator.clipboard.writeText(pixKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 flex flex-col max-h-[90vh]">
        
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><ShoppingBag size={20} className="text-orange-500"/> Finalizar Pedido</h3>
            <button onClick={onClose} className="bg-gray-200 p-1.5 rounded-full text-gray-600 hover:bg-gray-300 transition"><X size={18}/></button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
            
            {/* 1. LOGIN COM GOOGLE */}
            {!currentUser ? (
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-blue-800">Já pediu aqui?</p>
                        <p className="text-[10px] text-blue-600">Entre para facilitar.</p>
                    </div>
                    <button onClick={handleLogin} className="bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition">
                        <LogIn size={12}/> Entrar com Google
                    </button>
                </div>
            ) : (
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {currentUser.photoURL && <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-full border border-green-200"/>}
                        <div>
                            <p className="text-xs font-bold text-green-800">Olá, {currentUser.displayName?.split(' ')[0]}</p>
                            <p className="text-[10px] text-green-600">Logado com Google</p>
                        </div>
                    </div>
                    <a href={`/${slug}/meus-pedidos`} className="bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition flex items-center gap-1">
                        <Package size={12}/> Meus Pedidos
                    </a>
                </div>
            )}

            {/* 2. ENTREGA OU RETIRADA */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${deliveryMethod === 'delivery' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Bike size={16}/> Entrega
                </button>
                <button 
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${deliveryMethod === 'pickup' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Store size={16}/> Retirada
                </button>
            </div>

            {/* 3. DADOS PESSOAIS E ENDEREÇO */}
            <div className="space-y-3">
                <div className="bg-white border border-gray-300 rounded-xl px-3 py-2 flex items-center gap-2 focus-within:border-orange-500 transition">
                    <User size={18} className="text-gray-400"/>
                    <input type="text" placeholder="Seu Nome (Obrigatório)" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full text-sm outline-none text-gray-800 font-medium" />
                </div>

                {deliveryMethod === 'delivery' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            <input type="text" placeholder="Rua" value={addressStreet} onChange={e => setAddressStreet(e.target.value)} className="flex-2 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
                            <input type="text" placeholder="Nº" value={addressNumber} onChange={e => setAddressNumber(e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
                        </div>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Bairro" value={addressNeighborhood} onChange={e => setAddressNeighborhood(e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
                        </div>
                        <input type="text" placeholder="Complemento (Opcional)" value={addressComplement} onChange={e => setAddressComplement(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
                    </div>
                )}
            </div>

            {/* 4. CUPOM */}
            {coupons && coupons.length > 0 && (
                <div className="bg-white border border-purple-200 rounded-xl p-3">
                     {!appliedCoupon ? (
                         <div className="flex gap-2">
                             <input type="text" placeholder="Cupom" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="flex-1 border border-gray-300 rounded px-3 text-sm outline-none focus:border-purple-500 uppercase font-bold text-gray-700" />
                             <button onClick={handleApplyCoupon} className="bg-purple-600 text-white px-4 rounded text-xs font-bold hover:bg-purple-700">OK</button>
                         </div>
                     ) : (
                         <div className="flex justify-between items-center">
                             <span className="text-sm font-bold text-purple-700 flex items-center gap-1"><Tag size={14}/> {appliedCoupon.code} aplicado!</span>
                             <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remover</button>
                         </div>
                     )}
                     {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>
            )}

            {/* 5. RESUMO PAGAMENTO */}
            <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                 {pixKey && (
                     <div className="bg-white border border-green-200 rounded p-2 mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-green-700 uppercase">Pagamento via Pix</span>
                            <button onClick={handleCopyPix} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{copied ? 'Copiado!' : 'Copiar Chave'}</button>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate font-mono">{pixKey}</p>
                     </div>
                 )}
                 {appliedCoupon && (
                    <div className="flex justify-between items-end text-green-600 text-xs font-bold">
                        <span>Desconto</span>
                        <span>- R$ {discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-end">
                    <span className="text-sm text-gray-500 font-bold">Total Final</span>
                    <span className="text-2xl font-black text-gray-900">R$ {finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <button 
                onClick={handleFinish}
                disabled={cart.length === 0 || isSending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition active:scale-95"
            >
                {isSending ? <Loader2 className="animate-spin"/> : <MessageCircle size={20} />}
                {isSending ? 'Enviando...' : 'Enviar Pedido no WhatsApp'}
            </button>
        </div>
      </div>
    </div>
  );
}

function FloatingCartBar({ whatsapp, restaurantName, pixKey, coupons }: { whatsapp?: string, restaurantName: string, pixKey?: string, coupons?: CouponData[] }) {
  const { cart, total } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (cart.length === 0) return null;

  return (
    <>
        <div className="fixed bottom-6 left-4 right-4 z-40 animate-in slide-in-from-bottom-10 duration-500">
            <button onClick={() => setIsModalOpen(true)} className="w-full group relative overflow-hidden bg-gray-900/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transition-all active:scale-[0.98] hover:bg-gray-900/95">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"/>
                <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-full relative">
                            <ShoppingBag className="text-white" size={20} />
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-medium">Total estimado</p>
                            <p className="text-white font-bold text-xl leading-none">R$ {total.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-900/20 group-hover:bg-green-500 transition">Ver Sacola <ArrowRight size={16}/></div>
                </div>
            </button>
        </div>
        <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} whatsapp={whatsapp} restaurantName={restaurantName} pixKey={pixKey} coupons={coupons}/>
    </>
  );
}

export default function CartWidget({ children, whatsapp, restaurantName, pixKey, coupons }: { children: React.ReactNode, whatsapp?: string, restaurantName: string, pixKey?: string, coupons?: CouponData[] }) {
  return (
    <CartProvider>
      {children}
      <FloatingCartBar whatsapp={whatsapp} restaurantName={restaurantName} pixKey={pixKey} coupons={coupons} />
    </CartProvider>
  );
}