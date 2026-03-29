# 📖 README - FIFPRO2K26 Full Stack Application

## 🏆 Descripción

Aplicación web full stack para gestión de datos futbolísticos con temática **UEFA Champions League**. Incluye gestión de equipos, jugadores, partidos y estadísticas con una interfaz moderna y animada.

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL (Render/Railway)
- **API Testing:** Bruno API Client
- **Deployment:** Render.com (⭐ Recomendado) / Railway

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Estilos:** TailwindCSS + Emotion React
- **State Management:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Animaciones:** Framer Motion
- **Deployment:** Netlify

### DevOps
- **Backend Hosting:** Render.com ⭐ (PostgreSQL + Express API) - 100% GRATIS, sin tarjeta
  - Alternativa: Railway (PostgreSQL + Express API) - $5/mes gratis, requiere tarjeta
- **Frontend Hosting:** 
  - Netlify ⭐ (React SPA estático) - 100% GRATIS
  - Vercel ⭐ (React SPA estático) - 100% GRATIS, Edge CDN más rápido
- **CI/CD:** Auto-deploy desde GitHub
- **Database:** PostgreSQL managed

---

## 📁 Estructura del Proyecto

```
PROYECTO FULLSTACK FIFPRO2K26/
├── backend/                 # API REST con Express
├── frontend/                # Aplicación React
├── skills/                  # Guías de desarrollo
├── memoria/                 # Tracking del proyecto
├── contexto-proyecto.md     # Documentación del proyecto
├── PLAN_IMPLEMENTACION.md   # Plan completo de desarrollo
└── README.md               # Este archivo
```

---

## 🚀 Estado del Proyecto

**Estado Actual:** ✅ FASE 1 COMPLETADA - Setup Inicial  
**Próxima Fase:** ⚙️ FASE 2 - Configuración Base  
**Última Actualización:** 27 Marzo 2026

### Fases del Proyecto
- [x] **Planificación** - Plan completo y documentación
- [x] **FASE 1:** Setup Inicial del Proyecto ✅ COMPLETADA
- [ ] **FASE 2:** Configuración Base (Próxima)
- [ ] **FASE 3:** API Backend
- [ ] **FASE 4:** Frontend - Componentes Base
- [ ] **FASE 5:** Frontend - Páginas Principales
- [ ] **FASE 6:** Características Avanzadas
- [ ] **FASE 7:** Testing y Export API
- [ ] **FASE 8:** Pulido Final

### ✅ FASE 1 - Completada
**Backend:**
- ✅ Proyecto inicializado con npm
- ✅ Express v5.2.1 instalado y configurado
- ✅ Prisma v7.6.0 con SQLite configurado
- ✅ Estructura de carpetas modular creada
- ✅ Servidor básico con ruta /api/health
- ✅ Archivos .http para Bruno API Client
- ✅ Variables de entorno configuradas

**Frontend:**
- ✅ Proyecto Vite + React inicializado
- ✅ TailwindCSS configurado con tema UEFA
- ✅ Colores personalizados UEFA integrados
- ✅ TanStack Query instalado
- ✅ Axios, Emotion, Framer Motion instalados
- ✅ Estructura de carpetas organizada
- ✅ Estilos globales UEFA aplicados
- ✅ Variables de entorno configuradas

---

## 🎨 Tema UEFA Champions League

### Paleta de Colores
- **Azul Oscuro:** `#001D3D` (fondo principal)
- **Azul UEFA:** `#003F88` (elementos primarios)
- **Azul Brillante:** `#0066CC` (acentos)
- **Dorado:** `#FFD700` (CTAs y destacados)
- **Plateado:** `#C0C0C0` (secundario)

### Elementos Visuales
- ⭐ Estrellas doradas animadas
- 💙 Gradientes azul oscuro a brillante
- ✨ Efectos de brillo y resplandor
- 🎭 Animaciones suaves (200-300ms)

---

## 📚 Documentación
 
### Deployment
- **[Guía de Deploy Render + Netlify](GUIA_DEPLOY_RENDER_NETLIFY.md)** ⭐ **RECOMENDADO** - 100% gratis
- **[Guía de Deploy Railway + Netlify](GUIA_DEPLOY_RAILWAY_NETLIFY.md)** - Alternativa (requiere tarjeta)
- **[Quickstart Deploy](QUICKSTART_DEPLOY.md)** - Referencia rápida de despliegue
- **[Resumen de Cambios](RESUMEN_CAMBIOS_DEPLOY.md)** - Cambios técnicos para deployment

### Desarrollo
- **[Plan de Implementación](PLAN_IMPLEMENTACION.md)** - Roadmap completo de 8 fases
- **[Contexto del Proyecto](contexto-proyecto.md)** - Stack, arquitectura y convenciones
- **[Skills](skills/)** - Guías de buenas prácticas:
  - UX/UI Best Practices
  - React Optimization
  - Performance Guidelines

---

## 🎯 Objetivos de Calidad

- ⚡ Lighthouse Performance > 90
- ⚡ First Contentful Paint < 1.5s
- ⚡ Componentes React < 200 líneas
- ⚡ 0 errores en consola
- ⚡ Responsive en todos los dispositivos
- ⚡ Animaciones a 60 FPS

---

## 🔧 Instalación

```bash
# IMPORTANTE: Usar Git Bash en Windows, NO PowerShell ni CMD
# En PowerShell: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 1. Clonar o navegar al proyecto
cd "PROYECTO FULLSTACK FIFPRO2K26"

# 2. Backend - Instalar dependencias (YA INSTALADAS)
cd backend
# Las dependencias ya están instaladas, pero si necesitas reinstalar:
# npm install

# 3. Frontend - Instalar dependencias (YA INSTALADAS)
cd ../frontend
# Las dependencias ya están instaladas, pero si necesitas reinstalar:
# npm install

# 4. Variables de entorno
# Los archivos .env ya están creados a partir de .env.example
# Puedes modificarlos según tus necesidades

# Estado actual: Listo para FASE 2 (Schema Prisma + Migración)
```

---

## 🚀 Ejecutar

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server en http://localhost:3000
# Health check: http://localhost:3000/api/health

# Terminal 2 - Frontend
cd frontend
npm run dev
# App en http://localhost:5173
```

**Nota:** En Windows con PowerShell, si hay error de ejecución de scripts:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## 🌐 Deployment en Render/Railway + Netlify

### Arquitectura de Producción

#### Opción 1: Render + Netlify (⭐ Recomendado)
- **Backend + Database**: Render.com (PostgreSQL + Express API)
- **Frontend**: Netlify (React SPA estático)
- **Costo**: $0/mes - 100% GRATIS, sin tarjeta
- **Tradeoff**: Sleep mode después de 15 min de inactividad

#### Opción 2: Railway + Netlify (Alternativa)
- **Backend + Database**: Railway (PostgreSQL + Express API)
- **Frontend**: Netlify (React SPA estático)
- **Costo**: $5 gratis/mes - Requiere tarjeta de crédito
- **Ventaja**: Sin sleep mode, más rápido

### Guías de Despliegue

📚 **Escoge tu plataforma:**

**Backend:**
- **[Guía Completa Render + Netlify](GUIA_DEPLOY_RENDER_NETLIFY.md)** ⭐ **RECOMENDADO** - 100% gratis, sin tarjeta
- **[Guía Completa Render + Vercel](GUIA_DEPLOY_RENDER_VERCEL.md)** ⭐ **RECOMENDADO** - 100% gratis, CDN más rápido
- **[Guía Completa Railway + Netlify](GUIA_DEPLOY_RAILWAY_NETLIFY.md)** - Alternativa (requiere tarjeta)

**Recursos:**
- **[Comparación de Plataformas](COMPARATIVA_PLATAFORMAS.md)** - Ver diferencias entre Render, Railway, Netlify, Vercel, etc.
- **[Guía Rápida](QUICKSTART_DEPLOY.md)** - Referencia rápida de comandos
- **[Resumen de Cambios](RESUMEN_CAMBIOS_DEPLOY.md)** - Qué se modificó para el deploy

### Despliegue Rápido

#### Opción A: Backend en Render (⭐ Recomendado)
```bash
# 1. Crear PostgreSQL database en Render.com (gratis, sin tarjeta)
# 2. Crear Web Service desde GitHub
# 3. Configurar Root Directory: backend
# 4. Variables de entorno:
#    - DATABASE_URL=<Internal Database URL>
#    - NODE_ENV=production
#    - JWT_SECRET=<generar con crypto>
#    - CORS_ORIGIN=https://tu-app.netlify.app
# 5. Deploy automático
# ⚠️ Sleep mode después de 15 min inactividad
```

#### Opción B: Backend en Railway (Alternativa)
```bash
# 1. Crear PostgreSQL database en Railway ($5 gratis/mes, requiere tarjeta)
# 2. Crear servicio desde GitHub
# 3. Root path: backend
# 4. Variables de entorno (igual que Render)
# 5. Deploy automático
# ✅ Sin sleep mode
```

#### Frontend en Netlify (Ambas opciones)
```bash
# 1. Crear sitio en Netlify.com (100% gratis)
# 2. Conectar repo de GitHub
# 3. Configurar build:
#    - Base: frontend
#    - Build: npm install && npm run build
#    - Publish: frontend/dist
# 4. Variable de entorno:
#    - VITE_API_URL=<URL de tu backend en Render o Railway>
# 5. Deploy automático
```

### URLs de Producción

#### Si usas Render:
- **Frontend:** `https://tu-app.netlify.app`
- **Backend API:** `https://tu-app.onrender.com`
- **Health Check:** `https://tu-app.onrender.com/api/health`
- **⚠️ Nota:** Sleep mode tras 15 min inactividad (~30s wake-up)

#### Si usas Railway:
- **Frontend:** `https://tu-app.netlify.app`
- **Backend API:** `https://tu-app.up.railway.app`
- **Health Check:** `https://tu-app.up.railway.app/api/health`

---

## 🧪 Testing (Próximamente)

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# Bruno API Tests
# Importar colección desde backend/api-requests/
```

---

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.jsx` (ej: `PlayerCard.jsx`)
- Hooks: `camelCase.js` (ej: `useAuth.js`)
- Utilidades: `camelCase.js` (ej: `formatDate.js`)

### Git Commits
```bash
feat: agregar módulo de jugadores
fix: corregir validación de formulario
style: actualizar tema UEFA en header
perf: optimizar query de equipos
docs: actualizar README
```

---

## 🤝 Contribución

Este proyecto sigue estrictos estándares de calidad:

1. **Leer skills** antes de desarrollar
2. **Seguir convenciones** del contexto-proyecto.md
3. **Componentes < 200 líneas**
4. **Performance first** - optimizar siempre
5. **UX/UI consistent** - tema UEFA en todo
6. **Git Bash only** - no PowerShell/CMD

---

## 📄 Licencia

Proyecto educativo - FIFPRO2K26

---

## 📞 Contacto

Proyecto desarrollado con asistencia de IA Agent  
**Fecha:** Marzo 2026

---

**¡Listo para comenzar cuando reciba la orden!** 🚀⚽
