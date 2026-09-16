import React, { useState } from 'react';
import { X, User, Phone, MapPin, QrCode, CreditCard, Banknote, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { ORDER_TYPES, PAYMENT_METHODS } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import PixPaymentStep from './PixPaymentStep';

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder, updatePaymentStatus } = useOrders();
  const { settings } = useMenu();

  const [step, setStep] = useState('FORM'); // 'FORM' | 'PIX'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState(ORDER_TYPES.DINE_IN);
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PIX);
  const [notes, setNotes] = useState('');
  const [pendingOrder, setPendingOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome para identificação do pedido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        orderType,
        tableNumber: orderType === ORDER_TYPES.DINE_IN ? (tableNumber.trim() || 'Mesa Balcão') : 'Para Viagem',
        items: cart,
        subtotal: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === PAYMENT_METHODS.PIX ? 'PENDING' : 'PENDING',
        notes: notes.trim(),
      });

      setPendingOrder(newOrder);

      if (paymentMethod === PAYMENT_METHODS.PIX) {
        setStep('PIX');
      } else {
        clearCart();
        onSuccess(newOrder);
        onClose();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Ocorreu um erro ao processar seu pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePixConfirmed = async () => {
    if (pendingOrder) {
      await updatePaymentStatus(pendingOrder.id, 'PAID');
      clearCart();
      onSuccess(pendingOrder);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            {step === 'PIX' && (
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="font-black text-lg text-stone-900 leading-tight">
                {step === 'FORM' ? 'Identificação & Pagamento' : 'Pagamento via Pix'}
              </h2>
              <p className="text-xs text-stone-500">
                {step === 'FORM' ? 'Informe seus dados para a comanda' : 'Finalize para enviar à cozinha'}
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

        {/* Conteúdo */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {step === 'FORM' ? (
            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Nome do Cliente */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Seu Nome *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp (Opcional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    WhatsApp
                  </label>
                  <span className="text-[11px] text-stone-400">Opcional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Onde vai consumir */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Onde você vai consumir? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType(ORDER_TYPES.DINE_IN)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      orderType === ORDER_TYPES.DINE_IN
                        ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <span className="block text-sm">🍽️ Comer no Local</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType(ORDER_TYPES.TAKE_AWAY)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      orderType === ORDER_TYPES.TAKE_AWAY
                        ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <span className="block text-sm">🛍️ Levar / Viagem</span>
                  </button>
                </div>

                {orderType === ORDER_TYPES.DINE_IN && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Número da Mesa ou 'Balcão' (ex: Mesa 04)"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Forma de Pagamento *
                </label>
                <div className="space-y-2.5">
                  <label
                    onClick={() => setPaymentMethod(PAYMENT_METHODS.PIX)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                      paymentMethod === PAYMENT_METHODS.PIX
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">
                          Pix Instantâneo
                        </span>
                        <span className="text-xs text-stone-500 block">
                          QR Code e Copia e Cola na hora
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Mais Rápido
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod(PAYMENT_METHODS.COUNTER)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                      paymentMethod === PAYMENT_METHODS.COUNTER
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">
                          Pagar no Balcão na Retirada
                        </span>
                        <span className="text-xs text-stone-500 block">
                          Dinheiro ou Cartão na Maquininha
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botão Avançar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white px-5 py-4 rounded-2xl font-black shadow-lg shadow-amber-500/25 transition-all text-base mt-4"
              >
                <span>{paymentMethod === PAYMENT_METHODS.PIX ? 'Ir para Pagamento Pix' : 'Gerar Minha Comanda'}</span>
                <div className="flex items-center gap-2">
                  <span>{formatCurrency(cartTotal)}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </form>
          ) : (
            <PixPaymentStep
              orderData={pendingOrder}
              storeSettings={settings}
              onPaymentConfirmed={handlePixConfirmed}
              onCancel={() => setStep('FORM')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
