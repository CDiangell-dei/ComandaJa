import React from 'react';
import { Plus, Check, Sliders } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function MenuItemCard({ item, onSelect }) {
  const isAvailable = item.available !== false;

  return (
    <div
      onClick={() => isAvailable && onSelect(item)}
      className={`group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-card transition-all duration-300 flex flex-col justify-between ${
        isAvailable
          ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
          : 'opacity-60 cursor-not-allowed filter grayscale'
      }`}
    >
      {/* Imagem do Produto com Badge */}
      <div className="relative h-44 w-full overflow-hidden bg-stone-100">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105' : ''
          }`}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Badge do Item */}
        {item.badge && isAvailable && (
          <span className="absolute top-3 left-3 bg-amber-500/95 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
            {item.badge}
          </span>
        )}

        {!isAvailable && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Esgotado
          </span>
        )}

        {/* Preço sobre a imagem em destaque */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-2xl shadow-md border border-white/50">
          <span className="text-xs text-stone-500 font-semibold mr-1">a partir de</span>
          <span className="font-extrabold text-sm sm:text-base text-amber-700">
            {formatCurrency(item.price)}
          </span>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-stone-900 leading-snug group-hover:text-amber-700 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Botão de Adicionar / Personalizar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="text-xs text-stone-400 font-medium">
            {item.customizable ? 'Opções & Adicionais' : 'Item pronto'}
          </div>

          <button
            disabled={!isAvailable}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              isAvailable
                ? 'bg-amber-50 text-amber-800 hover:bg-amber-500 hover:text-white group-hover:bg-amber-500 group-hover:text-white'
                : 'bg-stone-200 text-stone-400'
            }`}
          >
            {item.customizable ? (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>Montar</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
