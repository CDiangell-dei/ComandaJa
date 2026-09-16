import React, { useState } from 'react';
import { MenuProvider, useMenu } from './context/MenuContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import Header from './components/common/Header';
import CategoryNav from './components/customer/CategoryNav';
import MenuItemCard from './components/customer/MenuItemCard';
import ItemCustomizerModal from './components/customer/ItemCustomizerModal';
import CartDrawer from './components/customer/CartDrawer';
import CheckoutModal from './components/customer/CheckoutModal';
import DigitalTicket from './components/customer/DigitalTicket';
import KitchenDashboard from './components/kitchen/KitchenDashboard';
import PasswordCallScreen from './components/display/PasswordCallScreen';
import MenuManagerModal from './components/admin/MenuManagerModal';
import { Sparkles, Phone, Clock, ShoppingBag } from 'lucide-react';
import { formatCurrency } from './utils/formatters';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('menu'); // 'menu' | 'kitchen' | 'tv' | 'ticket' | 'admin'
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { items, categories, settings, loading: menuLoading } = useMenu();
  const { cartCount, cartTotal, addToCart } = useCart();
  const { currentOrder, setCurrentOrderId } = useOrders();

  // Filtrar itens da categoria selecionada
  const filteredItems = selectedCategory === 'todos'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const handleOpenCustomizer = (item) => {
    setCustomizingItem(item);
  };

  const handleCheckoutSuccess = (createdOrder) => {
    setCurrentTab('ticket');
  };

  const handleStartNewOrder = () => {
    setCurrentOrderId(null);
    setCurrentTab('menu');
  };

  // Se a aba for o Telão de TV, renderiza o painel de tela cheia
  if (currentTab === 'tv') {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setCurrentTab('menu')}
            className="bg-stone-800/80 hover:bg-stone-750 text-stone-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all backdrop-blur-xs border border-stone-700"
          >
            Sair do Telão
          </button>
        </div>
        <PasswordCallScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Header Principal com seletor de módulos */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'admin') {
            setIsAdminOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Conteúdo da Aba Selecionada */}
      <main className="flex-1 pb-24 sm:pb-12">
        {currentTab === 'menu' && (
          <div>
            {/* Banner de Boas-Vindas da Pastelaria */}
            <section className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white py-8 px-4 sm:px-6 shadow-sm">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Cardápio Digital Oficial</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    {settings.storeName}
                  </h1>
                  <p className="text-sm sm:text-base text-amber-100 mt-1 max-w-xl">
                    {settings.storeSubtitle}
                  </p>

                  {/* Informações de Contato e Pedido */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-amber-100">
                    <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                      <Phone className="w-3.5 h-3.5 text-amber-300" />
                      <span>WhatsApp: (92) 99482-2309</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Preparo rápido: ~{settings.avgWaitTimeMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block text-right">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center">
                    <span className="text-4xl">🥟</span>
                    <span className="block text-xs font-bold text-white mt-1">Frito na Hora</span>
                    <span className="block text-[10px] text-amber-200">Massa Crocante</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Navegação por Categorias */}
            <CategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Grade de Produtos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              {menuLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold mt-4">Carregando cardápio do Supabase...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
                  <p className="text-stone-500 font-semibold text-sm">
                    Nenhum item encontrado nesta categoria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onSelect={handleOpenCustomizer}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'kitchen' && <KitchenDashboard />}

        {currentTab === 'ticket' && (
          <div className="py-6">
            {currentOrder ? (
              <DigitalTicket
                order={currentOrder}
                onNewOrder={handleStartNewOrder}
              />
            ) : (
              <div className="max-w-md mx-auto text-center p-12 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <span className="text-4xl">📋</span>
                <h3 className="font-bold text-lg text-stone-800">Nenhuma comanda ativa</h3>
                <p className="text-xs text-stone-500">
                  Você ainda não possui pedidos em andamento nesta sessão.
                </p>
                <button
                  onClick={() => setCurrentTab('menu')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-5 rounded-2xl transition-all"
                >
                  Abrir Cardápio
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Barra Flutuante Inferior no Mobile com Carrinho */}
      {cartCount > 0 && currentTab === 'menu' && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto sm:hidden animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between bg-amber-500 text-white p-4 rounded-3xl shadow-xl shadow-amber-500/30 font-bold active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-white text-amber-600 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">
                {cartCount}
              </div>
              <span className="text-sm">Ver Comanda</span>
            </div>
            <span className="text-base font-extrabold">{formatCurrency(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Modais da Aplicação */}
      <ItemCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <MenuManagerModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </MenuProvider>
  );
}
