/* global React, fmt, Icon, ProductArt, Stars, CATEGORIES, BRANDS, PRODUCTS */

const { useState: useStateB } = React;

// ============================================================
// BRANDS PAGE
// ============================================================
function BrandsPage({ onNav, onOpenProduct }) {
  // Hand-curated metadata per brand
  const brandMeta = {
    KRAFT:    { tag: 'Herramientas eléctricas',    origin: 'Alemania',         since: 1947, pro: true,  blurb: 'Precisión alemana en sierras y herramientas de corte. Estándar industrial.' },
    VOLTRA:   { tag: 'Inalámbricas profesionales',  origin: 'Japón',            since: 1962, pro: true,  blurb: 'Plataforma de batería de 18V/40V con más de 60 herramientas compatibles.' },
    IRONHAUS: { tag: 'Rotomartillos & demolición',  origin: 'EE.UU.',           since: 1924, pro: true,  blurb: 'Especialistas en herramientas para obra pesada y demolición.' },
    STRIKE:   { tag: 'Herramientas manuales',       origin: 'México',           since: 1985, pro: false, blurb: 'Martillos y destornilladores forjados en monterrey. Calidad nacional.' },
    PROFORGE: { tag: 'Llaves & juegos profesionales',origin: 'Taiwán',          since: 1972, pro: true,  blurb: 'Cromo-vanadio para uso diario en taller, certificación DIN.' },
    ARMOR:    { tag: 'Equipo de protección',        origin: 'EE.UU.',           since: 1968, pro: false, blurb: 'EPP certificado ANSI/CE para industria pesada y construcción.' },
    NORDE:    { tag: 'Tubería & fijación',          origin: 'México',           since: 1994, pro: false, blurb: 'PVC sanitario e hidráulico, conexiones y fijadores a granel.' },
    AXIS:     { tag: 'Anclajes & válvulas',         origin: 'Italia',           since: 1958, pro: true,  blurb: 'Anclas químicas, válvulas de latón y conexiones de alta presión.' },
  };

  const [active, setActive] = useStateB(null);

  return (
    <div className="page page--brands">
      <div className="crumbs">
        <button onClick={()=>onNav('home')}>Inicio</button><Icon name="chevron" size={11}/>
        <span className="crumbs__here">Marcas</span>
      </div>

      <div className="brands__head">
        <div>
          <div className="eyebrow">DIRECTORIO · 42 MARCAS</div>
          <h1 className="brands__title">Las marcas que respaldan tu obra</h1>
          <p className="brands__lead">Trabajamos solo con marcas verificadas, con garantía directa de fabricante y soporte técnico en español. Filtra por especialidad o origen.</p>
        </div>
        <div className="brands__stats">
          <div><span className="mono mono--xs mono--dim">MARCAS</span><strong>42</strong></div>
          <div><span className="mono mono--xs mono--dim">PAÍSES</span><strong>14</strong></div>
          <div><span className="mono mono--xs mono--dim">SKUs</span><strong>1,803</strong></div>
          <div><span className="mono mono--xs mono--dim">CERTIFICADAS</span><strong>100%</strong></div>
        </div>
      </div>

      <div className="brands__grid">
        {BRANDS.map(b => {
          const meta = brandMeta[b];
          const products = PRODUCTS.filter(p => p.brand === b);
          const minPrice = products.length ? Math.min(...products.map(p => p.price)) : 0;
          return (
            <div key={b} className={`brand-card ${active===b?'is-open':''}`}>
              <div className="brand-card__head">
                <div className="brand-card__logo">{b}</div>
                <div className="brand-card__meta">
                  <div className="mono mono--xs mono--dim">{meta.tag.toUpperCase()}</div>
                  <h3>{b}</h3>
                  <div className="brand-card__chips">
                    <span className="mono mono--xs"><Icon name="pin" size={10}/> {meta.origin}</span>
                    <span className="mono mono--xs mono--dim">·</span>
                    <span className="mono mono--xs">Desde {meta.since}</span>
                    {meta.pro && <span className="tag tag--accent">PRO</span>}
                  </div>
                </div>
              </div>
              <p className="brand-card__blurb">{meta.blurb}</p>
              <div className="brand-card__foot">
                <div className="brand-card__price">
                  <span className="mono mono--xs mono--dim">{products.length} producto{products.length!==1?'s':''}</span>
                  {minPrice > 0 && <span className="mono mono--xs">desde {fmt(minPrice)}</span>}
                </div>
                <button className="link-cta" onClick={()=>onNav('catalog', { brand: b })}>
                  Ver catálogo <Icon name="arrow" size={13}/>
                </button>
              </div>
              {products.length > 0 && (
                <div className="brand-card__products">
                  {products.slice(0, 4).map(p => (
                    <button key={p.id} className="brand-card__product" onClick={()=>onOpenProduct(p.id)}>
                      <div className="brand-card__product-media">
                        {p.img && <img src={p.img} alt={p.name} loading="lazy"/>}
                      </div>
                      <div className="brand-card__product-info">
                        <div className="mono mono--xs mono--dim">{p.sku}</div>
                        <div className="brand-card__product-name">{p.name}</div>
                        <div className="brand-card__product-price">{fmt(p.price)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="brands__cta">
        <div>
          <h2>¿Buscas una marca específica?</h2>
          <p>Tenemos 34 marcas adicionales en bodega. Pídela en cotización y la conseguimos.</p>
        </div>
        <button className="btn btn--primary">Solicitar cotización <Icon name="arrow" size={15}/></button>
      </div>
    </div>
  );
}

// ============================================================
// SUPPORT PAGE
// ============================================================
function SupportPage({ onNav }) {
  const [tab, setTab] = useStateB('contact');
  const [topicOpen, setTopicOpen] = useStateB(null);

  const channels = [
    { icon: 'phone', title: 'Teléfono', value: '800 123 4567', hours: 'Lun-Sáb · 8:00 — 19:00', live: true },
    { icon: 'mail',  title: 'Correo',   value: 'hola@ferreteria-industrial.mx', hours: 'Respuesta en < 2 hrs hábiles' },
    { icon: 'box',   title: 'Chat técnico', value: 'Ingenieros en línea', hours: 'Lun-Vie · 9:00 — 18:00', live: true },
    { icon: 'pin',   title: 'Sucursal', value: '6 sucursales · CDMX y EdoMex', hours: 'Recoge en 2 horas' },
  ];

  const topics = [
    { id: 'orders',   title: 'Pedidos y entregas', count: 14 },
    { id: 'returns',  title: 'Devoluciones y garantías', count: 9 },
    { id: 'invoice',  title: 'Facturación electrónica', count: 7 },
    { id: 'pro',      title: 'Cuenta Pro y crédito', count: 12 },
    { id: 'tech',     title: 'Especificaciones técnicas', count: 18 },
    { id: 'pay',      title: 'Métodos de pago', count: 6 },
  ];

  const faqs = [
    { q: '¿Cuál es el costo de envío?', a: 'Envío gratis en pedidos mayores a $2,000 MXN. Pedidos menores: $99 fijo. Envío exprés (mismo día CDMX) $149.' },
    { q: '¿Cuándo recibo mi pedido?', a: 'CDMX y área metropolitana: 24-48 hrs. Interior: 3-5 días hábiles. Pedidos antes de 14:00 con pago confirmado salen el mismo día.' },
    { q: '¿Cómo solicito factura?', a: 'Al momento de checkout puedes pedir factura ingresando tu RFC y datos fiscales. Llega automática por correo en menos de 24 hrs.' },
    { q: '¿Qué garantía tienen los productos?', a: 'Todos nuestros productos tienen garantía directa de fabricante. Reposición sin trámites largos en 12 meses (varía por producto).' },
    { q: '¿Puedo devolver un producto?', a: 'Sí. Tienes 30 días para devolución completa siempre que el producto esté en condiciones originales y empaque sellado.' },
    { q: '¿Cómo aplico para cuenta Pro?', a: 'Solicita en línea con RFC + comprobante de domicilio fiscal + 3 referencias comerciales. Aprobación en 48 hrs hábiles.' },
  ];

  return (
    <div className="page page--support">
      <div className="crumbs">
        <button onClick={()=>onNav('home')}>Inicio</button><Icon name="chevron" size={11}/>
        <span className="crumbs__here">Soporte</span>
      </div>

      <div className="support__hero">
        <div>
          <div className="eyebrow"><span className="eyebrow__dot"/> SOPORTE EN LÍNEA · 11:42 AM</div>
          <h1 className="support__title">¿En qué te podemos<br/>ayudar hoy?</h1>
          <p className="support__lead">Tiempo de respuesta promedio: <strong>4 minutos</strong> · Resolución en primer contacto: <strong>92%</strong></p>
        </div>
        <div className="support__search">
          <Icon name="search" size={16}/>
          <input placeholder="Escribe tu pregunta o un número de pedido…"/>
          <button className="btn btn--primary btn--sm">Buscar</button>
        </div>
      </div>

      <div className="support__channels">
        {channels.map(c => (
          <div key={c.title} className="support__channel">
            <Icon name={c.icon} size={22}/>
            <div className="support__channel-body">
              <div className="support__channel-head">
                <strong>{c.title}</strong>
                {c.live && <span className="tag tag--ok"><span className="dot dot--ok"/> En vivo</span>}
              </div>
              <div className="support__channel-val">{c.value}</div>
              <div className="mono mono--xs mono--dim">{c.hours}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="support__layout">
        <aside className="support__topics">
          <div className="mono mono--xs mono--dim" style={{padding:'0 0 12px'}}>TEMAS</div>
          {topics.map(t => (
            <button key={t.id} className={`filter-row ${topicOpen===t.id?'is-active':''}`} onClick={()=>setTopicOpen(t.id)}>
              <span>{t.title}</span>
              <span className="mono mono--xs mono--dim">{t.count}</span>
            </button>
          ))}
        </aside>
        <section className="support__main">
          <div className="support__main-head">
            <h2>Preguntas frecuentes</h2>
            <span className="mono mono--xs mono--dim">{faqs.length} preguntas · actualizadas hoy</span>
          </div>
          <div className="qa">
            {faqs.map((f, i) => (
              <details key={i} className="qa__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="support__contact-cta">
            <div>
              <h3>¿No encontraste tu respuesta?</h3>
              <p>Nuestro equipo técnico responde por chat o teléfono.</p>
            </div>
            <div className="support__contact-actions">
              <button className="btn btn--ghost">Abrir ticket</button>
              <button className="btn btn--primary">Iniciar chat <Icon name="arrow" size={14}/></button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { BrandsPage, SupportPage });
