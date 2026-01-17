// src/app/[slug]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import { getPageDataBySlug, PageData, LinkData } from '@/lib/pageService';
import Image from 'next/image';
import { MapPin, Clock, Phone, Search, Package, User } from 'lucide-react';
import ClientLinkItem from './ClientLinkItem';
import CartWidget from './CartWidget';
import { ProductDetailsModal } from '@/components/ProductDetailsModal';
import Link from 'next/link'; 
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'; 
import { app } from '@/lib/firebaseClient';

const auth = getAuth(app);

const themeMap: Record<string, string> = {
  restaurant: 'bg-red-900',
  light: 'bg-gray-100',
  dark: 'bg-gray-900',
  pizza: 'bg-orange-600',
  sushi: 'bg-black',
  cafe: 'bg-amber-800',
  burger: 'bg-yellow-500',
  ocean: 'bg-blue-500',
};

export default function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  const [selectedProduct, setSelectedProduct] = useState<LinkData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
        }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (slug) {
      getPageDataBySlug(slug).then((doc) => {
        if (doc) {
            const page = doc as PageData; 
            if (page.links) {
                page.links.sort((a, b) => (a.order || 0) - (b.order || 0));
            }
            setData(page);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const handleOpenProduct = (product: LinkData) => { setSelectedProduct(product); setIsModalOpen(true); };
  const handleCloseProduct = () => { setIsModalOpen(false); setTimeout(() => setSelectedProduct(null), 300); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">Cardápio não encontrado 😕</div>;

  const categories = ['Todos', ...Array.from(new Set(data.links?.map(l => l.category).filter(Boolean) || []))];
  const filteredLinks = data.links?.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const themeClass = data.theme && themeMap[data.theme] ? themeMap[data.theme] : (data.customThemeColor ? '' : 'bg-gray-800');
  const customStyle = data.theme === 'custom' && data.customThemeColor ? { backgroundColor: data.customThemeColor } : {};

  return (
    <CartWidget 
        whatsapp={data.whatsapp} 
        restaurantName={data.title} 
        pixKey={data.pixKey}
        coupons={data.coupons}
    >
      <div className="min-h-screen bg-gray-50 pb-24 font-sans">
        
        <header className={`relative ${data.backgroundImage ? 'h-48 sm:h-64' : 'h-32 sm:h-40'} transition-all duration-500`}>
             <div className={`absolute inset-0 ${themeClass}`} style={customStyle}>
                {data.backgroundImage && (
                    <>
                        {/* CORREÇÃO 1: Adicionado sizes="100vw" na capa */}
                        <Image 
                            src={data.backgroundImage} 
                            alt="Capa" 
                            fill 
                            className="object-cover opacity-80" 
                            priority 
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    </>
                )}
             </div>
        </header>

        <main className="max-w-md mx-auto px-4 -mt-16 sm:-mt-20 relative z-10">
            
            <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 text-center border border-gray-100 relative overflow-hidden">
                
                {currentUser && (
                    <div className="absolute top-0 left-0 right-0 bg-green-50 py-1 flex justify-center items-center gap-1">
                        <p className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                            <User size={10} /> Olá, {currentUser.displayName?.split(' ')[0]}
                        </p>
                    </div>
                )}

                <div className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto -mt-12 sm:-mt-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white relative ${currentUser ? 'mt-4' : ''}`}>
                    {/* CORREÇÃO 2: Adicionado sizes="120px" no logo */}
                    {data.profileImageUrl ? (
                        <Image 
                            src={data.profileImageUrl} 
                            alt={data.title} 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 768px) 100vw, 120px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-3xl">{data.title?.charAt(0)}</div>
                    )}
                </div>
                
                <h1 className="mt-3 text-xl sm:text-2xl font-bold text-gray-900">{data.title}</h1>
                {data.bio && <p className="text-gray-500 text-sm mt-1">{data.bio}</p>}
                
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-medium text-gray-600">
                    {data.isOpen ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 border border-green-200 animate-pulse"><Clock size={12}/> Aberto</span> : <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1 border border-red-200"><Clock size={12}/> Fechado</span>}
                    {data.address && <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"><MapPin size={12}/> {data.address}</span>}
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    {currentUser && (
                        <Link href={`/${slug}/meus-pedidos`} className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-orange-500 text-orange-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-orange-50 transition transform active:scale-95 animate-in slide-in-from-top-2">
                            <Package size={18} /> Ver Meus Pedidos
                        </Link>
                    )}

                    {data.whatsapp && (
                        <a href={`https://wa.me/${data.whatsapp}`} target="_blank" className="w-full inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-600 transition transform active:scale-95">
                            <Phone size={18} /> Falar no WhatsApp
                        </a>
                    )}
                </div>
            </div>

            <div className="sticky top-2 z-20 space-y-3 mb-6 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 shadow-sm transition-all">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input type="text" placeholder="O que você procura hoje?" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm shadow-sm" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map(cat => (
                        <button key={cat as string} onClick={() => setSelectedCategory(cat as string)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{cat as string}</button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredLinks.length > 0 ? (
                    filteredLinks.map((link, index) => <ClientLinkItem key={index} link={link} onSelect={handleOpenProduct} />)
                ) : (
                    <div className="text-center py-10 text-gray-400"><p>Nenhum produto encontrado.</p></div>
                )}
            </div>
        </main>

        {selectedProduct && <ProductDetailsModal isOpen={isModalOpen} onClose={handleCloseProduct} product={selectedProduct} />}
      </div>
    </CartWidget>
  );
}