// src/app/[slug]/pedido/[id]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import { getOrderById, OrderData } from '@/lib/pageService';
import { CheckCircle, Clock, Truck, ShoppingBag, MapPin, Phone, ChefHat, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function OrderTrackingPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  // Desembrulha os params (Padrão Next.js 15)
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta o pedido em TEMPO REAL (Snapshot do Firebase)
    // Assim que o dono muda o status no painel, muda aqui na hora!
    const unsub = onSnapshot(doc(db, "orders", resolvedParams.id), (doc) => {
        if (doc.exists()) {
            setOrder({ id: doc.id, ...doc.data() } as OrderData);
        }
        setLoading(false);
    });

    return () => unsub();
  }, [resolvedParams.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div></div>;
  
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-bold text-gray-800">Pedido não encontrado 😕</h1>
        <p className="text-gray-500 mt-2">Verifique se o link está correto.</p>
        <Link href={`/${resolvedParams.slug}`} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Voltar ao Cardápio</Link>
    </div>
  );

  // Lógica da Barra de Progresso
  const steps = [
      { status: 'pending', label: 'Aguardando', icon: Clock, desc: 'Aguardando confirmação do restaurante' },
      { status: 'preparing', label: 'Preparando', icon: ChefHat, desc: 'A cozinha está preparando seu pedido' },
      { status: 'delivery', label: 'Saiu p/ Entrega', icon: Truck, desc: 'Seu pedido está a caminho!' },
      { status: 'completed', label: 'Entregue', icon: CheckCircle, desc: 'Pedido entregue. Bom apetite!' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* Header */}
      <header className="bg-white p-4 shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Link href={`/${resolvedParams.slug}`} className="text-gray-500 hover:text-gray-800 p-2 -ml-2">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-gray-800 flex items-center gap-2">
                Acompanhar Pedido
            </h1>
            <div className="w-8"></div> {/* Espaço para centralizar */}
          </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
          
          {/* Cartão de Status Principal */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 ${
                  order.status === 'completed' ? 'bg-green-500' : 
                  order.status === 'delivery' ? 'bg-blue-500' :
                  'bg-orange-500'
              }`}></div>
              
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-in zoom-in duration-500 ${
                  order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                  order.status === 'delivery' ? 'bg-blue-100 text-blue-600' :
                  'bg-orange-100 text-orange-600'
              }`}>
                  <currentStep.icon size={40} />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                  {currentStep.label}
              </h2>
              <p className="text-gray-500 font-medium text-sm">
                  {currentStep.desc}
              </p>
              
              {order.deliveryMethod === 'delivery' && order.status === 'delivery' && (
                  <div className="mt-6 bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
                      <Truck size={18}/> O motoboy está chegando!
                  </div>
              )}
          </div>

          {/* Linha do Tempo */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wider text-center">Histórico do Pedido</h3>
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {steps.map((step, idx) => {
                      const isActive = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      
                      return (
                          <div key={idx} className={`relative flex items-center gap-4 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 transition-all duration-500 ${isActive ? 'bg-green-500 border-green-200 text-white shadow-lg shadow-green-200' : 'bg-gray-100 border-white text-gray-300'}`}>
                                  <step.icon size={16} />
                              </div>
                              <div className="flex-1">
                                  <p className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                                  {isCurrent && <p className="text-xs text-green-600 font-bold animate-pulse">Em andamento...</p>}
                              </div>
                              {isActive && <div className="text-green-500"><CheckCircle size={16}/></div>}
                          </div>
                      )
                  })}
              </div>
          </div>

          {/* Detalhes do Pedido */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">Pedido #{order.id?.slice(0,6)}</p>
                      <p className="text-sm font-bold text-gray-800">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold">Data</p>
                      <p className="text-sm font-bold text-gray-800">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Hoje'}</p>
                  </div>
              </div>

              <div className="space-y-3 mb-6">
                  {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm items-start">
                          <div className="flex gap-3">
                              <span className="bg-gray-100 w-6 h-6 flex items-center justify-center rounded text-xs font-bold text-gray-600">{item.quantity}</span>
                              <span className="text-gray-700 font-medium">{item.title}</span>
                          </div>
                          <span className="font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                  ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                      <span>Entrega ({order.deliveryMethod === 'delivery' ? 'Moto' : 'Retirada'})</span>
                      <span>-</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>R$ {order.total.toFixed(2)}</span>
                  </div>
              </div>
              
              {order.deliveryAddress && (
                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <MapPin size={14} className="shrink-0 mt-0.5"/>
                      <p>{order.deliveryAddress}</p>
                  </div>
              )}
          </div>

          <Link href={`/${resolvedParams.slug}`} className="block w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-center shadow-lg hover:bg-black transition active:scale-95">
              Fazer Novo Pedido
          </Link>

      </main>
    </div>
  );
}