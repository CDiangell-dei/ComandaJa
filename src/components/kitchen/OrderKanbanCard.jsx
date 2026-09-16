import React from 'react';
import { Flame, Bell, CheckCircle, Printer, Volume2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { ORDER_STATUS } from '../../types';
import { formatCurrency, formatTimeOnly } from '../../utils/formatters';

export default function OrderKanbanCard({ order, onUpdateStatus, onCallAgain, onPrint }) {
  const isReceived = order.order_status === ORDER_STATUS.RECEIVED || order.order_status === ORDER_STATUS.PENDING_PAYMENT;
  const isPreparing = order.order_status === ORDER_STATUS.PREPARING;
  const isReady = order.order_status === ORDER_STATUS.READY;

  // Calcula tempo decorrido desde o pedido
  const createdTime = new Date(order.created_at).getTime();
  const now = Date.now();
  const minutesAgo = Math.floor((now - createdTime) / 60000);

  return (
    <div className={`bg-white rounded-3xl p-4 border shadow-sm transition-all flex flex-col justify-between ${
      isReady
        ? 'border-emerald-400 bg-emerald-50/30'
        : isPreparing
        ? 'border-orange-300 bg-orange-50/20'
        : 'border-stone-200 hover:border-amber-400'
    }`}>
      {/* Topo do Card: Senha, Mesa e Horário */}
      <div>
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-black px-2.5 py-0.5 rounded-xl text-white ${
              isReady
                ? 'bg-emerald-600'
                : isPreparing
                ? 'bg-orange-500'
                : 'bg-amber-600'
            }`}>
              {order.ticket_number || 'P-01'}
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{order.table_number || 'Balcão'}</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium block">
                {order.customer_name}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-stone-700 block">
              {formatTimeOnly(order.created_at)}
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              minutesAgo > 20
                ? 'bg-rose-100 text-rose-800'
                : minutesAgo > 10
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600'
            }`}>
              há {minutesAgo} min
            </span>
          </div>
        </div>

        {/* Status de Pagamento */}
        <div className="py-2 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Pagamento:</span>
          {order.payment_status === 'PAID' ? (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle className="w-3 h-3" />
              Pago ({order.payment_method})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              <AlertCircle className="w-3 h-3" />
              Cobrar no Balcão
            </span>
          )}
        </div>

        {/* Lista de Itens para Cozinha */}
        <div className="py-2.5 border-t border-stone-100 space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="bg-stone-50/80 p-2 rounded-xl border border-stone-200/60">
              <div className="flex items-center justify-between text-sm font-bold text-stone-900">
                <span className="text-amber-700 text-base mr-1">{item.quantity}x</span>
                <span className="flex-1">{item.name}</span>
              </div>

              {item.selectedSize && (
                <div className="text-xs font-semibold text-amber-800 pl-4 mt-0.5">
                  Tamanho: {item.selectedSize.name}
                </div>
              )}

              {item.selectedAddons && item.selectedAddons.length > 0 && (
                <div className="text-xs text-stone-600 pl-4 mt-0.5 font-medium">
                  + {item.selectedAddons.map((a) => a.name).join(', ')}
                </div>
              )}

              {item.notes && (
                <div className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md mt-1 italic">
                  OBS: {item.notes}
                </div>
              )}
            </div>
          ))}

          {order.notes && (
            <div className="text-xs font-semibold text-stone-600 bg-amber-50 p-2 rounded-xl border border-amber-200">
              Nota geral: {order.notes}
            </div>
          )}
        </div>
      </div>

      {/* Ações Rápidas da Cozinha */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
        <button
          onClick={() => onPrint(order)}
          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
          title="Imprimir Comanda Térmica"
        >
          <Printer className="w-4 h-4" />
        </button>

        {isReceived && (
          <button
            onClick={() => onUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>Iniciar Fritura</span>
          </button>
        )}

        {isPreparing && (
          <button
            onClick={() => onUpdateStatus(order.id, ORDER_STATUS.READY)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Pronto (Chamar)</span>
          </button>
        )}

        {isReady && (
          <div className="flex-1 flex gap-1.5">
            <button
              onClick={() => onCallAgain(order)}
              className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              title="Chamar Senha Novamente no Telão"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onUpdateStatus(order.id, ORDER_STATUS.DELIVERED)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-black text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Entregar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
