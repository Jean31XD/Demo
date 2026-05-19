import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cart.store';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '@/graphql/queries/order.queries';

/* ── Icons ── */
const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4 12 5 5L20 6"/>
  </svg>
);
const IconTruck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
  </svg>
);
const IconChevron = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

const fmt = (n: number) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ── Field component ── */
const Field: React.FC<{
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  half?: boolean;
}> = ({ label, name, type = 'text', placeholder, value, onChange, error, required, half }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: half ? 'span 1' : 'span 2' }}>
    <label htmlFor={name} style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>
      {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
    </label>
    <input
      id={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
      style={{ borderColor: error ? 'var(--danger)' : undefined }}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-err` : undefined}
    />
    {error && (
      <p id={`${name}-err`} style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</p>
    )}
  </div>
);

type Step = 'shipping' | 'payment' | 'done';

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; colony: string; city: string; state: string; zip: string;
  card: string; expiry: string; cvv: string; cardName: string;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', colony: '', city: '', state: '', zip: '',
  card: '', expiry: '', cvv: '', cardName: '',
};

const Checkout: React.FC = () => {
  const { items, total, count, clearCart } = useCartStore();
  const [placeOrderMutation] = useMutation(PLACE_ORDER);
  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const cartTotal  = total();
  const itemCount  = count();
  const shipping   = cartTotal >= 2000 ? 0 : 150;
  const grandTotal = cartTotal + shipping;

  /* Redirect if empty cart */
  if (items.length === 0 && step !== 'done') {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', animation: 'slideUp .3s ease' }}>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>Tu carrito está vacío</p>
        <Link to="/catalogo" className="btn btn--primary" style={{ marginTop: 12 }}>Ir al catálogo</Link>
      </div>
    );
  }

  const set = (k: keyof FormData) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateShipping = () => {
    const e: Partial<FormData> = {};
    if (!form.firstName.trim()) e.firstName = 'Requerido';
    if (!form.lastName.trim())  e.lastName  = 'Requerido';
    if (!form.email.includes('@')) e.email   = 'Email inválido';
    if (!form.phone.trim())     e.phone      = 'Requerido';
    if (!form.address.trim())   e.address    = 'Requerido';
    if (!form.city.trim())      e.city       = 'Requerido';
    if (!form.state.trim())     e.state      = 'Requerido';
    if (form.zip.length < 5)    e.zip        = 'CP inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Partial<FormData> = {};
    const clean = form.card.replace(/\s/g, '');
    if (clean.length < 16)      e.card     = 'Número inválido';
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Formato MM/AA';
    if (form.cvv.length < 3)    e.cvv      = 'CVV inválido';
    if (!form.cardName.trim())  e.cardName = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleShippingNext = () => {
    if (validateShipping()) { setErrors({}); setStep('payment'); window.scrollTo(0, 0); }
  };

  const handlePaymentSubmit = async () => {
    if (!validatePayment()) return;
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const shippingAddressStr = `${form.address}, Col. ${form.colony || ''}, ${form.city}, ${form.state}. CP ${form.zip}`;

      await placeOrderMutation({
        variables: {
          input: {
            items: orderItems,
            shippingAddr: shippingAddressStr,
            notes: `Contacto: ${form.firstName} ${form.lastName}, Tel: ${form.phone}`,
          },
        },
      });

      clearCart();
      setStep('done');
    } catch (e: any) {
      console.error('Failed to submit order:', e);
      alert(e.message || 'Error al procesar la orden. Por favor intente de nuevo.');
    } finally {
      setSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  /* Format card number with spaces */
  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  /* Format expiry */
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  /* ── Done screen ── */
  if (step === 'done') return (
    <div style={{
      maxWidth: 560, margin: '60px auto', textAlign: 'center',
      animation: 'slideUp .3s ease', padding: '0 20px',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'color-mix(in srgb, var(--ok) 12%, transparent)',
        border: '2px solid var(--ok)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', color: 'var(--ok)',
      }}>
        <IconCheck />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 10 }}>
        ¡Pedido confirmado!
      </h1>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: 8 }}>
        Hemos recibido tu pedido. Recibirás un correo de confirmación en <strong style={{ color: 'var(--ink)' }}>{form.email}</strong> con los detalles y número de seguimiento.
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-4)', marginBottom: 32 }}>
        Tiempo de entrega estimado: 24–48 hrs en CDMX
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn--ghost">Volver al inicio</Link>
        <Link to="/catalogo" className="btn btn--primary">Seguir comprando</Link>
      </div>
    </div>
  );

  /* ── Step indicators ── */
  const steps = [
    { key: 'shipping', label: 'Envío' },
    { key: 'payment',  label: 'Pago'  },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', animation: 'slideUp .3s ease' }}>
      {/* Breadcrumb */}
      <nav className="crumbs" style={{ marginBottom: 24 }}>
        <Link to="/">Inicio</Link><span>/</span>
        <Link to="/carrito">Carrito</Link><span>/</span>
        <span style={{ color: 'var(--ink)' }}>Checkout</span>
      </nav>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36, maxWidth: 360 }}>
        {steps.map((s, i) => {
          const active = s.key === step;
          const done = (step === 'payment' && s.key === 'shipping');
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--ok)' : active ? 'var(--ink)' : 'var(--bg-soft)',
                  border: `1.5px solid ${done ? 'var(--ok)' : active ? 'var(--ink)' : 'var(--border)'}`,
                  color: done || active ? '#fff' : 'var(--ink-4)',
                  fontSize: 11, fontWeight: 600, flexShrink: 0,
                  transition: 'all .3s',
                }}>
                  {done ? <IconCheck /> : i + 1}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? 'var(--ink)' : done ? 'var(--ink-2)' : 'var(--ink-4)',
                }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 1.5, background: done ? 'var(--ok)' : 'var(--border)',
                  margin: '0 12px', alignSelf: 'center', transition: 'background .3s',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

        {/* ── Form panel ── */}
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden',
        }}>
          {/* Shipping form */}
          {step === 'shipping' && (
            <div>
              <div style={{
                padding: '16px 24px', background: 'var(--bg-soft)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <IconTruck />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Información de envío</p>
              </div>
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Nombre"   name="firstName" value={form.firstName} onChange={set('firstName')} error={errors.firstName} required half />
                <Field label="Apellido" name="lastName"  value={form.lastName}  onChange={set('lastName')}  error={errors.lastName}  required half />
                <Field label="Correo electrónico" name="email" type="email" placeholder="tu@correo.com" value={form.email} onChange={set('email')} error={errors.email} required />
                <Field label="Teléfono" name="phone" type="tel" placeholder="55 1234 5678" value={form.phone} onChange={set('phone')} error={errors.phone} required />
                <Field label="Calle y número" name="address" placeholder="Av. Insurgentes Sur 1234" value={form.address} onChange={set('address')} error={errors.address} required />
                <Field label="Colonia" name="colony" placeholder="Del Valle" value={form.colony} onChange={set('colony')} error={errors.colony} half />
                <Field label="Código postal" name="zip" type="text" placeholder="06100" value={form.zip} onChange={(v) => set('zip')(v.replace(/\D/g,'').slice(0,5))} error={errors.zip} required half />
                <Field label="Ciudad / Alcaldía" name="city" value={form.city} onChange={set('city')} error={errors.city} required half />
                <Field label="Estado" name="state" value={form.state} onChange={set('state')} error={errors.state} required half />
              </div>
              <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleShippingNext} className="btn btn--primary btn--lg" style={{ gap: 8 }}>
                  Continuar al pago <IconChevron />
                </button>
              </div>
            </div>
          )}

          {/* Payment form */}
          {step === 'payment' && (
            <div>
              <div style={{
                padding: '16px 24px', background: 'var(--bg-soft)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <IconLock />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Información de pago</p>
                <span style={{
                  marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <IconLock /> SSL seguro
                </span>
              </div>

              {/* Shipping summary */}
              <div style={{
                margin: '16px 24px', padding: '12px 14px',
                background: 'var(--bg-soft)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', fontSize: 12.5, color: 'var(--ink-2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>
                    {form.firstName} {form.lastName}
                  </p>
                  <p>{form.address}{form.colony ? `, ${form.colony}` : ''}</p>
                  <p>{form.city}, {form.state} {form.zip}</p>
                </div>
                <button
                  onClick={() => { setErrors({}); setStep('shipping'); }}
                  style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                >
                  Editar
                </button>
              </div>

              <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Field
                    label="Número de tarjeta" name="card"
                    placeholder="1234 5678 9012 3456"
                    value={form.card}
                    onChange={(v) => set('card')(formatCard(v))}
                    error={errors.card} required
                  />
                </div>
                <Field label="Vencimiento" name="expiry" placeholder="MM/AA" value={form.expiry} onChange={(v) => set('expiry')(formatExpiry(v))} error={errors.expiry} required half />
                <Field label="CVV" name="cvv" placeholder="123" value={form.cvv} onChange={(v) => set('cvv')(v.replace(/\D/g,'').slice(0,4))} error={errors.cvv} required half />
                <div style={{ gridColumn: 'span 2' }}>
                  <Field label="Nombre en tarjeta" name="cardName" placeholder="Como aparece en tu tarjeta" value={form.cardName} onChange={set('cardName')} error={errors.cardName} required />
                </div>
              </div>

              <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => { setErrors({}); setStep('shipping'); }}
                  className="btn btn--ghost"
                >
                  ← Volver
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={submitting}
                  className="btn btn--primary btn--lg"
                  style={{ gap: 8, minWidth: 180, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="shimmer" style={{ width: 14, height: 14, borderRadius: '50%' }} />
                      Procesando...
                    </span>
                  ) : (
                    <><IconLock /> Pagar {fmt(grandTotal)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order summary ── */}
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
          overflow: 'hidden', position: 'sticky', top: 96,
        }}>
          <div style={{ padding: '14px 20px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
              Resumen ({itemCount} artículos)
            </p>
          </div>

          {/* Items */}
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={item.productId} style={{
                display: 'flex', gap: 10, padding: '10px 16px',
                borderBottom: '1px solid var(--border)', alignItems: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0,
                  background: 'var(--bg-soft)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xs)', overflow: 'hidden', position: 'relative',
                }}>
                  <img src={item.image.url} alt={item.image.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'var(--ink)', color: '#fff',
                    fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                  }}>
                    {item.quantity}
                  </span>
                </div>
                <p style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.35 }}>
                  {item.name}
                </p>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>
                  {fmt(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
              <span>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{fmt(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
              <span>Envío</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: shipping === 0 ? 'var(--ok)' : 'inherit',
                fontWeight: shipping === 0 ? 600 : 400,
              }}>
                {shipping === 0 ? 'GRATIS' : fmt(shipping)}
              </span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              paddingTop: 10, marginTop: 2, borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                {fmt(grandTotal)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
