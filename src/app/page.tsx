// src/app/page.tsx
import Link from "next/link";
import { CheckCircle, Zap, DollarSign, MessageCircle, Star, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- NAVBAR --- */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-blue-900">CardápioCerto</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/login" 
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Entrar
            </Link>
            <Link 
              href="/admin/login" 
              className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-200"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        
        {/* --- HERO SECTION --- */}
        <section className="max-w-6xl mx-auto px-4 text-center mb-16 sm:mb-24">
          <div className="inline-block bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-4">
            🚀 O fim das taxas abusivas
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
            Pare de perder <span className="text-blue-600">27% do seu lucro</span> com aplicativos de entrega.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tenha seu próprio <strong>Cardápio Digital</strong>, receba pedidos ilimitados no WhatsApp e pagamentos via Pix na hora. Sem comissões, sem intermediários.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/admin/login" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-green-200 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <MessageCircle size={24} />
              Criar Cardápio Grátis
            </Link>
            <p className="text-xs text-gray-400 mt-2 sm:mt-0">
              *Teste grátis de 7 dias no plano PRO
            </p>
          </div>
        </section>

        {/* --- VIDEO SECTION --- */}
        <section className="max-w-4xl mx-auto px-4 mb-24">
            <div className="bg-gray-900 rounded-2xl p-2 sm:p-4 shadow-2xl shadow-gray-400/50 transform sm:rotate-1 hover:rotate-0 transition duration-500">
                <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden bg-black">
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/PYc9ZxPNQng?si=t3AgHZNKosFC1ouo" 
                        title="Veja como funciona o Cardápio Certo" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                👆 Veja em 1 minuto como é fácil automatizar seu atendimento.
            </p>
        </section>

        {/* --- VANTAGENS --- */}
        <section className="bg-gray-50 py-20 border-y border-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo o que seu Delivery precisa</h2>
                    <p className="text-gray-600">Simples para você configurar, perfeito para seu cliente pedir.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <DollarSign size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Zero Taxas</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Esqueça as comissões de 15% a 30%. Aqui o lucro é todo seu. Você paga apenas uma assinatura fixa e barata.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Pedido no WhatsApp</h3>
                        <p className="text-gray-600 leading-relaxed">
                            O cliente monta o pedido e envia pronto pro seu Zap. Já vem com endereço, itens, observações e total somado.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <Star size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Pagamento via Pix</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Receba na hora! O cliente copia sua chave Pix no checkout e te manda o comprovante junto com o pedido.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- PLANOS --- */}
        <section id="planos" className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Escolha como começar</h2>
            <p className="text-gray-600">Faça você mesmo ou deixe com a gente.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* 1. Plano Grátis */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 hover:border-blue-200 transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Iniciante</h3>
                <div className="text-4xl font-extrabold text-gray-900 mb-6">Grátis<span className="text-sm font-normal text-gray-500">/sempre</span></div>
                <p className="text-gray-500 mb-8 text-sm">Ideal para testar e validar.</p>
                
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-green-500"/> Até 8 Produtos</li>
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-green-500"/> Pedidos no WhatsApp</li>
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-green-500"/> Tema Padrão (Clean)</li>
                    <li className="flex items-center gap-3 text-gray-400 text-sm line-through"><CheckCircle size={18} className="text-gray-300"/> Pagamento via Pix</li>
                </ul>

                <Link href="/admin/login" className="block w-full py-3 border border-blue-600 text-blue-600 font-bold rounded-xl text-center hover:bg-blue-50 transition">
                    Começar Grátis
                </Link>
            </div>

            {/* 2. Plano PRO (Destaque) */}
            <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden text-white transform lg:-translate-y-4">
                <div className="absolute top-0 right-0 bg-linear-to-l from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Mais Popular
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Profissional</h3>
                <div className="text-4xl font-extrabold text-white mb-6">R$ 29,90<span className="text-sm font-normal text-gray-400">/mês</span></div>
                <p className="text-gray-400 mb-8 text-sm">Venda sem limites e com estilo.</p>
                
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-white text-sm"><CheckCircle size={18} className="text-green-400"/> <strong>Produtos Ilimitados</strong></li>
                    <li className="flex items-center gap-3 text-white text-sm"><CheckCircle size={18} className="text-green-400"/> <strong>Checkout Pix (Receba na hora)</strong></li>
                    <li className="flex items-center gap-3 text-white text-sm"><CheckCircle size={18} className="text-green-400"/> Todos os Temas Premium</li>
                    <li className="flex items-center gap-3 text-white text-sm"><CheckCircle size={18} className="text-green-400"/> Cupons de Desconto</li>
                    <li className="flex items-center gap-3 text-white text-sm"><CheckCircle size={18} className="text-green-400"/> QR Code de Mesa</li>
                </ul>

                <Link href="/admin/login" className="block w-full py-4 bg-green-600 text-white font-bold rounded-xl text-center hover:bg-green-500 transition shadow-lg shadow-green-900/50">
                    Testar 7 Dias Grátis
                </Link>
                <p className="text-center text-xs text-gray-500 mt-4">Cancele quando quiser.</p>
            </div>

            {/* 3. Plano Configuração VIP (Novo) */}
            <div className="bg-white p-8 rounded-3xl border border-purple-100 hover:border-purple-300 transition shadow-lg shadow-purple-100/50 relative">
                <div className="absolute top-4 right-4 text-purple-500">
                    <Rocket size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configuração VIP</h3>
                <div className="text-4xl font-extrabold text-gray-900 mb-6">R$ 199,99<span className="text-sm font-normal text-gray-500">/único</span></div>
                <p className="text-gray-500 mb-8 text-sm">Sem tempo? Nós fazemos tudo por você.</p>
                
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-purple-500"/> <strong>Cadastro de Todo o Cardápio</strong></li>
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-purple-500"/> Configuração de Cores e Logo</li>
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-purple-500"/> Criação de Cupons</li>
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-purple-500"/> Entrega Pronta para Vender</li>
                    <li className="flex items-center gap-3 text-gray-700 text-sm"><CheckCircle size={18} className="text-purple-500"/> Suporte VIP no WhatsApp</li>
                </ul>

                <a href="https://wa.me/5579996337995?text=Olá, quero contratar a Configuração VIP do Cardápio!" target="_blank" className="block w-full py-3 border border-purple-600 text-purple-600 font-bold rounded-xl text-center hover:bg-purple-50 transition">
                    Contratar Setup
                </a>
            </div>

          </div>
        </section>

        {/* --- FAQ / FINAL CTA --- */}
        <section className="text-center py-20 px-4 bg-blue-900 text-white rounded-t-[3rem] mt-10">
            <h2 className="text-3xl font-bold mb-6">Pronto para vender mais?</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">
                Junte-se a centenas de restaurantes que já modernizaram o atendimento.
            </p>
            <Link 
              href="/admin/login" 
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl"
            >
               Criar Conta Agora
            </Link>
        </section>

      </main>

      <footer className="bg-white border-t border-gray-100 py-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2024 CardápioCerto. Feito com ❤️ em Aracaju, SE.
        </p>
      </footer>
    </div>
  );
}