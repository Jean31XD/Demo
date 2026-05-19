import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Icons ── */
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
  </svg>
);
const IconPackage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);
const IconTruck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
  </svg>
);

type Tab = 'orders' | 'wishlist' | 'profile';

const fmt = (n: number) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const MOCK_ORDERS = [
  {
    id: 'FI-2024-0042',
    date: '12 May 2024',
    status: 'Entregado',
    statusColor: 'var(--ok)',
    total: 4850,
    items: [
      { name: 'Taladro percutor DeWalt 20V', sku: 'DW-DCD778', qty: 1, price: 3200 },
      { name: 'Set de brocas HRC para concreto', sku: 'BRC-HRC-10',  qty: 2, price: 825 },
    ],
  },
  {
    id: 'FI-2024-0031',
    date: '28 Abr 2024',
    status: 'En tránsito',
    statusColor: 'var(--warn)',
    total: 1560,
    items: [
      { name: 'Casco de seguridad clase E', sku: 'SEG-HELM-E', qty: 2, price: 780 },
    ],
  },
  {
    id: 'FI-2024-0018',
    date: '5 Mar 2024',
    status: 'Entregado',
    statusColor: 'var(--ok)',
    total: 2100,
    items: [
      { name: 'Sierra circular 7-1/4" 1400W', sku: 'SC-714-1400', qty: 1, price: 2100 },
    ],
  },
];

const Account: React.FC = () => {
  const [tab, setTab] = useState<Tab>('orders');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  /* Mock user */
  const user = { name: 'Carlos Mendoza', email: 'c.mendoza@constructora.mx', since: 'Desde 2022' };

  const TABS: { key: Tab; label: string; icon: React.FC }[] = [
    { key: 'orders',   label: 'Mis pedidos', icon: IconPackage },
    { key: 'wishlist', label: 'Favoritos',   icon: IconHeart   },
    { key: 'profile',  label: 'Mi perfil',   icon: IconSettings },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', animation: 'slideUp .3s ease' }}>
      <nav className="crumbs" style={{ marginBottom: 24 }}>
        <Link to="/">Inicio</Link><span>/</span>
        <span style={{ color: 'var(--ink)' }}>Mi cuenta</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <aside style={{ position: 'sticky', top: 96 }}>
          {/* User card */}
          <div style={{
            padding: '20px', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', marginBottom: 8,
            background: 'var(--bg-card)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--ink)', color: 'var(--ink-on-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.01em',
            }}>
              {user.name.split(' ').map(w => w[0]).slice(0,2).join('')}
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{user.name}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{user.email}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', marginTop: 6, letterSpacing: '0.04em' }}>
              {user.since}
            </p>
          </div>

          {/* Nav */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 16px', fontSize: 13.5, textAlign: 'left',
                  background: tab === key ? 'var(--ink)' : 'var(--bg-card)',
                  color: tab === key ? 'var(--ink-on-dark)' : 'var(--ink-2)',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'background .15s, color .15s',
                  fontWeight: tab === key ? 500 : 400,
                }}
                onMouseEnter={(e) => { if (tab !== key) (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)'; }}
                onMouseLeave={(e) => { if (tab !== key) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
              >
                <Icon />{label}
              </button>
            ))}
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 16px', fontSize: 13.5, textAlign: 'left',
                background: 'var(--bg-card)', color: 'var(--ink-4)',
                cursor: 'pointer', transition: 'color .15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-4)'; }}
            >
              <IconLogOut /> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div>

          {/* ORDERS */}
          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 4 }}>
                Mis pedidos
              </h2>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden',
                }}>
                  {/* Order header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'var(--bg-soft)',
                    cursor: 'pointer', gap: 12,
                  }}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink)', fontWeight: 600, letterSpacing: '0.04em' }}>
                          {order.id}
                        </p>
                        <p style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>{order.date}</p>
                      </div>
                      <span style={{
                        padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 500,
                        background: `color-mix(in srgb, ${order.statusColor} 12%, transparent)`,
                        color: order.statusColor,
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: order.statusColor }} />
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                        {fmt(order.total)}
                      </span>
                      <span style={{
                        color: 'var(--ink-4)', transition: 'transform .2s',
                        transform: expandedOrder === order.id ? 'rotate(90deg)' : 'none',
                      }}>
                        <IconChevron />
                      </span>
                    </div>
                  </div>

                  {/* Order details */}
                  {expandedOrder === order.id && (
                    <div style={{ borderTop: '1px solid var(--border)' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 18px',
                          borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                          <div>
                            <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{item.name}</p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>
                              {item.sku} · ×{item.qty}
                            </p>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                            {fmt(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                      <div style={{
                        padding: '10px 18px', background: 'var(--bg-soft)',
                        display: 'flex', justifyContent: 'flex-end', gap: 10,
                      }}>
                        {order.status === 'En tránsito' && (
                          <button
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                          >
                            <IconTruck /> Rastrear envío
                          </button>
                        )}
                        <button className="btn btn--ghost btn--sm">
                          Reordenar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* WISHLIST */}
          {tab === 'wishlist' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 20 }}>
                Favoritos
              </h2>
              <div style={{
                padding: '60px 20px', textAlign: 'center', border: '1px dashed var(--border)',
                borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 10,
              }}>
                <span style={{ color: 'var(--border-strong)' }}><IconHeart /></span>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>Aún no tienes favoritos</p>
                <p style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>Guarda productos para verlos después</p>
                <Link to="/catalogo" className="btn btn--primary btn--sm" style={{ marginTop: 8 }}>
                  Explorar catálogo
                </Link>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 20 }}>
                Mi perfil
              </h2>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconUser /><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Información personal</p>
                </div>
                <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['Nombre',    user.name.split(' ')[0]],
                    ['Apellido',  user.name.split(' ')[1]],
                    ['Correo',    user.email],
                    ['Teléfono',  '55 1234 5678'],
                    ['RFC',       'MECC840312XY4'],
                    ['Empresa',   'Constructora Mendoza SA'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-3)' }}>{label}</label>
                      <div style={{
                        padding: '8px 12px', background: 'var(--bg-soft)',
                        border: '1px solid var(--border)', borderRadius: 'var(--r-xs)',
                        fontSize: 13, color: 'var(--ink)', letterSpacing: '-0.005em',
                      }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn--primary">Guardar cambios</button>
                </div>
              </div>

              {/* Password */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginTop: 16 }}>
                <div style={{ padding: '16px 24px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconSettings /><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Seguridad</p>
                </div>
                <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>Contraseña</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 3 }}>Última actualización hace 3 meses</p>
                  </div>
                  <button className="btn btn--ghost btn--sm">Cambiar contraseña</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Account;
