/* global React, fmt, Icon, ProductArt, Stars, StockBadge, Tag, CATEGORIES, PRODUCTS */

const { useState: useStateA } = React;

// ============================================================
// ACCOUNT
// ============================================================
function Account({ onOpenProduct, onNav }) {
  const [tab, setTab] = useStateA('orders');
  const orders = [
    { id: 'FI-24891', date: '12 May 2026', status: 'En tránsito',  items: ['p001','p005','p008'], total: 4738, eta: 'Mañana antes de 12pm' },
    { id: 'FI-24732', date: '04 May 2026', status: 'Entregado',    items: ['p011','p012'],         total: 622,  eta: 'Entregado 06 May' },
    { id: 'FI-24501', date: '21 Abr 2026', status: 'Entregado',    items: ['p015','p016','p017'],  total: 557,  eta: 'Entregado 23 Abr' },
    { id: 'FI-24310', date: '08 Abr 2026', status: 'Entregado',    items: ['p002','p004'],         total: 4740, eta: 'Entregado 10 Abr' },
  ];
  const addresses = [
    { id: 'a1', label: 'Casa',  street: 'Av. Insurgentes Sur 1234, Int. 502', city: 'CDMX · Del Valle · 03100', default: true },
    { id: 'a2', label: 'Obra Polanco', street: 'Calle Lamartine 156', city: 'CDMX · Polanco · 11560' },
  ];

  return (
    <div className="page page--account">
      <div className="crumbs">
        <button onClick={()=>onNav('home')}>Inicio</button><Icon name="chevron" size={11}/>
        <span className="crumbs__here">Mi cuenta</span>
      </div>

      <div className="acc">
        {/* SIDEBAR */}
        <aside className="acc__side">
          <div className="acc__user">
            <div className="acc__avatar">JM</div>
            <div>
              <div className="acc__name">Javier Morales</div>
              <div className="mono mono--xs mono--dim">javier@constructora-vm.mx</div>
            </div>
          </div>
          <div className="acc__pro">
            <div className="mono mono--xs mono--dim">CUENTA PRO</div>
            <div className="acc__pro-val">Activa</div>
            <div className="mono mono--xs mono--dim">Crédito disponible: <strong>{fmt(38400)}</strong></div>
            <div className="acc__pro-bar"><div style={{width: '52%'}}/></div>
            <div className="mono mono--xs mono--dim">52% de tu línea de {fmt(80000)}</div>
          </div>
          <nav className="acc__nav">
            {[
              { id: 'orders',    label: 'Pedidos',         icon: 'package' },
              { id: 'tracking',  label: 'En camino',       icon: 'truck'   },
              { id: 'invoices',  label: 'Facturas',        icon: 'box'     },
              { id: 'addresses', label: 'Direcciones',     icon: 'pin'     },
              { id: 'pay',       label: 'Métodos de pago', icon: 'shield'  },
              { id: 'profile',   label: 'Perfil',          icon: 'user'    },
            ].map(t => (
              <button key={t.id} className={tab===t.id?'is-active':''} onClick={()=>setTab(t.id)}>
                <Icon name={t.icon} size={14}/> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="acc__main">
          {tab === 'orders' && (
            <>
              <div className="acc__head">
                <div>
                  <h1>Pedidos</h1>
                  <p className="mono mono--xs mono--dim">{orders.length} pedidos · {fmt(orders.reduce((s,o)=>s+o.total,0))} total este año</p>
                </div>
                <div className="acc__head-actions">
                  <div className="plp__search plp__search--sm">
                    <Icon name="search" size={13}/>
                    <input placeholder="Buscar pedido o producto…"/>
                  </div>
                  <div className="sort">
                    <span className="mono mono--xs mono--dim">FILTRAR</span>
                    <select><option>Todos</option><option>En tránsito</option><option>Entregados</option></select>
                    <Icon name="chevron-down" size={12}/>
                  </div>
                </div>
              </div>

              <div className="orders">
                {orders.map(o => (
                  <div className="order" key={o.id}>
                    <div className="order__head">
                      <div className="order__meta">
                        <div className="mono mono--xs mono--dim">PEDIDO</div>
                        <strong className="mono">{o.id}</strong>
                      </div>
                      <div className="order__meta">
                        <div className="mono mono--xs mono--dim">FECHA</div>
                        <strong>{o.date}</strong>
                      </div>
                      <div className="order__meta">
                        <div className="mono mono--xs mono--dim">TOTAL</div>
                        <strong>{fmt(o.total)}</strong>
                      </div>
                      <div className="order__meta">
                        <div className="mono mono--xs mono--dim">ESTADO</div>
                        <Tag kind={o.status === 'Entregado' ? 'ok' : 'live'}>
                          <span className={o.status === 'Entregado' ? 'dot dot--ok' : 'dot dot--live'}/>
                          {o.status}
                        </Tag>
                      </div>
                      <button className="link-cta">Detalle <Icon name="arrow" size={13}/></button>
                    </div>

                    {o.status === 'En tránsito' && (
                      <div className="order__track">
                        <div className="order__track-steps">
                          {['Confirmado', 'Empacado', 'En ruta', 'Entregado'].map((s, i) => (
                            <div key={s} className={`order__track-step ${i<=2?'is-done':''} ${i===2?'is-current':''}`}>
                              <span className="order__track-dot"/>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order__track-eta">
                          <Icon name="truck" size={14}/>
                          <span>Llega <strong>{o.eta}</strong></span>
                          <button className="link-cta link-cta--sm">Rastrear en vivo →</button>
                        </div>
                      </div>
                    )}

                    <div className="order__items">
                      {o.items.map(pid => {
                        const p = PRODUCTS.find(x => x.id === pid);
                        if (!p) return null;
                        return (
                          <button key={pid} className="order__item" onClick={()=>onOpenProduct(pid)}>
                            <div className="order__item-media"><ProductArt product={p} size="sm"/></div>
                            <div className="order__item-info">
                              <div className="mono mono--xs mono--dim">{p.brand} · {p.sku}</div>
                              <div className="order__item-name">{p.name}</div>
                            </div>
                            <div className="order__item-price">{fmt(p.price)}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="order__foot">
                      <button className="btn btn--ghost btn--sm">Volver a pedir</button>
                      <button className="btn btn--ghost btn--sm">Descargar factura</button>
                      {o.status === 'Entregado' && <button className="btn btn--ghost btn--sm">Reseñar productos</button>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'addresses' && (
            <>
              <div className="acc__head">
                <h1>Direcciones</h1>
                <button className="btn btn--primary btn--sm"><Icon name="plus" size={13}/> Nueva dirección</button>
              </div>
              <div className="addr-grid">
                {addresses.map(a => (
                  <div className="addr-card" key={a.id}>
                    <div className="addr-card__head">
                      <strong>{a.label}</strong>
                      {a.default && <Tag kind="accent">Predeterminada</Tag>}
                    </div>
                    <div>{a.street}</div>
                    <div className="mono mono--xs mono--dim">{a.city}</div>
                    <div className="addr-card__foot">
                      <button className="link-cta link-cta--sm">Editar</button>
                      {!a.default && <button className="link-cta link-cta--sm">Hacer predeterminada</button>}
                    </div>
                  </div>
                ))}
                <button className="addr-card addr-card--add">
                  <Icon name="plus" size={18}/>
                  <span>Agregar dirección</span>
                </button>
              </div>
            </>
          )}

          {tab === 'tracking' && (
            <>
              <div className="acc__head">
                <h1>En camino</h1>
                <p className="mono mono--xs mono--dim">1 pedido activo</p>
              </div>
              <div className="track-card">
                <div className="track-card__head">
                  <div>
                    <div className="mono mono--xs mono--dim">PEDIDO</div>
                    <strong className="mono">FI-24891</strong>
                  </div>
                  <Tag kind="live"><span className="dot dot--live"/> En tránsito</Tag>
                </div>
                <div className="track-card__map">
                  <div className="track-card__map-grid">
                    {Array.from({length: 120}).map((_,i)=><span key={i}/>)}
                  </div>
                  <div className="track-card__map-route"/>
                  <div className="track-card__pin track-card__pin--from">Almacén</div>
                  <div className="track-card__pin track-card__pin--truck"><Icon name="truck" size={14}/></div>
                  <div className="track-card__pin track-card__pin--to">Casa</div>
                </div>
                <div className="track-card__info">
                  <div><div className="mono mono--xs mono--dim">CHOFER</div><strong>Roberto · Camioneta #14</strong></div>
                  <div><div className="mono mono--xs mono--dim">DISTANCIA</div><strong>4.2 km</strong></div>
                  <div><div className="mono mono--xs mono--dim">ETA</div><strong>11:42 AM</strong></div>
                </div>
              </div>
            </>
          )}

          {(tab === 'invoices' || tab === 'pay' || tab === 'profile') && (
            <div className="acc__placeholder">
              <h1>{tab === 'invoices' ? 'Facturas' : tab === 'pay' ? 'Métodos de pago' : 'Perfil'}</h1>
              <div className="empty empty--inline">
                <Icon name={tab === 'pay' ? 'shield' : tab === 'profile' ? 'user' : 'box'} size={28}/>
                <p className="mono mono--xs mono--dim">Sección del prototipo · contenido placeholder</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ onNav }) {
  return (
    <footer className="ftr">
      <div className="ftr__top">
        <div className="ftr__brand">
          <div className="logo logo--lg">
            <Icon name="logo" size={26}/>
            <span className="logo__name">Ferretería <span className="logo__dim">Industrial</span></span>
          </div>
          <p className="ftr__tag">Herramientas, fijación, materiales y EPP para quien construye en serio. Desde 2003.</p>
          <div className="ftr__contact">
            <div><Icon name="phone" size={13}/> 800 123 4567</div>
            <div><Icon name="mail" size={13}/> hola@ferreteria-industrial.mx</div>
            <div><Icon name="pin" size={13}/> 6 sucursales · CDMX y EdoMex</div>
          </div>
        </div>
        <div className="ftr__cols">
          <div className="ftr__col">
            <div className="mono mono--xs mono--dim">CATÁLOGO</div>
            {CATEGORIES.map(c => <button key={c.id} onClick={()=>onNav('catalog', { category: c.id })}>{c.name}</button>)}
          </div>
          <div className="ftr__col">
            <div className="mono mono--xs mono--dim">PROFESIONALES</div>
            <button>Cuenta Pro</button>
            <button>Crédito empresa</button>
            <button>Cotizaciones</button>
            <button>Programa de obra</button>
            <button>Factura electrónica</button>
          </div>
          <div className="ftr__col">
            <div className="mono mono--xs mono--dim">AYUDA</div>
            <button>Envíos y devoluciones</button>
            <button>Garantías</button>
            <button>Centro de ayuda</button>
            <button>Soporte técnico</button>
            <button>Contacto</button>
          </div>
          <div className="ftr__col">
            <div className="mono mono--xs mono--dim">EMPRESA</div>
            <button>Sobre nosotros</button>
            <button>Sucursales</button>
            <button>Trabaja con nosotros</button>
            <button>Aviso de privacidad</button>
            <button>Términos</button>
          </div>
        </div>
      </div>
      <div className="ftr__bottom">
        <div className="mono mono--xs mono--dim">© 2026 FERRETERÍA INDUSTRIAL S.A. DE C.V. · RFC FIN030412-XYZ</div>
        <div className="ftr__pays">
          {['VISA','MASTERCARD','AMEX','OXXO','SPEI','PAYPAL'].map(p => <span key={p} className="mono mono--xs ftr__pay">{p}</span>)}
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Account, Footer });
