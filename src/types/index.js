export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT', // Aguardando pagamento
  RECEIVED: 'RECEIVED',               // Recebido na cozinha
  PREPARING: 'PREPARING',             // Em preparo / Fritadeira
  READY: 'READY',                     // Pronto para retirada
  DELIVERED: 'DELIVERED',             // Entregue / Finalizado
  CANCELLED: 'CANCELLED',             // Cancelado
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'Aguardando Pagamento',
  [ORDER_STATUS.RECEIVED]: 'Recebido',
  [ORDER_STATUS.PREPARING]: 'Em Preparo',
  [ORDER_STATUS.READY]: 'Pronto para Retirada',
  [ORDER_STATUS.DELIVERED]: 'Entregue',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'bg-amber-100 text-amber-800 border-amber-300',
  [ORDER_STATUS.RECEIVED]: 'bg-blue-100 text-blue-800 border-blue-300',
  [ORDER_STATUS.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
  [ORDER_STATUS.READY]: 'bg-emerald-100 text-emerald-800 border-emerald-400',
  [ORDER_STATUS.DELIVERED]: 'bg-stone-100 text-stone-600 border-stone-200',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
};

export const PAYMENT_METHODS = {
  PIX: 'PIX',
  CARD: 'CARD',
  COUNTER: 'COUNTER',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.PIX]: 'Pix (Instantâneo)',
  [PAYMENT_METHODS.CARD]: 'Cartão (Débito/Crédito)',
  [PAYMENT_METHODS.COUNTER]: 'Pagar no Balcão',
};

export const ORDER_TYPES = {
  DINE_IN: 'DINE_IN',       // Consumir no local (Mesa)
  TAKE_AWAY: 'TAKE_AWAY',   // Retirar para viagem
};

export const ORDER_TYPE_LABELS = {
  [ORDER_TYPES.DINE_IN]: 'Consumir no Local',
  [ORDER_TYPES.TAKE_AWAY]: 'Para Viagem',
};
