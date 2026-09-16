import React, { useState } from 'react';
import { Volume2, ChefHat, Flame, Bell, CheckCircle, RefreshCw, Printer } from 'lucide-react';
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
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL' | 'PASTEIS' | 'BEBIDAS'
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

  // Total do dia
  const totalRevenueToday = orders
    .filter((o) => o.order_status !== ORDER_STATUS.CANCELLED)
    .reduce((sum, o) => sum + (o.subtotal || 0), 0);

  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Topo do Painel KDS com Estatísticas e Controles */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-orange-100 text-orange-700">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Painel da Cozinha (KDS)
              </h1>
              <p className="text-xs text-stone-500">
                Fila de fritura e despacho sincronizada em tempo real via Supabase
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Rápido e Botão Teste de Som */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Faturamento Hoje</span>
            <span className="text-sm font-extrabold text-amber-700">
              {formatCurrency(totalRevenueToday)}
            </span>
          </div>

          <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Entregues</span>
            <span className="text-sm font-extrabold text-stone-800">
              {deliveredOrdersCount} comandas
            </span>
          </div>

          <button
            onClick={playNewOrderSound}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-2xl text-xs font-bold transition-colors"
            title="Testar alerta sonoro de novo pedido"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Testar Som</span>
          </button>
        </div>
      </div>

      {/* Colunas do Kanban KDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Coluna 1: Novos / Fila de Espera */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-amber-100/70 p-3.5 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <h2 className="font-extrabold text-sm text-amber-900">Novos Pedidos</h2>
            </div>
            <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Nenhum novo pedido na fila
              </div>
            ) : (
              pendingOrders.map((order) => (
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
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Fritadeira livre no momento
              </div>
            ) : (
              preparingOrders.map((order) => (
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
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <div className="bg-white/60 rounded-3xl p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Nenhum pedido aguardando retirada
              </div>
            ) : (
              readyOrders.map((order) => (
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
