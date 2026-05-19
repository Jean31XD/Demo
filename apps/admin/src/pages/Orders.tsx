import React from 'react';
import OrdersTable from '@/features/orders/components/OrdersTable';

const Orders: React.FC = () => (
  <div className="flex flex-col gap-6 fade-in">
    <div>
      <p className="section-label mb-1">Gestion de pedidos</p>
      <h2
        className="font-display font-bold uppercase tracking-wide"
        style={{ color: 'var(--chalk)', fontSize: '1.5rem' }}
      >
        Ordenes
      </h2>
      <p className="mono-tag mt-0.5">Revisa y avanza el estado de cada pedido</p>
    </div>
    <OrdersTable />
  </div>
);

export default Orders;
