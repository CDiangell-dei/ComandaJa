import React, { useState } from 'react';
import { X, SlidersHorizontal, Store, DollarSign, Check, AlertCircle, Database, Lock } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { formatCurrency } from '../../utils/formatters';

export default function MenuManagerModal({ isOpen, onClose }) {
  const { items, settings, toggleAvailability, updatePrice, updateSettings } = useMenu();
  const [activeTab, setActiveTab] = useState('ITEMS'); // 'ITEMS' | 'SETTINGS'

  // Settings form local state
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeSubtitle, setStoreSubtitle] = useState(settings.storeSubtitle);
  const [pixKey, setPixKey] = useState(settings.pixKey);
  const [pixReceiverName, setPixReceiverName] = useState(settings.pixReceiverName);
  const [pixCity, setPixCity] = useState(settings.pixCity);
  const [avgWaitTimeMinutes, setAvgWaitTimeMinutes] = useState(settings.avgWaitTimeMinutes);
  const [kitchenPin, setKitchenPin] = useState(settings.kitchenPin || '1234');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSettings({
      storeName,
      storeSubtitle,
      pixKey,
      pixReceiverName,
      pixCity,
      avgWaitTimeMinutes: parseInt(avgWaitTimeMinutes, 10) || 15,
      kitchenPin: kitchenPin.trim() || '1234',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-stone-900 leading-tight">
                  Gerenciador do Cardápio & Loja
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <Database className="w-3 h-3" />
                  Supabase Conectado
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Altere preços, pause sabores esgotados ou configure a chave Pix
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-stone-200 px-5 pt-2 bg-stone-50/50 gap-4">
          <button
            onClick={() => setActiveTab('ITEMS')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'ITEMS'
                ? 'border-amber-500 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Itens do Cardápio ({items.length})
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'SETTINGS'
                ? 'border-amber-500 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Dados da Loja & Chave Pix
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'ITEMS' ? (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 mb-2">
                Dica: você pode pausar produtos que acabaram na cozinha para que os clientes não consigam pedir no cardápio.
              </p>

              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    item.available !== false
                      ? 'bg-white border-stone-200'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs text-stone-400 capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Campo de Preço Rápido */}
                    <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs font-bold text-stone-800">
                      <span>R$</span>
                      <input
                        type="number"
                        step="0.50"
                        defaultValue={item.price}
                        onBlur={(e) => updatePrice(item.id, e.target.value)}
                        className="w-14 bg-transparent text-right font-bold focus:outline-none"
                      />
                    </div>

                    {/* Botão de Disponibilidade */}
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        item.available !== false
                          ? 'bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-800'
                          : 'bg-stone-200 hover:bg-emerald-100 text-stone-600 hover:text-emerald-800'
                      }`}
                    >
                      {item.available !== false ? 'Disponível' : 'Esgotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Nome do Estabelecimento
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Subtítulo / Slogan
                </label>
                <input
                  type="text"
                  value={storeSubtitle}
                  onChange={(e) => setStoreSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Chave Pix (Telefone / CPF / CNPJ)
                  </label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Nome do Titular do Pix
                  </label>
                  <input
                    type="text"
                    value={pixReceiverName}
                    onChange={(e) => setPixReceiverName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={pixCity}
                    onChange={(e) => setPixCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Tempo Médio Estimado (minutos)
                  </label>
                  <input
                    type="number"
                    value={avgWaitTimeMinutes}
                    onChange={(e) => setAvgWaitTimeMinutes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Senha da Cozinha & Admin */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Senha de Acesso da Cozinha & Gerenciamento (PIN)
                  </label>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={kitchenPin}
                  onChange={(e) => setKitchenPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-black tracking-widest text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Esta senha de 4 dígitos protege o painel da cozinha (KDS) e esta tela de configurações para que clientes não possam acessar.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-200" />
                      <span>Configurações Salvas no Supabase!</span>
                    </>
                  ) : (
                    <span>Salvar Alterações</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
