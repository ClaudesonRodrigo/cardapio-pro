// src/app/page.tsx
'use client';
import Link from 'next/link';
import { FaUtensils, FaQrcode, FaMobileAlt, FaCheckCircle, FaWhatsapp, FaArrowRight } from 'react-icons/fa';

export default function LandingPage() {
  // Substitua pelo seu número real do WhatsApp
  const whatsappNumber = "5579996337995"; 
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de saber mais sobre o Cardápio Pro e o serviço de Setup.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      {/* HEADER */}
      <header className="fixed w-full bg-white/90 backdrop-blur z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-orange-600">
            <FaUtensils /> CardápioPro
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm font-medium text-gray-600 hover:text-orange-600 hidden sm:block">
              Área do Cliente
            </Link>
            <a href="#planos" className="bg-orange-600 text-white px-5 py-2 rounded-full font-bold hover:bg-orange-700 transition text-sm">
              Ver Planos
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 bg-linear-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold mb-6 animate-pulse">
            🚀 Aumente suas vendas hoje
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Tenha um Cardápio Digital <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600">Profissional e Sem Taxas.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nós configuramos tudo para você. Abandone o PDF e tenha um cardápio interativo com QR Code, pedidos no WhatsApp e atualização em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-600 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-green-700 transition transform hover:-translate-y-1">
              <FaWhatsapp size={24} /> Falar com Consultor
            </a>
            <Link href="/admin/login" className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 text-lg px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition">
              Entrar no Sistema
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            <FaCheckCircle className="inline text-green-500 mr-1"/> Cardápio pronto em até 24h
          </p>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que usar o CardápioPro?</h2>
                <p className="text-gray-500">A solução completa para lanchonetes, restaurantes e delivery.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {icon: FaMobileAlt, title: "Atualize no Celular", desc: "Acabou a coca-cola? Mude o preço ou tire do ar em 1 segundo pelo seu celular."},
                    {icon: FaQrcode, title: "QR Code na Mesa", desc: "Seu cliente senta, escaneia e pede. Sem esperar o garçom trazer o cardápio velho."},
                    {icon: FaCheckCircle, title: "Zero Comissões", desc: "Diferente do iFood, aqui você não paga taxa sobre os pedidos. O lucro é 100% seu."}
                ].map((i,k) => (
                    <div key={k} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:border-orange-200 transition duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-orange-500 text-2xl">
                            <i.icon />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-gray-800">{i.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{i.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* PRECIFICAÇÃO (MODELO B) */}
      <section id="planos" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Invista no seu Negócio</h2>
                <p className="text-gray-400">Escolha a opção ideal. Ajudamos você a configurar tudo.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8 items-center md:items-stretch">
                
                {/* Plano DIY (Faça você mesmo) - Opcional, bom para ancoragem */}
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-sm flex flex-col opacity-80 hover:opacity-100 transition">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">Faça Você Mesmo</h3>
                    <p className="text-gray-400 text-sm mb-6">Acesso à plataforma para criar sozinho.</p>
                    <div className="text-3xl font-bold text-white mb-6">Gratuito <span className="text-sm font-normal text-gray-500">/ teste</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
                        <li className="flex gap-2"><FaCheckCircle className="text-gray-500"/> Cadastro manual</li>
                        <li className="flex gap-2"><FaCheckCircle className="text-gray-500"/> Tema Básico</li>
                        <li className="flex gap-2"><FaCheckCircle className="text-gray-500"/> QR Code Simples</li>
                    </ul>
                    <Link href="/admin/login" className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center font-bold py-3 rounded-xl transition">
                        Criar Grátis
                    </Link>
                </div>

                {/* PLANO DESTAQUE (MODELO B) */}
                <div className="bg-white text-gray-900 p-8 rounded-3xl border-4 border-orange-500 w-full max-w-md flex flex-col shadow-2xl transform scale-105 relative z-10">
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                        Recomendado
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Profissional</h3>
                    <p className="text-gray-500 mb-6">Nós entregamos seu cardápio pronto.</p>
                    
                    <div className="mb-6">
                        <span className="text-5xl font-extrabold text-gray-900">R$ 200</span>
                        <span className="text-gray-500 font-medium">,00</span>
                        <span className="block text-sm text-green-600 font-bold mt-1">Taxa Única de Setup (Implantação)</span>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-8">
                        <p className="text-sm text-orange-800 font-bold flex justify-between items-center">
                            Mensalidade <span className="text-lg">R$ 29,90</span>
                        </p>
                        <p className="text-xs text-orange-600 mt-1">Para manutenção do sistema online.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-500 mt-1 shrink-0"/>
                            <span className="text-sm"><strong>Cadastro Completo:</strong> Nós cadastramos seus pratos e fotos.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-500 mt-1 shrink-0"/>
                            <span className="text-sm"><strong>Design Premium:</strong> Capa personalizada e cores da sua marca.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-500 mt-1 shrink-0"/>
                            <span className="text-sm"><strong>Material de Apoio:</strong> Arquivo do QR Code pronto para gráfica.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-500 mt-1 shrink-0"/>
                            <span className="text-sm"><strong>Suporte VIP:</strong> Atendimento direto no WhatsApp.</span>
                        </li>
                    </ul>
                    
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-4 rounded-xl transition shadow-lg items-center justify-center gap-2 animate-bounce hover:animate-none">
                        <FaWhatsapp size={20}/> Contratar Agora
                    </a>
                    <p className="text-xs text-center text-gray-400 mt-4">Entrega em até 24h após envio dos dados.</p>
                </div>

            </div>
        </div>
      </section>

      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-4 font-bold text-gray-800 text-xl">
            <FaUtensils className="text-orange-600"/> CardápioPro
          </div>
          <p className="text-sm mb-4">A tecnologia que faltava para o seu restaurante.</p>
          <p className="text-xs">&copy; {new Date().getFullYear()} CardápioPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}