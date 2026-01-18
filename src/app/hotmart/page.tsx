// src/app/hotmart/page.tsx
'use client';

import React from 'react';
import { 
  CheckCircle, Rocket, Smartphone, DollarSign, Layout, Shield, 
  ArrowRight, Star, Code, Database, Zap, Lock, BarChart3, 
  ShoppingBag, MapPin, MousePointerClick, Eye, ExternalLink, PlayCircle 
} from 'lucide-react';

export default function HotmartSalesPage() {
  
  // 👇 LINK DEFINITIVO DO CHECKOUT HOTMART
  const HOTMART_LINK = "https://pay.hotmart.com/K103943387F"; 

  const features = [
    { icon: Shield, title: "Painel Super Admin", desc: "Controle total. Crie, bloqueie e gerencie todos os restaurantes da plataforma em uma única tela." },
    { icon: BarChart3, title: "Gestão Financeira", desc: "Dashboard com gráficos de faturamento, ticket médio e relatórios detalhados por período." },
    { icon: MousePointerClick, title: "Login Social (Google)", desc: "Zero fricção. O cliente final faz login com 1 clique para fechar o pedido." },
    { icon: Zap, title: "Rastreio em Tempo Real", desc: "Atualização de status ao vivo: Pendente -> Preparando -> Saiu para Entrega." },
    { icon: ShoppingBag, title: "Gestão de Pedidos", desc: "Fluxo completo de Carrinho, Cupons de Desconto, Taxa de Entrega e Retirada no Local." },
    { icon: Layout, title: "Cardápio Drag & Drop", desc: "Organize os produtos e categorias apenas arrastando. UX impecável." },
  ];

  const techStack = [
    { name: "Next.js 14", desc: "App Router & Server Actions" },
    { name: "React 19", desc: "A biblioteca mais usada no mundo" },
    { name: "Tailwind CSS", desc: "Design Responsivo e Moderno" },
    { name: "Firebase", desc: "Auth, Firestore & Storage" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-white selection:bg-green-500 selection:text-black overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#020617]/80 backdrop-blur-lg z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
                <span className="text-green-400">CODE</span>MARKET
            </div>
            <a href={HOTMART_LINK} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-400 text-black px-6 py-2.5 rounded-full font-bold text-sm transition shadow-lg shadow-green-500/20 flex items-center gap-2">
                Comprar Agora <ArrowRight size={16}/>
            </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-32 pb-10 px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
              
              <div className="inline-flex items-center gap-2 bg-white/5 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-green-500/50 transition cursor-default">
                  <Star size={12} fill="currentColor"/> Venda de Código Fonte Completo
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                  SaaS de Delivery <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-600">High Ticket.</span><br/>
                  <span className="text-white">Sem Programar Nada.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Adquira o <strong>Código Fonte White-Label</strong> de um sistema de pedidos validado. Instale, coloque sua marca e venda assinaturas para restaurantes da sua cidade.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a href={HOTMART_LINK} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-black text-xl px-10 py-5 rounded-2xl font-black shadow-xl shadow-green-500/20 hover:bg-green-400 hover:scale-105 transition transform flex items-center justify-center gap-3">
                      <Code size={24}/> BAIXAR CÓDIGO FONTE
                  </a>
              </div>
              
              <div className="pt-6 flex items-center justify-center gap-8 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Entrega Imediata</span>
                  <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Garantia de 7 Dias</span>
                  <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Vitalício</span>
              </div>
          </div>
      </header>

      {/* 🎥 VÍDEO PERSUASIVO (NOVA SEÇÃO) */}
      <section className="px-6 pb-20 relative z-20">
          <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-b from-gray-800 to-black p-1 rounded-3xl shadow-2xl shadow-green-900/20 border border-white/10">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                      <iframe 
                        className="w-full h-full" 
                        src="https://www.youtube.com/embed/vfKJIkoTT-c?si=bpJKgS6X80f_keNP" 
                        title="Apresentação do Sistema SaaS" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                      ></iframe>
                  </div>
              </div>
              <div className="text-center mt-6">
                 <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <PlayCircle size={16} className="text-green-500"/> Assista ao vídeo e veja o potencial de lucro deste sistema.
                 </p>
              </div>
          </div>
      </section>

      {/* TECH STACK */}
      <section className="py-10 border-y border-white/5 bg-white/2 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">Construído com Stack de Elite</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {techStack.map((tech, i) => (
                      <div key={i} className="bg-[#0f172a] p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:border-green-500/30 transition">
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                              <Code size={20}/> 
                          </div>
                          <div>
                              <h3 className="font-bold text-white text-sm">{tech.name}</h3>
                              <p className="text-xs text-gray-500">{tech.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="py-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black text-white">Mais que um Site.<br/>Um Ecossistema Completo.</h2>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">Não vendemos apenas "telinhas". Vendemos um sistema robusto com regras de negócio complexas já resolvidas para você.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((f, i) => (
                      <div key={i} className="bg-[#0f172a] p-8 rounded-3xl border border-white/5 hover:border-green-500/40 hover:bg-white/3 transition group">
                          <div className="w-14 h-14 bg-linear-to-br from-gray-800 to-black rounded-2xl border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                              <f.icon size={28} className="text-green-400"/>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition">{f.title}</h3>
                          <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* DEMONSTRAÇÃO AO VIVO */}
      <section className="py-24 px-6 bg-[#0b1120] border-y border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                  <Eye size={12}/> Veja com seus próprios olhos
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white">
                  O Produto que você vai entregar.
              </h2>
              
              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Não vendemos promessas, vendemos software rodando. Clique no botão abaixo para ver a plataforma original (Cardápio Certo) em funcionamento. <br/>É <strong>exatamente isso</strong> que seus clientes vão receber.
              </p>
              
              <div className="pt-4">
                  <a href="https://cardapiocerto.com.br" target="_blank" rel="noopener noreferrer" className="inline-flex bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 items-center gap-3">
                      <ExternalLink size={20} className="text-blue-400"/>
                      ACESSAR DEMONSTRAÇÃO AO VIVO
                  </a>
                  <p className="text-xs text-gray-600 mt-3 font-medium">Link abre em nova aba: cardapiocerto.com.br</p>
              </div>
          </div>
      </section>

      {/* OFERTA IRRESISTÍVEL */}
      <section className="py-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-linear-to-b from-[#0f172a] to-black rounded-[40px] border border-white/10 p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Comece sua Software House</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                  Pare de vender horas. Comece a vender produto. Baixe o código, customize e venda licenças mensais.
              </p>

              <div className="bg-white/5 rounded-3xl p-8 max-w-sm mx-auto border border-white/10 mb-10">
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Oferta Especial</p>
                  <div className="flex items-center justify-center gap-3">
                      <span className="text-gray-600 line-through text-lg">R$ 997</span>
                      <span className="text-5xl font-black text-white">R$ 247</span>
                  </div>
                  <p className="text-xs text-green-400 mt-2 font-medium">Pagamento Único • Acesso Vitalício</p>
              </div>

              <a href={HOTMART_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex bg-green-500 hover:bg-green-400 text-black text-xl px-12 py-5 rounded-2xl font-black shadow-xl shadow-green-500/20 transition transform hover:scale-105 items-center gap-3">
                  COMPRAR SISTEMA AGORA <ArrowRight size={24}/>
              </a>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 font-medium opacity-60">
                  <div className="flex items-center justify-center gap-2"><Lock size={12}/> Compra Segura</div>
                  <div className="flex items-center justify-center gap-2"><Database size={12}/> Banco Incluso (Firebase)</div>
                  <div className="flex items-center justify-center gap-2"><Smartphone size={12}/> Responsivo</div>
                  <div className="flex items-center justify-center gap-2"><Layout size={12}/> UX/UI Premium</div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#020617] py-12 text-center relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
              <div className="font-black text-xl tracking-tighter text-white/50">
                  CODE<span className="text-green-500/50">MARKET</span>
              </div>
              <p className="text-sm text-gray-600">
                  © 2026. Todos os direitos reservados.<br/>
                  Este produto não garante lucros. O resultado depende da sua capacidade de venda.
              </p>
          </div>
      </footer>
    </div>
  );
}