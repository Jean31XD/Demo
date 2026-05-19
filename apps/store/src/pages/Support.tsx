import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
  </svg>
);
const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-4)', flexShrink: 0 }}>
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IconWA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CHANNELS = [
  { icon: IconPhone, label: 'Teléfono',       sub: '800 123 4567',            meta: 'Lun-Vie 8–19h · Sáb 8–15h', color: 'var(--accent-2)', href: 'tel:8001234567' },
  { icon: IconWA,    label: 'WhatsApp',        sub: '55 1234 5678',            meta: 'Respuesta en minutos',        color: '#25D366',         href: 'https://wa.me/5215512345678' },
  { icon: IconChat,  label: 'Chat técnico',    sub: 'En línea ahora',          meta: '🟢 4 agentes disponibles',    color: 'var(--ok)',       href: '#chat' },
  { icon: IconMail,  label: 'Email',           sub: 'ventas@ferreteriai.com',  meta: 'Respuesta en < 4 horas',     color: 'var(--accent)',   href: 'mailto:ventas@ferreteriai.com' },
];

const TOPICS = [
  { label: 'Pedidos y entregas',          count: 14, desc: 'Consulta el estado y ubicación de tu envío en tiempo real.' },
  { label: 'Devoluciones y garantías',    count:  9, desc: 'Proceso sencillo, sin trámites engorrosos. Respuesta en 24h.' },
  { label: 'Facturación electrónica',     count:  7, desc: 'Emisión inmediata de CFDI con tus datos fiscales.' },
  { label: 'Cuenta Pro y crédito',        count: 12, desc: 'Financiamiento a 30/60 días para constructoras verificadas.' },
  { label: 'Especificaciones técnicas',   count: 18, desc: 'Nuestros ingenieros resuelven dudas de compatibilidad y aplicación.' },
  { label: 'Métodos de pago',             count:  6, desc: 'Tarjeta, transferencia, crédito empresarial y más.' },
];

const FAQS = [
  { q: '¿Cuánto tarda el envío?',                        a: 'En CDMX y zona metropolitana 24-48 hrs. Interior de la república 3-5 días hábiles. Envío gratis en pedidos mayores a $2,000 MXN.' },
  { q: '¿Puedo comprar sin registrarme?',                 a: 'Sí, aceptamos compras como invitado. Solo necesitas tu correo y dirección de entrega.' },
  { q: '¿Qué garantía tienen los productos?',             a: 'Todos nuestros productos tienen garantía directa de fabricante por 12 meses. En caso de falla la reposición es sin costo.' },
  { q: '¿Tienen sucursales físicas?',                    a: 'Tenemos 6 sucursales en CDMX. Horario Lun-Vie 7:00-19:00, Sáb 8:00-15:00.' },
  { q: '¿Aceptan pedidos por WhatsApp?',                 a: 'Sí, puedes cotizar y hacer pedidos por WhatsApp al 55 1234 5678. Un asesor te confirma la disponibilidad.' },
  { q: '¿Emiten facturas CFDI?',                         a: 'Sí, con todos tus datos fiscales. Emisión el mismo día de tu compra.' },
];

const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'slideUp .3s ease' }}>
      <nav className="crumbs" style={{ marginBottom: 24 }}>
        <Link to="/">Inicio</Link><span>/</span>
        <span style={{ color: 'var(--ink)' }}>Soporte</span>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 40, padding: '20px 0 32px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          <span className="eyebrow__dot" /> SOPORTE EN LÍNEA
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 10 }}>
          ¿En qué te podemos<br/>ayudar hoy?
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>
          Tiempo de respuesta promedio: <strong style={{ color: 'var(--ink-2)' }}>4 minutos</strong> · Resolución en primer contacto: <strong style={{ color: 'var(--ink-2)' }}>92%</strong>
        </p>
        {/* Search bar */}
        <div style={{ display: 'flex', gap: 8, maxWidth: 560 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 14px', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', background: 'var(--bg-card)',
          }}>
            <IconSearch />
            <input
              placeholder="Escribe tu pregunta o número de pedido…"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13.5, color: 'var(--ink)', outline: 'none', padding: '11px 0' }}
            />
          </div>
          <button className="btn btn--primary" style={{ flexShrink: 0 }}>Buscar</button>
        </div>
      </div>

      {/* Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 48 }}>
        {CHANNELS.map(({ icon: Icon, label, sub, meta, color, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{
              display: 'flex', flexDirection: 'column', gap: 12,
              padding: '20px', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', background: 'var(--bg-card)',
              textDecoration: 'none', transition: 'border-color .15s, box-shadow .15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = color;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px -4px ${color}30`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--r-sm)',
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color,
            }}>
              <Icon />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: 13, color, fontWeight: 500, marginBottom: 3 }}>{sub}</p>
              <p style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{meta}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Topics + Sucursales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
        {/* Topics */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)', marginBottom: 16 }}>
            ¿En qué podemos ayudarte?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOPICS.map(({ label, count, desc }) => (
              <div key={label} style={{
                padding: '14px 16px', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', background: 'var(--bg-card)',
                cursor: 'pointer', transition: 'border-color .15s, background .15s',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-4)' }}>{count}</span>
                    <IconChevron />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.45 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sucursales + Schedule */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)', marginBottom: 16 }}>
            Visítanos
          </h2>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: 16 }}>
            {[
              ['Polanco',          'Av. Presidente Masaryk 45, CDMX'],
              ['Insurgentes Sur',  'Insurgentes Sur 1234, Col. Del Valle'],
              ['Tlalnepantla',     'Blvd. Manuel Ávila Camacho 88, EdoMex'],
              ['Naucalpan',        'Periférico Norte 500, Naucalpan'],
              ['Santa Fe',         'Vasco de Quiroga 3900, Santa Fe'],
              ['Satélite',         'Circuito Médicos 12, Ciudad Satélite'],
            ].map(([name, addr], i) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '12px 16px',
                borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}><IconPin /></span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{name}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{addr}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--bg-soft)' }}>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>Horario de atención</p>
            {[['Lun – Vie', '7:00 – 19:00'], ['Sábado', '8:00 – 15:00'], ['Domingo', 'Cerrado']].map(([day, hrs]) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{day}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: hrs === 'Cerrado' ? 'var(--ink-4)' : 'var(--ink)' }}>{hrs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)', marginBottom: 16 }}>
          Preguntas frecuentes
        </h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 12, padding: '14px 20px',
                  background: openFaq === i ? 'var(--bg-soft)' : 'var(--bg-card)',
                  textAlign: 'left', transition: 'background .15s',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{q}</span>
                <span style={{
                  color: 'var(--ink-4)', flexShrink: 0,
                  transform: openFaq === i ? 'rotate(90deg)' : 'none',
                  transition: 'transform .2s',
                }}>
                  <IconChevron />
                </span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.65, background: 'var(--bg-soft)' }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{
        background: 'var(--bg-deep)', borderRadius: 'var(--r-md)',
        padding: '36px 40px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 40,
      }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.015em', marginBottom: 6 }}>
            ¿No encontraste lo que buscas?
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>
            Un asesor técnico responde en menos de 10 minutos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="https://wa.me/5215512345678" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" style={{ color: '#25D366', borderColor: '#25D366' }}>
            WhatsApp
          </a>
          <a href="tel:8001234567" className="btn btn--primary">
            Llamar ahora <IconArrow />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Support;
