import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Helpers de imagen ─────────────────────────────────────────────────────────
// Mismos helpers que _migration/data.js para consistencia con el prototipo
const U = (id: string, alt: string) => ({
  url: `https://images.unsplash.com/photo-${id}?fm=jpg&q=70&w=900&auto=format&fit=crop`,
  alt,
});
const P = (id: number, alt: string) => ({
  url: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=900`,
  alt,
});

const IMGS = {
  // Herramientas manuales — IDs del prototipo (data.js)
  allenKeys:   P(220639,  'Juego de llaves Allen hexagonales'),         // wrenches ✓
  hammer:      P(209235,  'Martillo de carpintero'),                    // hammer with nails ✓
  pliers:      P(175039,  'Pinzas de punta fina'),                      // hand tools ✓
  tape:        U('1426927308491-6380b6a9936f', 'Cinta metrica profesional'), // tools wall
  screwdriver: P(175039,  'Juego de destornilladores'),                 // hand tools ✓
  level:       U('1503387762-592deb58ef4e',   'Nivel de burbuja'),
  alicates:    U('1635070041078-e363dbe005cb', 'Alicates universales'),
  escuadra:    U('1618090584176-7132b9911657', 'Escuadra de carpintero'),
  // Herramientas electricas — IDs del prototipo (data.js)
  drill:       U('1504148455328-c376907d081c', 'Taladro percutor electrico'),  // red drill ✓
  grinder:     U('1632095710940-ad578e8cbe6b', 'Amoladora angular'),           // yellow power tool ✓
  saw:         P(1216544, 'Sierra circular electrica'),                         // angle grinder sparks ✓
  powertool:   P(1249611, 'Rotomartillo SDS Plus'),                            // person drilling ✓
  jigsaw:      U('1504328345606-18bbc8c9d7d1', 'Caladora de vaiven'),
  sander:      U('1589939705384-5185137a7f0f', 'Lijadora orbital'),
  // Materiales de construccion — IDs del prototipo (data.js)
  concrete:    P(1216585, 'Cemento Portland en saco'),                  // worker building ✓
  mortar:      U('1586023492125-27b2c045efd7', 'Mortero adhesivo para ceramica'),
  steel:       U('1531834685032-c34bf0d84c77', 'Varilla de acero corrugado'),  // rebar ✓
  // Seguridad industrial — IDs del prototipo (data.js)
  hardhat:     P(209236,  'Casco de seguridad industrial'),             // yellow hard hat ✓
  gloves:      P(1249611, 'Guantes de carnaza soldador'),               // gloves visible ✓
  goggles:     P(8005400, 'Lentes de seguridad antiempanantes'),        // safety glasses ✓
  safetyVest:  U('1614028674026-a65e31bfd27c', 'Chaleco reflectante alta visibilidad'),
  harness:     U('1571171637578-41bc2dd41cd2', 'Arnes de seguridad cuerpo completo'),
  // Plomeria — IDs del prototipo (data.js)
  wrench:      U('1416879595882-3373a0480b5b', 'Llave Stillson para tuberia'),
  valve:       P(6444256, 'Valvula de esfera de bronce'),               // bathroom plumbing ✓
  teflon:      U('1617195737496-bc30194e3a19', 'Cinta teflon PTFE para roscas'),
  glue:        U('1518709268805-4e9042af9f23', 'Pegamento solvente para CPVC'),
  // Fijaciones y tornilleria — IDs del prototipo (data.js)
  screws:      U('1581244277943-fe4a9c777189', 'Tornillos para drywall'),       // sockets/bits ✓
  anchors:     P(5691641, 'Pernos de anclaje expansivos'),              // drywall anchors ✓
  plugs:       U('1496247749665-49cf5b1022e9', 'Taquetes plasticos de nylon'),
  rivets:      U('1581244277943-fe4a9c777189', 'Remaches pop de aluminio'),
};

const CATEGORIES = [
  { name: 'Herramientas Manuales',      slug: 'herramientas-manuales'    },
  { name: 'Herramientas Electricas',    slug: 'herramientas-electricas'  },
  { name: 'Materiales de Construccion', slug: 'materiales-construccion'  },
  { name: 'Seguridad Industrial',       slug: 'seguridad-industrial'     },
  { name: 'Plomeria',                   slug: 'plomeria'                 },
  { name: 'Fijaciones y Tornilleria',   slug: 'fijaciones-tornilleria'   },
];

const PRODUCTS = [
  // ── HERRAMIENTAS MANUALES ────────────────────────────────────────────────────
  {
    name: 'Juego de Llaves Allen 9 pzas',
    slug: 'juego-llaves-allen-9pzas',
    description: 'Set de 9 llaves hexagonales en acero al cromo-vanadio. Medidas 1.5 mm a 10 mm. Funda de tela incluida. Ideal para muebles, bicicletas y maquinaria.',
    price: 189.00, compareAtPrice: 249.00, sku: 'HM-001', brand: 'proforge',
    categorySlug: 'herramientas-manuales', quantity: 45,
    attributes: [
      { name: 'Material', value: 'Acero cromo-vanadio' },
      { name: 'Piezas', value: '9' },
      { name: 'Medidas', value: '1.5 a 10 mm' },
    ],
    images: [IMGS.allenKeys],
  },
  {
    name: 'Martillo de Carpintero 16 oz',
    slug: 'martillo-carpintero-16oz',
    description: 'Martillo con cabeza de acero forjado y mango de fibra de vidrio antivibración. Capacidad 16 oz. Una para extraccion de clavos. Balance perfecto para trabajo intensivo.',
    price: 299.00, compareAtPrice: null, sku: 'HM-002', brand: 'strike',
    categorySlug: 'herramientas-manuales', quantity: 30,
    attributes: [
      { name: 'Peso cabeza', value: '16 oz / 454 g' },
      { name: 'Mango', value: 'Fibra de vidrio' },
      { name: 'Longitud', value: '33 cm' },
    ],
    images: [IMGS.hammer],
  },
  {
    name: 'Pinzas de Punta 6"',
    slug: 'pinzas-punta-6-pulgadas',
    description: 'Pinzas de punta fina con corte lateral integrado. Acero forjado con templado al vacio. Mango ergonomico con grip de doble componente. Perfectas para trabajos electricos.',
    price: 149.00, compareAtPrice: 199.00, sku: 'HM-003', brand: 'strike',
    categorySlug: 'herramientas-manuales', quantity: 60,
    attributes: [
      { name: 'Longitud', value: '6" / 15 cm' },
      { name: 'Material', value: 'Acero forjado' },
      { name: 'Aislamiento', value: '1000 V' },
    ],
    images: [IMGS.pliers],
  },
  {
    name: 'Cinta Métrica 5m Profesional',
    slug: 'cinta-metrica-5m-profesional',
    description: 'Cinta metrica con carcasa de ABS resistente a impactos. Cinta de acero templado con recubrimiento de nylon. Freno automatico y gancho magnetico. Doble escala milimetrica.',
    price: 129.00, compareAtPrice: null, sku: 'HM-004', brand: 'strike',
    categorySlug: 'herramientas-manuales', quantity: 80,
    attributes: [
      { name: 'Longitud', value: '5 metros' },
      { name: 'Ancho cinta', value: '19 mm' },
      { name: 'Precision', value: 'Clase II' },
    ],
    images: [IMGS.tape],
  },
  {
    name: 'Juego Destornilladores 8 pzas',
    slug: 'juego-destornilladores-8pzas',
    description: 'Set de 8 destornilladores con puntas Phillips y planas en diferentes medidas. Mango ergonomico de trilobulo con zona de agarre suave. Acero S2 tratado termicamente.',
    price: 219.00, compareAtPrice: 279.00, sku: 'HM-005', brand: 'strike',
    categorySlug: 'herramientas-manuales', quantity: 55,
    attributes: [
      { name: 'Piezas', value: '8 (4 Phillips + 4 Planas)' },
      { name: 'Material', value: 'Acero S2' },
      { name: 'Mango', value: 'Trilobulo ergonomico' },
    ],
    images: [IMGS.screwdriver],
  },
  {
    name: 'Nivel de Burbuja 60 cm',
    slug: 'nivel-burbuja-60cm',
    description: 'Nivel de aluminio extruido con 3 burbujas: horizontal, vertical y 45 grados. Escala milimetrica grabada. Resistente a impactos y solventes. Precision de 0.5 mm/m.',
    price: 259.00, compareAtPrice: null, sku: 'HM-006', brand: 'proforge',
    categorySlug: 'herramientas-manuales', quantity: 40,
    attributes: [
      { name: 'Longitud', value: '60 cm' },
      { name: 'Material', value: 'Aluminio extruido' },
      { name: 'Precision', value: '0.5 mm/m' },
    ],
    images: [IMGS.level],
  },
  {
    name: 'Alicates Universales 8"',
    slug: 'alicates-universales-8-pulgadas',
    description: 'Alicates de uso general con muelle de retorno. Corte lateral integrado. Mangos con recubrimiento PVC bimaterial. Articulacion reforzada de alta durabilidad.',
    price: 179.00, compareAtPrice: 219.00, sku: 'HM-007', brand: 'proforge',
    categorySlug: 'herramientas-manuales', quantity: 70,
    attributes: [
      { name: 'Longitud', value: '8" / 20 cm' },
      { name: 'Material', value: 'Acero especial' },
      { name: 'Capacidad max', value: '35 mm' },
    ],
    images: [IMGS.alicates],
  },
  {
    name: 'Escuadra de Carpintero 30 cm',
    slug: 'escuadra-carpintero-30cm',
    description: 'Escuadra de acero inoxidable con mango de madera maciza. Angulos calibrados 90 y 45 grados. Escala en mm y pulgadas. Imprescindible para carpinteria y construccion.',
    price: 89.00, compareAtPrice: null, sku: 'HM-008', brand: 'strike',
    categorySlug: 'herramientas-manuales', quantity: 95,
    attributes: [
      { name: 'Longitud', value: '30 cm' },
      { name: 'Material', value: 'Acero inoxidable' },
      { name: 'Angulos', value: '90 y 45 grados' },
    ],
    images: [IMGS.escuadra],
  },

  // ── HERRAMIENTAS ELECTRICAS ──────────────────────────────────────────────────
  {
    name: 'Taladro Percutor 700W',
    slug: 'taladro-percutor-700w',
    description: 'Taladro percutor electrico 700 W con velocidad variable 0-3000 rpm. Chuck de 13 mm sin llave. Funcion rotacion y percusion. Mango auxiliar y tope de profundidad incluidos.',
    price: 1450.00, compareAtPrice: 1799.00, sku: 'HE-001', brand: 'voltra',
    categorySlug: 'herramientas-electricas', quantity: 15,
    attributes: [
      { name: 'Potencia', value: '700 W' },
      { name: 'RPM max', value: '3,000 rpm' },
      { name: 'Chuck', value: '13 mm sin llave' },
      { name: 'Voltaje', value: '127 V' },
    ],
    images: [IMGS.drill],
  },
  {
    name: 'Amoladora Angular 4.5" 850W',
    slug: 'amoladora-angular-4-5-850w',
    description: 'Amoladora angular con motor de 850 W y velocidad sin carga de 11,000 rpm. Protector ajustable 360 grados. Bloqueo de husillo para cambio rapido de disco.',
    price: 989.00, compareAtPrice: null, sku: 'HE-002', brand: 'kraft',
    categorySlug: 'herramientas-electricas', quantity: 8,
    attributes: [
      { name: 'Potencia', value: '850 W' },
      { name: 'Disco', value: '4.5" / 115 mm' },
      { name: 'RPM', value: '11,000 rpm' },
      { name: 'Peso', value: '1.8 kg' },
    ],
    images: [IMGS.grinder],
  },
  {
    name: 'Sierra Circular 7-1/4" 1400W',
    slug: 'sierra-circular-7-1-4-1400w',
    description: 'Sierra circular con motor de 1400 W. Profundidad de corte 63 mm a 90 grados y 48 mm a 45 grados. Guia paralela incluida. Base de aluminio fundido.',
    price: 2250.00, compareAtPrice: 2699.00, sku: 'HE-003', brand: 'kraft',
    categorySlug: 'herramientas-electricas', quantity: 0,
    attributes: [
      { name: 'Potencia', value: '1400 W' },
      { name: 'Disco', value: '7-1/4" / 184 mm' },
      { name: 'Corte max 90°', value: '63 mm' },
      { name: 'Corte max 45°', value: '48 mm' },
    ],
    images: [IMGS.saw],
  },
  {
    name: 'Rotomartillo SDS Plus 800W',
    slug: 'rotomartillo-sds-plus-800w',
    description: 'Rotomartillo con sistema SDS Plus y energia de impacto 2.4 J. Tres modos: rotacion, martillo y cincel. Velocidad variable 0-1100 rpm. Incluye mango auxiliar, tope y maletin.',
    price: 2199.00, compareAtPrice: 2599.00, sku: 'HE-004', brand: 'ironhaus',
    categorySlug: 'herramientas-electricas', quantity: 10,
    attributes: [
      { name: 'Potencia', value: '800 W' },
      { name: 'Portabroca', value: 'SDS Plus' },
      { name: 'Energia impacto', value: '2.4 J' },
      { name: 'Modos', value: '3 (rotacion / martillo / cincel)' },
    ],
    images: [IMGS.powertool],
  },
  {
    name: 'Caladora de Vaiven 500W',
    slug: 'caladora-vaiven-500w',
    description: 'Caladora electrica con 4 posiciones de vaiven y velocidad variable. Motor 500 W. Corte max madera 80 mm, metal 10 mm. Guia paralela y base pivotante hasta 45 grados.',
    price: 879.00, compareAtPrice: 1049.00, sku: 'HE-005', brand: 'voltra',
    categorySlug: 'herramientas-electricas', quantity: 12,
    attributes: [
      { name: 'Potencia', value: '500 W' },
      { name: 'Vaiven', value: '4 posiciones' },
      { name: 'Corte madera', value: 'hasta 80 mm' },
      { name: 'Corte metal', value: 'hasta 10 mm' },
    ],
    images: [IMGS.jigsaw],
  },
  {
    name: 'Lijadora Orbital 200W',
    slug: 'lijadora-orbital-200w',
    description: 'Lijadora orbital aleatoria con motor de 200 W y plato de 125 mm. Orbita de 2.5 mm para acabados finos. Sistema de aspiracion de polvo integrado. Velocidad variable 5,000-12,000 rpm.',
    price: 759.00, compareAtPrice: null, sku: 'HE-006', brand: 'kraft',
    categorySlug: 'herramientas-electricas', quantity: 18,
    attributes: [
      { name: 'Potencia', value: '200 W' },
      { name: 'Plato', value: '125 mm' },
      { name: 'RPM', value: '5,000 a 12,000' },
      { name: 'Orbita', value: '2.5 mm' },
    ],
    images: [IMGS.sander],
  },

  // ── MATERIALES DE CONSTRUCCION ───────────────────────────────────────────────
  {
    name: 'Cemento Portland Tipo I 50kg',
    slug: 'cemento-portland-tipo-i-50kg',
    description: 'Cemento Portland ordinario Tipo I en saco de 50 kg. Ideal para cimentaciones, losas, castillos y trabajos generales de construccion. Alta resistencia inicial y final.',
    price: 185.00, compareAtPrice: null, sku: 'MC-001', brand: 'ironhaus',
    categorySlug: 'materiales-construccion', quantity: 300,
    attributes: [
      { name: 'Tipo', value: 'Portland Tipo I' },
      { name: 'Peso', value: '50 kg' },
      { name: 'Resistencia 28 dias', value: '350 kg/cm2' },
    ],
    images: [IMGS.concrete],
  },
  {
    name: 'Mortero Adhesivo Gris 25kg',
    slug: 'mortero-adhesivo-gris-25kg',
    description: 'Mortero adhesivo cementoso para colocacion de ceramica, porcelanato y piedra natural en interiores y exteriores. Fraguado controlado. Resistente al agua.',
    price: 129.00, compareAtPrice: 159.00, sku: 'MC-002', brand: 'ironhaus',
    categorySlug: 'materiales-construccion', quantity: 150,
    attributes: [
      { name: 'Peso', value: '25 kg' },
      { name: 'Uso', value: 'Interior y exterior' },
      { name: 'Tiempo abierto', value: '30 minutos' },
    ],
    images: [IMGS.mortar],
  },
  {
    name: 'Varilla Corrugada 3/8" x 6m',
    slug: 'varilla-corrugada-3-8-x-6m',
    description: 'Varilla de acero corrugado Grado 42, diametro 3/8" (9.5 mm) por 6 metros. Para cimentaciones, castillos y losas. Certificado NMX. Resistencia de fluencia 4200 kg/cm2.',
    price: 89.00, compareAtPrice: null, sku: 'MC-003', brand: 'ironhaus',
    categorySlug: 'materiales-construccion', quantity: 500,
    attributes: [
      { name: 'Diametro', value: '3/8" / 9.5 mm' },
      { name: 'Longitud', value: '6 metros' },
      { name: 'Grado', value: '42' },
    ],
    images: [IMGS.steel],
  },

  // ── SEGURIDAD INDUSTRIAL ─────────────────────────────────────────────────────
  {
    name: 'Casco de Seguridad ANSI Z89.1',
    slug: 'casco-seguridad-ansi-z891',
    description: 'Casco dielectrico certificado ANSI Z89.1 Clase E. Suspension de ruleta ajustable 51-63 cm. Ranuras para aditamentos (visor, orejeras). Material HDPE resistente a impactos y UV.',
    price: 245.00, compareAtPrice: null, sku: 'SI-001', brand: 'armor',
    categorySlug: 'seguridad-industrial', quantity: 120,
    attributes: [
      { name: 'Certificacion', value: 'ANSI Z89.1 Clase E' },
      { name: 'Material', value: 'HDPE' },
      { name: 'Ajuste', value: 'Ruleta 51 a 63 cm' },
    ],
    images: [IMGS.hardhat],
  },
  {
    name: 'Guantes de Carnaza Soldador',
    slug: 'guantes-carnaza-soldador',
    description: 'Guantes de soldador en cuero de carnaza natural con forro de algodon resistente al calor. Proteccion hasta 250 C. Costuras en hilo de kevlar. Tallas M, L y XL.',
    price: 189.00, compareAtPrice: 229.00, sku: 'SI-002', brand: 'armor',
    categorySlug: 'seguridad-industrial', quantity: 55,
    attributes: [
      { name: 'Material', value: 'Carnaza natural' },
      { name: 'Temperatura max', value: '250 C' },
      { name: 'Costuras', value: 'Hilo Kevlar' },
    ],
    images: [IMGS.gloves],
  },
  {
    name: 'Lentes de Seguridad Antiempanantes',
    slug: 'lentes-seguridad-antiempanantes',
    description: 'Lentes de seguridad certificados ANSI Z87.1. Lente policarbonato con tratamiento antiempanante y proteccion UV 99%. Montura ligera de nylon. Patillas ajustables.',
    price: 79.00, compareAtPrice: 99.00, sku: 'SI-003', brand: 'armor',
    categorySlug: 'seguridad-industrial', quantity: 200,
    attributes: [
      { name: 'Certificacion', value: 'ANSI Z87.1' },
      { name: 'Lente', value: 'Policarbonato antiempanante' },
      { name: 'UV', value: 'Proteccion 99%' },
    ],
    images: [IMGS.goggles],
  },
  {
    name: 'Chaleco Reflectante Alta Visibilidad',
    slug: 'chaleco-reflectante-alta-visibilidad',
    description: 'Chaleco de seguridad Clase 2 con cintas reflectantes de 5 cm. Material poliester naranja fluorescente. Bolsillos frontales con cierre. Tallas S a XXL. Certificado ANSI 107.',
    price: 145.00, compareAtPrice: null, sku: 'SI-004', brand: 'armor',
    categorySlug: 'seguridad-industrial', quantity: 85,
    attributes: [
      { name: 'Clase', value: 'ANSI 107 Clase 2' },
      { name: 'Material', value: 'Poliester 100%' },
      { name: 'Cintas', value: '5 cm reflectantes' },
    ],
    images: [IMGS.safetyVest],
  },
  {
    name: 'Arnes Full Body Doble Gancho',
    slug: 'arnes-full-body-doble-gancho',
    description: 'Arnes de seguridad de cuerpo completo con doble gancho de seguro y absorbedor de impacto. Certificado ANSI Z359. Cintas de nylon de 45 mm. Ajuste de 5 puntos. Carga max 140 kg.',
    price: 1199.00, compareAtPrice: 1499.00, sku: 'SI-005', brand: 'armor',
    categorySlug: 'seguridad-industrial', quantity: 25,
    attributes: [
      { name: 'Certificacion', value: 'ANSI Z359' },
      { name: 'Carga max', value: '140 kg' },
      { name: 'Cintas', value: 'Nylon 45 mm' },
    ],
    images: [IMGS.harness],
  },

  // ── PLOMERIA ─────────────────────────────────────────────────────────────────
  {
    name: 'Llave Stillson 14" Profesional',
    slug: 'llave-stillson-14-profesional',
    description: 'Llave de tubo ajustable 14" fabricada en hierro maleable. Mandibula de acero endurecido. Apertura maxima 50 mm. Mecanismo de ajuste rapido. Para tuberias de hasta 2 pulgadas.',
    price: 349.00, compareAtPrice: null, sku: 'PL-001', brand: 'proforge',
    categorySlug: 'plomeria', quantity: 25,
    attributes: [
      { name: 'Longitud', value: '14" / 35 cm' },
      { name: 'Apertura max', value: '50 mm' },
      { name: 'Material', value: 'Hierro maleable' },
    ],
    images: [IMGS.wrench],
  },
  {
    name: 'Valvula de Esfera 1/2" Bronce',
    slug: 'valvula-esfera-1-2-bronce',
    description: 'Valvula de paso de 1/2 pulgada con cuerpo de bronce fundido y esfera de acero inoxidable. Conexiones roscadas NPT. Manija de aluminio. Presion de trabajo 200 PSI.',
    price: 89.00, compareAtPrice: 119.00, sku: 'PL-002', brand: 'axis',
    categorySlug: 'plomeria', quantity: 180,
    attributes: [
      { name: 'Diametro', value: '1/2"' },
      { name: 'Material', value: 'Bronce fundido' },
      { name: 'Presion max', value: '200 PSI' },
    ],
    images: [IMGS.valve],
  },
  {
    name: 'Cinta Teflon 12m x 10 rollos',
    slug: 'cinta-teflon-12m-10-rollos',
    description: 'Cinta de PTFE para sellado de roscas en instalaciones de agua, gas y aire. Ancho 12 mm, espesor 0.075 mm. Pack de 10 rollos de 12 metros. Resistente de -200 a +260 C.',
    price: 65.00, compareAtPrice: null, sku: 'PL-003', brand: 'norde',
    categorySlug: 'plomeria', quantity: 350,
    attributes: [
      { name: 'Material', value: 'PTFE (teflon)' },
      { name: 'Medidas', value: '12 mm x 12 m c/u' },
      { name: 'Contenido', value: '10 rollos' },
    ],
    images: [IMGS.teflon],
  },
  {
    name: 'Pegamento CPVC 250ml',
    slug: 'pegamento-cpvc-250ml',
    description: 'Pegamento solvente para tuberias y conexiones de CPVC. Fraguado rapido en 30 segundos. Resistente a cloro y agua caliente hasta 93 C. Contenido 250 ml con cepillo aplicador.',
    price: 119.00, compareAtPrice: 149.00, sku: 'PL-004', brand: 'norde',
    categorySlug: 'plomeria', quantity: 90,
    attributes: [
      { name: 'Tipo', value: 'CPVC' },
      { name: 'Contenido', value: '250 ml' },
      { name: 'Temp max', value: '93 C' },
    ],
    images: [IMGS.glue],
  },

  // ── FIJACIONES Y TORNILLERIA ─────────────────────────────────────────────────
  {
    name: 'Tornillos Drywall 1000 pzas',
    slug: 'tornillos-drywall-1000pzas',
    description: 'Caja con 1000 tornillos para drywall de 6 x 1-1/4". Punta fosfatada de alta penetracion para tablaroca y perfiles de acero calibre 20-25. Cabeza avellanada Phillips.',
    price: 219.00, compareAtPrice: 269.00, sku: 'FT-001', brand: 'norde',
    categorySlug: 'fijaciones-tornilleria', quantity: 200,
    attributes: [
      { name: 'Medida', value: '6 x 1-1/4"' },
      { name: 'Cantidad', value: '1,000 piezas' },
      { name: 'Acabado', value: 'Fosfatado negro' },
    ],
    images: [IMGS.screws],
  },
  {
    name: 'Pernos Ancla Expansivos 3/8" x50',
    slug: 'pernos-ancla-expansivos-3-8-x50',
    description: 'Pernos de expansion para concreto y mamposteria. Acero galvanizado 3/8" x 3". Carga de trabajo 450 kg por perno. Pack de 50 piezas con tuercas y rondanas incluidas.',
    price: 189.00, compareAtPrice: null, sku: 'FT-002', brand: 'axis',
    categorySlug: 'fijaciones-tornilleria', quantity: 160,
    attributes: [
      { name: 'Medida', value: '3/8" x 3"' },
      { name: 'Material', value: 'Acero galvanizado' },
      { name: 'Contenido', value: '50 piezas' },
    ],
    images: [IMGS.anchors],
  },
  {
    name: 'Taquetes Plasticos No.10 x100',
    slug: 'taquetes-plasticos-no10-x100',
    description: 'Taquetes de nylon Tipo S para uso en concreto, tabique y tablarock. Para tornillo No.10 / 4.5 mm. Pack de 100 piezas. Alta resistencia a la extraccion y rotacion.',
    price: 45.00, compareAtPrice: null, sku: 'FT-003', brand: 'norde',
    categorySlug: 'fijaciones-tornilleria', quantity: 500,
    attributes: [
      { name: 'Numero', value: 'No.10 / 4.5 mm' },
      { name: 'Material', value: 'Nylon' },
      { name: 'Contenido', value: '100 piezas' },
    ],
    images: [IMGS.plugs],
  },
  {
    name: 'Remaches Pop 4mm x100',
    slug: 'remaches-pop-4mm-x100',
    description: 'Remaches de aluminio de traccion tipo POP. Diametro 4 mm, longitud 10 mm. Para union de laminas de aluminio, acero y plastico. Caja con 100 piezas.',
    price: 59.00, compareAtPrice: 79.00, sku: 'FT-004', brand: 'axis',
    categorySlug: 'fijaciones-tornilleria', quantity: 300,
    attributes: [
      { name: 'Diametro', value: '4 mm' },
      { name: 'Longitud', value: '10 mm' },
      { name: 'Contenido', value: '100 piezas' },
    ],
    images: [IMGS.rivets],
  },
];

async function main() {
  console.log('Iniciando seed de Ferreteria...\n');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();

  console.log('Creando categorias...');
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const c = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, c.id);
    console.log(`  - ${cat.name}`);
  }

  console.log('\nCreando productos...');
  for (const prod of PRODUCTS) {
    const { categorySlug, quantity, images, attributes, brand, ...data } = prod;
    await prisma.product.create({
      data: {
        ...data,
        brand: brand ?? null,
        images: JSON.stringify(images),
        attributes: JSON.stringify(attributes),
        categoryId: categoryMap.get(categorySlug)!,
        inventory: { create: { quantity } },
      },
    });
    console.log(`  - ${prod.name} (stock: ${quantity === 0 ? 'AGOTADO' : quantity})`);
  }

  console.log('\nCreando usuario demo...');
  const hash = await bcrypt.hash('demo1234', 12);
  await prisma.customer.create({
    data: { email: 'demo@ferreteria.com', name: 'Juan Constructor', password: hash },
  });
  console.log('  - demo@ferreteria.com / demo1234');

  console.log(`\nSeed completado: ${PRODUCTS.length} productos en ${CATEGORIES.length} categorias.`);
}

main()
  .catch((e) => { console.error('Error en seed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
