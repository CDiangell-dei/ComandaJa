import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-stone-900 leading-tight">Sua Comanda</h2>
              <p className="text-xs text-stone-500">{cartCount} {cartCount === 1 ? 'item selecionado' : 'itens selecionados'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-rose-600 font-semibold px-2 py-1 transition-colors"
                title="Limpar Carrinho"
              >
                Limpar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl">
                🥟
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-lg">Seu carrinho está vazio</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Que tal experimentar um dos nossos pastéis artesanais bem recheados ou um suco natural geladinho?
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-2.5 rounded-2xl shadow-md transition-all"
              >
                Ver Cardápio
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3">
                {/* Imagem em miniatura */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-stone-100 flex-shrink-0"
                />

                {/* Conteúdo do Item */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-stone-900 leading-snug">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tamanho (se aplicável) */}
                  {item.selectedSize && (
                    <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-1">
                      {item.selectedSize.name}
                    </span>
                  )}

                  {/* Adicionais */}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="text-[11px] text-stone-500 mt-1 space-y-0.5">
                      {item.selectedAddons.map((add) => (
                        <div key={add.id} className="flex items-center gap-1">
                          <span className="text-amber-600 font-bold">+</span>
                          <span>{add.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Escolhas do Combo */}
                  {item.comboChoices && Object.keys(item.comboChoices).length > 0 && (
                    <div className="text-[11px] text-stone-500 mt-1">
                      {Object.values(item.comboChoices).map((choice, i) => (
                        <div key={i} className="truncate">
                          • {choice}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Observações */}
                  {item.notes && (
                    <p className="text-[11px] italic text-stone-400 mt-1 bg-stone-50 px-2 py-1 rounded-md">
                      "{item.notes}"
                    </p>
                  )}

                  {/* Preço e Controles de Quantidade */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-extrabold text-sm text-amber-700">
                      {formatCurrency(item.totalPrice)}
                    </span>

                    <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:text-rose-600 transition-colors"
                        aria-label="Diminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-stone-800 min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 text-stone-600 hover:text-amber-600 transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer com Subtotal e Botão Finalizar */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 font-medium">Subtotal dos itens</span>
              <span className="font-extrabold text-stone-900 text-base">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white px-5 py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/25 transition-all text-sm sm:text-base"
            >
              <span>Fechar Pedido</span>
              <div className="flex items-center gap-2">
                <span>{formatCurrency(cartTotal)}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
