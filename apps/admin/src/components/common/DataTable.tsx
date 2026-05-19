import React from 'react';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

function DataTable<T>({
  columns, rows, keyExtractor, loading = false, emptyTitle = 'Sin resultados', emptyDescription,
}: DataTableProps<T>) {
  return (
    <div
      className="overflow-hidden"
      style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`th ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="td">
                      <div className="shimmer h-3 rounded" style={{ width: `${50 + (i * 13) % 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="transition-colors"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-row)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`td ${col.className ?? ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
