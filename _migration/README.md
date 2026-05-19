# Migración del Prototipo → Demo Codebase

Este paquete contiene el **prototipo HTML** del e-commerce Ferretería Industrial.
Tu repo `Demo/` ya tiene migrado el Home, Catalog, PDP, Cart, Account.
Lo que falta es portar las nuevas piezas y pulir lo existente.

---

## Qué portar (lo nuevo)

### 1. Páginas faltantes
- `app-extras.jsx` contiene:
  - `BrandsPage` → portar a `Demo/apps/store/src/pages/Brands.tsx`
  - `SupportPage` → portar a `Demo/apps/store/src/pages/Support.tsx`

### 2. Imágenes reales por producto
- `data.js` tiene el catálogo con URLs verificadas de Unsplash + Pexels
- Hay que migrarlas a tu **backend seed** (`Demo/backend/src/db/seed.ts`)
  para que tus productos tengan `images[]` con URLs reales

### 3. Paleta confirmada
- `--accent: #DC2B31` (rojo) y `--accent-2: #2E3293` (indigo)
- Ya están en tu `index.css` ✓

### 4. Header con navegación funcional
- `app-home.jsx` (líneas del Header) — los links de "Marcas", "Ofertas", "Soporte"
  deben apuntar a `/marcas`, `/catalogo?ofertas=1`, `/soporte`

### 5. Tweaks panel (opcional — solo si quieres demos interactivas)
- `tweaks-panel.jsx` permite cambiar el color de acento en vivo
- En tu app real probablemente no lo necesitas — es de prototipo

---

## Cómo usarlo con Claude Code

1. Mete esta carpeta dentro de tu repo: `Demo/_prototype-reference/`
2. Abre Claude Code: `cd Demo && claude`
3. Pega este prompt como primer mensaje:

```
Lee la carpeta _prototype-reference/ — es el prototipo HTML del que viene
el diseño actual. Compara con apps/store/src/pages/ y dime exactamente
qué falta por portar. Específicamente:

1. ¿Existe pages/Brands.tsx con el contenido de app-extras.jsx > BrandsPage?
2. ¿Existe pages/Support.tsx con el contenido de app-extras.jsx > SupportPage?
3. ¿El Header (components/layout/Header.tsx) tiene links a /marcas, 
   /catalogo?ofertas=1 y /soporte?
4. ¿El seed del backend (backend/src/db/seed.ts) usa las URLs de imágenes
   reales que están en _prototype-reference/data.js?

Listo todo lo que falte y proponme un plan en orden.
```

4. Claude Code te dirá qué falta y lo aplicará archivo por archivo.

---

## Archivos del prototipo

| Archivo | Contenido |
|---|---|
| `index.html` | Punto de entrada del prototipo |
| `styles.css` | CSS completo (~57KB) — referencia para `apps/store/src/index.css` |
| `data.js` | Catálogo de productos con URLs de imágenes |
| `ui.jsx` | Iconos + `ProductArt` + `CategoryArt` + helpers |
| `app-home.jsx` | Home + Header + ProductCard |
| `app-plp.jsx` | Catálogo con filtros |
| `app-pdp.jsx` | Product detail page |
| `app-cart.jsx` | Drawer carrito + QuickView + Compare + Search |
| `app-account.jsx` | Account + Footer |
| `app-extras.jsx` | **Brands + Support (lo nuevo)** |
| `app.jsx` | App root con routing |
| `tweaks-panel.jsx` | Panel de tweaks (no portar) |

---

## Versión completa standalone

Si en algún momento quieres ver el prototipo funcionando offline sin
todas estas piezas separadas, abre:
`Ferreteria Industrial — Prototipo (standalone).html`
(doble clic, funciona offline)
