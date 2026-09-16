import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, Zap, Clock, ShieldCheck } from 'lucide-react';
import { generatePixPayload, getQrCodeImageUrl } from '../../utils/pix';
import { formatCurrency } from '../../utils/formatters';

export default function PixPaymentStep({
  orderData,
  storeSettings,
  onPaymentConfirmed,
  onCancel,
}) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  // Gera o payload do Pix
  const pixPayload = generatePixPayload({
    key: storeSettings.pixKey || 'contato@comandaja.com.br',
    name: storeSettings.pixReceiverName || 'PASTELARIA COMANDA JA',
    city: storeSettings.pixCity || 'SAO PAULO',
    amount: orderData.subtotal,
    txid: orderData.ticket_number ? `CMD${orderData.ticket_number.replace(/[^A-Za-z0-9]/g, '')}` : 'CMD01',
  });

  const qrCodeUrl = getQrCodeImageUrl(pixPayload, 260);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5 text-center">
      {/* Resumo do Valor */}
      <div className="bg-amber-50 p-4 rounded-3xl border border-amber-200/80">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
          Valor Total a Pagar
        </span>
        <span className="text-3xl font-black text-amber-900 tracking-tight block mt-1">
          {formatCurrency(orderData.subtotal)}
        </span>
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-semibold mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>
            Expira em {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* QR Code Imagem */}
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl border border-stone-200 shadow-card">
        <div className="p-2 bg-white rounded-2xl shadow-inner border border-stone-100">
          <img
            src={qrCodeUrl}
            alt="QR Code Pix"
            className="w-52 h-52 object-contain rounded-xl"
          />
        </div>
        <p className="text-xs text-stone-500 font-medium mt-3">
          Abra o app do seu banco e escaneie o código acima
        </p>
      </div>

      {/* Botão Copia e Cola */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Ou use o Pix Copia e Cola
        </label>
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all border ${
            copied
              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Código Pix Copiado com Sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-stone-600" />
              <span>Copiar Código Pix</span>
            </>
          )}
        </button>
      </div>

      {/* Botão de Simulação Instantânea para Demonstração / Colega */}
      <div className="pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={() => onPaymentConfirmed('PAID')}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all"
        >
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
          <span>Confirmar Pagamento Pix</span>
        </button>
        <p className="text-[11px] text-stone-400 mt-1.5 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Liberação automática da comanda na cozinha após confirmação
        </p>
      </div>
    </div>
  );
}
