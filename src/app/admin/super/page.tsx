// src/app/admin/super/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, updateUserPlan, adminDeleteUserSystem, adminUpdateUser, UserData } from '@/lib/pageService';
import { 
  Shield, Search, LogOut, ArrowLeft, CheckCircle, XCircle, 
  User, Mail, Calendar, Crown, Loader2, Trash2, Edit2, Briefcase, Save, X
} from 'lucide-react';
import { signOutUser } from '@/lib/authService';

export default function SuperAdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<(UserData & { uid: string })[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(UserData & { uid: string })[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Estados de Edição
  const [editingUser, setEditingUser] = useState<(UserData & { uid: string }) | null>(null);
  const [editName, setEditName] = useState('');

  // 1. Proteção da Rota
  useEffect(() => {
    if (!loading) {
      if (!user || userData?.role !== 'admin') {
        router.push('/admin/dashboard');
      } else {
        loadUsers();
      }
    }
  }, [user, userData, loading, router]);

  const loadUsers = async () => {
    setIsLoadingList(true);
    const users = await getAllUsers();
    users.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    setAllUsers(users);
    setFilteredUsers(users);
    setIsLoadingList(false);
  };

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = allUsers.filter(u => 
        (u.displayName?.toLowerCase() || '').includes(lowerTerm) ||
        (u.email?.toLowerCase() || '').includes(lowerTerm) ||
        (u.pageSlug?.toLowerCase() || '').includes(lowerTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);

  // AÇÃO: Mudar Plano
  const handleTogglePlan = async (targetUid: string, currentPlan: string) => {
      if (processingId) return;
      setProcessingId(targetUid);
      const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
      try {
          await updateUserPlan(targetUid, newPlan);
          setAllUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, plan: newPlan } : u));
      } catch (error) { alert("Erro ao atualizar plano."); } 
      finally { setProcessingId(null); }
  };

  // AÇÃO: Regência (Gerenciar Cardápio)
  const handleManageUser = (targetUid: string) => {
      // Redireciona para o Dashboard passando o ID do alvo na URL
      router.push(`/admin/dashboard?manageUser=${targetUid}`);
  };

  // AÇÃO: Abrir Modal Editar
  const openEditModal = (u: UserData & { uid: string }) => {
      setEditingUser(u);
      setEditName(u.displayName || '');
  };

  // AÇÃO: Salvar Edição
  const handleSaveEdit = async () => {
      if (!editingUser) return;
      try {
          await adminUpdateUser(editingUser.uid, editName);
          setAllUsers(prev => prev.map(u => u.uid === editingUser.uid ? { ...u, displayName: editName } : u));
          setEditingUser(null);
      } catch (error) { alert("Erro ao salvar."); }
  };

  // AÇÃO: Deletar Usuário
  const handleDelete = async (targetUid: string, pageSlug?: string) => {
      if (!confirm("TEM CERTEZA? Isso apagará o usuário e o cardápio do banco de dados permanentemente.")) return;
      setProcessingId(targetUid);
      try {
          await adminDeleteUserSystem(targetUid, pageSlug);
          setAllUsers(prev => prev.filter(u => u.uid !== targetUid));
      } catch (error) { alert("Erro ao deletar."); }
      finally { setProcessingId(null); }
  };

  if (loading || isLoadingList) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><Loader2 className="animate-spin" size={48}/></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans pb-20">
      
      {/* Modal de Edição */}
      {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Edit2 size={20}/> Editar Usuário</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Nome</label>
                          <input 
                            value={editName} onChange={e => setEditName(e.target.value)} 
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-yellow-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Email (Apenas Leitura)</label>
                          <input disabled value={editingUser.email} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2 text-gray-500 cursor-not-allowed"/>
                      </div>
                      <div className="flex gap-2 pt-2">
                          <button onClick={() => setEditingUser(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-bold transition">Cancelar</button>
                          <button onClick={handleSaveEdit} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-bold transition">Salvar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20 shadow-md">
         <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Shield className="text-yellow-500" size={24} />
                <h1 className="font-bold text-xl tracking-tight">Painel Deus <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded ml-2 uppercase">Super Admin</span></h1>
            </div>
            <div className="flex gap-4">
                 <button onClick={() => router.push('/admin/dashboard')} className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 transition"><ArrowLeft size={16}/> Voltar</button>
                 <button onClick={() => signOutUser()} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-2 transition"><LogOut size={16}/> Sair</button>
            </div>
         </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
              <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Controle Total</h2>
                  <p className="text-gray-400 text-sm">Gerencie {allUsers.length} clientes.</p>
              </div>
              <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                  <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-500 outline-none transition" />
              </div>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-bold tracking-wider">
                          <tr>
                              <th className="p-4">Cliente</th>
                              <th className="p-4">Link</th>
                              <th className="p-4">Plano</th>
                              <th className="p-4 text-right">Ações</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                          {filteredUsers.map((u) => (
                              <tr key={u.uid} className="hover:bg-gray-700/30 transition">
                                  <td className="p-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300">{u.displayName ? u.displayName.charAt(0) : <User/>}</div>
                                          <div>
                                              <p className="font-bold text-white text-sm">{u.displayName || 'Sem Nome'}</p>
                                              <p className="text-xs text-gray-400">{u.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-4 text-sm text-blue-400">{u.pageSlug}</td>
                                  <td className="p-4">
                                      <button onClick={() => handleTogglePlan(u.uid, u.plan || 'free')} className={`px-3 py-1 rounded-full text-xs font-bold border transition ${u.plan === 'pro' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20' : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'}`}>
                                          {u.plan === 'pro' ? 'PRO (Ativo)' : 'FREE'}
                                      </button>
                                  </td>
                                  <td className="p-4 text-right flex items-center justify-end gap-2">
                                      <button onClick={() => handleManageUser(u.uid)} className="bg-blue-600/20 text-blue-400 p-2 rounded hover:bg-blue-600/40 transition" title="Gerenciar Cardápio"><Briefcase size={16}/></button>
                                      <button onClick={() => openEditModal(u)} className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition" title="Editar"><Edit2 size={16}/></button>
                                      <button onClick={() => handleDelete(u.uid, u.pageSlug)} className="bg-red-500/20 text-red-400 p-2 rounded hover:bg-red-500/40 transition" title="Excluir"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </main>
    </div>
  );
}