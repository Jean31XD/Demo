import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const IconLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="3"/>
    <path d="M7 8h10M7 12h10M7 16h6" stroke="#FAFAF9" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconPhone = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
  </svg>
);
const IconMail = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
  </svg>
);
const IconPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconWA = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const IconIG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const CATALOG_LINKS = [
  ['Herramientas manuales',   '/catalogo/herramientas-manuales'],
  ['Herramientas eléctricas', '/catalogo/herramientas-electricas'],
  ['Materiales construcción', '/catalogo/materiales-construccion'],
  ['Seguridad industrial',    '/catalogo/seguridad-industrial'],
  ['Plomería',                '/catalogo/plomeria'],
  ['Fijaciones',              '/catalogo/fijaciones-tornilleria'],
] as const;

const SCHEDULE = [
  ['Lun – Vie', '08:00–19:00'],
  ['Sábado',    '08:00–15:00'],
  ['Domingo',   'Cerrado'],
] as const;

const Footer: React.FC = memo(() => (
  <footer className="ftr">
    {/* SVG Wave separator */}
    <div className="ftr__wave">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" fill="#0D1B3E">
        <path d="M0,0 C300,55 900,55 1200,0 L1200,60 L0,60 Z" />
      </svg>
    </div>
    <div className="ftr__top">
      <div className="ftr__cols">

        {/* Brand */}
        <div className="ftr__brand">
          <Link to="/" className="ftr__logo">
            <IconLogo />
            <span>
              La Tremenda <span style={{ opacity: 0.5 }}>Ferretería & Hogar</span>
            </span>
          </Link>
          <p className="ftr__tagline">
            Todo en materiales, herramientas y construcción. Villa Hermosa, La Romana, RD.
          </p>
          <div className="ftr__social">
            <a
              href="https://wa.me/18098011234"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="ftr__social-btn"
              style={{ background: '#25D366', color: '#fff' }}
            >
              <IconWA />
            </a>
            <a
              href="https://instagram.com/latremendaferreterialr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="ftr__social-btn"
              style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff' }}
            >
              <IconIG />
            </a>
            <a
              href="mailto:ventas@latremendaferreteria.com"
              aria-label="Email"
              className="ftr__social-btn"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <IconMail />
            </a>
          </div>
        </div>

        {/* Catálogo */}
        <div>
          <p className="ftr__col-head">Catálogo</p>
          <div className="ftr__links">
            {CATALOG_LINKS.map(([label, href]) => (
              <Link key={href} to={href} className="ftr__link">{label}</Link>
            ))}
          </div>
        </div>

        {/* Horario */}
        <div>
          <p className="ftr__col-head">Horario</p>
          <div className="ftr__links">
            {SCHEDULE.map(([day, hours]) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span className="ftr__link" style={{ pointerEvents: 'none' }}>{day}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: hours === 'Cerrado' ? 'rgba(250,250,249,0.3)' : 'rgba(250,250,249,0.6)',
                  letterSpacing: '0.02em',
                }}>
                  {hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div>
          <p className="ftr__col-head">Contacto</p>
          <div className="ftr__links">
            {([
              [IconPhone, '(809) 801-1234'],
              [IconMail,  'ventas@latremendaferreteria.com'],
              [IconPin,   'Av. Prof. Juan Bosch, Villa Hermosa, LR'],
            ] as const).map(([Icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>
                  <Icon />
                </span>
                <span className="ftr__link" style={{ pointerEvents: 'none', whiteSpace: 'normal' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>

    {/* Bottom */}
    <div className="ftr__bottom">
      <p className="ftr__copy">
        © {new Date().getFullYear()} La Tremenda Ferretería & Hogar.
      </p>
      <div className="ftr__pays">
        {['Privacidad', 'Términos', 'Envíos', 'Garantías'].map((l) => (
          <a key={l} href="#" className="ftr__link">{l}</a>
        ))}
      </div>
    </div>
  </footer>
));

Footer.displayName = 'Footer';
export default Footer;
