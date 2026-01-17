// src/app/[slug]/meus-pedidos/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import { getOrdersByCustomerId, OrderData } from '@/lib/pageService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseClient';
import { ArrowLeft, Clock, ShoppingBag, ChevronRight, Package, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);

export default function MyOrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const history = await getOrdersByCustomerId(user.uid);
            setOrders(history);
            setLoading(false);
        } else {
            // Se não tiver logado, manda pra home
            router.push(`/${resolvedParams.slug}`);
        }
    });
    return () => unsub();
  }, [resolvedParams.slug, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* Header */}
      <header className="bg-white p-4 shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Link href={`/${resolvedParams.slug}`} className="text-gray-500 hover:text-gray-800 p-2 -ml-2">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-gray-800 flex items-center gap-2">
                <Package className="text-orange-500" size={20}/> Meus Pedidos
            </h1>
            <div className="w-8"></div>
          </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
          {orders.length === 0 ? (
              <div className="text-center py-20 opacity-60">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400"/>
                  <p className="text-gray-500 font-medium">Você ainda não fez pedidos.</p>
                  <Link href={`/${resolvedParams.slug}`} className="mt-4 inline-block text-orange-600 font-bold hover:underline">Fazer meu primeiro pedido</Link>
              </div>
          ) : (
              orders.map((order) => (
                  <Link key={order.id} href={`/${resolvedParams.slug}/pedido/${order.id}`} className="block bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-orange-300 transition active:scale-[0.98]">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <p className="font-bold text-gray-800 text-sm">Pedido #{order.id?.slice(0,5)}</p>
                              <p className="text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Hoje'} às {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                             ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                               order.status === 'canceled' ? 'bg-red-100 text-red-700' : 
                               'bg-blue-100 text-blue-700'}
                          `}>
                              {order.status === 'pending' && 'Aguardando'}
                              {order.status === 'preparing' && 'Preparando'}
                              {order.status === 'delivery' && 'Saiu p/ Entrega'}
                              {order.status === 'completed' && 'Concluído'}
                              {order.status === 'canceled' && 'Cancelado'}
                          </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3 line-clamp-1">
                          {order.items.map((i:any) => `${i.quantity}x ${i.title}`).join(', ')}
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                          <p className="font-black text-gray-800 text-sm">R$ {order.total.toFixed(2)}</p>
                          <div className="flex items-center text-orange-600 text-xs font-bold gap-1">
                              Acompanhar <ChevronRight size={14}/>
                          </div>
                      </div>
                  </Link>
              ))
          )}
      </main>
    </div>
  );
}