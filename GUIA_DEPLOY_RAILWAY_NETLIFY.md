# 🚀 Guía Completa de Despliegue - Railway + Netlify

## 📋 Resumen de la Arquitectura

- **Backend + Base de Datos**: Railway (PostgreSQL + Express API)
- **Frontend**: Netlify (React SPA estático)

**Ventajas:**
- ✅ Backend en Railway con PostgreSQL incluido (gratis)
- ✅ Frontend en Netlify con CDN global (gratis)
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS automático en ambos
- ✅ Fácil de escalar

---

## 📦 Requisitos Previos

- [x] Cuenta en GitHub
- [x] Cuenta en Railway (https://railway.app) - Free tier: $5/mes de crédito
- [x] Cuenta en Netlify (https://netlify.com) - Free tier ilimitado
- [x] Código en repositorio de GitHub

---

## 🎯 PARTE 1: Desplegar Backend en Railway

### Paso 1.1: Crear Cuenta y Proyecto en Railway

1. **Ir a Railway.app**
   - Visita: https://railway.app
   - Click en "Start a New Project"
   - Autoriza con GitHub

2. **Crear Nuevo Proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Busca y selecciona tu repositorio: `PROYECTO FULLSTACK FIFPRO2K26`

### Paso 1.2: Configurar PostgreSQL

1. **Agregar Base de Datos**
   - En el proyecto de Railway, click en "+ New"
   - Selecciona "Database" → "Add PostgreSQL"
   - Railway creará automáticamente una base de datos PostgreSQL

2. **Conectar Base de Datos al Backend**
   - Railway automáticamente inyectará la variable `DATABASE_URL`
   - No necesitas configurarla manualmente

### Paso 1.3: Configurar el Servicio Backend

1. **Configurar Root Directory**
   - Click en el servicio de tu repositorio
   - En Settings → "Root Directory"
   - Configurar: `backend`

2. **Configurar Variables de Entorno**
   - En Settings → "Variables"
   - Agregar las siguientes variables:

   ```env
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<generar_un_secreto_seguro>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://tu-app.netlify.app
   ```

   **Generar JWT_SECRET seguro:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Configurar Build y Start Commands**
   - En Settings → "Build Command":
     ```bash
     npm install && npm run build
     ```
   
   - En Settings → "Start Command":
     ```bash
     npm start
     ```

### Paso 1.4: Deploy del Backend

1. **Hacer Deploy**
   - Click en "Deploy"
   - Railway ejecutará:
     - `npm install`
     - `npx prisma generate`
     - `npx prisma migrate deploy`
     - `npm start`

2. **Esperar el Build** (2-5 minutos)
   - Verás los logs en tiempo real
   - Espera hasta ver "Deployment successful"

3. **Obtener la URL del Backend**
   - En Settings → "Domains"
   - Railway genera automáticamente algo como: `https://tu-app.up.railway.app`
   - Click en "Generate Domain" si no existe
   - **Guarda esta URL** - la necesitarás para el frontend

### Paso 1.5: Verificar el Deployment del Backend

1. **Probar Health Check**
   - Abre en tu navegador:
     ```
     https://tu-app.up.railway.app/api/health
     ```
   
   - Deberías ver:
     ```json
     {
       "status": "ok",
       "message": "FIFPRO2K26 API - UEFA Champions League Theme",
       "timestamp": "2026-03-29T..."
     }
     ```

2. **Ver Logs**
   - En Railway, ve a la pestaña "Deployments"
   - Click en el deployment activo
   - Revisa los logs para verificar que no haya errores

### Paso 1.6: Ejecutar Migraciones (Opcional - Seed Data)

Si quieres poblar la base de datos con datos de ejemplo:

1. **Conectarse a la base de datos desde local**
   - En Railway → PostgreSQL service → "Connect"
   - Copia la `DATABASE_URL`

2. **Ejecutar seed desde tu máquina local**
   ```bash
   cd backend
   
   # Configurar DATABASE_URL temporal
   export DATABASE_URL="postgresql://..."  # La URL de Railway
   
   # Ejecutar seed
   npx prisma db seed
   ```

**O ejecutar desde Railway CLI:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ejecutar seed
railway run npx prisma db seed
```

---

## 🌐 PARTE 2: Desplegar Frontend en Netlify

### Paso 2.1: Configurar Variables de Entorno del Frontend

1. **Crear archivo `.env.production` en `frontend/`**
   
   ```bash
   cd frontend
   ```

   Crear archivo `.env.production`:
   ```env
   VITE_API_URL=https://tu-app.up.railway.app/api
   VITE_APP_NAME=FIFPRO2K26
   VITE_APP_VERSION=1.0.0
   ```

   **⚠️ IMPORTANTE**: Reemplaza `https://tu-app.up.railway.app` con tu URL real de Railway.

2. **Actualizar CORS en Railway**
   
   Vuelve a Railway → Backend → Variables:
   - Edita `CORS_ORIGIN`
   - Cambia por tu URL de Netlify (la obtendrás en el siguiente paso)
   - Si aún no la tienes, usa: `*` temporalmente (cambiar después)

### Paso 2.2: Configurar Netlify

1. **Ir a Netlify**
   - Visita: https://app.netlify.com
   - Click en "Add new site" → "Import an existing project"

2. **Conectar GitHub**
   - Autoriza Netlify con GitHub
   - Selecciona el repositorio: `PROYECTO FULLSTACK FIFPRO2K26`

3. **Configurar Build Settings**
   
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`

4. **Configurar Variables de Entorno**
   
   - En "Site settings" → "Environment variables"
   - Click "Add a variable"
   - Agregar:
     ```
     VITE_API_URL = https://tu-app.up.railway.app/api
     ```

### Paso 2.3: Deploy del Frontend

1. **Click en "Deploy site"**
   - Netlify ejecutará:
     - `npm install`
     - `npm run build`
   - Espera 2-3 minutos

2. **Obtener URL de Netlify**
   - Netlify genera algo como: `https://random-name-123.netlify.app`
   - Puedes cambiar el nombre en "Site settings" → "Change site name"

### Paso 2.4: Actualizar CORS en Railway

Ahora que tienes la URL de Netlify:

1. **Volver a Railway**
   - Ve a tu proyecto → Backend service → Variables
   - Edita `CORS_ORIGIN`
   - Cambia de `*` a: `https://tu-app.netlify.app`
   - **Importante**: Sin la barra final `/`

2. **Redeploy del Backend**
   - Railway hará redeploy automáticamente al cambiar variables
   - O manualmente: Settings → "Redeploy"

### Paso 2.5: Verificar el Frontend

1. **Abrir tu app de Netlify**
   ```
   https://tu-app.netlify.app
   ```

2. **Probar funcionalidades:**
   - ✅ La página carga con tema UEFA
   - ✅ Navegar a /login
   - ✅ Crear cuenta nueva
   - ✅ Iniciar sesión
   - ✅ Ver equipos/jugadores/partidos

---

## 🔄 PARTE 3: CI/CD - Despliegue Automático

### Configuración Automática

Ambos servicios (Railway y Netlify) están configurados para **auto-deploy**:

1. **Hacer cambios en tu código**
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin master
   ```

2. **Deploy automático:**
   - ✅ Railway detecta el push y redeploya el backend
   - ✅ Netlify detecta el push y redeploya el frontend

3. **Ver progreso:**
   - Railway: Pestaña "Deployments"
   - Netlify: Dashboard → "Deploys"

### Preview Deployments (Netlify)

Netlify crea previews automáticos para cada Pull Request:

1. Crear un Pull Request en GitHub
2. Netlify genera una URL de preview
3. Probar los cambios antes de mergear
4. Al mergear, se deploya a producción

---

## 📊 PARTE 4: Monitoreo y Mantenimiento

### Railway - Backend

**Ver Logs:**
1. Railway → Tu proyecto → Backend service
2. Pestaña "Deployments" → Click en deployment activo
3. Ver logs en tiempo real

**Métricas:**
- CPU usage
- Memory usage
- Network traffic

**Base de Datos:**
1. Railway → PostgreSQL service → "Data"
2. Ver tablas y datos directamente
3. O usar Prisma Studio localmente:
   ```bash
   # Copiar DATABASE_URL de Railway
   export DATABASE_URL="postgresql://..."
   npx prisma studio
   ```

### Netlify - Frontend

**Analytics:**
- Dashboard → "Analytics"
- Ver tráfico, bandwidth, requests

**Logs:**
- Dashboard → "Functions" (si usas functions)
- "Deploy log" para cada deployment

**Performance:**
- Lighthouse integrado
- Core Web Vitals

---

## 🐛 Troubleshooting

### Backend no se conecta a la base de datos

**Síntoma:** Error `P1001: Can't reach database server`

**Solución:**
1. Verificar que PostgreSQL esté activo en Railway
2. Verificar que `DATABASE_URL` esté correctamente inyectada
3. Ver logs en Railway → Backend → View Logs

### Frontend no se conecta al Backend

**Síntoma:** Errores CORS o "Network Error"

**Solución:**
1. Verificar `VITE_API_URL` en variables de Netlify
2. Verificar `CORS_ORIGIN` en Railway incluya tu dominio de Netlify
3. Verificar que el backend esté activo (health check)

### Migraciones no se ejecutan

**Síntoma:** Tablas no existen en producción

**Solución:**
```bash
# Desde local, conectado a Railway DB
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

O usar Railway CLI:
```bash
railway run npx prisma migrate deploy
```

### Build falla en Railway

**Síntoma:** "Build failed" en Railway

**Solución:**
1. Verificar logs del build
2. Asegurar que `Root Directory = backend`
3. Verificar que `package.json` tenga script `build`
4. Revisar versión de Node (Railway usa la del `package.json` engines)

---

## 💰 Costos y Límites

### Railway Free Tier
- **Crédito:** $5/mes gratis
- **PostgreSQL:** Incluido
- **Límites:**
  - 500 horas de ejecución/mes
  - 1GB RAM
  - 1GB almacenamiento DB
  - Shared CPU

**Uso estimado del proyecto:**
- ~$3-4/mes con tráfico moderado
- Aumenta con más tráfico/queries

### Netlify Free Tier
- **Bandwidth:** 100GB/mes
- **Build minutes:** 300/mes
- **Sites:** Ilimitados
- **Serverless functions:** 125k requests/mes

**Uso estimado del proyecto:**
- Gratis con tráfico bajo-medio
- Frontend estático consume muy poco

---

## 🔐 Seguridad en Producción

### Checklist de Seguridad

- [x] `JWT_SECRET` único y seguro (64+ caracteres)
- [x] `CORS_ORIGIN` configurado solo para tu dominio (no `*`)
- [x] HTTPS habilitado (automático en Railway y Netlify)
- [x] Variables de entorno en servicios (nunca en código)
- [x] `.env` en `.gitignore`
- [x] Helmet.js habilitado en Express (ya está)
- [x] Rate limiting (considerar agregar)
- [x] Backups regulares de BD

### Rotar JWT_SECRET

Si necesitas cambiar el JWT_SECRET:

1. Generar nuevo secret
2. Actualizar en Railway → Variables
3. Railway redeploya automáticamente
4. ⚠️ Todos los usuarios deberán volver a iniciar sesión

---

## 📝 Resumen de URLs

Después del deployment, tendrás:

- **Frontend (Netlify):** `https://tu-app.netlify.app`
- **Backend (Railway):** `https://tu-app.up.railway.app`
- **API Health:** `https://tu-app.up.railway.app/api/health`
- **Database:** Accesible solo desde Railway backend

---

## 🎉 ¡Listo!

Tu aplicación está completamente desplegada en Railway + Netlify.

**Próximos pasos:**
1. ✅ Personalizar nombre del sitio en Netlify
2. ✅ Configurar dominio personalizado (opcional)
3. ✅ Agregar miembros del equipo
4. ✅ Configurar notificaciones de deploy
5. ✅ Monitorear uso y métricas

---

## 📚 Recursos Adicionales

- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **Prisma Docs:** https://www.prisma.io/docs
- **Railway CLI:** https://docs.railway.app/develop/cli

---

**¿Problemas?** Revisa la sección de Troubleshooting o consulta los logs en Railway/Netlify.
