import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ORDER_STATUS } from '../types';
import { playNewOrderSound, playCallPasswordSound } from '../utils/audio';

const OrderContext = createContext();

const LOCAL_ORDERS_KEY = 'comandaja_local_orders_v1';
const CURRENT_ORDER_ID_KEY = 'comandaja_current_order_id_v1';

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOrderId, setCurrentOrderId] = useState(() => {
    return localStorage.getItem(CURRENT_ORDER_ID_KEY) || null;
  });
  const [lastCalledOrder, setLastCalledOrder] = useState(null);
  const [broadcastChannel, setBroadcastChannel] = useState(null);

  // Keep track of sound notification state to avoid double chimes
  const soundMutedRef = useRef(false);

  // Setup BroadcastChannel for local cross-tab synchronization
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('comandaja_sync_channel');
      setBroadcastChannel(channel);

      channel.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (type === 'NEW_ORDER') {
          setOrders((prev) => {
            if (prev.some((o) => o.id === data.id)) return prev;
            return [data, ...prev];
          });
          playNewOrderSound();
        } else if (type === 'UPDATE_ORDER') {
          setOrders((prev) => prev.map((o) => (o.id === data.id ? data : o)));
          if (data.order_status === ORDER_STATUS.READY) {
            setLastCalledOrder(data);
            playCallPasswordSound();
          }
        } else if (type === 'CALL_AGAIN') {
          setLastCalledOrder(data);
          playCallPasswordSound();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  // Fetch initial orders from Supabase (or fallback to localStorage)
  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

          if (!error && data && isMounted) {
            setOrders(data);
            setLoading(false);
            return;
          }
          if (error) {
            console.warn('Supabase fetch error, falling back to local storage:', error.message);
          }
        } catch (err) {
          console.warn('Supabase network error, falling back to local storage:', err);
        }
      }

      // Fallback to local storage
      try {
        const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
        if (saved && isMounted) {
          setOrders(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error reading local orders:', e);
      }
      if (isMounted) setLoading(false);
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  // Setup Supabase Realtime Subscription
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new;
            setOrders((prev) => {
              if (prev.some((o) => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });
            playNewOrderSound();
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new;
            setOrders((prev) =>
              prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );

            if (updatedOrder.order_status === ORDER_STATUS.READY) {
              setLastCalledOrder(updatedOrder);
              playCallPasswordSound();
            }
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save to local storage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders locally:', e);
    }
  }, [orders]);

  // Create a new order
  const createOrder = async ({
    customerName,
    customerPhone = '',
    orderType = 'DINE_IN',
    tableNumber = '',
    items,
    subtotal,
    paymentMethod,
    paymentStatus = 'PENDING',
    notes = '',
  }) => {
    // Generate daily ticket sequence: P-01, P-02, ...
    const todayOrdersCount = orders.length + 1;
    const ticketNumber = `P-${String(todayOrdersCount % 100 || 1).padStart(2, '0')}`;

    const tempId = crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`;
    const newOrderData = {
      id: tempId,
      ticket_number: ticketNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      order_type: orderType,
      table_number: tableNumber || (orderType === 'DINE_IN' ? 'Balcão' : 'Viagem'),
      items,
      subtotal,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      order_status: paymentStatus === 'PAID' ? ORDER_STATUS.RECEIVED : ORDER_STATUS.PENDING_PAYMENT,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let savedOrder = newOrderData;

    // Try saving to Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([newOrderData])
          .select()
          .single();

        if (!error && data) {
          savedOrder = data;
        } else if (error) {
          console.warn('Supabase insert warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert failed, keeping local:', err);
      }
    }

    // Update local state
    setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);
    setCurrentOrderId(savedOrder.id);
    localStorage.setItem(CURRENT_ORDER_ID_KEY, savedOrder.id);

    // Notify other tabs via BroadcastChannel
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_ORDER', data: savedOrder });
    }

    playNewOrderSound();

    return savedOrder;
  };

  // Update order status (KDS actions)
  const updateOrderStatus = async (orderId, newStatus) => {
    const updatedOrder = orders.find((o) => o.id === orderId);
    if (!updatedOrder) return;

    const payload = {
      ...updatedOrder,
      order_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Update locally immediately
    setOrders((prev) => prev.map((o) => (o.id === orderId ? payload : o)));

    if (newStatus === ORDER_STATUS.READY) {
      setLastCalledOrder(payload);
      playCallPasswordSound();
    }

    // Sync via BroadcastChannel
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'UPDATE_ORDER', data: payload });
    }

    // Sync with Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.error('Failed to update status on Supabase:', err);
      }
    }
  };

  // Update payment status (e.g. Pix confirmed)
  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newOrderStatus =
      newPaymentStatus === 'PAID' && targetOrder.order_status === ORDER_STATUS.PENDING_PAYMENT
        ? ORDER_STATUS.RECEIVED
        : targetOrder.order_status;

    const payload = {
      ...targetOrder,
      payment_status: newPaymentStatus,
      order_status: newOrderStatus,
      updated_at: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? payload : o)));

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'UPDATE_ORDER', data: payload });
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({
            payment_status: newPaymentStatus,
            order_status: newOrderStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      } catch (err) {
        console.error('Failed to update payment status on Supabase:', err);
      }
    }
  };

  // Trigger calling ticket again (chime on TV)
  const callTicketAgain = (order) => {
    setLastCalledOrder(order);
    playCallPasswordSound();
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'CALL_AGAIN', data: order });
    }
  };

  // Active order of the customer currently on this device
  const currentOrder = orders.find((o) => o.id === currentOrderId) || null;

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        currentOrder,
        currentOrderId,
        lastCalledOrder,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        callTicketAgain,
        setCurrentOrderId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
