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
  const minutesAgo = Math.max(0, Math.floor((now - createdTime) / 60000));

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border shadow-sm transition-all flex flex-col justify-between ${
      isReady
        ? 'border-emerald-400 bg-emerald-50/30 ring-1 ring-emerald-400/30'
        : isPreparing
        ? 'border-orange-300 bg-orange-50/20 ring-1 ring-orange-400/30'
        : 'border-stone-200 hover:border-amber-400'
    }`}>
      {/* Topo do Card: Senha Gigante, Mesa/Balcão e Horário */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`text-xl sm:text-2xl font-black px-3 py-1 rounded-xl text-white font-mono tracking-tight shadow-2xs flex-shrink-0 ${
              isReady
                ? 'bg-emerald-600'
                : isPreparing
                ? 'bg-orange-500'
                : 'bg-amber-600'
            }`}>
              {order.ticket_number || 'P-01'}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs font-extrabold text-stone-800">
                <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="truncate">{order.table_number || 'Balcão / Retirada'}</span>
              </div>
              <span className="text-xs text-stone-500 font-semibold truncate block">
                {order.customer_name || 'Cliente'}
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-xs font-extrabold text-stone-700 block">
              {formatTimeOnly(order.created_at)}
            </span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-lg mt-0.5 ${
              minutesAgo > 15
                ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300 animate-pulse'
                : minutesAgo > 8
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{minutesAgo} min</span>
            </span>
          </div>
        </div>

        {/* Status de Pagamento */}
        <div className="py-2 flex items-center justify-between text-xs">
          <span className="text-stone-400 font-semibold text-[11px]">Pagamento:</span>
          {order.payment_status === 'PAID' ? (
            <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              Pago ({order.payment_method || 'PIX'})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              Cobrar no Balcão
            </span>
          )}
        </div>

        {/* Lista de Itens para Cozinha */}
        <div className="py-2.5 border-t border-stone-100 space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="bg-stone-50/90 p-2.5 rounded-xl border border-stone-200/70">
              <div className="flex items-start gap-2 text-sm sm:text-base font-black text-stone-900 leading-snug">
                <span className="inline-flex items-center justify-center bg-amber-500 text-white font-black text-xs px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                  {item.quantity}x
                </span>
                <span className="flex-1 text-stone-850">{item.name}</span>
              </div>

              {item.selectedSize && (
                <div className="text-xs font-bold text-amber-800 pl-7 mt-0.5">
                  Tamanho: {item.selectedSize.name}
                </div>
              )}

              {item.selectedAddons && item.selectedAddons.length > 0 && (
                <div className="text-xs text-stone-600 pl-7 mt-0.5 font-medium">
                  + {item.selectedAddons.map((a) => a.name).join(', ')}
                </div>
              )}

              {/* Observações do Cliente com Destaque Máximo */}
              {item.notes && (
                <div className="text-xs font-black text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-xl mt-1.5 flex items-start gap-1.5 shadow-2xs">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>OBS: {item.notes}</span>
                </div>
              )}
            </div>
          ))}

          {/* Observação Geral do Pedido */}
          {order.notes && (
            <div className="text-xs font-black text-stone-800 bg-amber-50 border border-amber-300 p-2.5 rounded-xl flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Nota geral: {order.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ações Rápidas da Cozinha - Botões Grandes e Fáceis de Tocar */}
      <div className="pt-3 border-t border-stone-100 flex items-center gap-2 mt-2">
        <button
          onClick={() => onPrint(order)}
          className="h-12 w-12 flex-shrink-0 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-100 active:scale-95 transition-all flex items-center justify-center bg-stone-50"
          title="Imprimir Comanda Térmica"
          aria-label="Imprimir Comanda"
        >
          <Printer className="w-5 h-5" />
        </button>

        {isReceived && (
          <button
            onClick={() => onUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.98] text-white font-black text-sm px-4 rounded-2xl shadow-md shadow-orange-500/20 transition-all"
          >
            <Flame className="w-5 h-5" />
            <span>Iniciar Fritura</span>
          </button>
        )}

        {isPreparing && (
          <button
            onClick={() => onUpdateStatus(order.id, ORDER_STATUS.READY)}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white font-black text-sm px-4 rounded-2xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span>Pronto (Chamar)</span>
          </button>
        )}

        {isReady && (
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => onCallAgain(order)}
              className="h-12 px-3 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 border border-blue-200 font-bold text-xs transition-all flex items-center justify-center gap-1"
              title="Chamar Senha Novamente no Telão"
            >
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span className="hidden xs:inline">Chamar</span>
            </button>

            <button
              onClick={() => onUpdateStatus(order.id, ORDER_STATUS.DELIVERED)}
              className="flex-1 h-12 flex items-center justify-center gap-2 bg-stone-900 hover:bg-black active:scale-[0.98] text-white font-black text-sm px-3 rounded-2xl shadow-md transition-all"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Entregar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
