import React from 'react';
import { ShoppingBag, ReceiptText, ChefHat, Tv, SlidersHorizontal, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { formatCallPassword } from '../../utils/formatters';

export default function Header({ currentTab, setCurrentTab, onOpenCart, onOpenAdmin, onLockKitchen }) {
  const { cartCount } = useCart();
  const { currentOrder } = useOrders();
  const { settings } = useMenu();

  const isStaffView = currentTab === 'kitchen';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 w-full gap-2">
          
          {/* Logo / Nome da Pastelaria */}
          <div 
            onClick={() => setCurrentTab('menu')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-lg sm:text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              🥟
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-stone-900 whitespace-nowrap">
                  {settings.storeName || 'ComandaJá'}
                </span>
                {isStaffView && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Cozinha KDS
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block leading-none">
                {settings.storeSubtitle || 'Pastéis Crocantes & Bebidas Geladas'}
              </p>
            </div>
          </div>

          {/* Lado Direito: Ações Contextuais */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Se estiver na visão da Cozinha, mostra botões da equipe */}
            {isStaffView ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentTab('tv')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-all"
                  title="Abrir Telão de Senhas na TV"
                >
                  <Tv className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Abrir Telão</span>
                </button>

                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
                  title="Configurações & Cardápio"
                >
                  <SlidersHorizontal className="w-4 h-4 text-stone-600" />
                  <span className="hidden sm:inline">Cardápio</span>
                </button>

                <button
                  onClick={onLockKitchen}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 text-xs font-bold transition-all"
                  title="Bloquear Cozinha (Sair)"
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Bloquear</span>
                </button>

                <button
                  onClick={() => setCurrentTab('menu')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
                  title="Ver Cardápio do Cliente"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Cardápio</span>
                </button>
              </div>
            ) : (
              /* Visão do Cliente: Apenas Atalho de Comanda Ativa e Carrinho */
              <>
                {currentOrder && (
                  <button
                    onClick={() => setCurrentTab('ticket')}
                    className="flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold transition-all shadow-xs"
                  >
                    <ReceiptText className="w-4 h-4 text-amber-600" />
                    <span>Minha Comanda: {formatCallPassword(currentOrder.ticket_number?.replace('P-', ''))}</span>
                  </button>
                )}

                {/* Botão de Carrinho */}
                <button
                  onClick={onOpenCart}
                  className="relative p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white transition-all shadow-md shadow-amber-500/20 flex-shrink-0"
                  aria-label="Abrir Carrinho de Compras"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
