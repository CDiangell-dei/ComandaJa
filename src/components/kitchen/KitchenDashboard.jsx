import React, { useState } from 'react';
import { 
  Volume2, ChefHat, Flame, Bell, CheckCircle, RefreshCw, Printer, 
  Search, X, Layers, LayoutGrid, SlidersHorizontal, Sparkles, Filter, Clock
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { ORDER_STATUS } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { playNewOrderSound, playCallPasswordSound } from '../../utils/audio';
import OrderKanbanCard from './OrderKanbanCard';
import ThermalReceipt from './ThermalReceipt';

export default function KitchenDashboard() {
  const { orders, updateOrderStatus, callTicketAgain } = useOrders();
  const { settings } = useMenu();
  const [mobileTab, setMobileTab] = useState('PENDING'); // 'PENDING' | 'PREPARING' | 'READY' | 'ALL'
  const [mobileViewMode, setMobileViewMode] = useState('TABS'); // 'TABS' | 'SWIPE'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'PASTEIS' | 'BEBIDAS'
  const [printingOrder, setPrintingOrder] = useState(null);

  // Filtrar pedidos por status
  const pendingOrders = orders.filter(
    (o) => o.order_status === ORDER_STATUS.RECEIVED || o.order_status === ORDER_STATUS.PENDING_PAYMENT
  );

  const preparingOrders = orders.filter(
    (o) => o.order_status === ORDER_STATUS.PREPARING
  );

  const readyOrders = orders.filter(
    (o) => o.order_status === ORDER_STATUS.READY
  );

  const deliveredOrdersCount = orders.filter(
    (o) => o.order_status === ORDER_STATUS.DELIVERED
  ).length;

  // Total de pedidos ativos na cozinha
  const activeOrdersCount = pendingOrders.length + preparingOrders.length + readyOrders.length;

  // Faturamento do dia
  const totalRevenueToday = orders
    .filter((o) => o.order_status !== ORDER_STATUS.CANCELLED)
    .reduce((sum, o) => sum + (o.subtotal || 0), 0);

  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Função auxiliar para filtrar pedidos com base na pesquisa e no tipo
  const applyFilters = (orderList) => {
    return orderList.filter((order) => {
      // 1. Filtro de busca (senha ou nome do cliente)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTicket = (order.ticket_number || '').toLowerCase().includes(query);
        const matchesName = (order.customer_name || '').toLowerCase().includes(query);
        if (!matchesTicket && !matchesName) return false;
      }

      // 2. Filtro de tipo (Pastéis vs Bebidas)
      if (filterType === 'PASTEIS') {
        const hasPastel = order.items?.some((i) => 
          i.category === 'tradicional' || i.category === 'diversos' || (i.name && i.name.toLowerCase().includes('pastel'))
        );
        if (!hasPastel) return false;
      } else if (filterType === 'BEBIDAS') {
        const hasBebida = order.items?.some((i) => 
          i.category === 'bebidas' || (i.name && (i.name.toLowerCase().includes('coca') || i.name.toLowerCase().includes('suco') || i.name.toLowerCase().includes('fanta')))
        );
        if (!hasBebida) return false;
      }

      return true;
    });
  };

  const filteredPending = applyFilters(pendingOrders);
  const filteredPreparing = applyFilters(preparingOrders);
  const filteredReady = applyFilters(readyOrders);

  // Lista para a aba "Todos" no mobile
  const allActiveFiltered = [
    ...filteredPending,
    ...filteredPreparing,
    ...filteredReady,
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      
      {/* 1. TOPO COMPACTO & ESTATÍSTICAS (OTIMIZADO PARA MOBILE E DESKTOP) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Título & Status Conexão */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl sm:rounded-2xl bg-orange-100 text-orange-700">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
                    Painel da Cozinha (KDS)
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="hidden xs:inline">Realtime</span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block">
                  Fila de fritura e despacho sincronizada em tempo real via Supabase
                </p>
              </div>
            </div>

            {/* Botão Testar Som no Mobile */}
            <button
              onClick={playNewOrderSound}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-all"
              title="Testar som de novo pedido"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Som</span>
            </button>
          </div>

          {/* Indicadores / Estatísticas Rápidas */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
              <div className="bg-stone-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 text-center flex-1 sm:flex-initial">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-400 block leading-none">Faturamento</span>
                <span className="text-xs sm:text-sm font-black text-amber-700">
                  {formatCurrency(totalRevenueToday)}
                </span>
              </div>

              <div className="bg-stone-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 text-center flex-1 sm:flex-initial">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-400 block leading-none">Entregues</span>
                <span className="text-xs sm:text-sm font-black text-stone-800">
                  {deliveredOrdersCount}
                </span>
              </div>

              <div className="bg-stone-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 text-center flex-1 sm:flex-initial">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-400 block leading-none">Na Cozinha</span>
                <span className="text-xs sm:text-sm font-black text-orange-600">
                  {activeOrdersCount}
                </span>
              </div>
            </div>

            {/* Botão Testar Som no Desktop */}
            <button
              onClick={playNewOrderSound}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-200 text-amber-800 rounded-2xl text-xs font-bold transition-all"
              title="Testar alerta sonoro de novo pedido"
            >
              <Volume2 className="w-4 h-4" />
              <span>Testar Som</span>
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Rápida e Filtros de Categoria */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Campo de Busca de Senha / Cliente */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar senha (ex: 01) ou cliente..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro de Categoria (Pastéis vs Bebidas) & Alternador de Modo no Mobile */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5">
            <div className="inline-flex p-0.5 bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'ALL'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('PASTEIS')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterType === 'PASTEIS'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🥟 Pastéis</span>
              </button>
              <button
                onClick={() => setFilterType('BEBIDAS')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterType === 'BEBIDAS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🥤 Bebidas</span>
              </button>
            </div>

            {/* Alternador de visualização no Mobile (Abas vs Swipe) */}
            <div className="md:hidden inline-flex p-0.5 bg-stone-100 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setMobileViewMode('TABS')}
                className={`p-1.5 rounded-lg transition-all ${
                  mobileViewMode === 'TABS'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-stone-400'
                }`}
                title="Modo Abas"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileViewMode('SWIPE')}
                className={`p-1.5 rounded-lg transition-all ${
                  mobileViewMode === 'SWIPE'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-stone-400'
                }`}
                title="Modo Colunas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVEGAÇÃO POR ABAS NO CELULAR (MD:HIDDEN) */}
      <div className="md:hidden sticky top-16 z-30 bg-stone-50/95 backdrop-blur-md pt-1 pb-2">
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-200/70 rounded-2xl">
          
          {/* Aba 1: Novos Pedidos */}
          <button
            onClick={() => setMobileTab('PENDING')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all relative flex flex-col items-center justify-center gap-0.5 ${
              mobileTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-stone-600 hover:text-stone-900 bg-white/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>Novos</span>
              {pendingOrders.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  mobileTab === 'PENDING'
                    ? 'bg-white text-amber-600'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}>
                  {pendingOrders.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold opacity-80">Na Fila</span>
          </button>

          {/* Aba 2: Fritadeira */}
          <button
            onClick={() => setMobileTab('PREPARING')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all relative flex flex-col items-center justify-center gap-0.5 ${
              mobileTab === 'PREPARING'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-stone-600 hover:text-stone-900 bg-white/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>Fritura</span>
              {preparingOrders.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  mobileTab === 'PREPARING'
                    ? 'bg-white text-orange-600'
                    : 'bg-orange-500 text-white'
                }`}>
                  {preparingOrders.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold opacity-80">Fritando</span>
          </button>

          {/* Aba 3: Prontos no Balcão */}
          <button
            onClick={() => setMobileTab('READY')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all relative flex flex-col items-center justify-center gap-0.5 ${
              mobileTab === 'READY'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-stone-600 hover:text-stone-900 bg-white/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Bell className="w-3 h-3" />
              <span>Balcão</span>
              {readyOrders.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  mobileTab === 'READY'
                    ? 'bg-white text-emerald-600'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {readyOrders.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold opacity-80">Chamar</span>
          </button>

          {/* Aba 4: Todos Ativos */}
          <button
            onClick={() => setMobileTab('ALL')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all relative flex flex-col items-center justify-center gap-0.5 ${
              mobileTab === 'ALL'
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 bg-white/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>Todos</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                mobileTab === 'ALL'
                  ? 'bg-stone-700 text-white'
                  : 'bg-stone-300 text-stone-800'
              }`}>
                {activeOrdersCount}
              </span>
            </div>
            <span className="text-[9px] font-bold opacity-80">Geral</span>
          </button>

        </div>
      </div>

      {/* 3. CONTEÚDO NO CELULAR: VISÃO POR ABAS (PADRÃO MOBILE) */}
      <div className="md:hidden">
        {mobileViewMode === 'TABS' ? (
          <div className="space-y-3 pb-8">
            
            {/* Aba: Novos */}
            {mobileTab === 'PENDING' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-1 text-xs font-black text-amber-900">
                  <span>Novos Pedidos na Fila ({filteredPending.length})</span>
                  <span className="text-[10px] text-stone-500 font-semibold">Toque em "Iniciar Fritura"</span>
                </div>
                {filteredPending.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200 text-stone-400 space-y-2">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="font-bold text-stone-700 text-sm">Nenhum novo pedido na fila</p>
                    <p className="text-xs text-stone-400">Quando um cliente pagar, o pedido aparecerá aqui com alerta sonoro.</p>
                  </div>
                ) : (
                  filteredPending.map((order) => (
                    <OrderKanbanCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onCallAgain={callTicketAgain}
                      onPrint={handlePrint}
                    />
                  ))
                )}
              </div>
            )}

            {/* Aba: Fritura */}
            {mobileTab === 'PREPARING' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-1 text-xs font-black text-orange-900">
                  <span>Na Fritadeira / Em Preparo ({filteredPreparing.length})</span>
                  <span className="text-[10px] text-stone-500 font-semibold">Toque em "Pronto (Chamar)"</span>
                </div>
                {filteredPreparing.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200 text-stone-400 space-y-2">
                    <Flame className="w-8 h-8 text-orange-400 mx-auto" />
                    <p className="font-bold text-stone-700 text-sm">Fritadeira livre no momento</p>
                    <p className="text-xs text-stone-400">Nenhum pastel ou salgado sendo frito agora.</p>
                  </div>
                ) : (
                  filteredPreparing.map((order) => (
                    <OrderKanbanCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onCallAgain={callTicketAgain}
                      onPrint={handlePrint}
                    />
                  ))
                )}
              </div>
            )}

            {/* Aba: Prontos no Balcão */}
            {mobileTab === 'READY' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-1 text-xs font-black text-emerald-900">
                  <span>Prontos para Retirada ({filteredReady.length})</span>
                  <span className="text-[10px] text-stone-500 font-semibold">Toque em "Entregar"</span>
                </div>
                {filteredReady.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200 text-stone-400 space-y-2">
                    <Bell className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="font-bold text-stone-700 text-sm">Nenhum pedido no balcão</p>
                    <p className="text-xs text-stone-400">Todos os pedidos prontos já foram entregues.</p>
                  </div>
                ) : (
                  filteredReady.map((order) => (
                    <OrderKanbanCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onCallAgain={callTicketAgain}
                      onPrint={handlePrint}
                    />
                  ))
                )}
              </div>
            )}

            {/* Aba: Todos Ativos */}
            {mobileTab === 'ALL' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-1 text-xs font-black text-stone-800">
                  <span>Todas as Comandas Ativas ({allActiveFiltered.length})</span>
                </div>
                {allActiveFiltered.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200 text-stone-400">
                    Nenhuma comanda ativa no momento
                  </div>
                ) : (
                  allActiveFiltered.map((order) => (
                    <OrderKanbanCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onCallAgain={callTicketAgain}
                      onPrint={handlePrint}
                    />
                  ))
                )}
              </div>
            )}

          </div>
        ) : (
          /* MODO COLUNAS COM SWIPE LATERAL NO MOBILE */
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-6 -mx-3 px-3 no-scrollbar">
            
            {/* Coluna 1: Novos */}
            <div className="snap-center w-[85vw] max-w-[340px] flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between bg-amber-100/80 p-3 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <h2 className="font-black text-xs text-amber-900">Novos ({filteredPending.length})</h2>
                </div>
              </div>
              <div className="space-y-3">
                {filteredPending.map((order) => (
                  <OrderKanbanCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onCallAgain={callTicketAgain}
                    onPrint={handlePrint}
                  />
                ))}
              </div>
            </div>

            {/* Coluna 2: Fritando */}
            <div className="snap-center w-[85vw] max-w-[340px] flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between bg-orange-100/80 p-3 rounded-2xl border border-orange-200">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <h2 className="font-black text-xs text-orange-900">Fritando ({filteredPreparing.length})</h2>
                </div>
              </div>
              <div className="space-y-3">
                {filteredPreparing.map((order) => (
                  <OrderKanbanCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onCallAgain={callTicketAgain}
                    onPrint={handlePrint}
                  />
                ))}
              </div>
            </div>

            {/* Coluna 3: Balcão */}
            <div className="snap-center w-[85vw] max-w-[340px] flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between bg-emerald-100/80 p-3 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <h2 className="font-black text-xs text-emerald-900">Prontos ({filteredReady.length})</h2>
                </div>
              </div>
              <div className="space-y-3">
                {filteredReady.map((order) => (
                  <OrderKanbanCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onCallAgain={callTicketAgain}
                    onPrint={handlePrint}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. VISÃO COMPLETA KANBAN EM TELAS MÉDIAS E GRANDES (DESKTOP / TABLET: MD+) */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        
        {/* Coluna 1: Novos / Fila de Espera */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-amber-100/70 p-3.5 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <h2 className="font-extrabold text-sm text-amber-900">Novos Pedidos</h2>
            </div>
            <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
              {filteredPending.length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredPending.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Nenhum novo pedido na fila
              </div>
            ) : (
              filteredPending.map((order) => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCallAgain={callTicketAgain}
                  onPrint={handlePrint}
                />
              ))
            )}
          </div>
        </div>

        {/* Coluna 2: Em Fritura / Preparo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-orange-100/70 p-3.5 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <h2 className="font-extrabold text-sm text-orange-900">Na Fritadeira / Preparo</h2>
            </div>
            <span className="bg-orange-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
              {filteredPreparing.length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredPreparing.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Fritadeira livre no momento
              </div>
            ) : (
              filteredPreparing.map((order) => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCallAgain={callTicketAgain}
                  onPrint={handlePrint}
                />
              ))
            )}
          </div>
        </div>

        {/* Coluna 3: Prontos para Retirada */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-100/70 p-3.5 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h2 className="font-extrabold text-sm text-emerald-900">Prontos no Balcão</h2>
            </div>
            <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
              {filteredReady.length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredReady.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Nenhum pedido aguardando retirada
              </div>
            ) : (
              filteredReady.map((order) => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCallAgain={callTicketAgain}
                  onPrint={handlePrint}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Comprovante Térmico para Impressão */}
      <ThermalReceipt order={printingOrder} storeSettings={settings} />
    </div>
  );
}
