# PLAN DE REDISEÑO UI — FIFPRO2K26 Champions League

> **Objetivo**: Alinear el sistema visual con la identidad gráfica oficial de la UEFA Champions League.  
> Correcciones clave: tipología de colores, eliminación de border-radius agresivos, animaciones de brillo diagonal, y rediseño estructural de las cards de jugadores y equipos.

---

## 1. ANÁLISIS DEL ESTADO ACTUAL — PROBLEMAS DETECTADOS

| Área | Problema Actual |
|------|----------------|
| Colores | `bg-gradient-to-br` genérico, oro demasiado protagonista en todas partes, fondo demasiado negro puro (`#000814`) sin el azul profundo de la UCL |
| Border radius | `rounded-lg` (8px) en absolutamente todo: cards, botones, inputs, badges, imágenes — da look de producto SaaS genérico |
| Animaciones | `hover:scale-105` en todas las cards — agresivo, torpe y sin personalidad |
| Cards (jugadores) | Layout horizontal pequeño con imagen 80×80px, no aprovecha el espacio visual |
| Cards (equipos) | Diseño de lista horizontal, logo pequeño, no tiene impacto visual |
| Botones | Solo cambio de color en hover, sin efecto de calidad |

---

## 2. NUEVOS DESIGN TOKENS

### 2.1 Paleta de Colores (basada en las imágenes de referencia de la UEFA)

Inspirada en el fondo azul marino profundo de la web oficial, el blanco limpio para texto y el dorado como acento mínimo.

```js
// tailwind.config.js — nueva extensión de colores
colors: {
  // Mantener compatibilidad con clases existentes + añadir nuevas
  'uefa-dark':        '#001240',   // CAMBIO: era #001D3D, ahora más profundo
  'uefa-blue':        '#0033A0',   // CAMBIO: era #003F88, ahora el azul real UCL
  'uefa-light-blue':  '#0057B8',   // CAMBIO: tono medio para hover/accents
  'uefa-gold':        '#FFD700',   // MANTENER, usar más sparingly
  'uefa-silver':      '#A0AEC0',   // CAMBIO: era #C0C0C0, ahora más apagado
  'uefa-background':  '#000B1E',   // CAMBIO: era #000814, ahora con tono azul
  // Nuevas
  'ucl-navy':         '#00072D',   // Para fondos de sección alternos
}
```

### 2.2 Filosofía de Border Radius

**Regla general: formas rectangulares y editoriales.**

| Elemento | Actual | Nuevo |
|----------|--------|-------|
| Cards (player, team, match) | `rounded-lg` | `rounded-none` |
| Botones primarios / secundarios | `rounded-lg` | `rounded-none` |
| Inputs de formulario | `rounded-lg` | `rounded-none` |
| Badges de estado (live, scheduled) | `rounded-full` | `rounded-none` |
| Modales / contenedores popup | `rounded-lg` | `rounded-none` |
| Imágenes dentro de cards | `rounded-lg` | `rounded-none` |
| Spinners de carga | `rounded-full` | **Mantener** (es un círculo funcional) |
| Avatar muy pequeño en header | `rounded-full` | **Mantener** (solo en avatares circulares de perfil) |

---

## 3. SISTEMA DE ANIMACIONES — EFECTO BRILLO DIAGONAL (SHIMMER)

### 3.1 El problema con `hover:scale-105`

El scale actual se aplica uniformemente al 100% de los elementos. Es la animación más genérica que existe en cualquier proyecto web. No tiene relación con la identidad de la Champions.

### 3.2 La solución: Barrido de luz diagonal (Diagonal Light Sweep)

Técnica utilizada en diseños premium (Apple, UEFA, Nike). Un haz de luz semi-transparente recorre el elemento en diagonal cuando el usuario pone el cursor encima.

**Implementación en `index.css` con pseudo-elemento `::before`:**

```css
/* ════════════════════════════════════════════
   EFECTO BRILLO DIAGONAL — versión blanca
   Para: cards generales, elementos de fondo oscuro
════════════════════════════════════════════ */
.shine-effect {
  position: relative;
  overflow: hidden;
}

.shine-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent     0%,
    rgba(255, 255, 255, 0.04)  35%,
    rgba(255, 255, 255, 0.14)  50%,
    rgba(255, 255, 255, 0.04)  65%,
    transparent     100%
  );
  transform: skewX(-12deg);
  transition: left 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 10;
}

.shine-effect:hover::before {
  left: 150%;
}

/* ════════════════════════════════════════════
   EFECTO BRILLO DIAGONAL — versión dorada
   Para: botones primarios (fondo dorado/claro)
════════════════════════════════════════════ */
.shine-effect-gold::before {
  background: linear-gradient(
    115deg,
    transparent     0%,
    rgba(255, 255, 255, 0.08)  35%,
    rgba(255, 255, 255, 0.30)  50%,
    rgba(255, 255, 255, 0.08)  65%,
    transparent     100%
  );
}

/* ════════════════════════════════════════════
   ESCALA SUTIL — solo para cards de jugador/equipo
   Acompañar SIEMPRE con shine-effect, no sola
════════════════════════════════════════════ */
.card-hover-scale {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover-scale:hover {
  transform: scale(1.025);   /* Sutil: 2.5% en vez de 5% */
}
```

### 3.3 Resumen de efectos por elemento

| Elemento | Hover anterior | Hover nuevo |
|----------|---------------|-------------|
| `.card-uefa` general | `scale-105` | `shine-effect` sin scale |
| Cards de jugador (nueva) | `scale-105` | `shine-effect` + `scale(1.025)` |
| Cards de equipo (nueva) | `scale-105` | `shine-effect` + `scale(1.025)` |
| Botón primario (Gold) | solo color | `shine-effect-gold` + color |
| Botón secundario (Blue) | solo color | `shine-effect` + color |
| MatchCard | `scale-105` | `shine-effect` sin scale |
| Links de nav | `text-color` | `text-color` + línea inferior animada |

---

## 4. REDISEÑO — PLAYERCARD

### 4.1 Concepto Visual

Card cuadrada / portrait con imagen como fondo completo. El degradado oscuro asciende desde la parte inferior ocupando ~60% de la card. La información del jugador (nombre, posición, equipo, dorsal) se superpone sobre el degradado en blanco. El dorsal aparece en grande y semi-transparente como marca de agua en el fondo.

```
┌────────────────────────────────┐
│                                │  ← imagen background object-cover
│                                │
│       [DORSAL]                 │  ← número grande, opacity 0.07, top-right
│                                │
│  ░░░ degradado negro ░░░░░░░  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← 60% inferior, negro 0→0.9
│ ▓                            ▓ │
│ ▓  POSICIÓN • EQUIPO         ▓ │  ← pequeño, blanco/gris
│ ▓  NOMBRE APELLIDO           ▓ │  ← grande, bold, blanco
│ ▓  Nac. • Edad               ▓ │  ← micro, plata
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────┘
```

### 4.2 Especificaciones Técnicas

- **Dimensiones**: `aspect-[3/4]` (portrait) — más alto que ancho, da impacto
- **Contenedor**: `relative overflow-hidden cursor-pointer` — sin border-radius
- **Imagen fondo**: `absolute inset-0 w-full h-full object-cover`
- **Overlay gradiente**: `absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent`
- **Dorsal decorativo**: `absolute top-3 right-3 text-8xl font-black text-white/[0.07] leading-none select-none`
- **Área de info**: `absolute bottom-0 left-0 right-0 p-4`
- **Posición/Equipo**: `text-xs text-white/60 uppercase tracking-widest mb-1`
- **Nombre**: `text-xl font-bold text-white leading-tight`
- **Nac/Edad**: `text-xs text-white/50 mt-1`
- **Hover**: clase `shine-effect` + clase `card-hover-scale`
- **Click**: `onClick` que abre `PlayerDetailModal` — NO botón "Ver detalles" en la card

### 4.3 Fallback sin imagen

- Fondo: `bg-gradient-to-b from-[#001450] to-[#000B1E]`
- Emoji de posición: centrado, `text-7xl opacity-30` en el área de imagen
- Mismo layout de info en la parte inferior

### 4.4 Grid en PlayersPage

```
Desktop  xl: grid-cols-4  →  cards más compactas, visual impactante
Desktop  lg: grid-cols-3
Tablet:      grid-cols-2
Mobile:      grid-cols-2  (cards pequeñas pero reconocibles)
Gap: gap-3 (12px — editorial, sin tanto espacio)
```

---

## 5. REDISEÑO — TEAMCARD

### 5.1 Concepto Visual

Card cuadrada (1:1) con el logo del equipo centrado sobre un fondo oscuro. El fondo puede tener un glow suave del color primario del equipo (muy baja opacidad). Franja de información en la parte inferior con overlay oscuro.

```
┌────────────────────────────────┐
│                                │
│         [  LOGO  ]             │  ← logo centrado, object-contain, grande
│         [grande  ]             │
│                                │
│  ░░░ degradado negro ░░░░░░░  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓  NOMBRE DEL EQUIPO         ▓ │  ← bold, blanco, grande
│ ▓  País • Siglas             ▓ │  ← pequeño, blanco/60
│ ▓  [P:12] [J:28] [Local:14] ▓ │  ← stats row pequeñas
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────┘
```

### 5.2 Especificaciones Técnicas

- **Dimensiones**: `aspect-square` — perfectamente cuadrada
- **Fondo dinámico**: Si el equipo tiene `colors.primary`, aplicar como `radial-gradient` muy sutil (`rgba(color, 0.12)` al centro, negro en bordes) via style inline
- **Logo**: `w-24 h-24 object-contain mx-auto` — bien grande para impacto
- **Overlay inferior**: `bg-gradient-to-t from-black/85 via-black/30 to-transparent`
- **Dots de color del equipo**: Eliminados los círculos `rounded-full` — reemplazar por una línea delgada decorativa de 2px del color primario del equipo en el borde inferior de la card (via `border-b-2 style={borderColor: colors.primary}`)
- **Hover**: `shine-effect` + `card-hover-scale`
- **Click**: `onClick` que abre `TeamDetailModal`

### 5.3 Grid en TeamsPage

```
Desktop  xl: grid-cols-4
Desktop  lg: grid-cols-3
Tablet:      grid-cols-2
Mobile:      grid-cols-2
Gap: gap-3
```

---

## 6. MODALES DE DETALLE — NUEVOS COMPONENTES

### 6.1 PlayerDetailModal — Contenido

Abre al hacer click en cualquier `PlayerCard`. Reemplaza visualmente el contenido que hoy está expandido en la card.

**Secciones del modal:**
1. **Header visual**: Imagen del jugador como fondo panorámico (recortada al centro) + overlay oscuro + nombre grande + posición + dorsal
2. **Info principal**: Tabla 2 columnas — Nacionalidad, Edad, Equipo, Fecha nacimiento
3. **Estadísticas**: Goles, Asistencias, Partidos (si `statistics` JSON existe)
4. **Botones de acción** (solo si el usuario tiene permisos de admin): Editar, Eliminar — al fondo del modal

**Specs del contenedor:**
- `max-w-lg w-full` centrado, `rounded-none`, no altura máxima absoluta — scroll si mucho contenido
- Backdrop: `fixed inset-0 bg-black/80 backdrop-blur-sm z-50`
- Cerrar: click en backdrop O botón `✕` arriba derecha
- Animación de entrada: `transition-all duration-300` desde opacidad 0 + translateY(8px)

### 6.2 TeamDetailModal — Contenido

1. **Header visual**: Logo grande centrado + nombre del equipo + país
2. **Info principal**: Nombre corto, sede/estadio (si disponible), colores
3. **Estadísticas**: Jugadores registrados, Partidos totales, De local
4. **Lista de jugadores del equipo** (si el backend devuelve el `include players`): lista simplificada, nombre + posición + dorsal
5. **Botones de acción** (admin): Editar, Eliminar

### 6.3 Archivos a crear

```
frontend/src/components/players/PlayerDetailModal.jsx   ← NUEVO
frontend/src/components/teams/TeamDetailModal.jsx       ← NUEVO
```

---

## 7. REFACTOR DE BOTONES

### 7.1 Nuevas clases en index.css

Las clases actuales (`btn-uefa-primary`, etc.) se actualizan en lugar de renombrarse, para no tener que cambiar todos los JSX que ya las usan.

| Clase | Cambios |
|-------|---------|
| `.btn-uefa-primary` | `rounded-none`, añadir `shine-effect-gold`, quitar `rounded-lg` |
| `.btn-uefa-secondary` | `rounded-none`, añadir `shine-effect`, quitar `rounded-lg` |
| `.btn-uefa-ghost` | `rounded-none`, añadir `shine-effect`, quitar `rounded-lg` |

### 7.2 Botón de peligro (delete)

En los formularios/modals donde se usa la clase inline de Tailwind para botón rojo:
- Quitar `rounded-lg` → sin radius
- Añadir clase `shine-effect`

---

## 8. REFACTOR DE INPUTS Y FORMULARIOS

### `input-uefa` en index.css

- Quitar `rounded-lg` → `rounded-none`
- Añadir `border-b-2 border-t-0 border-l-0 border-r-0` para estilo línea inferior (más UCL)
  - Alternativa más conservadora: mantener las 4 paredes del borde pero sin radius
- `focus:border-uefa-gold` → mantener

### `PlayerFormModal` y `TeamFormModal`

- Contenedor del modal: quitar `rounded-lg` → `rounded-none`
- Header del modal: quitar cualquier radius
- Campos de formulario: aplicar `rounded-none`

---

## 9. HEADER — REFINAMIENTO

### Cambios menores (no rediseño radical)

| Elemento | Cambio |
|----------|--------|
| `border-b-2 border-uefa-gold` | → `border-b border-white/10` (más sutil) |
| Links de navegación hover | Añadir `::after` con línea inferior animada en lugar de solo cambio de color |
| Botón "Cerrar Sesión" | Quitar `rounded-lg` → `rounded-none` |
| Botón "Iniciar Sesión" | Quitar `rounded-lg` → `rounded-none` + `shine-effect-gold` |

### Línea inferior animada en nav links (CSS)

```css
.nav-link {
  position: relative;
  padding-bottom: 4px;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #FFD700;
  transition: width 0.3s ease;
}
.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

---

## 10. MATCHCARD — REFINAMIENTO MENOR

La MatchCard no necesita rediseño estructural, solo limpieza de estilo:

| Elemento | Cambio |
|----------|--------|
| Contenedor `.card-uefa` | hereda `rounded-none` al actualizar la clase base |
| Badge de estado (`rounded-full`) | → `rounded-none`, estilo rectangular |
| Avatar fallback equipo (`rounded-full`) | → `rounded-none` |
| `hover:scale-105` (heredado) | → `shine-effect` sin scale |
| Separador "VS" | Considerar cambiar a barra vertical simple |

---

## 11. ACTUALIZACIONES EN `tailwind.config.js`

```js
// Añadir al extend existente:
extend: {
  colors: {
    // (colores actualizados — ver sección 2.1)
  },
  aspectRatio: {
    '3/4': '3 / 4',      // Para cards portrait de jugadores
  },
  keyframes: {
    // No se necesitan keyframes para el shimmer — es una transición CSS pura
    // Mantener spin-slow y pulse-slow existentes
  }
}
```

---

## 12. ORDEN DE IMPLEMENTACIÓN

La implementación debe seguir este orden para evitar romper estilos en cascada:

| Paso | Archivo | Tarea |
|------|---------|-------|
| 1 | `tailwind.config.js` | Actualizar tokens de color |
| 2 | `index.css` | Eliminar `rounded-*` en clases globales, añadir `.shine-effect`, `.shine-effect-gold`, `.card-hover-scale`, `.nav-link`, actualizar `.btn-*` e `.input-uefa` |
| 3 | `PlayerCard.jsx` | Rediseño completo — layout imagen-fondo + info overlay, cursor pointer, onClick |
| 4 | `PlayerDetailModal.jsx` | **Crear nuevo** — modal de detalles del jugador |
| 5 | `PlayersPage.jsx` | Integrar estado `isDetailModalOpen` + `selectedPlayerDetail`, actualizar grid, remover `onEdit` del click de card |
| 6 | `TeamCard.jsx` | Rediseño completo — layout imagen-logo + info overlay, cursor pointer, onClick |
| 7 | `TeamDetailModal.jsx` | **Crear nuevo** — modal de detalles del equipo |
| 8 | `TeamsPage.jsx` | Integrar estado `isDetailModalOpen` + `selectedTeamDetail`, actualizar grid |
| 9 | `MatchCard.jsx` | Refinamiento: quitar radii, aplicar shine, cambiar badge radius |
| 10 | `Header.jsx` | Aplicar `.nav-link`, ajustar border y botones |
| 11 | `PlayerFormModal.jsx` | Quitar radii, alinear con nuevo estilo |
| 12 | `TeamFormModal.jsx` | Quitar radii, alinear con nuevo estilo |
| 13 | `ConfirmDeleteModal.jsx` | Quitar radii, alinear con nuevo estilo |
| 14 | QA Visual | Revisar todas las páginas en desktop, tablet y mobile |

---

## 13. NOTAS Y RESTRICCIONES

- **No crear nuevas páginas** — solo refactorizar componentes existentes
- **No cambiar lógica de negocio** — solo cambios visuales/estructurales
- **Los botones Editar/Eliminar se mantienen** — pero se mueven al interior de los modales de detalle, sacándolos de la card visible
- **El modal `PlayerFormModal` y `TeamFormModal` siguen existiendo** — el flujo de edición parte desde el `DetailModal`, que al hacer click en "Editar" abre el `FormModal` correspondiente
- **Accesibilidad**: Todos los modales deben tener `role="dialog"` y manejo de tecla `Escape` para cerrar
- **Performance**: Las cards con imagen de fondo usan `loading="lazy"` en los `<img>`
