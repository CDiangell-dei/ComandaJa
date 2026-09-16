import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, Flame, Bell, QrCode, ArrowLeft, Utensils } from 'lucide-react';
import { ORDER_STATUS } from '../../types';
import { formatCurrency, formatTimeOnly, formatCallPassword } from '../../utils/formatters';
import { getQrCodeImageUrl } from '../../utils/pix';

export default function DigitalTicket({ order, onNewOrder }) {
  if (!order) return null;

  const isReady = order.order_status === ORDER_STATUS.READY;
  const isPreparing = order.order_status === ORDER_STATUS.PREPARING;
  const isDelivered = order.order_status === ORDER_STATUS.DELIVERED;

  // Lança confetes festivos quando o pedido fica pronto!
  useEffect(() => {
    if (isReady) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
      });
    }
  }, [isReady]);

  const ticketQr = getQrCodeImageUrl(`COMANDA-${order.id}`, 180);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Card da Comanda / Ticket */}
      <div className={`bg-white rounded-3xl overflow-hidden border shadow-xl transition-all ${
        isReady ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-stone-200'
      }`}>
        
        {/* Topo do Ticket com Senha */}
        <div className={`p-6 text-center text-white transition-colors ${
          isReady
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 pulse-ready'
            : isPreparing
            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
            : isDelivered
            ? 'bg-stone-700'
            : 'bg-gradient-to-br from-amber-600 to-amber-500'
        }`}>
          <span className="text-xs uppercase font-extrabold tracking-widest opacity-90 block">
            Senha de Retirada
          </span>

          <div className="text-5xl sm:text-6xl font-black tracking-tight my-2 drop-shadow-sm">
            {order.ticket_number || 'P-01'}
          </div>

          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold">
            <span>Comanda #{order.order_number || String(order.id).slice(-4)}</span>
            <span>•</span>
            <span>{order.table_number || 'Balcão'}</span>
          </div>
        </div>

        {/* Status Tracker Animado */}
        <div className="p-6 border-b border-stone-100 bg-stone-50">
          <div className="relative flex items-center justify-between">
            {/* Linha de conexão */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0">
              <div 
                className="h-full bg-amber-500 transition-all duration-500"
                style={{
                  width: isDelivered ? '100%' : isReady ? '75%' : isPreparing ? '50%' : '15%',
                }}
              />
            </div>

            {/* Passo 1: Recebido */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Recebido</span>
            </div>

            {/* Passo 2: Fritando */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                isPreparing || isReady || isDelivered
                  ? 'bg-orange-500 text-white animate-pulse'
                  : 'bg-stone-200 text-stone-400'
              }`}>
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Fritando</span>
            </div>

            {/* Passo 3: Pronto */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                isReady || isDelivered
                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                  : 'bg-stone-200 text-stone-400'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Pronto!</span>
            </div>

            {/* Passo 4: Entregue */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                isDelivered
                  ? 'bg-stone-700 text-white'
                  : 'bg-stone-200 text-stone-400'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Entregue</span>
            </div>
          </div>

          {/* Mensagem de Destaque do Status Atual */}
          <div className="mt-5 text-center">
            {isReady ? (
              <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-2xl text-emerald-900 animate-bounce">
                <span className="font-extrabold text-sm block">🥟 SEU PEDIDO ESTÁ PRONTO!</span>
                <span className="text-xs">Dirija-se ao balcão e apresente sua senha para retirada.</span>
              </div>
            ) : isPreparing ? (
              <div className="bg-orange-100 border border-orange-200 p-2.5 rounded-2xl text-orange-900">
                <span className="font-bold text-xs block">🔥 Na Fritadeira / Copa</span>
                <span className="text-[11px] text-orange-800">Seus pastéis e bebidas estão sendo preparados no capricho.</span>
              </div>
            ) : isDelivered ? (
              <div className="bg-stone-100 p-2.5 rounded-2xl text-stone-600 text-xs font-semibold">
                Pedido entregue com sucesso. Bom apetite!
              </div>
            ) : (
              <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-900 text-xs font-semibold">
                Pedido na fila da cozinha. Tempo médio estimado: 15 min.
              </div>
            )}
          </div>
        </div>

        {/* Detalhes dos Itens da Comanda */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
            <span>Cliente: <strong className="text-stone-800">{order.customer_name}</strong></span>
            <span>Horário: <strong className="text-stone-800">{formatTimeOnly(order.created_at)}</strong></span>
          </div>

          <div className="space-y-2.5">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-stone-900">
                    {item.quantity}x {item.name}
                  </span>
                  {item.selectedSize && (
                    <span className="text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded ml-1.5">
                      {item.selectedSize.name}
                    </span>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="text-[11px] text-stone-500 pl-4">
                      + {item.selectedAddons.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[11px] italic text-stone-400 pl-4">
                      "{item.notes}"
                    </div>
                  )}
                </div>
                <span className="font-bold text-stone-800 whitespace-nowrap">
                  {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-dashed border-stone-200 flex items-center justify-between">
            <span className="font-bold text-stone-600 text-sm">Total da Comanda</span>
            <span className="font-black text-amber-700 text-lg">
              {formatCurrency(order.subtotal)}
            </span>
          </div>
        </div>

        {/* QR Code de Retirada */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-4">
          <img
            src={ticketQr}
            alt="QR Code da Comanda"
            className="w-20 h-20 bg-white p-1 rounded-xl border border-stone-200 shadow-xs"
          />
          <div className="text-left">
            <span className="text-xs font-bold text-stone-800 block">Identificação Digital</span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Apresente esta tela ou o QR Code ao atendente para confirmar o recebimento.
            </p>
          </div>
        </div>
      </div>

      {/* Botão Novo Pedido */}
      <button
        onClick={onNewOrder}
        className="w-full flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-3.5 px-4 rounded-2xl text-sm transition-all"
      >
        <Utensils className="w-4 h-4" />
        <span>Fazer Outro Pedido</span>
      </button>
    </div>
  );
}
