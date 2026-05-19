// Catálogo Ferretería Industrial — datos del prototipo
const U = (id) => `https://images.unsplash.com/photo-${id}?fm=jpg&q=70&w=900&auto=format&fit=crop`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=900`;

window.CATEGORIES = [
  { id: 'electric',  name: 'Eléctricas',       short: 'Eléctricas',   count: 142, icon: 'drill',   blurb: 'Taladros, sierras, rotomartillos. Batería e inalámbricas.',
    img: U('1567507145544-da3fe1b4f8f9') },
  { id: 'manual',    name: 'Manuales',         short: 'Manuales',     count: 318, icon: 'hammer',  blurb: 'Martillos, llaves, destornilladores, escuadras.',
    img: U('1426927308491-6380b6a9936f') },
  { id: 'fasteners', name: 'Fijación',         short: 'Fijación',     count: 904, icon: 'screw',   blurb: 'Tornillos, anclas, tarugos, abrazaderas a granel.',
    img: P(5691641) },
  { id: 'materials', name: 'Construcción',     short: 'Construcción', count: 256, icon: 'brick',   blurb: 'Cemento, agregados, perfiles, láminas.',
    img: U('1531834685032-c34bf0d84c77') },
  { id: 'plumbing',  name: 'Plomería',         short: 'Plomería',     count: 187, icon: 'pipe',    blurb: 'Tuberías PVC/CPVC, conexiones, válvulas, llaves.',
    img: P(6444256) },
  { id: 'safety',    name: 'Seguridad',        short: 'Seguridad',    count: 96,  icon: 'helmet',  blurb: 'EPP, cascos, guantes, gafas, arneses.',
    img: P(1216589) },
];

window.HERO_IMG  = U('1632095710940-ad578e8cbe6b');

window.BRANDS = ['KRAFT', 'VOLTRA', 'IRONHAUS', 'STRIKE', 'PROFORGE', 'ARMOR', 'NORDE', 'AXIS'];

window.PRODUCTS = [
  // ── ELÉCTRICAS ──────────────────────────────────────────────────────
  { id: 'p001', sku: 'EL-DRL-018', name: 'Taladro percutor inalámbrico 18V', brand: 'VOLTRA', category: 'electric', price: 4290, was: 4990, rating: 4.8, reviews: 217, stock: 24, badge: 'Más vendido',
    specs: { 'Voltaje': '18 V', 'Torque': '65 Nm', 'Velocidad': '0-2000 rpm', 'Batería': '4.0 Ah Li-ion', 'Peso': '1.6 kg' }, color: 'amber',
    img: U('1504148455328-c376907d081c') },     // red drill
  { id: 'p002', sku: 'EL-SAW-072', name: 'Sierra circular 7-1/4" 1800W', brand: 'KRAFT', category: 'electric', price: 3450, rating: 4.7, reviews: 138, stock: 11,
    specs: { 'Potencia': '1800 W', 'Disco': '184 mm', 'Profundidad': '65 mm', 'RPM': '5500' }, color: 'sky',
    img: P(1216544) },                          // angle grinder with sparks (closest power tool action shot)
  { id: 'p003', sku: 'EL-ROT-220', name: 'Rotomartillo SDS-Plus 800W', brand: 'IRONHAUS', category: 'electric', price: 2890, was: 3290, rating: 4.6, reviews: 92, stock: 7, badge: 'Oferta',
    specs: { 'Potencia': '800 W', 'Impacto': '2.8 J', 'Mandril': 'SDS-Plus', 'Peso': '2.9 kg' }, color: 'amber',
    img: P(1249611) },                          // person drilling masonry with gloves
  { id: 'p004', sku: 'EL-AMP-450', name: 'Amoladora angular 4-1/2"', brand: 'VOLTRA', category: 'electric', price: 1290, rating: 4.5, reviews: 304, stock: 56,
    specs: { 'Potencia': '900 W', 'Disco': '115 mm', 'RPM': '11000', 'Peso': '2.1 kg' }, color: 'red',
    img: U('1632095710940-ad578e8cbe6b') },     // yellow power tool held (DeWalt-style)

  // ── MANUALES ────────────────────────────────────────────────────────
  { id: 'p005', sku: 'HM-HMR-016', name: 'Martillo de uña 16 oz mango fibra', brand: 'STRIKE', category: 'manual', price: 289, rating: 4.9, reviews: 612, stock: 88,
    specs: { 'Peso cabeza': '16 oz', 'Material': 'Acero forjado', 'Mango': 'Fibra de vidrio', 'Longitud': '330 mm' }, color: 'graphite',
    img: P(209235) },                           // hammer with nails ✓
  { id: 'p006', sku: 'HM-WRN-SET', name: 'Juego llaves combinadas 14 piezas', brand: 'PROFORGE', category: 'manual', price: 1190, was: 1490, rating: 4.8, reviews: 188, stock: 32, badge: 'Oferta',
    specs: { 'Piezas': '14', 'Rango': '8-24 mm', 'Acabado': 'Cromo vanadio', 'Estuche': 'Incluido' }, color: 'graphite',
    img: P(220639) },                           // wrenches on white ✓
  { id: 'p007', sku: 'HM-SCR-008', name: 'Set destornilladores 8 piezas magnético', brand: 'STRIKE', category: 'manual', price: 549, rating: 4.7, reviews: 421, stock: 64,
    specs: { 'Piezas': '8', 'Tipos': '4 Phillips + 4 Planos', 'Punta': 'S2 magnética', 'Mango': 'TPR antideslizante' }, color: 'red',
    img: P(175039) },                           // pile of hand tools incl screwdrivers ✓
  { id: 'p008', sku: 'HM-MSR-005', name: 'Cinta métrica 5m reforzada', brand: 'KRAFT', category: 'manual', price: 159, rating: 4.6, reviews: 933, stock: 142, badge: 'Top',
    specs: { 'Longitud': '5 m', 'Ancho': '25 mm', 'Carcasa': 'ABS + goma', 'Bloqueo': 'Automático' }, color: 'amber',
    img: U('1426927308491-6380b6a9936f') },     // tools wall (fallback, but consistent)

  // ── FIJACIÓN ────────────────────────────────────────────────────────
  { id: 'p009', sku: 'FX-SCW-100', name: 'Tornillo autoperforante 8x1-1/2" (100u)', brand: 'NORDE', category: 'fasteners', price: 189, rating: 4.7, reviews: 76, stock: 240,
    specs: { 'Cantidad': '100 unidades', 'Medida': '8 x 1-1/2"', 'Material': 'Acero zincado', 'Cabeza': 'Hexagonal' }, color: 'graphite',
    img: U('1581244277943-fe4a9c777189') },     // sockets/bits close-up (reads as fasteners)
  { id: 'p010', sku: 'FX-ANC-050', name: 'Ancla expansiva 3/8" (50u)', brand: 'AXIS', category: 'fasteners', price: 320, rating: 4.6, reviews: 51, stock: 86,
    specs: { 'Cantidad': '50 unidades', 'Diámetro': '3/8"', 'Largo': '3"', 'Carga': 'Hasta 180 kg' }, color: 'graphite',
    img: P(5691641) },                          // drywall anchors pile ✓

  // ── CONSTRUCCIÓN ────────────────────────────────────────────────────
  { id: 'p011', sku: 'MT-CMT-050', name: 'Cemento gris 50 kg', brand: 'PROFORGE', category: 'materials', price: 245, rating: 4.5, reviews: 89, stock: 320,
    specs: { 'Peso': '50 kg', 'Tipo': 'Pórtland CPC-30R', 'Fraguado': 'Normal', 'Rendimiento': '~14 m² (5cm)' }, color: 'graphite',
    img: P(1216585) },                          // worker building interior
  { id: 'p012', sku: 'MT-RBR-3-8', name: 'Varilla corrugada 3/8" 12m', brand: 'IRONHAUS', category: 'materials', price: 189, rating: 4.6, reviews: 41, stock: 178,
    specs: { 'Diámetro': '3/8"', 'Largo': '12 m', 'Grado': 'Grado 42', 'Norma': 'NMX-C-407' }, color: 'graphite',
    img: U('1531834685032-c34bf0d84c77') },     // construction on rebar ✓

  // ── PLOMERÍA ────────────────────────────────────────────────────────
  { id: 'p013', sku: 'PL-PVC-3-4', name: 'Tubería PVC hidráulica 3/4" 6m', brand: 'NORDE', category: 'plumbing', price: 198, rating: 4.7, reviews: 62, stock: 96,
    specs: { 'Diámetro': '3/4"', 'Largo': '6 m', 'Cédula': '40', 'Presión': '450 PSI' }, color: 'sky',
    img: P(3637739) },                          // kitchen with plumbing fixtures
  { id: 'p014', sku: 'PL-VLV-1-2', name: 'Válvula de esfera latón 1/2"', brand: 'AXIS', category: 'plumbing', price: 159, rating: 4.8, reviews: 124, stock: 58,
    specs: { 'Material': 'Latón forjado', 'Conexión': '1/2" NPT', 'Presión': '600 WOG', 'Operación': 'Cuarto de vuelta' }, color: 'amber',
    img: P(6444256) },                          // bathroom with plumbing fixtures

  // ── SEGURIDAD ───────────────────────────────────────────────────────
  { id: 'p015', sku: 'SF-HLM-001', name: 'Casco de seguridad industrial dieléctrico', brand: 'ARMOR', category: 'safety', price: 289, rating: 4.7, reviews: 203, stock: 74,
    specs: { 'Clase': 'Clase E (20kV)', 'Material': 'HDPE', 'Suspensión': 'Ratchet 6 puntos', 'Norma': 'ANSI Z89.1' }, color: 'amber',
    img: P(209236) },                           // worker yellow hard hat ✓
  { id: 'p016', sku: 'SF-GLV-009', name: 'Guantes anticorte nivel 5 (par)', brand: 'ARMOR', category: 'safety', price: 179, rating: 4.6, reviews: 318, stock: 142, badge: 'Top',
    specs: { 'Nivel corte': 'EN388 4544 / ANSI A4', 'Forro': 'HPPE + fibra de vidrio', 'Palma': 'Nitrilo espumado', 'Talla': 'M / L / XL' }, color: 'sky',
    img: P(1249611) },                          // person drilling with yellow gloves (gloves visible) ✓
  { id: 'p017', sku: 'SF-GLS-002', name: 'Lentes seguridad antiempañantes', brand: 'ARMOR', category: 'safety', price: 89, rating: 4.5, reviews: 487, stock: 220,
    specs: { 'Lente': 'Policarbonato', 'Norma': 'ANSI Z87.1+', 'Recubrimiento': 'Antifog / antirayón', 'Color': 'Claro' }, color: 'graphite',
    img: P(8005400) },                          // worker with safety glasses + hard hat ✓
];

window.REVIEWS = [
  { product: 'p001', author: 'Marco V.', role: 'Contratista', rating: 5, date: 'hace 3 días', verified: true, body: 'Sólido. Llevo 2 meses usándolo a diario en obra y la batería aguanta todo el turno. El torque es real, no inflado.' },
  { product: 'p001', author: 'Ana R.',  role: 'DIY',          rating: 5, date: 'hace 1 sem',  verified: true, body: 'Compré para remodelar la casa. Liviano, fácil de usar y vino con dos baterías. La entrega fue al día siguiente.' },
  { product: 'p001', author: 'Luis K.', role: 'Carpintero',    rating: 4, date: 'hace 2 sem',  verified: true, body: 'Excelente relación precio/calidad. Le bajaría una estrella solo porque el cargador podría ser más rápido.' },
];
