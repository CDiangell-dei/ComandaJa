// Categorias do Cardápio baseadas no panfleto da pastelaria
export const CATEGORIES = [
  { id: 'todos', name: 'Todos', icon: 'Sparkles' },
  { id: 'tradicional', name: 'Pastéis Tradicionais', icon: 'Flame' },
  { id: 'diversos', name: 'Diversos & Salgados', icon: 'Heart' },
  { id: 'bebidas', name: 'Bebidas & Sucos 1L', icon: 'Coffee' },
];

// O cardápio oficial é carregado e gerenciado dinamicamente direto no Supabase (tabela public.menu_items)
export const INITIAL_MENU = [];
