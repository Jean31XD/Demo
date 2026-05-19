import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { GET_ALL_ORDERS } from '@/graphql/queries/orders.queries';
import { UPDATE_ORDER_STATUS } from '@/graphql/mutations/orders.mutations';
import DataTable, { type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import type { Order, OrderStatus } from '@/types';

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  PENDING:   'CONFIRMED',
  CONFIRMED: 'SHIPPED',
  SHIPPED:   'DELIVERED',
  DELIVERED: null,
  CANCELLED: null,
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:   'Confirmar',
  CONFIRMED: 'Marcar enviado',
  SHIPPED:   'Marcar entregado',
  DELIVERED: '',
  CANCELLED: '',
};

const PAGE_SIZE = 15;

const OrdersTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const { data, loading, error } = useQuery(GET_ALL_ORDERS, {
    variables: {
      page,
      pageSize: PAGE_SIZE,
      status: statusFilter || undefined,
    },
    pollInterval: 3000,
    fetchPolicy: 'cache-and-network',
  });

  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, {
    refetchQueries: [{ query: GET_ALL_ORDERS, variables: { page, pageSize: PAGE_SIZE, status: statusFilter || undefined } }],
  });

  const handleAdvance = useCallback(
    (order: Order) => {
      const next = STATUS_FLOW[order.status];
      if (!next) return;
      updateStatus({ variables: { id: order.id, status: next } });
    },
    [updateStatus]
  );

  const orders: any[] = data?.allOrders?.items ?? [];
  const pagination = data?.allOrders?.pagination;
  const totalRevenue: number = data?.allOrders?.totalRevenue ?? 0;

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Orden',
      render: (o) => (
        <span
          className="font-black text-xs"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--red)', letterSpacing: '0.06em' }}
        >
          #{o.id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Cliente',
      render: (o) => (
        <div>
          <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
            {o.customer?.name ?? '—'}
          </p>
          <p className="mono-tag" style={{ fontSize: '0.6rem' }}>{o.customer?.email ?? ''}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Arts.',
      render: (o) => (
        <span className="mono-tag">{o.items.length}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (o) => (
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--ink)', fontSize: '0.9rem' }}
        >
          {o.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (o) => (
        <span className="mono-tag">
          {new Date(o.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (o) => {
        const next = STATUS_FLOW[o.status as OrderStatus];
        if (!next) return null;
        return (
          <button
            onClick={() => handleAdvance(o)}
            className="flex items-center gap-1 text-xs px-2 py-1 transition-colors"
            style={{ color: 'var(--red)', border: '1px solid var(--red-border)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--red-pale)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
          >
            {STATUS_LABELS[o.status as OrderStatus]}
            <ChevronRight size={11} strokeWidth={2.5} />
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {(['', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className="text-xs px-3 py-1.5 transition-colors font-medium"
                style={{
                  background: active ? 'var(--red)' : 'var(--panel)',
                  color: active ? '#fff' : 'var(--muted)',
                  border: `1px solid ${active ? 'var(--red)' : 'var(--border)'}`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s === '' ? 'Todos' : s === 'PENDING' ? 'Pendiente' : s === 'CONFIRMED' ? 'Confirmado'
                  : s === 'SHIPPED' ? 'Enviado' : s === 'DELIVERED' ? 'Entregado' : 'Cancelado'}
              </button>
            );
          })}
        </div>

        {totalRevenue > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp size={13} strokeWidth={2} style={{ color: 'var(--ok)' }} />
            <span className="section-label">Ingresos:</span>
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--ok)', fontSize: '1rem' }}
            >
              {totalRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div
          className="px-4 py-3 text-sm"
          style={{ background: 'var(--fail-pale)', border: '1px solid var(--fail-border)', color: 'var(--fail)' }}
        >
          Error: {error.message}
        </div>
      )}

      <DataTable<any>
        columns={columns}
        rows={orders}
        keyExtractor={(o) => o.id}
        loading={loading}
        emptyTitle="Sin ordenes"
        emptyDescription="Las ordenes aparecen aqui cuando los clientes compran."
      />

      {/* Pagination */}
      {pagination && pagination.total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <span className="mono-tag">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} de {pagination.total} ordenes
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary px-4 py-1.5"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
              className="btn-secondary px-4 py-1.5"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
