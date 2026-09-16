import React, { useState, useEffect } from 'react';
import { Tv, Bell, Clock, Volume2, Sparkles, MapPin } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { ORDER_STATUS } from '../../types';
import { playCallPasswordSound } from '../../utils/audio';

export default function PasswordCallScreen() {
  const { orders, lastCalledOrder } = useOrders();
  const { settings } = useMenu();
  const [time, setTime] = useState('');
  const [highlightOrder, setHighlightOrder] = useState(null);

  // Relógio digital em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quando um pedido é chamado, exibe o popup gigante em destaque com som
  useEffect(() => {
    if (lastCalledOrder) {
      setHighlightOrder(lastCalledOrder);
      const timer = setTimeout(() => {
        setHighlightOrder(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [lastCalledOrder]);

  const preparingOrders = orders
    .filter((o) => o.order_status === ORDER_STATUS.PREPARING)
    .slice(0, 8);

  const readyOrders = orders
    .filter((o) => o.order_status === ORDER_STATUS.READY)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col p-4 sm:p-8 select-none">
      {/* Header do Telão */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
            🥟
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400">
              {settings.storeName}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">Painel de Chamada de Senhas</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={playCallPasswordSound}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            title="Testar som de chamada"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <div className="text-right">
            <span className="text-2xl sm:text-4xl font-mono font-black tracking-wider text-stone-200">
              {time}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Principal de Senhas */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        
        {/* Painel Esquerdo: Em Preparo */}
        <div className="bg-stone-900/80 rounded-3xl p-6 border border-stone-800 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-500 animate-spin" />
              <h2 className="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wider">
                Em Preparo
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-400">
              {preparingOrders.length} na fila
            </span>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-max">
            {preparingOrders.length === 0 ? (
              <div className="col-span-full h-48 flex items-center justify-center text-stone-500 text-sm italic">
                Nenhum pedido em preparo no momento
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/60 text-center shadow-inner"
                >
                  <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight block">
                    {order.ticket_number}
                  </span>
                  <span className="text-xs text-stone-400 font-semibold truncate block mt-1">
                    {order.customer_name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Painel Direito: Pronto para Retirada */}
        <div className="bg-emerald-950/30 rounded-3xl p-6 border-2 border-emerald-500/40 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/50 mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-emerald-400 animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-black text-emerald-400 uppercase tracking-wider">
                Pronto para Retirada
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-300">
              Dirija-se ao balcão
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
            {readyOrders.length === 0 ? (
              <div className="col-span-full h-48 flex items-center justify-center text-emerald-700/60 text-sm italic">
                Aguardando chamadas da cozinha
              </div>
            ) : (
              readyOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className={`bg-emerald-900/60 rounded-3xl p-5 border-2 border-emerald-400/80 text-center shadow-lg transition-all ${
                    idx === 0 ? 'ring-4 ring-emerald-400/30 pulse-ready scale-[1.02]' : ''
                  }`}
                >
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-wider block">
                    {order.ticket_number}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-emerald-200 mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{order.table_number || 'Balcão'}</span>
                    <span>•</span>
                    <span>{order.customer_name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Pop-up Gigante de Chamada Recente */}
      {highlightOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-90 duration-300">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-8 sm:p-14 max-w-2xl w-full text-center border-4 border-emerald-300 shadow-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Pedido Pronto!</span>
            </div>

            <h2 className="text-7xl sm:text-9xl font-black tracking-tight my-4 drop-shadow-md">
              {highlightOrder.ticket_number}
            </h2>

            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-100">
              {highlightOrder.customer_name}
            </p>

            <div className="mt-4 text-base sm:text-lg text-emerald-200 font-semibold">
              Por favor, retirar no balcão ({highlightOrder.table_number || 'Balcão'})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
