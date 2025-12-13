// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaUtensils, FaWhatsapp, FaQrcode, FaBolt, FaCheck, FaArrowRight, FaStore 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getRecentPages, PageData } from '@/lib/pageService';
import Image from 'next/image';

export default function LandingPage() {
  const [recentPages, setRecentPages] = useState<PageData[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(true);

  useEffect(() => {
    const fetchRecents = async () => {
      const pages = await getRecentPages();
      setRecentPages(pages);
      setLoadingRecents(false);
    };
    fetchRecents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-extrabold text-gray-800">
            <div className="bg-orange-600 text-white p-2 rounded-lg">
              <FaUtensils size={18} />
            </div>
            Cardápio<span className="text-orange-600">Pro</span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/login" className="text-sm font-bold text-gray-600 hover:text-orange-600 py-2 transition">
              Entrar
            </Link>
            <Link href="/admin/login" className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition shadow-lg hidden sm:block">
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-32 pb-20 px-4 text-center bg-linear-to-b from-white to-gray-100 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-200/20 rounded-full blur-3xl -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200">
            🚀 O Sistema de Delivery Mais Simples do Brasil
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Receba Pedidos no <span className="text-green-500">WhatsApp</span> <br/>
            e Pagamentos via <span className="text-blue-600">Pix</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Crie seu cardápio digital em menos de 2 minutos. Sem taxas por pedido, sem maquininha e com QR Code automático.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Link href="/admin/login" className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-orange-700 transition shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:scale-105">
              Criar Cardápio Grátis <FaArrowRight size={14}/>
            </Link>

            <div className="w-full max-w-2xl mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Últimos Cardápios Criados 👇
                </p>
                
                {loadingRecents ? (
                    <div className="flex justify-center gap-3 animate-pulse">
                        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        {recentPages.length > 0 ? (
                            recentPages.map((page) => (
                                <Link 
                                    key={page.slug} 
                                    href={`/${page.slug}`} 
                                    target="_blank"
                                    className="bg-white border border-gray-200 hover:border-orange-400 text-gray-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition flex items-center gap-2 group"
                                >
                                    {page.profileImageUrl ? (
                                        <div className="w-5 h-5 rounded-full overflow-hidden relative">
                                            <Image src={page.profileImageUrl} alt="Icon" fill className="object-cover" sizes="20px" />
                                        </div>
                                    ) : (
                                        <FaStore className="text-gray-400 group-hover:text-orange-500" />
                                    )}
                                    {page.title.length > 15 ? page.title.substring(0, 15) + '...' : page.title}
                                </Link>
                            ))
                        ) : (
                            // MUDANÇA AQUI: Se não tiver nenhum, manda criar!
                            <Link href="/admin/login" className="bg-white border border-gray-300 text-gray-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                                <FaStore className="text-orange-500" /> Seja o primeiro a criar!
                            </Link>
                        )}
                    </div>
                )}
            </div>
          </div>
          
          <p className="mt-6 text-xs text-gray-400">Não precisa de cartão de crédito • Plano Grátis disponível</p>
        </motion.div>
      </header>

      {/* RESTO DA LANDING PAGE (Features, Pricing, etc) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tudo que você precisa para vender mais</h2>
            <p className="text-gray-500">Esqueça os PDFs e prints. Tenha um sistema profissional.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition group">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition text-green-600"><FaWhatsapp size={30} /></div>
              <h3 className="text-xl font-bold mb-3">Pedidos no WhatsApp</h3>
              <p className="text-gray-600 leading-relaxed">O cliente monta o pedido e envia prontinho para o seu Zap. Nome, endereço e total calculado. Zero erros.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition text-blue-600"><FaQrcode size={30} /></div>
              <h3 className="text-xl font-bold mb-3">Pix Automático (Pro)</h3>
              <p className="text-gray-600 leading-relaxed">O cliente vê o QR Code da sua chave Pix na hora de pagar. Dinheiro cai na sua conta na hora, sem intermediários.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition group">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition text-orange-600"><FaBolt size={30} /></div>
              <h3 className="text-xl font-bold mb-3">Fácil de Atualizar</h3>
              <p className="text-gray-600 leading-relaxed">Acabou a Coca-Cola? Mudou o preço do X-Bacon? Edite pelo celular em segundos e atualize para todos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Planos Simples e Transparentes</h2>
            <p className="text-gray-400">Comece grátis e cresça com a gente.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700">
              <h3 className="text-xl font-bold text-gray-400 mb-2">Iniciante</h3>
              <div className="text-4xl font-extrabold mb-6">Grátis <span className="text-sm font-normal text-gray-500">/para sempre</span></div>
              <ul className="space-y-4 mb-8 text-gray-300">
                <li className="flex gap-3"><FaCheck className="text-green-500 shrink-0 mt-1"/> Até 8 Produtos</li>
                <li className="flex gap-3"><FaCheck className="text-green-500 shrink-0 mt-1"/> Pedidos ilimitados no Zap</li>
                <li className="flex gap-3"><FaCheck className="text-green-500 shrink-0 mt-1"/> Link Personalizado</li>
                <li className="flex gap-3 opacity-50"><FaCheck className="text-gray-500 shrink-0 mt-1"/> QR Code Pix Automático</li>
                <li className="flex gap-3 opacity-50"><FaCheck className="text-gray-500 shrink-0 mt-1"/> Temas Premium</li>
              </ul>
              <Link href="/admin/login" className="block w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-center transition">Começar Grátis</Link>
            </div>
            <div className="bg-orange-600 p-8 rounded-3xl border-4 border-orange-500 shadow-2xl relative transform md:scale-105">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase">Mais Popular</div>
              <h3 className="text-xl font-bold text-orange-100 mb-2">Profissional</h3>
              <div className="text-4xl font-extrabold mb-6">R$ 29,90 <span className="text-sm font-normal text-orange-200">/mês</span></div>
              <ul className="space-y-4 mb-8 text-white font-medium">
                <li className="flex gap-3"><FaCheck className="text-yellow-300 shrink-0 mt-1"/> Produtos Ilimitados</li>
                <li className="flex gap-3"><FaCheck className="text-yellow-300 shrink-0 mt-1"/> <strong>QR Code Pix Automático</strong></li>
                <li className="flex gap-3"><FaCheck className="text-yellow-300 shrink-0 mt-1"/> Temas Premium (Sushi, Pizza...)</li>
                <li className="flex gap-3"><FaCheck className="text-yellow-300 shrink-0 mt-1"/> Banner Personalizado</li>
                <li className="flex gap-3"><FaCheck className="text-yellow-300 shrink-0 mt-1"/> Suporte Prioritário</li>
              </ul>
              <Link href="/admin/login" className="block w-full py-4 rounded-xl bg-white text-orange-600 hover:bg-gray-100 font-bold text-center transition shadow-lg">Testar 7 Dias Grátis</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Pronto para digitalizar seu delivery?</h2>
          <p className="text-gray-600 text-lg mb-8">Junte-se a centenas de restaurantes que modernizaram o atendimento.</p>
          <Link href="/admin/login" className="inline-flex items-center gap-2 bg-green-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-green-700 transition shadow-xl hover:shadow-green-500/40">
            <FaWhatsapp /> Criar Meu Cardápio Agora
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800 mb-4">
          <FaUtensils className="text-orange-600" /> CardápioPro
        </div>
        <p className="text-gray-500 text-sm">© 2025 CardápioPro. Feito com ❤️ para empreendedores.</p>
      </footer>

    </div>
  );
}