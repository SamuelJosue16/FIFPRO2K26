# 🎮 Contexto del Proyecto FIFPRO2K26

## 📌 Información General

**Nombre:** FIFPRO2K26 Full Stack Application  
**Tipo:** Aplicación Web Full Stack  
**Temática:** UEFA Champions League  
**Fecha Inicio:** 27 Marzo 2026  
**Estado:** En Planificación

---

## 🎯 Propósito del Proyecto

Desarrollar una aplicación web completa para la gestión de datos futbolísticos (equipos, jugadores, partidos) con una interfaz inspirada en el diseño premium de la UEFA Champions League. La aplicación debe ser moderna, rápida y visualmente atractiva con animaciones profesionales.

---

## 🛠️ Stack Tecnológico Completo

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | Latest | Framework web |
| Prisma ORM | Latest | ORM para base de datos |
| SQLite | 3.x | Base de datos |
| Bruno | Latest | Cliente API Testing |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18+ | Framework UI |
| Vite | Latest | Build tool & dev server |
| TailwindCSS | 3.x | Utility-first CSS |
| Emotion React | Latest | CSS-in-JS animations |
| TanStack Query | 5.x | State management async |
| Axios | Latest | HTTP client |
| Framer Motion | Latest | Animaciones avanzadas |

---

## 🎨 Identidad Visual UEFA

### Colores Principales
```css
--uefa-dark-blue: #001D3D
--uefa-blue: #003F88
--uefa-light-blue: #0066CC
--uefa-gold: #FFD700
--uefa-silver: #C0C0C0
--uefa-background: #000814
```

### Elementos Característicos
- ⭐ Estrellas doradas animadas (logo UEFA)
- 💙 Gradientes azul oscuro a azul brillante
- ✨ Efectos de brillo y resplandor
- 🎭 Animaciones suaves y premium
- 🏆 Iconografía dorada para destacados

### Tipografía
- **Headers:** Bold, sans-serif, uppercase
- **Body:** Regular, sans-serif
- **Acentos:** Dorado para CTAs importantes

---

## 📐 Arquitectura del Sistema

```
Cliente (React + Vite)
    ↓ HTTP/HTTPS (Axios)
API REST (Express.js)
    ↓ Prisma ORM
Base de Datos (SQLite)
```

### Flujo de Datos
1. Usuario interactúa con componente React
2. TanStack Query maneja el estado de la petición
3. Axios envía request al backend
4. Express recibe, valida y procesa
5. Prisma consulta/modifica SQLite
6. Response regresa al frontend
7. TanStack Query actualiza cache y UI

---

## 🗂️ Módulos Principales

### 1. Autenticación
- Registro de usuarios
- Login/Logout
- JWT para sesiones
- Protección de rutas

### 2. Gestión de Equipos
- CRUD completo de equipos
- Relación con jugadores
- Escudos y colores del equipo
- Estadísticas del equipo

### 3. Gestión de Jugadores
- CRUD completo de jugadores
- Perfiles detallados
- Estadísticas individuales
- Relación con equipos

### 4. Gestión de Partidos
- Calendario de partidos
- Resultados y marcadores
- Estadísticas de partido
- Alineaciones

### 5. Dashboard
- Vista general de estadísticas
- Gráficos interactivos
- Últimos resultados
- Próximos partidos

---

## 🔑 Principios de Desarrollo

### 1. Performance First
- Lazy loading de componentes
- Memoización estratégica
- Code splitting
- Optimización de imágenes
- Cache inteligente

### 2. UX/UI Excellence
- Feedback inmediato (< 100ms)
- Loading states informativos
- Error handling amigable
- Animaciones sutiles (200-300ms)
- Diseño responsive mobile-first

### 3. Código Limpio
- Componentes < 200 líneas
- Funciones con un solo propósito
- Nombres descriptivos
- Comentarios donde sea necesario
- DRY (Don't Repeat Yourself)

### 4. Accesibilidad
- Semántica HTML correcta
- ARIA labels
- Contraste de colores adecuado
- Navegación por teclado
- Textos alternativos en imágenes

---

## 📊 Entidades de Base de Datos (Prisma Schema)

### User
- id, email, password (hash), name
- role (admin/user)
- createdAt, updatedAt

### Team
- id, name, shortName, country
- colors (primary, secondary)
- logoUrl
- createdAt, updatedAt

### Player
- id, firstName, lastName, position
- number, teamId (FK)
- nationality, birthDate
- statistics (JSON)
- photoUrl
- createdAt, updatedAt

### Match
- id, homeTeamId (FK), awayTeamId (FK)
- homeScore, awayScore
- date, status
- venue
- statistics (JSON)
- createdAt, updatedAt

---

## 🧰 Herramientas y Comandos

### Terminal
**IMPORTANTE:** Todos los comandos se ejecutan con **Git Bash**, NO PowerShell ni CMD.

### Git
```bash
git init
git add .
git commit -m "mensaje"
git push origin main
```

### NPM
```bash
npm install
npm run dev
npm run build
```

### Prisma
```bash
npx prisma init
npx prisma migrate dev
npx prisma studio
npx prisma generate
```

---

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.jsx` (ej: `PlayerCard.jsx`)
- Hooks: `camelCase.js` (ej: `useAuth.js`)
- Utilidades: `camelCase.js` (ej: `formatDate.js`)
- Estilos: `kebab-case.css` (ej: `uefa-theme.css`)

### Estructura de Componentes React
```jsx
// 1. Imports
import { useState } from 'react';

// 2. Component
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState();
  
  // 4. Funciones
  const handleAction = () => {};
  
  // 5. Render
  return (
    <div></div>
  );
};

// 6. Export
export default ComponentName;
```

### Backend Controllers
```javascript
// Async/await con try-catch
const getItems = async (req, res) => {
  try {
    const items = await service.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 🚀 Workflow de Desarrollo

1. **Leer skills** antes de empezar una tarea
2. **Actualizar memoria** con lo que se está haciendo
3. **Implementar** siguiendo las buenas prácticas
4. **Probar** manualmente y con Bruno
5. **Actualizar memoria** con lo completado
6. **Commit** con mensaje descriptivo

---

## 📚 Referencias Útiles

- [React Docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com)
- [Emotion](https://emotion.sh)
- [Express.js](https://expressjs.com)

---

## ⚠️ Restricciones y Limitaciones

1. **Solo Git Bash** para comandos de terminal
2. **No usar** PowerShell ni CMD
3. **Componentes** no deben exceder 200 líneas
4. **Evitar** dependencias innecesarias
5. **Priorizar** performance sobre features
6. **Mantener** consistencia en el estilo UEFA

---

## 🎯 Objetivos de Calidad

- ✅ Lighthouse Performance: > 90
- ✅ Sin errores en consola
- ✅ Responsive en todos los viewports
- ✅ Animaciones a 60 FPS
- ✅ Accesibilidad básica (WCAG AA)
- ✅ Código limpio y mantenible

---

**Última actualización:** 27 Marzo 2026  
**Mantenedor:** Agente de Desarrollo IA
