# ✅ Checklist de Deployment - Render/Railway + Netlify

## 🎯 Escoge tu Plataforma

- **Opción A: Render** ⭐ RECOMENDADO - 100% gratis, sin tarjeta
- **Opción B: Railway** - $5 gratis/mes, requiere tarjeta, sin sleep

---

## 📋 Pre-Deployment (Ambas Opciones)

- [ ] Leer la guía correspondiente:
  - [ ] Render: [GUIA_DEPLOY_RENDER_NETLIFY.md](GUIA_DEPLOY_RENDER_NETLIFY.md)
  - [ ] Railway: [GUIA_DEPLOY_RAILWAY_NETLIFY.md](GUIA_DEPLOY_RAILWAY_NETLIFY.md)
- [ ] Ver comparación: [COMPARATIVA_PLATAFORMAS.md](COMPARATIVA_PLATAFORMAS.md)
- [ ] Tener cuenta en GitHub
- [ ] Código en repositorio de GitHub (push completo)

---

## 🔵 OPCIÓN A: Render (Backend + Database) ⭐ RECOMENDADO

### Setup Inicial
- [ ] Crear cuenta en https://render.com (NO requiere tarjeta)
- [ ] Verificar email
- [ ] Conectar con GitHub

### Crear PostgreSQL Database
- [ ] Dashboard → "New +" → "PostgreSQL"
- [ ] Name: `fifpro2k26-db`
- [ ] Database: `fifpro2k26`
- [ ] User: `fifpro2k26`
- [ ] Region: Oregon (US West) - más rápido
- [ ] Instance Type: Free
- [ ] Click "Create Database"
- [ ] Esperar ~2 minutos

### Copiar Database URL
- [ ] Ver detalles de la base de datos
- [ ] Copiar "Internal Database URL"
- [ ] Formato: `postgresql://user:pass@host/db`
- [ ] **GUARDAR ESTA URL** (necesaria para el backend)

### Crear Web Service (Backend)
- [ ] Dashboard → "New +" → "Web Service"
- [ ] "Build and deploy from a Git repository" → Next
- [ ] Conectar GitHub y seleccionar repo
- [ ] Configurar:
  - [ ] Name: `fifpro2k26-api`
  - [ ] Region: Oregon (US West)
  - [ ] Root Directory: `backend`
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: Free

### Configurar Variables de Entorno
- [ ] En la configuración del Web Service
- [ ] "Environment" → "Add Environment Variable"
- [ ] Agregar:
  - [ ] `DATABASE_URL` = `<Internal Database URL copiada>`
  - [ ] `NODE_ENV` = `production`
  - [ ] `JWT_SECRET` = `<generar abajo>`
  - [ ] `CORS_ORIGIN` = `https://tu-app.netlify.app` (actualizar después)
  - [ ] `JWT_EXPIRES_IN` = `7d`

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Deploy
- [ ] Click "Create Web Service"
- [ ] Esperar build (3-5 minutos)
- [ ] Ver logs - verificar:
  - [ ] ✅ Prisma generate successful
  - [ ] ✅ Migrations applied
  - [ ] ✅ Server running on port 3000

### Obtener URL
- [ ] Ver URL asignada: `https://fifpro2k26-api.onrender.com`
- [ ] **GUARDAR ESTA URL** (necesaria para Netlify)

### Verificar
- [ ] Abrir: `https://tu-app.onrender.com/api/health`
- [ ] Ver respuesta JSON con status "ok"
- [ ] ⚠️ Puede tardar 30s si está en sleep mode

---

## 🚂 OPCIÓN B: Railway (Backend + Database) - Alternativa

### Setup Inicial
- [ ] Crear cuenta en https://railway.app (Requiere tarjeta)
- [ ] Verificar email
- [ ] Conectar con GitHub

### Crear Proyecto
- [ ] Click en "New Project"
- [ ] "Deploy from GitHub repo"
- [ ] Seleccionar repositorio: `PROYECTO FULLSTACK FIFPRO2K26`

### Configurar PostgreSQL
- [ ] Click "+ New" → "Database"
- [ ] Seleccionar "PostgreSQL"
- [ ] Esperar a que se cree (30 segundos)

### Configurar Backend Service
- [ ] Click en el servicio del repo
- [ ] Settings → Root Directory: `backend`
- [ ] Settings → Variables → Agregar:
  - [ ] `NODE_ENV` = `production`
  - [ ] `JWT_SECRET` = `<generar con comando>`
  - [ ] `CORS_ORIGIN` = `https://tu-app.netlify.app` (actualizar después)
  - [ ] `JWT_EXPIRES_IN` = `7d`

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Build Commands
- [ ] Settings → Build Command: `npm install && npm run build`
- [ ] Settings → Start Command: `npm start`

### Deploy
- [ ] Click "Deploy"
- [ ] Esperar build (2-5 minutos)
- [ ] Ver logs - verificar sin errores

### Obtener URL
- [ ] Settings → Domains
- [ ] Click "Generate Domain"
- [ ] Copiar URL: `https://_____.up.railway.app`
- [ ] **Guardar esta URL** (necesaria para Netlify)

### Verificar
- [ ] Abrir: `https://tu-app.up.railway.app/api/health`
- [ ] Ver respuesta JSON con status "ok"

---

## 🌐 PARTE 3: Netlify (Frontend) - AMBAS OPCIONES

### Setup Inicial
- [ ] Crear cuenta en https://netlify.com
- [ ] Verificar email
- [ ] Conectar con GitHub

### Crear Sitio
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Conectar con GitHub
- [ ] Seleccionar repositorio: `PROYECTO FULLSTACK FIFPRO2K26`

### Configurar Build
- [ ] Base directory: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `frontend/dist`

### Variables de Entorno
- [ ] Site settings → Environment variables
- [ ] Click "Add a variable"
- [ ] Agregar:
  - [ ] Key: `VITE_API_URL`
  - [ ] Value (si usas Render): `https://tu-app.onrender.com/api`
  - [ ] Value (si usas Railway): `https://tu-app.up.railway.app/api`

### Deploy
- [ ] Click "Deploy site"
- [ ] Esperar build (2-3 minutos)
- [ ] Ver deploy log - verificar sin errores

### Obtener URL
- [ ] Netlify asigna URL: `https://random-name-123.netlify.app`
- [ ] Opcional: Site settings → Change site name
- [ ] **Copiar URL de Netlify**

### Verificar
- [ ] Abrir tu URL de Netlify
- [ ] Ver aplicación con tema UEFA
- [ ] Navegar a /login
- [ ] Navegar a /register

---

## 🔄 PARTE 4: Conectar Frontend y Backend

### Si usaste Render:
- [ ] Volver a Render → Web Service
- [ ] Environment → Variables
- [ ] Editar `CORS_ORIGIN`
- [ ] Cambiar a URL de Netlify: `https://tu-app.netlify.app`
- [ ] **Sin barra final `/`**
- [ ] Render redeploya automáticamente
- [ ] Esperar redeploy (2-3 minutos)

### Si usaste Railway:
- [ ] Volver a Railway → Proyecto → Backend service
- [ ] Settings → Variables
- [ ] Editar `CORS_ORIGIN`
- [ ] Cambiar a URL de Netlify: `https://tu-app.netlify.app`
- [ ] **Sin barra final `/`**
- [ ] Railway redeploya automáticamente
- [ ] Esperar redeploy (1-2 minutos)

### Verificar Conexión
- [ ] Abrir app de Netlify
- [ ] Intentar crear cuenta
- [ ] Intentar iniciar sesión
- [ ] Ver que funcione sin errores CORS
- [ ] ⚠️ Si usas Render: Primera petición puede tardar 30s (wake-up)

---

## 🎯 PARTE 5: Testing Final

### Frontend
- [ ] Cargar página principal
- [ ] Crear cuenta nueva
- [ ] Iniciar sesión
- [ ] Ver lista de equipos
- [ ] Ver lista de jugadores
- [ ] Ver lista de partidos
- [ ] Crear alineación (squad)
- [ ] Editar perfil
- [ ] Cerrar sesión

### Backend API
- [ ] Health check (Render): `https://tu-app.onrender.com/api/health`
- [ ] Health check (Railway): `https://tu-app.up.railway.app/api/health`
- [ ] Responde JSON correctamente
- [ ] No hay errores en logs de la plataforma

### Performance
- [ ] Frontend carga rápido (< 3s), o 30s si Render wake-up)
- [ ] Sin errores en consola del navegador

---

## 📊 PARTE 6: Configuración Adicional (Opcional)

### Si usas Render:
- [ ] Ver métricas de uso en dashboard
- [ ] Considerar cron job externo para keep-alive
- [ ] Revisar logs periódicamente

### Si usas Railway:
### Railway
- [ ] Ver métricas de uso
- [ ] Configurar backups de BD (si es necesario)
- [ ] Revisar logs periódicamente

### Netlify
- [ ] Cambiar nombre del sitio
- [ ] Configurar dominio personalizado (opcional)
- [ ] Habilitar analytics (opcional)
- [ ] Ver build logs

### GitHub
- [ ] Configurar protección de rama master
- [ ] Config7: Seguridad

- [ ] Verificar `JWT_SECRET` es seguro (64+ caracteres)
- [ ] Verificar `CORS_ORIGIN` es específico (no `*`)
- [ ] Verificar `.env` NO está en GitHub
- [ ] HTTPS habilitado (automático en ambas plataformas)
- [ ] Variables de entorno en servicios (no en código)

---

## 📝 PARTE 8: Documentación

- [ ] Guardar URLs en lugar seguro:
  - Frontend: `https://_____.netlify.app`
  - Backend Render: `https://_____.onrender.com` (si usaste Render)
  - Backend Railway: `https://_____.up.railway.app` (si usaste Railway)
  
- [ ] Guardar credenciales importantes:
  - Render/Railway login
  - Netlify login
  - JWT_SECRET usado

- [ ] Crear README de deployment personalizado (opcional)

---

## 🎉 ¡Deployment Completado!

### URLs Finales (Render)

- **Frontend:** `https://_______________.netlify.app`
- **Backend:** `https://_______________.onrender.com`
- **API Health:** `https://_______________.onrender.com/api/health`

### URLs Finales (Railway)
---

## 🎉 ¡Deployment Completado!

### URLs Finales

- **Frontend:** `https://_______________.netlify.app`
- **Backend:** `https://_______________.up.railway.app`
- **API Health:** `https://_______________.up.railway.app/api/health`

### Próximos Pasos

- [ ] Compartir aplicación con usuarios
- [ ] Monitorear uso en Railway
- [ ] Revisar analytics en Netlify
- [ ] Hacer cambios y ver auto-deploy funcionar
- [ ] Configurar dominio personalizado (opcional)
- [ ] Agregar más features

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| ❌ CORS error | Verificar `CORS_ORIGIN` en Railway = URL de Netlify (sin `/`) |
| ❌ Can't reach database | Verificar PostgreSQL está activo en Railway |
| ❌ Build falla | Revisar logs, verificar Root Directory |
| ❌ 404 en rutas | Verificar `netlify.toml` en frontend |
| ❌ Frontend no carga | Verificar `VITE_API_URL` en Netlify variables |
| ❌ API no responde | Verificar backend está deployed en Railway |

---

## 📞 Recursos

- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **Guía Completa:** [GUIA_DEPLOY_RAILWAY_NETLIFY.md](GUIA_DEPLOY_RAILWAY_NETLIFY.md)
- **Guía Rápida:** [QUICKSTART_DEPLOY.md](QUICKSTART_DEPLOY.md)

---

**¡Felicidades! Tu app está en producción** 🚀
