import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MenuContext = createContext();

export const CATEGORIES = [
  { id: 'todos', name: 'Todos', icon: 'Sparkles' },
  { id: 'tradicional', name: 'Pastéis Tradicionais', icon: 'Flame' },
  { id: 'diversos', name: 'Diversos & Salgados', icon: 'Heart' },
  { id: 'bebidas', name: 'Bebidas & Sucos 1L', icon: 'Coffee' },
];

const DEFAULT_SETTINGS = {
  storeName: 'Pastelaria & Salgados da Lucilene',
  storeSubtitle: 'Pastéis Tradicionais, Salgados Especiais & Bebidas Geladas',
  pixKey: '92994822309',
  pixReceiverName: 'MARIA LUCILENE DE JESUS CHAVES',
  pixCity: 'MANAUS',
  avgWaitTimeMinutes: 15,
};

export function MenuProvider({ children }) {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Carrega cardápio e configurações direto do Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadMenuFromSupabase() {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          // Busca itens do cardápio no Supabase
          const { data: menuData, error: menuErr } = await supabase
            .from('menu_items')
            .select('*')
            .order('category', { ascending: false })
            .order('price', { ascending: true });

          if (!menuErr && menuData && isMounted) {
            setItems(menuData.map(item => ({
              ...item,
              price: parseFloat(item.price) || 0,
            })));
          }

          // Busca configurações da loja no Supabase
          const { data: settingsData, error: settErr } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', 'default')
            .single();

          if (!settErr && settingsData && isMounted) {
            setSettings({
              storeName: settingsData.store_name || DEFAULT_SETTINGS.storeName,
              storeSubtitle: settingsData.store_subtitle || DEFAULT_SETTINGS.storeSubtitle,
              pixKey: settingsData.pix_key || DEFAULT_SETTINGS.pixKey,
              pixReceiverName: settingsData.pix_receiver_name || DEFAULT_SETTINGS.pixReceiverName,
              pixCity: settingsData.pix_city || DEFAULT_SETTINGS.pixCity,
              avgWaitTimeMinutes: settingsData.avg_wait_time_minutes || 15,
            });
          }
        } catch (err) {
          console.warn('Erro ao carregar cardápio do Supabase:', err);
        }
      }
      if (isMounted) setLoading(false);
    }

    loadMenuFromSupabase();

    // Inscrição Realtime no Supabase para sincronização instantânea do cardápio
    let channel;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('public:menu_items')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'menu_items' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setItems((prev) => [...prev, { ...payload.new, price: parseFloat(payload.new.price) }]);
            } else if (payload.eventType === 'UPDATE') {
              setItems((prev) =>
                prev.map((i) =>
                  i.id === payload.new.id
                    ? { ...payload.new, price: parseFloat(payload.new.price) }
                    : i
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setItems((prev) => prev.filter((i) => i.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Alternar disponibilidade (esgotado / disponível) diretamente no Supabase
  const toggleAvailability = async (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newStatus = !item.available;

    // Atualização otimista local
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, available: newStatus } : i))
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('menu_items')
          .update({ available: newStatus })
          .eq('id', itemId);
      } catch (e) {
        console.error('Erro ao atualizar disponibilidade no Supabase:', e);
      }
    }
  };

  // Atualizar preço de um item no Supabase
  const updatePrice = async (itemId, newPrice) => {
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed)) return;

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, price: parsed } : i))
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('menu_items')
          .update({ price: parsed })
          .eq('id', itemId);
      } catch (e) {
        console.error('Erro ao atualizar preço no Supabase:', e);
      }
    }
  };

  // Atualizar configurações da loja no Supabase
  const updateSettings = async (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('store_settings')
          .update({
            store_name: newSettings.storeName,
            store_subtitle: newSettings.storeSubtitle,
            pix_key: newSettings.pixKey,
            pix_receiver_name: newSettings.pixReceiverName,
            pix_city: newSettings.pixCity,
            avg_wait_time_minutes: newSettings.avgWaitTimeMinutes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 'default');
      } catch (e) {
        console.error('Erro ao atualizar configurações no Supabase:', e);
      }
    }
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        categories: CATEGORIES,
        settings,
        loading,
        toggleAvailability,
        updatePrice,
        updateSettings,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}
