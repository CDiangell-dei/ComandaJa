import React, { useState, useEffect } from 'react';
import { Lock, X, Delete, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';

export default function PinAuthModal({ isOpen, onClose, onSuccess }) {
  const { settings } = useMenu();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const correctPin = String(settings.kitchenPin || '1234');
  const targetLength = correctPin.length || 4;

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  // Suporte a digitação pelo teclado físico do computador
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleAddDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  if (!isOpen) return null;

  const handleAddDigit = (digit) => {
    if (pin.length < targetLength) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      // Quando atinge a quantidade de dígitos, valida automaticamente
      if (nextPin.length === targetLength) {
        if (nextPin === correctPin) {
          setTimeout(() => {
            onSuccess();
          }, 150);
        } else {
          setTimeout(() => {
            setError(true);
            setPin('');
          }, 200);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de Cadeado */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
          <Lock className="w-7 h-7 text-amber-600" />
        </div>

        <h3 className="text-xl font-black text-stone-900 tracking-tight">
          Acesso da Cozinha & Equipe
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-[240px]">
          Digite a senha de 4 dígitos para acessar o painel de pedidos
        </p>

        {/* Indicador visual de Dígitos */}
        <div className="my-6 flex items-center justify-center gap-4">
          {Array.from({ length: targetLength }).map((_, idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 ring-4 ring-rose-100 scale-110'
                    : isFilled
                    ? 'bg-amber-500 ring-4 ring-amber-100 scale-110'
                    : 'bg-stone-200'
                }`}
              />
            );
          })}
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="flex items-center gap-1 text-xs font-bold text-rose-600 mb-3 animate-shake">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Senha incorreta. Tente novamente.</span>
          </div>
        )}

        {/* Teclado Numérico */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleAddDigit(String(num))}
              className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-900 text-xl font-black shadow-2xs transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          {/* Botão Limpar */}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-500 text-xs font-bold transition-all flex items-center justify-center"
          >
            Limpar
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleAddDigit('0')}
            className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-900 text-xl font-black shadow-2xs transition-all flex items-center justify-center"
          >
            0
          </button>

          {/* Apagar */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 transition-all flex items-center justify-center"
            aria-label="Apagar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 w-full flex items-center justify-between text-xs text-stone-400">
          <span>{correctPin === '1234' ? 'Padrão: 1234' : 'Acesso Restrito'}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 font-bold"
          >
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    </div>
  );
}
