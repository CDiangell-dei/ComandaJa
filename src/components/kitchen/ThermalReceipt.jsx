import React from 'react';
import { formatCurrency, formatDateTime, formatCallPassword } from '../../utils/formatters';

export default function ThermalReceipt({ order, storeSettings }) {
  if (!order) return null;

  return (
    <div id="thermal-receipt" className="hidden">
      <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
          {storeSettings?.storeName || 'COMANDA JÁ'}
        </h2>
        <p style={{ margin: 0, fontSize: '11px' }}>
          {storeSettings?.storeSubtitle || 'Pastelaria & Lanchonete'}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '11px' }}>
          {formatDateTime(order.created_at)}
        </p>
      </div>

      {/* Destaque da Senha */}
      <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '2px solid #000' }}>
        <span style={{ fontSize: '12px', display: 'block', fontWeight: 'bold' }}>SENHA DE RETIRADA</span>
        <span style={{ fontSize: '32px', fontWeight: '900', display: 'block', letterSpacing: '1px' }}>
          {order.ticket_number || 'P-01'}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {order.table_number || 'Balcão'} • Comanda #{order.order_number || String(order.id).slice(-4)}
        </span>
      </div>

      {/* Dados do Cliente */}
      <div style={{ padding: '8px 0', borderBottom: '1px dashed #000', fontSize: '12px' }}>
        <div><strong>Cliente:</strong> {order.customer_name}</div>
        {order.customer_phone && <div><strong>Fone:</strong> {order.customer_phone}</div>}
        <div><strong>Tipo:</strong> {order.order_type === 'TAKE_AWAY' ? 'PARA VIAGEM' : 'LOCAL'}</div>
        <div>
          <strong>Pagamento:</strong> {order.payment_method} ({order.payment_status === 'PAID' ? 'PAGO' : 'PENDENTE NO BALCAO'})
        </div>
      </div>

      {/* Itens do Pedido */}
      <div style={{ padding: '8px 0', borderBottom: '2px solid #000' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>ITENS DO PEDIDO:</div>
        {order.items?.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>{item.quantity}x {item.name}</span>
              <span>{formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}</span>
            </div>
            {item.selectedSize && (
              <div style={{ fontSize: '11px', paddingLeft: '10px' }}>
                Tamanho: {item.selectedSize.name}
              </div>
            )}
            {item.selectedAddons && item.selectedAddons.length > 0 && (
              <div style={{ fontSize: '11px', paddingLeft: '10px' }}>
                + {item.selectedAddons.map((a) => a.name).join(', ')}
              </div>
            )}
            {item.notes && (
              <div style={{ fontSize: '11px', fontWeight: 'bold', paddingLeft: '10px', fontStyle: 'italic' }}>
                OBS: {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', fontWeight: 'bold' }}>
        <span>TOTAL:</span>
        <span>{formatCurrency(order.subtotal)}</span>
      </div>

      {/* Rodapé */}
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', borderTop: '1px dashed #000', paddingTop: '8px' }}>
        <p style={{ margin: 0 }}>Obrigado pela preferência!</p>
        <p style={{ margin: '2px 0 0 0' }}>Sistema ComandaJá • cdiangell-dei</p>
      </div>
    </div>
  );
}
