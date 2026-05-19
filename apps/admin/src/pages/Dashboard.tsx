import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { GET_ALL_ORDERS, GET_DASHBOARD_STATS } from '@/graphql/queries/orders.queries';
import StatsCard from '@/components/common/StatsCard';
import StatusBadge from '@/components/common/StatusBadge';
import type { Order } from '@/types';

interface DashboardStats {
  totalProducts: number; lowStockProducts: number; outOfStockProducts: number;
  totalOrders: number; pendingOrders: number; totalRevenue: number; totalCustomers: number;
}

const Dashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: statsData, loading: statsLoading } = useQuery<{ dashboardStats: DashboardStats }>(GET_DASHBOARD_STATS);
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ALL_ORDERS, {
    variables: { page: 1, pageSize: 6 },
  });

  const stats = statsData?.dashboardStats;
  const recentOrders: Order[] = ordersData?.allOrders?.items ?? [];
  const fmt = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6 fade-in">

      {/* Header */}
      <div>
        <p className="section-label mb-1">Centro de operaciones</p>
        <h2
          className="font-black uppercase leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--ink)', fontSize: '1.6rem', letterSpacing: '0.02em' }}
        >
          Bienvenido, {user?.name?.split(' ')[0] ?? 'Admin'}
        </h2>
        <p className="mono-tag mt-1">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      {statsLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 stagger">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 shimmer" style={{ border: '1px solid var(--border)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 stagger">
          <StatsCard
            label="Productos"
            value={stats?.totalProducts ?? 0}
            icon="P"
            delta={stats?.outOfStockProducts ? `${stats.outOfStockProducts} agotados` : undefined}
            deltaPositive={false}
          />
          <StatsCard
            label="Órdenes totales"
            value={stats?.totalOrders ?? 0}
            icon="O"
            delta={stats?.pendingOrders ? `${stats.pendingOrders} pendientes` : undefined}
            deltaPositive={false}
          />
          <StatsCard
            label="Ingresos"
            value={stats ? fmt(stats.totalRevenue) : '$0'}
            icon="$"
          />
          <StatsCard
            label="Clientes"
            value={stats?.totalCustomers ?? 0}
            icon="C"
            delta={stats?.lowStockProducts ? `${stats.lowStockProducts} bajo stock` : 'Stock OK'}
            deltaPositive={!stats?.lowStockProducts}
          />
        </div>
      )}

      {/* Inventory alert */}
      {stats && (stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: 'var(--warn-pale)',
            border: '1px solid var(--warn-border)',
            borderLeft: '3px solid var(--warn)',
          }}
        >
          <AlertTriangle size={15} strokeWidth={2} style={{ color: 'var(--warn)', flexShrink: 0 }} />
          <span className="text-sm" style={{ color: 'var(--warn)', fontFamily: "'DM Sans', sans-serif" }}>
            <strong>Alerta de inventario:</strong>
            {stats.outOfStockProducts > 0 && ` ${stats.outOfStockProducts} producto(s) agotado(s)`}
            {stats.outOfStockProducts > 0 && stats.lowStockProducts > 0 && ' ·'}
            {stats.lowStockProducts > 0 && ` ${stats.lowStockProducts} con stock bajo (≤10 uds)`}
          </span>
        </div>
      )}

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="section-label">Órdenes recientes</p>
          <Link
            to="/orders"
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: 'var(--red)', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red-dark)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
          >
            Ver todas
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </div>

        {ordersLoading ? (
          <div className="shimmer h-48 rounded" style={{ border: '1px solid var(--border)' }} />
        ) : recentOrders.length === 0 ? (
          <div
            className="px-6 py-14 text-center"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
          >
            <p
              className="font-bold uppercase tracking-widest text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--faint)' }}
            >
              Sin órdenes aún
            </p>
          </div>
        ) : (
          <div
            className="overflow-hidden"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <table className="min-w-full">
              <thead>
                <tr>
                  {['# Orden', 'Cliente', 'Total', 'Estado', 'Fecha'].map((h) => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr
                    key={o.id}
                    className="transition-colors"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-row)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    <td className="td">
                      <span
                        className="font-black text-xs"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--red)', letterSpacing: '0.06em' }}
                      >
                        #{o.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="td">
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                          {o.customer?.name ?? '—'}
                        </p>
                        <p className="mono-tag" style={{ fontSize: '0.6rem' }}>{o.customer?.email ?? ''}</p>
                      </div>
                    </td>
                    <td className="td">
                      <span
                        className="font-semibold text-xs"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink)' }}
                      >
                        {o.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                      </span>
                    </td>
                    <td className="td"><StatusBadge status={o.status} /></td>
                    <td className="td mono-tag">
                      {new Date(o.createdAt).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;
