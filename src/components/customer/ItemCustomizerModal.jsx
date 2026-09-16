import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ItemCustomizerModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  // Selected size (default to first size if exists)
  const [selectedSize, setSelectedSize] = useState(
    item.sizes && item.sizes.length > 0 ? item.sizes[0] : null
  );

  // Selected addons array
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Combo selections map { [choiceIndex]: optionString }
  const [comboChoices, setComboChoices] = useState(() => {
    if (!item.comboChoices) return {};
    const initial = {};
    item.comboChoices.forEach((choice, idx) => {
      initial[idx] = choice.options[0] || '';
    });
    return initial;
  });

  // Notes/Observations
  const [notes, setNotes] = useState('');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Calculate live price
  const basePrice = selectedSize ? selectedSize.price : item.price;
  const addonsTotal = selectedAddons.reduce((sum, add) => sum + (add.price || 0), 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleComboChange = (choiceIndex, optionValue) => {
    setComboChoices((prev) => ({
      ...prev,
      [choiceIndex]: optionValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddToCart(item, {
      quantity,
      selectedSize,
      selectedAddons,
      comboChoices,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Imagem */}
        <div className="relative h-48 sm:h-56 bg-stone-100 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-lg backdrop-blur-xs transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Título e Preço Base sobre a imagem */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">
              {item.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        {/* Corpo com Scroll para Opções */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Escolha de Tamanho (ex: Sucos) */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Escolha o Tamanho *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      type="button"
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold">{size.name}</div>
                      <div className="text-xs text-amber-700 font-bold mt-1">
                        {formatCurrency(size.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opções de Combo */}
          {item.comboChoices && item.comboChoices.length > 0 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Personalize seu Combo *
              </label>
              {item.comboChoices.map((choice, idx) => (
                <div key={idx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <span className="text-xs font-bold text-stone-800 block mb-2">
                    {choice.name}
                  </span>
                  <select
                    value={comboChoices[idx] || choice.options[0]}
                    onChange={(e) => handleComboChange(idx, e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {choice.options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Adicionais & Ingredientes Extras */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Adicionais e Preferências
                </label>
                <span className="text-[11px] text-stone-400">Opcional</span>
              </div>

              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm font-medium text-stone-800">{addon.name}</span>
                      </div>

                      <span className="text-xs font-bold text-amber-700">
                        {addon.price > 0 ? `+ ${formatCurrency(addon.price)}` : 'Grátis'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observações do Cliente */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Alguma observação especial?
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: pastel bem fritinho, sem cebola, suco com pouco gelo..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer com Quantidade e Botão de Adicionar */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-4">
          {/* Stepper de Quantidade */}
          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-2 py-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2 text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-stone-800 text-base min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 text-stone-500 hover:text-amber-600 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botão de Adicionar ao Carrinho */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-between bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white px-5 py-3.5 rounded-2xl font-bold shadow-lg shadow-amber-500/25 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Adicionar</span>
            </div>
            <span className="font-extrabold text-base tracking-tight">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
