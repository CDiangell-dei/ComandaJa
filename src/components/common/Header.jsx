import React from 'react';
import { ShoppingBag, UtensilsCrossed, Tv, ChefHat, SlidersHorizontal, ReceiptText, Wifi } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { formatCallPassword } from '../../utils/formatters';

export default function Header({ currentTab, setCurrentTab, onOpenCart }) {
  const { cartCount } = useCart();
  const { currentOrder } = useOrders();
  const { settings } = useMenu();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Nome da Pastelaria */}
          <div 
            onClick={() => setCurrentTab('menu')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              🥟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900">
                  Comanda<span className="text-amber-600">Já</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ao Vivo
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block leading-none">
                {settings.storeSubtitle || 'Pastéis Crocantes & Sucos Naturais'}
              </p>
            </div>
          </div>

          {/* Seletor de Telas / Módulos */}
          <nav className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setCurrentTab('menu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'menu'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Cardápio do Cliente"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Cardápio</span>
            </button>

            <button
              onClick={() => setCurrentTab('kitchen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'kitchen'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Painel da Cozinha KDS"
            >
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span className="hidden md:inline">Cozinha</span>
            </button>

            <button
              onClick={() => setCurrentTab('tv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'tv'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Telão de Senhas (TV)"
            >
              <Tv className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Telão</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'admin'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Gerenciar Cardápio & Configurações"
            >
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
            </button>
          </nav>

          {/* Lado Direito: Comanda Ativa e Carrinho */}
          <div className="flex items-center gap-2">
            
            {/* Atalho para Comanda Digital do Cliente se houver pedido ativo */}
            {currentOrder && (
              <button
                onClick={() => setCurrentTab('ticket')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all shadow-xs"
              >
                <ReceiptText className="w-4 h-4 text-amber-600" />
                <span>Senha: {formatCallPassword(currentOrder.ticket_number?.replace('P-', ''))}</span>
              </button>
            )}

            {/* Botão de Carrinho */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white transition-all shadow-md shadow-amber-500/20"
              aria-label="Abrir Carrinho de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
