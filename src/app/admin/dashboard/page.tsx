// src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState, FormEvent, useCallback, Suspense } from 'react'; // Adicionei Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOutUser } from '@/lib/authService';
import {
  getPageDataForUser, addLinkToPage, deleteLinkFromPage, updateLinksOnPage,
  updatePageTheme, updatePageBackground, updateProfileImage, updatePageProfileInfo, updatePageCoupons, updateUserFiscalData,
  getAllUsers, getOrdersBySlug, updateOrderStatus, getOrdersByDateRange,
  PageData, LinkData, UserData, CouponData, findUserByEmail, updateUserPlan, OrderData, OrderStatus
} from '@/lib/pageService';
import { 
  Settings, Image as ImageIcon, Save, QrCode, Tag, Trash2,
  UtensilsCrossed, PlusCircle, Camera, Copy, ExternalLink, Lock, MapPin, 
  Store, DoorOpen, DoorClosed, MessageCircle, Key, Clock, Users, Search, Check, LogOut,
  ShoppingBag, RefreshCw, DollarSign, TrendingUp, Calendar, Filter, Shield
} from 'lucide-react';

import Image from 'next/image';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLinkItem } from '@/components/SortableLinkItem';
import { QRCodeCanvas } from 'qrcode.react';
import FiscalModal from '@/components/FiscalModal';
import { UpgradeModal } from '@/components/UpgradeModal';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""; 
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

const themes = [
  { name: 'restaurant', label: 'Bistrô', colorClass: 'bg-red-900', isPro: false },
  { name: 'light', label: 'Clean', colorClass: 'bg-gray-100', isPro: false },
  { name: 'dark', label: 'Pub', colorClass: 'bg-gray-900', isPro: false },
  { name: 'pizza', label: 'Pizzaria', colorClass: 'bg-orange-600', isPro: true },
  { name: 'sushi', label: 'Sushi', colorClass: 'bg-black border-b-4 border-red-600', isPro: true },
  { name: 'cafe', label: 'Café', colorClass: 'bg-amber-800', isPro: true },
  { name: 'burger', label: 'Burger', colorClass: 'bg-yellow-500', isPro: true },
  { name: 'ocean', label: 'Praia', colorClass: 'bg-blue-500', isPro: true },
];

function DashboardContent() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // REGÊNCIA: Se for admin e tiver ?manageUser=UID na URL, usa esse ID.
  const manageUserId = searchParams.get('manageUser');
  const isAdmin = userData?.role === 'admin';
  const effectiveUserId = (isAdmin && manageUserId) ? manageUserId : user?.uid;

  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'finance'>('menu');

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageSlug, setPageSlug] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  
  // PEDIDOS
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // FINANCEIRO
  const [financialOrders, setFinancialOrders] = useState<OrderData[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0].substring(0, 8) + '01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loadingFinance, setLoadingFinance] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false); 
  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Campos do Prato
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCat, setNewItemCat] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [isUploadingItemImg, setIsUploadingItemImg] = useState(false);

  // Campos de Cupom
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');

  // Campos de Edição
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItemTitle, setEditItemTitle] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemDesc, setEditItemDesc] = useState('');
  const [editItemCat, setEditItemCat] = useState('');
  const [editItemImage, setEditItemImage] = useState('');

  // Perfil e UI
  const [editingProfileTitle, setEditingProfileTitle] = useState('');
  const [editingProfileBio, setEditingProfileBio] = useState('');
  const [editingProfileAddress, setEditingProfileAddress] = useState('');
  const [editingProfileWhatsapp, setEditingProfileWhatsapp] = useState('');
  const [editingProfilePix, setEditingProfilePix] = useState('');
  const [isOpenStore, setIsOpenStore] = useState(true);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copiar Link');

  // Admin Flag
  const isProPlan = manageUserId ? true : (pageData?.plan === 'pro'); // Se o admin tá gerenciando, libera o Pro visualmente

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const existingCategories = Array.from(new Set(pageData?.links?.map(l => l.category).filter(Boolean) || []));

  const handleSubscribeClick = () => { setIsUpgradeModalOpen(true); };

  const saveFiscalDataAndSubscribe = async (cpf: string, phone: string) => {
    if (!user) return;
    setIsFiscalModalOpen(false);
    try {
        await updateUserFiscalData(user.uid, cpf, phone);
        alert("Dados salvos! Agora faça o Pix para liberar.");
        setIsUpgradeModalOpen(true);
    } catch (error) { alert("Erro ao salvar dados."); }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) { alert("Erro de configuração de imagem. Avise o suporte."); return ""; }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && pageData?.links) {
      setPageData((prev) => {
        if (!prev) return null;
        const oldIndex = prev.links.findIndex((l, i) => (l.url || l.title) + i === active.id);
        const newIndex = prev.links.findIndex((l, i) => (l.url || l.title) + i === over.id);
        const newLinks = arrayMove(prev.links, oldIndex, newIndex);
        const reordered = newLinks.map((l, i) => ({ ...l, order: i + 1 }));
        if (pageSlug) updateLinksOnPage(pageSlug, reordered);
        return { ...prev, links: reordered };
      });
    }
  };

  const fetchPageData = useCallback(async () => {
    if (effectiveUserId) {
      setIsLoadingData(true);
      const result = await getPageDataForUser(effectiveUserId);
      if (result) {
        const data = result.data as PageData;
        if (data.links) data.links.sort((a, b) => (a.order || 0) - (b.order || 0));
        setPageData(data);
        setPageSlug(result.slug);
        setEditingProfileTitle(data.title || '');
        setEditingProfileBio(data.bio || '');
        setEditingProfileAddress(data.address || '');
        
        let loadedWhats = (data as any).whatsapp || '';
        if (loadedWhats.startsWith('55') && loadedWhats.length > 10) { loadedWhats = loadedWhats.substring(2); }
        setEditingProfileWhatsapp(loadedWhats);
        setEditingProfilePix((data as any).pixKey || '');
        setIsOpenStore(data.isOpen !== false);

        if (data.plan === 'pro' && data.trialDeadline) {
            const now = new Date();
            const deadline = data.trialDeadline.toDate();
            const diffTime = Math.abs(deadline.getTime() - now.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (now > deadline) setDaysLeft(0); else setDaysLeft(diffDays);
        } else { setDaysLeft(null); }
      }
      setIsLoadingData(false);
    }
  }, [effectiveUserId]);

  const fetchOrders = useCallback(async () => {
    if (!pageSlug) return;
    setLoadingOrders(true);
    const result = await getOrdersBySlug(pageSlug);
    setOrders(result);
    setLoadingOrders(false);
  }, [pageSlug]);

  const fetchFinancials = useCallback(async () => {
      if (!pageSlug || !startDate || !endDate) return;
      setLoadingFinance(true);
      const result = await getOrdersByDateRange(pageSlug, new Date(startDate), new Date(endDate));
      setFinancialOrders(result);
      setLoadingFinance(false);
  }, [pageSlug, startDate, endDate]);

  useEffect(() => { if (!loading && user) fetchPageData(); }, [user, loading, fetchPageData]);
  useEffect(() => { if (!loading && !user) router.push('/admin/login'); }, [user, loading, router]);
  
  useEffect(() => {
      if (activeTab === 'orders' && pageSlug) {
          fetchOrders();
          const interval = setInterval(fetchOrders, 30000);
          return () => clearInterval(interval);
      }
      if (activeTab === 'finance' && pageSlug) {
          fetchFinancials();
      }
  }, [activeTab, pageSlug, fetchOrders, fetchFinancials]);

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!pageSlug || !newItemTitle) return;
    const current = pageData?.links || [];
    if (!isProPlan && current.length >= 8) { alert("Limite do Plano Grátis Atingido."); return; }
    const newItem: LinkData = { title: newItemTitle, url: '', type: 'dish', order: current.length + 1, clicks: 0, price: newItemPrice, description: newItemDesc, imageUrl: newItemImage, category: newItemCat };
    await addLinkToPage(pageSlug, newItem);
    setNewItemTitle(''); setNewItemPrice(''); setNewItemDesc(''); setNewItemImage(''); setNewItemCat('');
    fetchPageData();
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
      if(!orderId) return;
      let nextStatus: OrderStatus = 'preparing';
      if(currentStatus === 'pending') nextStatus = 'preparing';
      else if(currentStatus === 'preparing') nextStatus = 'delivery';
      else if(currentStatus === 'delivery') nextStatus = 'completed';
      await updateOrderStatus(orderId, nextStatus);
      fetchOrders(); 
  };

  // Funções de Update (Minificadas visualmente, mas completas na lógica)
  const handleAddCoupon = async () => { if (!pageSlug || !newCouponCode) return; if (!isProPlan) { alert("Recurso Pro!"); return; } const newCoupon: CouponData = { code: newCouponCode.toUpperCase().trim(), type: newCouponType, value: parseFloat(newCouponValue.replace(',', '.')), active: true }; await updatePageCoupons(pageSlug, [...(pageData?.coupons || []), newCoupon]); setPageData(prev => prev ? { ...prev, coupons: [...(prev.coupons || []), newCoupon] } : null); setNewCouponCode(''); setNewCouponValue(''); };
  const handleDeleteCoupon = async (code: string) => { if (!pageSlug) return; const updated = (pageData?.coupons || []).filter(c => c.code !== code); await updatePageCoupons(pageSlug, updated); setPageData(prev => prev ? { ...prev, coupons: updated } : null); };
  const handleUpdateItem = async (index: number) => { if (!pageSlug || !pageData) return; const updated = [...pageData.links]; updated[index] = { ...updated[index], title: editItemTitle, price: editItemPrice, description: editItemDesc, imageUrl: editItemImage, category: editItemCat }; await updateLinksOnPage(pageSlug, updated); setEditingIndex(null); fetchPageData(); };
  const handleItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => { const file = e.target.files?.[0]; if (!file) return; setIsUploadingItemImg(true); const url = await uploadToCloudinary(file); if (isNew) setNewItemImage(url); else setEditItemImage(url); setIsUploadingItemImg(false); };
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file || !pageSlug) return; setIsUploadingProfile(true); const url = await uploadToCloudinary(file); await updateProfileImage(pageSlug, url); setPageData(prev => prev ? {...prev, profileImageUrl: url} : null); setIsUploadingProfile(false); };
  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file || !pageSlug) return; if(!isProPlan) { alert("Recurso Pro!"); return; } setIsUploadingBg(true); const url = await uploadToCloudinary(file); await updatePageBackground(pageSlug, url); setPageData(prev => prev ? {...prev, backgroundImage: url} : null); setIsUploadingBg(false); };
  const handleSaveProfile = async () => { if(!pageSlug) return; const whatsappToSave = editingProfileWhatsapp ? `55${editingProfileWhatsapp.replace(/\D/g, '')}` : ''; await updatePageProfileInfo(pageSlug, editingProfileTitle, editingProfileBio, isProPlan ? editingProfileAddress : '', isOpenStore, whatsappToSave, isProPlan ? editingProfilePix : ''); setPageData(prev => prev ? { ...prev, title: editingProfileTitle, bio: editingProfileBio, address: isProPlan ? editingProfileAddress : '', isOpen: isOpenStore, whatsapp: whatsappToSave, pixKey: isProPlan ? editingProfilePix : '' } : null); alert("Dados atualizados!"); };
  const handleThemeChange = async (themeName: string, customColor?: string) => { if (!pageSlug) return; try { await updatePageTheme(pageSlug, themeName, customColor); setPageData(prev => prev ? { ...prev, theme: themeName, customThemeColor: customColor } : null); } catch { alert("Erro ao mudar tema."); } };
  const handleRemoveBg = async () => { if(pageSlug && confirm("Remover capa?")) { await updatePageBackground(pageSlug, ""); setPageData(prev => prev ? {...prev, backgroundImage: ""} : null); }};
  const handleCopyUrl = () => { if (!pageSlug) return; const url = `${window.location.origin}/${pageSlug}`; navigator.clipboard.writeText(url); setCopyButtonText("Copiado!"); setTimeout(() => setCopyButtonText("Copiar Link"), 2000); };
  const signOut = signOutUser;

  if (loading || (!isAdmin && isLoadingData && !pageData)) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  const paidOrders = financialOrders.filter(o => o.status !== 'canceled' && o.status !== 'pending');
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.total, 0);
  const totalCount = paidOrders.length;
  const averageTicket = totalCount > 0 ? totalRevenue / totalCount : 0;

  return (
    <div className="min-h-screen bg-theme-bg pb-20 font-sans relative text-theme-text transition-colors duration-300">
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      <FiscalModal isOpen={isFiscalModalOpen} onClose={() => setIsFiscalModalOpen(false)} onSave={saveFiscalDataAndSubscribe} />

      {/* BARRA DE AVISO DE REGÊNCIA (SE TIVER GERENCIANDO OUTRO USUÁRIO) */}
      {isAdmin && manageUserId && (
          <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2 sticky top-0 z-50">
              <Shield size={16}/> MODO REGÊNCIA: Você está editando o cardápio do cliente. 
              <button onClick={() => router.push('/admin/super')} className="underline ml-2">Sair</button>
          </div>
      )}

      <nav className="bg-white shadow-sm sticky top-0 z-20">
         <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
            <h1 className="font-bold text-gray-800 flex gap-2 items-center"><UtensilsCrossed className="text-orange-500" size={24} /> Gestor</h1>
            <div className="flex gap-4 items-center">
                 
                 {isAdmin && !manageUserId && (
                     <button onClick={() => router.push('/admin/super')} className="bg-gray-800 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-gray-900 transition shadow-sm border border-gray-700">
                        <Shield size={14} /> SUPER
                     </button>
                 )}

                 <button onClick={() => setActiveTab('menu')} className={`text-sm font-bold ${activeTab === 'menu' ? 'text-orange-600' : 'text-gray-500'}`}>Cardápio</button>
                 <button onClick={() => setActiveTab('orders')} className={`text-sm font-bold flex items-center gap-1 ${activeTab === 'orders' ? 'text-orange-600' : 'text-gray-500'}`}><ShoppingBag size={16}/> Pedidos</button>
                 <button onClick={() => setActiveTab('finance')} className={`text-sm font-bold flex items-center gap-1 ${activeTab === 'finance' ? 'text-orange-600' : 'text-gray-500'}`}><DollarSign size={16}/> <span className="hidden sm:inline">Financeiro</span></button>
                 <button onClick={() => signOut()} className="text-red-500 text-sm font-medium flex items-center gap-1"><LogOut size={16}/></button>
            </div>
         </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        
        {/* --- ABA FINANCEIRO --- */}
        {activeTab === 'finance' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-end gap-4">
                    <div className="w-full sm:w-auto"><label className="text-xs font-bold text-gray-500 block mb-1">Data Inicial</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border p-2 rounded text-sm text-gray-700"/></div>
                    <div className="w-full sm:w-auto"><label className="text-xs font-bold text-gray-500 block mb-1">Data Final</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border p-2 rounded text-sm text-gray-700"/></div>
                    <button onClick={fetchFinancials} disabled={loadingFinance} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 h-10 w-full sm:w-auto justify-center">{loadingFinance ? <RefreshCw className="animate-spin" size={16}/> : <Filter size={16}/>} Filtrar</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 relative overflow-hidden"><div className="absolute right-0 top-0 p-4 opacity-10"><DollarSign size={64} className="text-green-500"/></div><p className="text-sm font-bold text-gray-500 uppercase">Faturamento</p><p className="text-3xl font-black text-green-600 mt-1">R$ {totalRevenue.toFixed(2)}</p></div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden"><div className="absolute right-0 top-0 p-4 opacity-10"><ShoppingBag size={64} className="text-blue-500"/></div><p className="text-sm font-bold text-gray-500 uppercase">Pedidos Aprovados</p><p className="text-3xl font-black text-blue-600 mt-1">{totalCount}</p></div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 relative overflow-hidden"><div className="absolute right-0 top-0 p-4 opacity-10"><TrendingUp size={64} className="text-orange-500"/></div><p className="text-sm font-bold text-gray-500 uppercase">Ticket Médio</p><p className="text-3xl font-black text-orange-600 mt-1">R$ {averageTicket.toFixed(2)}</p></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200"><h3 className="font-bold text-gray-700 flex items-center gap-2"><Calendar size={18}/> Relatório Detalhado</h3></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs"><tr><th className="p-4">Data</th><th className="p-4">Cliente</th><th className="p-4">Status</th><th className="p-4">Pagamento</th><th className="p-4 text-right">Valor</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {financialOrders.length === 0 ? (<tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhum dado para o período selecionado.</td></tr>) : (financialOrders.map((order) => (<tr key={order.id} className="hover:bg-gray-50 transition"><td className="p-4 text-gray-600">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td><td className="p-4 font-bold text-gray-800">{order.customerName}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'canceled' ? 'bg-red-100 text-red-700' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{order.status === 'pending' && 'Pendente'}{order.status === 'preparing' && 'Preparo'}{order.status === 'delivery' && 'Entrega'}{order.status === 'completed' && 'Concluído'}{order.status === 'canceled' && 'Cancelado'}</span></td><td className="p-4 text-gray-600 capitalize">{order.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro/Cartão'}</td><td className="p-4 text-right font-bold text-gray-900">R$ {order.total.toFixed(2)}</td></tr>)))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- ABA DE PEDIDOS --- */}
        {activeTab === 'orders' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">Pedidos em Aberto</h2><button onClick={fetchOrders} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-200"><RefreshCw size={16} className={loadingOrders ? "animate-spin" : ""} /> Atualizar</button></div>
                <div className="space-y-4">
                    {orders.length === 0 ? (<div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300"><ShoppingBag className="mx-auto text-gray-300 mb-2" size={48} /><p className="text-gray-500 font-medium">Nenhum pedido recente.</p></div>) : (orders.map((order) => (
                            <div key={order.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2"><div><p className="font-bold text-lg text-gray-900">{order.customerName}</p><p className="text-xs text-gray-500">ID: {order.id?.slice(0,6)} • {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Recente'}</p></div><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''} ${order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : ''} ${order.status === 'delivery' ? 'bg-purple-100 text-purple-700' : ''} ${order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}`}>{order.status === 'pending' && 'Aguardando Pagamento'}{order.status === 'preparing' && 'Em Preparo'}{order.status === 'delivery' && 'Saiu p/ Entrega'}{order.status === 'completed' && 'Entregue'}</span></div>
                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">{order.deliveryMethod === 'delivery' ? <div className="flex gap-1 items-center"><MapPin size={14}/> <strong>Entrega:</strong> {order.deliveryAddress}</div> : <div className="flex gap-1 items-center"><Store size={14}/> <strong>Retirada no Local</strong></div>}</div>
                                    <div className="bg-gray-50 p-3 rounded-lg space-y-1 mb-3">{order.items.map((item: any, idx: number) => (<div key={idx} className="flex justify-between text-sm"><span className="text-gray-700">{item.quantity}x {item.title}</span><span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span></div>))}<div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900"><span>Total</span><span>R$ {order.total.toFixed(2)}</span></div></div>{order.paymentMethod === 'pix' && <p className="text-xs text-green-600 font-bold mb-2">Pagamento via Pix</p>}
                                </div>
                                <div className="flex flex-col justify-center gap-2 border-l border-gray-100 pl-0 md:pl-6">{order.status !== 'completed' && (<button onClick={() => handleUpdateOrderStatus(order.id!, order.status)} className={`w-full px-4 py-3 rounded-lg font-bold text-sm text-white transition shadow-sm ${order.status === 'pending' ? 'bg-green-600 hover:bg-green-700' : ''} ${order.status === 'preparing' ? 'bg-purple-600 hover:bg-purple-700' : ''} ${order.status === 'delivery' ? 'bg-gray-800 hover:bg-gray-900' : ''}`}>{order.status === 'pending' && 'Aprovar Pagamento'}{order.status === 'preparing' && 'Saiu para Entrega'}{order.status === 'delivery' && 'Finalizar Pedido'}</button>)}<a href={`/${pageSlug}/pedido/${order.id}`} target="_blank" className="text-center text-blue-600 text-sm font-bold hover:underline flex items-center justify-center gap-1"><ExternalLink size={14}/> Ver como Cliente</a></div>
                            </div>
                        )))}
                </div>
            </div>
        )}

        {/* --- ABA DE CARDÁPIO --- */}
        {activeTab === 'menu' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                {(!isProPlan || (daysLeft !== null && daysLeft >= 0)) && (<div className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${isProPlan ? 'bg-yellow-50 border-yellow-200' : 'bg-orange-50 border-orange-200'}`}><div className="flex items-center gap-3"><div className={`p-2 rounded-full ${isProPlan ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-600'}`}>{isProPlan ? <Clock size={20} /> : <Lock size={20} />}</div><div><p className="font-bold text-sm text-gray-800">{isProPlan ? `Período de Teste: Restam ${daysLeft} dias` : 'Você está no Plano Grátis'}</p><p className="text-xs text-gray-600">{isProPlan ? 'Aproveite todas as funções liberadas.' : 'Desbloqueie Pix, Cupons, Cores e Produtos Ilimitados.'}</p></div></div><button onClick={handleSubscribeClick} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition transform active:scale-95">{isProPlan ? 'Assinar Definitivo' : 'Quero ser PRO'}</button></div>)}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start"><div className="flex flex-col items-center gap-3 shrink-0"><div className="relative w-24 h-24"><div className="w-full h-full rounded-full overflow-hidden border-4 border-orange-100 relative bg-gray-100">{pageData?.profileImageUrl ? <Image src={pageData.profileImageUrl} alt="Logo" fill className="object-cover" sizes="96px" /> : <Camera className="text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8"/>}</div><label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 shadow"><Camera size={12}/><input type="file" className="hidden" onChange={handleProfileUpload} disabled={isUploadingProfile}/></label></div><button onClick={() => setIsOpenStore(!isOpenStore)} className={`w-full py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-colors ${isOpenStore ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{isOpenStore ? <><DoorOpen size={14}/> Aberto</> : <><DoorClosed size={14}/> Fechado</>}</button></div><div className="flex-1 w-full space-y-3"><input type="text" value={editingProfileTitle} onChange={e => setEditingProfileTitle(e.target.value)} className="w-full text-lg font-bold border-b border-gray-300 focus:border-orange-500 outline-none" placeholder="Nome do Restaurante" /><textarea value={editingProfileBio} onChange={e => setEditingProfileBio(e.target.value)} className="w-full text-sm border rounded p-2 focus:border-orange-500 outline-none resize-none" rows={2} placeholder="Descrição / Horário de Funcionamento" /><div className="flex items-center border rounded-lg overflow-hidden bg-white border-gray-300 focus-within:border-green-500 transition-all"><div className="bg-gray-100 px-3 py-2 border-r border-gray-200 flex items-center gap-1 text-gray-500 font-bold text-sm shrink-0"><MessageCircle className="text-green-500" size={16} /> +55</div><input type="tel" value={editingProfileWhatsapp} onChange={e => setEditingProfileWhatsapp(e.target.value.replace(/\D/g, ''))} className="w-full text-sm bg-transparent outline-none px-3 py-2" placeholder="DDD + Número (WhatsApp)" maxLength={11} /></div><div className={`flex items-center gap-2 border rounded p-2 transition-colors ${isProPlan ? 'bg-gray-50 focus-within:border-blue-500 focus-within:bg-white' : 'bg-gray-100 opacity-60 cursor-not-allowed'}`}><Key className="text-blue-500" size={16} /><input type="text" value={editingProfilePix} onChange={e => setEditingProfilePix(e.target.value)} className={`w-full text-sm bg-transparent outline-none ${!isProPlan ? 'cursor-not-allowed' : ''}`} placeholder={isProPlan ? "Chave Pix (CPF, Email, Telefone)" : "Chave Pix (Recurso Pro)"} disabled={!isProPlan}/>{!isProPlan && <Lock className="text-gray-400" size={14} />}</div><button onClick={handleSaveProfile} className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-bold flex gap-2 hover:bg-orange-700 transition w-fit items-center"><Save size={16}/> Salvar Dados</button></div></div>
                {pageSlug && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><QrCode className="text-orange-500" size={20} /> Divulgação</h3><div className="flex flex-col md:flex-row gap-4"><div className="flex-1 bg-orange-50 border border-orange-200 p-4 rounded-xl flex flex-col justify-center"><label className="text-orange-800 text-xs font-bold uppercase mb-2">Link do Cardápio</label><div className="flex gap-2"><div className="flex-1 bg-white border border-orange-200 rounded px-3 py-2 text-sm text-gray-600 truncate flex items-center">{typeof window !== 'undefined' ? window.location.origin : ''}/{pageSlug}</div><button onClick={handleCopyUrl} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold text-sm transition flex items-center gap-2"><Copy size={16} /> {copyButtonText}</button></div></div><div className="flex gap-2"><button onClick={() => isProPlan ? setShowQRCode(!showQRCode) : alert("QR Code é um recurso do plano Profissional.")} className={`${isProPlan ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1 min-w-[100px] transition py-3 relative`}><QrCode size={20} /> <span className="text-xs">{showQRCode ? 'Fechar' : 'QR Code'}</span>{!isProPlan && <div className="absolute top-2 right-2"><Lock size={10} /></div>}</button><a href={`/${pageSlug}`} target="_blank" className="bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-700 px-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1 min-w-[100px] transition py-3"><ExternalLink size={18} /><span className="text-xs">Abrir</span></a></div></div>{showQRCode && isProPlan && (<div className="mt-6 flex justify-center bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 animate-in fade-in zoom-in"><div className="text-center"><div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-4 shadow-sm"><QRCodeCanvas value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${pageSlug}`} size={200} level="H" /></div><p className="text-sm font-bold text-gray-800">Aponte a câmera do celular</p></div></div>)}</div>)}
                <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${!isProPlan ? 'opacity-70 pointer-events-none grayscale' : ''}`}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Tag className="text-purple-500" size={20} /> Cupons de Desconto</h3>{!isProPlan && <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold"><Lock size={10}/> Recurso Pro</span>}</div><div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100"><div className="flex-1"><label className="text-xs font-bold text-purple-800 uppercase mb-1 block">Código (Ex: VIP10)</label><input type="text" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value.toUpperCase())} className="w-full p-2 rounded border border-purple-200 text-sm font-bold uppercase" placeholder="Código" /></div><div className="flex-1"><label className="text-xs font-bold text-purple-800 uppercase mb-1 block">Valor</label><input type="text" value={newCouponValue} onChange={e => setNewCouponValue(e.target.value)} className="w-full p-2 rounded border border-purple-200 text-sm" placeholder="Ex: 10 ou 5,00" /></div><div className="flex-1"><label className="text-xs font-bold text-purple-800 uppercase mb-1 block">Tipo</label><select value={newCouponType} onChange={e => setNewCouponType(e.target.value as 'percent' | 'fixed')} className="w-full p-2 rounded border border-purple-200 text-sm"><option value="percent">Porcentagem (%)</option><option value="fixed">Valor Fixo (R$)</option></select></div><div className="flex items-end"><button onClick={handleAddCoupon} className="bg-purple-600 text-white px-6 py-2 rounded font-bold text-sm hover:bg-purple-700 h-10 w-full md:w-auto">Criar</button></div></div><div className="space-y-2">{pageData?.coupons && pageData.coupons.length > 0 ? (pageData.coupons.map((coupon, idx) => (<div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-lg"><Tag size={16}/></div><div><p className="font-bold text-gray-800">{coupon.code}</p><p className="text-xs text-gray-500">{coupon.type === 'percent' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`}</p></div></div><button onClick={() => handleDeleteCoupon(coupon.code)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button></div>))) : (<p className="text-center text-gray-400 text-sm py-4">Nenhum cupom criado.</p>)}</div></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex gap-2 items-center"><PlusCircle className="text-green-500" size={20}/> Novo Item</h3><form onSubmit={handleAddItem} className="space-y-4"><div className="flex flex-col sm:flex-row gap-4 items-start"><div className="w-20 h-20 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 group shrink-0">{newItemImage ? <Image src={newItemImage} alt="Prato" fill className="object-cover rounded" sizes="80px" /> : <Camera className="text-gray-400"/>}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleItemImageUpload(e, true)} disabled={isUploadingItemImg} /></div><div className="flex-1 space-y-3 w-full"><div className="flex gap-3"><input className="flex-1 border p-2 rounded text-sm outline-none focus:border-orange-500" placeholder="Nome" value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} required /><input className="w-24 border p-2 rounded text-sm outline-none focus:border-orange-500" placeholder="R$" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value.replace(/[^0-9,.]/g, ''))} /></div><input className="w-full border p-2 rounded text-sm outline-none focus:border-orange-500" placeholder="Categoria (Ex: Bebidas)" value={newItemCat} onChange={e => setNewItemCat(e.target.value)} list="categories-list" /><datalist id="categories-list">{existingCategories.map((cat, i) => <option key={i} value={cat as string} />)}</datalist><input className="w-full border p-2 rounded text-sm outline-none focus:border-orange-500" placeholder="Descrição" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} /></div></div><button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition">Adicionar</button></form></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4">Itens do Cardápio</h3><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}><SortableContext items={pageData?.links?.map((l,i) => (l.url||l.title)+i) || []} strategy={verticalListSortingStrategy}><div className="space-y-3">{pageData?.links?.map((link, index) => {if (editingIndex === index) {return (<div key={(link.url||link.title)+index} className="bg-orange-50 p-4 rounded border border-orange-200 space-y-3"><div className="flex gap-3"><div className="w-16 h-16 bg-white rounded relative border border-gray-200 shrink-0">{editItemImage ? <Image src={editItemImage} alt="Img" fill className="object-cover rounded" sizes="64px"/> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleItemImageUpload(e, false)} /></div><div className="flex-1 space-y-2"><div className="flex gap-2"><input className="flex-1 border p-1 rounded text-sm" value={editItemTitle} onChange={e => setEditItemTitle(e.target.value)} placeholder="Nome" /><input className="w-20 border p-1 rounded text-sm" value={editItemPrice} onChange={e => setEditItemPrice(e.target.value.replace(/[^0-9,.]/g, ''))} placeholder="Preço" /></div><input className="w-full border p-1 rounded text-sm" value={editItemCat} onChange={e => setEditItemCat(e.target.value)} placeholder="Categoria" /></div></div><div className="flex justify-end gap-2"><button onClick={() => setEditingIndex(null)} className="px-3 py-1 text-xs bg-white border rounded">Cancelar</button><button onClick={() => handleUpdateItem(index)} className="px-3 py-1 text-xs bg-green-600 text-white rounded">Salvar</button></div></div>);}return (<SortableLinkItem key={(link.url||link.title)+index} link={link} index={index} onEdit={() => { setEditingIndex(index); setEditItemTitle(link.title); setEditItemPrice(link.price||''); setEditItemDesc(link.description||''); setEditItemCat(link.category||''); setEditItemImage(link.imageUrl||''); }} onDelete={async () => { if(confirm("Excluir?")) { await deleteLinkFromPage(pageSlug!, link); fetchPageData(); }}} editingIndex={editingIndex} />);})}</div></SortableContext></DndContext></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"><h3 className="font-bold text-gray-800 mb-4">Aparência & Temas</h3><div className="grid grid-cols-3 sm:grid-cols-5 gap-2"><div className={`p-2 border rounded text-center text-xs relative overflow-hidden transition-all ${pageData?.theme === 'custom' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'} ${!isProPlan ? 'opacity-60 cursor-not-allowed' : ''}`}><div className="w-full h-8 rounded mb-1 shadow-sm bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 relative flex items-center justify-center">{isProPlan && (<input type="color" className="opacity-0 absolute inset-0 cursor-pointer w-full h-full" value={pageData?.customThemeColor || '#000000'} onChange={(e) => handleThemeChange('custom', e.target.value)} />)}</div><span className="font-medium text-gray-700">Cor Própria</span>{!isProPlan && <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]"><Lock className="text-white drop-shadow-md" size={12} /></div>}{pageData?.theme === 'custom' && <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5"><Check size={8} /></div>}</div>{themes.map(t => {const locked = t.isPro && !isProPlan;return (<button key={t.name} onClick={() => { if (locked) { alert("Assine o Pro!"); return; } handleThemeChange(t.name); }} className={`p-2 border rounded text-center text-xs relative overflow-hidden transition-all active:scale-95 ${pageData?.theme === t.name ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'} ${locked ? 'opacity-60 bg-gray-100 cursor-not-allowed' : ''}`}><div className={`w-full h-8 rounded mb-1 shadow-sm ${t.colorClass}`}></div><span className="font-medium text-gray-700">{t.label}</span>{locked && <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]"><Lock className="text-white drop-shadow-md" size={12}/></div>}{pageData?.theme === t.name && <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5"><Check size={8} /></div>}</button>)})}</div></div>
            </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}