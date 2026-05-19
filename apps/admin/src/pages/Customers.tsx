import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_CUSTOMERS } from '@/graphql/queries/orders.queries';
import DataTable, { type Column } from '@/components/common/DataTable';

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const PAGE_SIZE = 15;

const COLUMNS: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Nombre',
    render: (c) => (
      <div className="flex items-center gap-3">
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center font-black text-xs"
          style={{ background: 'var(--red-pale)', color: 'var(--red)', border: '1px solid var(--red-border)', fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {c.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>{c.name}</span>
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (c) => (
      <span className="mono-tag" style={{ color: 'var(--muted)' }}>{c.email}</span>
    ),
  },
  {
    key: 'joined',
    header: 'Registro',
    render: (c) => (
      <span className="mono-tag">
        {new Date(c.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
];

const Customers: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_ALL_CUSTOMERS, {
    variables: { page, pageSize: PAGE_SIZE },
  });

  const customers: Customer[] = data?.allCustomers?.items ?? [];
  const pagination = data?.allCustomers?.pagination;

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div>
        <p className="section-label mb-1">Directorio</p>
        <h2
          className="font-black uppercase leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--ink)', fontSize: '1.6rem', letterSpacing: '0.02em' }}
        >
          Clientes
        </h2>
        <p className="mono-tag mt-0.5">
          {pagination?.total !== undefined ? `${pagination.total} clientes registrados` : 'Cargando...'}
        </p>
      </div>

      {error && (
        <div
          className="px-4 py-3 text-sm"
          style={{ background: 'var(--fail-pale)', border: '1px solid var(--fail-border)', color: 'var(--fail)' }}
        >
          Error: {error.message}
        </div>
      )}

      <DataTable<Customer>
        columns={COLUMNS}
        rows={customers}
        keyExtractor={(c) => c.id}
        loading={loading}
        emptyTitle="Sin clientes"
        emptyDescription="Los clientes aparecen aqui cuando se registran en la tienda."
      />

      {pagination && pagination.total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <span className="mono-tag">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} de {pagination.total}
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

export default Customers;
