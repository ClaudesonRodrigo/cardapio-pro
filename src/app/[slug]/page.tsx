// src/app/[slug]/page.tsx
'use client';

import { useEffect, useState, use, useMemo } from 'react';
import { getPageDataBySlug, PageData, LinkData } from "@/lib/pageService";
import { notFound } from "next/navigation";
import Image from 'next/image';
import { FaMapMarkerAlt, FaWhatsapp, FaUtensils, FaPlus, FaMinus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ExtendedPageData extends PageData {
  backgroundImage?: string;
  plan?: string; // Incluído na tipagem para checar no front
}

type CartItem = LinkData & {
  quantity: number;
};

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [pageData, setPageData] = useState<ExtendedPageData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPageDataBySlug(resolvedParams.slug) as ExtendedPageData | null;
      if (!data) notFound();
      else {
        setPageData(data);
        document.documentElement.className = "";
        const theme = data.theme || 'restaurant';
        if (data.backgroundImage) {
            document.documentElement.classList.add('theme-custom-image');
        } else {
            document.documentElement.classList.add(`theme-${theme}`);
        }
      }
    };
    fetchData();
  }, [resolvedParams.slug]);

  const categories = useMemo(() => {
    if (!pageData?.links) return ['Todos'];
    const cats = Array.from(new Set(pageData.links.map(l => l.category || 'Outros')));
    return ['Todos', ...cats.sort()];
  }, [pageData]);

  const filteredItems = useMemo(() => {
    if (!pageData?.links) return [];
    if (selectedCategory === 'Todos') return pageData.links;
    return pageData.links.filter(l => (l.category || 'Outros') === selectedCategory);
  }, [pageData, selectedCategory]);

  const addToCart = (item: LinkData) => {
    setCart(prev => {
      const existing = prev.find(i => i.title === item.title);
      if (existing) {
        return prev.map(i => i.title === item.title ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (title: string) => {
    setCart(prev => prev.filter(i => i.title !== title));
  };

  const updateQuantity = (title: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.title === title) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.price?.replace(',', '.') || '0');
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    let phone = '5511999999999'; 
    const whatsappLink = pageData?.links.find(l => l.url?.includes('wa.me') || l.url?.includes('api.whatsapp'));
    if (whatsappLink && whatsappLink.url) {
        const match = whatsappLink.url.match(/\d+/);
        if(match) phone = match[0];
    }

    let message = `*Olá, gostaria de fazer um pedido:*\n\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.title}\n`;
    });
    message += `\n*Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLocation = () => {
      if(pageData?.address) {
          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pageData.address)}`, '_blank');
      } else {
          alert("Endereço não cadastrado.");
      }
  };

  if (!pageData) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Carregando...</div>;

  const isPro = pageData.plan === 'pro';

  return (
    <div className="min-h-screen font-sans text-theme-text bg-theme-bg pb-32"
         style={pageData.backgroundImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${pageData.backgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' } : {}}
    >
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mx-auto bg-gray-800 mb-4 relative">
            {pageData.profileImageUrl ? <Image src={pageData.profileImageUrl} alt="Logo" fill className="object-cover" sizes="96px" /> : <div className="flex items-center justify-center h-full text-white/30 text-3xl"><FaUtensils/></div>}
        </div>
        <h1 className="text-2xl font-bold mb-2">{pageData.title}</h1>
        <p className="text-white/70 text-sm max-w-md mx-auto">{pageData.bio}</p>
        
        {/* SÓ MOSTRA O BOTÃO SE FOR PRO E TIVER ENDEREÇO */}
        {isPro && pageData.address && (
            <div className="flex justify-center mt-4">
                <button onClick={handleLocation} className="bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/20 transition">
                    <FaMapMarkerAlt /> Como Chegar
                </button>
            </div>
        )}
      </header>

      <div className="sticky top-0 z-20 bg-theme-bg/95 backdrop-blur py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-4 gap-2 no-scrollbar">
            {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <main className="container mx-auto max-w-2xl px-4 mt-6 space-y-4">
        {filteredItems.map((item, index) => (
            <motion.div key={index} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-4">
                {item.imageUrl && (
                    <div className="w-24 h-24 rounded-lg bg-gray-800 relative overflow-hidden shrink-0">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="96px" />
                    </div>
                )}
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white">{item.title}</h3>
                        {item.price && <span className="text-orange-400 font-bold text-sm">R$ {item.price}</span>}
                    </div>
                    <p className="text-xs text-white/60 line-clamp-2 mt-1 mb-2">{item.description}</p>
                    <div className="mt-auto flex justify-end">
                        <button onClick={() => addToCart(item)} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-orange-500 transition flex items-center gap-1">
                            Adicionar <FaPlus size={8}/>
                        </button>
                    </div>
                </div>
            </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {cart.length > 0 && (
            <motion.div 
                initial={{y: 100}} animate={{y: 0}} exit={{y: 100}}
                className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-30"
            >
                <button onClick={() => setIsCartOpen(true)} className="w-full bg-green-600 text-white p-4 rounded-xl shadow-2xl flex justify-between items-center font-bold">
                    <div className="flex items-center gap-2">
                        <div className="bg-black/20 w-8 h-8 rounded-full flex items-center justify-center text-sm">{cart.reduce((a,b)=>a+b.quantity,0)}</div>
                        <span>Ver Carrinho</span>
                    </div>
                    <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{y: 100}} animate={{y: 0}} className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 text-gray-900 max-h-[80vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FaShoppingCart/> Seu Pedido</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">Fechar</button>
                </div>
                
                <div className="flex-1 space-y-4 mb-6">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm">{item.title}</p>
                                <p className="text-orange-600 text-xs font-bold">R$ {item.price}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.title, -1)} className="p-1 hover:bg-white rounded"><FaMinus size={10}/></button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.title, 1)} className="p-1 hover:bg-white rounded"><FaPlus size={10}/></button>
                            </div>
                            <button onClick={() => removeFromCart(item.title)} className="text-red-400 hover:text-red-600 p-2"><FaTrash size={12}/></button>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <span>Total</span>
                        <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 flex justify-center items-center gap-2">
                        <FaWhatsapp size={20}/> Enviar Pedido no Zap
                    </button>
                </div>
            </motion.div>
        </div>
      )}
    </div>
  );
}