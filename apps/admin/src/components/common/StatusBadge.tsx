import React from 'react';
import type { OrderStatus } from '@/types';

const CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDING:   { label: 'Pendiente',  color: 'var(--warn)',   bg: 'var(--warn-pale)',   border: 'var(--warn-border)'   },
  CONFIRMED: { label: 'Confirmado', color: 'var(--blue)',   bg: 'var(--blue-pale)',   border: 'var(--blue-border)'   },
  SHIPPED:   { label: 'Enviado',    color: 'var(--purple)', bg: 'var(--purple-pale)', border: 'var(--purple-border)' },
  DELIVERED: { label: 'Entregado',  color: 'var(--ok)',     bg: 'var(--ok-pale)',     border: 'var(--ok-border)'     },
  CANCELLED: { label: 'Cancelado',  color: 'var(--fail)',   bg: 'var(--fail-pale)',   border: 'var(--fail-border)'   },
};

interface StatusBadgeProps { status: OrderStatus; }

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = CONFIG[status] ?? {
    label: status, color: 'var(--muted)', bg: 'var(--bg)', border: 'var(--border)',
  };
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
