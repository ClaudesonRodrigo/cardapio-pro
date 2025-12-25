// src/app/[slug]/page.tsx
import { getPageDataBySlug } from '@/lib/pageService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaWhatsapp, FaMapMarkerAlt, FaClock, FaExclamationCircle } from 'react-icons/fa';
import ClientLinkItem from './ClientLinkItem';

// Mapa de Temas (IGUAL AO DASHBOARD)
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
  const { slug } = await Promise.resolve(params); // Next 15 safe access
  const pageData = await getPageDataBySlug(slug);

  if (!pageData) {
    return notFound();
  }

  const themeKey = pageData.theme || 'dark';
  const customColor = pageData.customThemeColor;
  
  // Lógica da Cor de Fundo
  const bgClass = themeKey === 'custom' ? '' : (themeMap[themeKey] || 'bg-gray-900');
  const bgStyle = themeKey === 'custom' && customColor ? { backgroundColor: customColor } : {};

  const colors = getTextColors(themeKey);

  return (
    <div 
        className={`min-h-screen flex flex-col items-center relative overflow-x-hidden ${bgClass}`}
        style={bgStyle}
    >
      {/* CAPA DE FUNDO */}
      {pageData.backgroundImage && (
          <div className="absolute top-0 left-0 w-full h-48 sm:h-64 z-0">
              <Image src={pageData.backgroundImage} alt="Capa" fill className="object-cover opacity-60 mask-linear" />
              <div className={`absolute inset-0 bg-linear-to-b from-transparent to-${themeKey === 'light' ? 'gray-100' : 'black'}/90`}></div>
          </div>
      )}

      <main className="w-full max-w-md px-4 py-8 z-10 flex flex-col gap-6">
        
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
                    <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"><FaExclamationCircle/> Fechado</span>
                ) : (
                    <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"><FaClock/> Aberto</span>
                )}
                {pageData.address && (
                    <span className={`bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colors.text}`}>
                        <FaMapMarkerAlt size={10}/> {pageData.address.split(',')[0]}
                    </span>
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

        <footer className="mt-8 text-center text-xs opacity-50 text-white pb-6">
            <p>Criado com CardápioPro</p>
        </footer>

      </main>

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      {pageData.whatsapp && (
          <a 
            href={`https://wa.me/${pageData.whatsapp}`} 
            target="_blank" 
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110 animate-bounce-slow"
          >
              <FaWhatsapp size={28} />
          </a>
      )}
    </div>
  );
}