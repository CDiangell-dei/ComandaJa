export function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatOrderNumber(orderNumber) {
  if (!orderNumber) return '#0000';
  return `#${String(orderNumber).padStart(4, '0')}`;
}

export function formatCallPassword(ticketNumber) {
  if (!ticketNumber) return 'P-01';
  return `P-${String(ticketNumber).padStart(2, '0')}`;
}
