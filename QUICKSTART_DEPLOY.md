# ⚡ Guía Rápida - Deploy 100% Gratis

## 🎯 Opciones de Deployment

### Opción 1: Render + Netlify (Más Simple)
- **Backend + DB**: Render (100% GRATIS)
- **Frontend**: Netlify (100% GRATIS, más fácil)

### Opción 2: Render + Vercel (Más Rápido)
- **Backend + DB**: Render (100% GRATIS)
- **Frontend**: Vercel (100% GRATIS, CDN más rápido)

---

## 📋 Checklist Rápido

### 🎨 Render (Backend + PostgreSQL)

1. **Crear PostgreSQL en Render:**
   - https://render.com → "New +" → "PostgreSQL"
   - Name: `fifpro2k26-db`
   - Plan: **Free**
   - Copiar "Internal Database URL"

2. **Crear Web Service:**
   - "New +" → "Web Service" → GitHub repo
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start: `npm start`

3. **Variables de entorno:**
   ```
   DATABASE_URL=<pegar Internal Database URL>
   NODE_ENV=production
   JWT_SECRET=<generar>
   CORS_ORIGIN=https://tu-app.netlify.app
   ```

4. **Deploy:**
   - Crear servicio
   - Esperar build (5-10 min primera vez)
   - Copiar URL: `https://tu-app.onrender.com`

### 🌐 Frontend - Opción A: Netlify (⭐ Más Simple)

1. **Crear sitio en Netlify:**
   - https://app.netlify.com → "Add new site"
   - Conectar GitHub → Seleccionar repo

2. **Configurar Build:**
   - Base: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `frontend/dist`

3. **Variables de entorno:**
   ```
   VITE_API_URL=https://tu-app.onrender.com/api
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Obtener URL de Netlify

### 🚀 Frontend - Opción B: Vercel (⭐ Más Rápido)

1. **Importar proyecto en Vercel:**
   - https://vercel.com → "Add New..." → "Project"
   - Conectar GitHub → Seleccionar repo

2. **Configurar Build:**
   - Framework Preset: Vite (auto-detectado)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto)
   - Output Directory: `dist` (auto)

3. **Variables de entorno:**
   ```env
   VITE_API_URL=https://tu-app.onrender.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Obtener URL de Vercel: `https://tu-app.vercel.app`

**🏆 Ventaja de Vercel:**
- CDN Edge más rápido
- 6000 build min/mes (vs 300 de Netlify)
- Analytics incluidos

### 🔄 Actualizar CORS

Volver a Render → Web Service → Environment:
- `CORS_ORIGIN` = URL de tu frontend (Netlify o Vercel, sin `/` al final)
- Render redeploya automáticamente

Ejemplos:
```env
# Si usas Netlify:
CORS_ORIGIN=https://tu-app.netlify.app

# Si usas Vercel:
CORS_ORIGIN=https://tu-app.vercel.app
```

---

## ✅ Verificación

- **Backend:** https://tu-app.onrender.com/api/health
- **Frontend Netlify:** https://tu-app.netlify.app
- **Frontend Vercel:** https://tu-app.vercel.app
- **Probar:** Login, crear cuenta, ver datos
- ⚠️ **Nota:** Primera petición puede tardar 30s (servicio gratuito se "duerme")

---

## 🔧 Comandos Útiles

### Generar JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
ender (local)
```bash
# Copiar DATABASE_URL de Render (Internal Database URL)
# Copiar DATABASE_URL de Railway
export DATABASE_URL="postgresql://..."

# Ejecutar migraciones
cd backend
npx prisma migrate deploy

# Seed (opcional)
npx prisma db seed

# Prisma Studio
npx prisma studio
```

---

## 📝 Variables de Entorno
ender (Backend)
```env
DATABASE_URL=<Internal Database URL de Render>
NODE_ENV=production
JWT_SECRET=<64_caracteres_aleatorios>
CORS_ORIGIN=https://tu-app.netlify.app
```

### Netlify (Frontend)
```env
VITE_API_URL=https://tu-app.onrender.com
VITE_API_URL=https://tu-app.up.railway.app/api
```

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|ender |
| DB error | Verificar PostgreSQL activo, usar Internal URL |
| Build falla | Revisar logs, verificar Root Directory |
| 404 en rutas | Verificar `netlify.toml` en frontend |
| Servicio lento | Primera petición "despierta" servicio (30s)y |
| 404 en rutas | Verificar `netlify.toml` en frontend |

---s Completas
- **Render + Netlify:** [GUIA_DEPLOY_RENDER_NETLIFY.md](GUIA_DEPLOY_RENDER_NETLIFY.md) ⭐ **RECOMENDADO**
- **Railway + Netlify:** [GUIA_DEPLOY_RAILWAY_NETLIFY.md](GUIA_DEPLOY_RAILWAY_NETLIFY.md) (alternativa de pago
## 📖 Guía Completa
Ver [GUIA_DEPLOY_RAILWAY_NETLIFY.md](GUIA_DEPLOY_RAILWAY_NETLIFY.md)
