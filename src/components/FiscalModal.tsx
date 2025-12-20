// src/components/FiscalModal.tsx
'use client';
import { useState } from 'react';

export default function FiscalModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (cpf: string, phone: string) => void }) {
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl relative">
        <h3 className="text-lg font-bold mb-2 text-gray-800">Quase lá! 🚀</h3>
        <p className="text-sm text-gray-500 mb-4">Para gerar sua assinatura, precisamos do seu CPF e WhatsApp.</p>
        
        <label className="block text-xs font-bold text-gray-700 mb-1">CPF ou CNPJ</label>
        <input 
            type="text" 
            value={cpf} 
            onChange={e => setCpf(e.target.value)} 
            className="w-full border p-2 rounded mb-3 outline-none focus:border-green-500 text-gray-900 bg-gray-50"
            placeholder="000.000.000-00"
        />

        <label className="block text-xs font-bold text-gray-700 mb-1">Celular (com DDD)</label>
        <input 
            type="text" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="w-full border p-2 rounded mb-4 outline-none focus:border-green-500 text-gray-900 bg-gray-50"
            placeholder="(00) 90000-0000"
        />

        <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold text-sm hover:bg-gray-300 transition">Cancelar</button>
            <button 
                onClick={() => { if(cpf.length > 10 && phone.length > 10) onSave(cpf, phone); else alert("Preencha CPF e Telefone corretamente!"); }} 
                className="flex-1 bg-green-600 text-white py-2 rounded font-bold text-sm hover:bg-green-700 transition shadow-lg shadow-green-500/30"
            >
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );
}