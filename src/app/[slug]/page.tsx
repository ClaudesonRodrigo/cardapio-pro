// src/app/[slug]/page.tsx

// ... (imports continuam iguais: getPageDataBySlug, notFound, Image, lucide-react, ClientLinkItem, CartWidget)
import { getPageDataBySlug } from '@/lib/pageService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, MapPin, Clock, AlertCircle } from 'lucide-react';
import ClientLinkItem from './ClientLinkItem';
import CartWidget from './CartWidget';

const themeMap: Record<string, string> = {
  restaurant: 'bg-red-900',
  light: 'bg-gray-100',
  dark: 'bg-gray-900',
  pizza: 'bg-orange-600',
  sushi: 'bg-black border-red-600',
  cafe: 'bg-amber-800',
  burger: 'bg-yellow-500',
  ocean: 'bg-blue-500'
};

const getTextColors = (theme: string) => {
    if (theme === 'light') return { text: 'text-gray-800', sub: 'text-gray-600', card: 'bg-white border-gray-200', link: 'text-gray-800' };
    if (theme === 'burger') return { text: 'text-gray-900', sub: 'text-gray-800', card: 'bg-white/90 border-yellow-600', link: 'text-gray-900' };
    return { text: 'text-white', sub: 'text-gray-200', card: 'bg-white/10 backdrop-blur-md border-white/10', link: 'text-white' };
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params); 
  const pageData = await getPageDataBySlug(slug);

  if (!pageData) {
    return notFound();
  }

  const themeKey = pageData.theme || 'dark';
  const customColor = pageData.customThemeColor;
  
  const bgClass = themeKey === 'custom' ? '' : (themeMap[themeKey] || 'bg-gray-900');
  const bgStyle = themeKey === 'custom' && customColor ? { backgroundColor: customColor } : {};

  const colors = getTextColors(themeKey);

  return (
    // ATENÇÃO AQUI: Passando pixKey para o CartWidget 👇
    <CartWidget 
        whatsapp={pageData.whatsapp} 
        restaurantName={pageData.title}
        pixKey={pageData.pixKey} // <--- ADICIONADO AQUI
    >
        <div 
            className={`min-h-screen flex flex-col items-center relative overflow-x-hidden ${bgClass}`}
            style={bgStyle}
        >
        {/* CAPA DE FUNDO */}
        {pageData.backgroundImage && (
            <div className="absolute top-0 left-0 w-full h-48 sm:h-64 z-0">
                <Image 
                    src={pageData.backgroundImage} 
                    alt="Capa" 
                    fill 
                    className="object-cover opacity-60 mask-linear" 
                    priority 
                />
                <div className={`absolute inset-0 bg-linear-to-b from-transparent to-${themeKey === 'light' ? 'gray-100' : 'black'}/90`}></div>
            </div>
        )}

        <main className="w-full max-w-md px-4 py-8 z-10 flex flex-col gap-6 pb-32">
            
            {/* PERFIL */}
            <div className="flex flex-col items-center text-center space-y-3 mt-10">
                <div className="w-28 h-28 rounded-full border-4 border-white/20 shadow-xl overflow-hidden relative bg-gray-200">
                    {pageData.profileImageUrl ? (
                        <Image src={pageData.profileImageUrl} alt={pageData.title} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">?</div>
                    )}
                </div>
                
                <h1 className={`text-2xl font-bold ${colors.text} drop-shadow-sm`}>{pageData.title}</h1>
                
                {pageData.bio && (
                    <p className={`text-sm ${colors.sub} max-w-xs leading-relaxed`}>{pageData.bio}</p>
                )}

                {/* STATUS E INFO */}
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {pageData.isOpen === false ? (
                        <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"><AlertCircle size={12}/> Fechado</span>
                    ) : (
                        <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"><Clock size={12}/> Aberto</span>
                    )}
                    {pageData.address && (
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pageData.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colors.text} hover:bg-white/30 transition cursor-pointer hover:scale-105 active:scale-95`}
                        >
                            <MapPin size={12}/> {pageData.address.split(',')[0]}
                        </a>
                    )}
                </div>
            </div>

            {/* LINKS / CARDÁPIO */}
            <div className="space-y-3 w-full">
                {pageData.links?.map((link: any, index: number) => (
                    <ClientLinkItem 
                        key={index} 
                        link={link} 
                        pageSlug={slug} 
                        cardClass={colors.card} 
                        textClass={colors.text}
                        subClass={colors.sub}
                    />
                ))}
                
                {(!pageData.links || pageData.links.length === 0) && (
                    <div className="text-center py-10 opacity-60 text-white">
                        <p>Cardápio vazio por enquanto.</p>
                    </div>
                )}
            </div>

            <footer className="mt-8 text-center text-xs opacity-50 text-white">
                <p>Criado com CardápioPro</p>
            </footer>

        </main>
        </div>
    </CartWidget>
  );
}