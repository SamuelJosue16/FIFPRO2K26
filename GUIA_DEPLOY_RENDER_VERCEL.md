# 🚀 Guía Completa: Deployment en Render + Vercel

## 📋 Resumen

Esta guía te ayudará a desplegar tu aplicación **FIFPRO2K26** usando:
- **Backend + PostgreSQL**: Render.com (100% GRATIS, sin tarjeta)
- **Frontend**: Vercel (100% GRATIS)

---

## 🎯 ¿Por qué Render + Vercel?

### ✅ Ventajas

**Render (Backend):**
- ✅ $0/mes - 100% gratis
- ✅ NO requiere tarjeta de crédito
- ✅ PostgreSQL incluido (1GB, 90 días)
- ✅ 750 horas/mes de Web Service
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático

**Vercel (Frontend):**
- ✅ $0/mes - 100% gratis
- ✅ Deploy automático desde GitHub
- ✅ Build automático con Vite
- ✅ CDN Edge Network ultra rápido
- ✅ HTTPS automático
- ✅ Preview deployments en cada PR
- ✅ Analytics incluidos

### ⚠️ Limitaciones

**Render:**
- ⚠️ Sleep mode después de 15 minutos de inactividad
- ⚠️ ~30 segundos de wake-up en primera petición

**Vercel:**
- ⚠️ 100GB bandwidth/mes (suficiente para proyectos normales)
- ⚠️ Optimizado para Next.js (pero funciona perfecto con Vite)

---

## 📦 Pre-requisitos

- [x] Cuenta en GitHub
- [x] Repositorio del proyecto en GitHub
- [x] Node.js 18+ instalado localmente
- [ ] Cuenta en Render.com (crear gratis)
- [ ] Cuenta en Vercel.com (crear gratis)

---

## 🔵 PARTE 1: Render (Backend + PostgreSQL)

### 1.1 Crear cuenta en Render

1. Ir a https://render.com
2. Click en **"Get Started for Free"**
3. Registrarse con GitHub (recomendado) o email
4. Verificar email
5. Dashboard listo ✅

---

### 1.2 Crear PostgreSQL Database

1. En el Dashboard de Render, click **"New +"** → **"PostgreSQL"**

2. Configurar la base de datos:
   ```
   Name:          fifpro2k26-db
   Database:      fifpro2k26
   User:          fifpro2k26
   Region:        Oregon (US West) - más rápido para Latinoamérica
   PostgreSQL:    16 (última versión)
   Instance Type: Free
   ```

3. Click **"Create Database"**

4. Esperar ~2 minutos mientras se provisiona

5. **COPIAR URL DE CONEXIÓN:**
   - En la página de detalles, buscar **"Internal Database URL"**
   - Formato: `postgresql://user:pass@dpg-xxxxx/dbname`
   - **GUARDAR ESTA URL** - la necesitarás en el siguiente paso

---

### 1.3 Generar JWT Secret

En tu terminal local, ejecuta:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Esto genera algo como:
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

**GUARDAR ESTE SECRET** - lo usarás en variables de entorno.

---

### 1.4 Crear Web Service (Backend)

1. En el Dashboard de Render, click **"New +"** → **"Web Service"**

2. **Conectar repositorio:**
   - Click **"Build and deploy from a Git repository"** → **Next**
   - Si es primera vez: **"Connect account"** → Autorizar GitHub
   - Seleccionar tu repositorio: `PROYECTO FULLSTACK FIFPRO2K26`
   - Click **"Connect"**

3. **Configurar el servicio:**
   ```
   Name:              fifpro2k26-api
   Region:            Oregon (US West)
   Branch:            master (o main)
   Root Directory:    backend
   Runtime:           Node
   Build Command:     npm install && npx prisma generate && npx prisma migrate deploy
   Start Command:     npm start
   Instance Type:     Free
   ```

4. **Agregar Variables de Entorno:**
   
   Click en **"Advanced"** → **"Add Environment Variable"**
   
   Agregar las siguientes variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgresql://user:pass@dpg-xxxxx/dbname` (copiado en paso 1.2) |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `a1b2c3d4e5f6...` (generado en paso 1.3) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | `https://tu-app.vercel.app` (actualizaremos después) |
   | `PORT` | `3000` |

   > ⚠️ Por ahora usa un placeholder en `CORS_ORIGIN`, lo actualizaremos después.

5. Click **"Create Web Service"**

6. **Esperar el deploy:**
   - Verás los logs en tiempo real
   - El proceso toma 3-5 minutos
   - Verifica que veas:
     ```
     ✅ Prisma schema loaded
     ✅ Migrations applied: 2 migrations
     ✅ Server is running on port 3000
     ```

7. **Obtener URL del Backend:**
   - Una vez completado, verás la URL: `https://fifpro2k26-api.onrender.com`
   - **COPIAR ESTA URL** - la necesitarás para Vercel

---

### 1.5 Verificar Backend

Abre en tu navegador:
```
https://fifpro2k26-api.onrender.com/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "FIFPRO 2K26 API is running",
  "timestamp": "2026-03-29T..."
}
```

✅ **Backend funcionando correctamente**

> ⚠️ **Primera petición:** Si el servicio estaba en sleep, puede tardar ~30 segundos.

---

## 🟢 PARTE 2: Vercel (Frontend)

### 2.1 Crear cuenta en Vercel

1. Ir a https://vercel.com
2. Click en **"Start Deploying"** o **"Sign Up"**
3. **Registrarse con GitHub** (RECOMENDADO)
4. Autorizar Vercel en GitHub
5. Dashboard listo ✅

---

### 2.2 Importar Proyecto

1. En el Dashboard de Vercel, click **"Add New..."** → **"Project"**

2. **Importar repositorio:**
   - Verás lista de tus repos de GitHub
   - Buscar: `PROYECTO FULLSTACK FIFPRO2K26`
   - Click **"Import"**

---

### 2.3 Configurar Build Settings

En la pantalla de configuración del proyecto:

1. **Framework Preset:**
   - Vercel detecta automáticamente: **Vite**
   - Si no lo detecta, seleccionar **"Vite"** manualmente

2. **Root Directory:**
   - Click en **"Edit"** al lado de Root Directory
   - Seleccionar: `frontend`
   - ✅ Confirmar

3. **Build and Output Settings:**
   ```
   Build Command:        npm run build
   Output Directory:     dist
   Install Command:      npm install
   ```
   
   > Vercel detecta esto automáticamente con Vite, pero verifica que sea correcto.

---

### 2.4 Agregar Variables de Entorno

1. Expandir **"Environment Variables"**

2. Agregar la siguiente variable:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://fifpro2k26-api.onrender.com/api` |

   > ⚠️ Reemplaza con la URL real de tu backend (del paso 1.4.7)
   
   > ⚠️ No olvides agregar `/api` al final

3. **Environment:** Dejar en `Production, Preview, and Development` (todas)

---

### 2.5 Deploy

1. Click **"Deploy"**

2. **Esperar el build:**
   - Verás logs en tiempo real
   - Proceso toma 1-3 minutos
   - Verifica:
     ```
     ✅ Installing dependencies...
     ✅ Building production bundle...
     ✅ Uploading build outputs...
     ✅ Deployment ready
     ```

3. **¡Deployment exitoso! 🎉**

---

### 2.6 Obtener URL del Frontend

Una vez completado el deploy:

1. Verás **"Congratulations"** con confetti 🎊
2. Click en **"Continue to Dashboard"**
3. Tu URL será algo como: `https://proyecto-fullstack-fifpro2k26.vercel.app`
4. **COPIAR ESTA URL** - la necesitarás para actualizar CORS

> 💡 **Tip:** Puedes personalizar el dominio en Settings → Domains

---

### 2.7 Verificar Frontend

Abre la URL de Vercel en tu navegador:
```
https://tu-app.vercel.app
```

Deberías ver:
- ✅ Página principal con tema UEFA Champions League
- ✅ Header con logo
- ✅ Footer
- ✅ No hay errores en la consola (F12)

⚠️ **No intentes login aún** - primero debemos conectar el frontend con el backend.

---

## 🔄 PARTE 3: Conectar Frontend y Backend

### 3.1 Actualizar CORS_ORIGIN en Render

Ahora que tenemos la URL de Vercel, debemos permitir que el frontend haga peticiones al backend.

1. **Ir a Render Dashboard:** https://dashboard.render.com

2. Click en tu Web Service: `fifpro2k26-api`

3. En el menú izquierdo, click **"Environment"**

4. Buscar la variable `CORS_ORIGIN`

5. Click en **"Edit"** (icono de lápiz)

6. Cambiar el valor a tu URL de Vercel:
   ```
   https://proyecto-fullstack-fifpro2k26.vercel.app
   ```
   
   > ⚠️ **SIN barra final** `/` al final
   > ⚠️ **Sin** `/api` ni nada más

7. Click **"Save Changes"**

8. **Render redeploya automáticamente:**
   - Esperar 1-2 minutos
   - Ver los logs para confirmar redeploy exitoso

---

### 3.2 Verificar Conexión

1. Abre tu app en Vercel: `https://tu-app.vercel.app`

2. Abre **DevTools** (F12) → **Console**

3. **Probar Registro:**
   - Ir a `/register`
   - Crear una cuenta de prueba
   - Si funciona → ✅ Conexión exitosa

4. **Probar Login:**
   - Ir a `/login`
   - Iniciar sesión con la cuenta creada
   - Deberías ver el dashboard

5. **Verificar sin errores CORS:**
   - No debe haber errores en consola
   - Si ves errores de CORS, verifica el paso 3.1

✅ **Frontend y Backend conectados correctamente**

---

## 🎯 PARTE 4: Testing Completo

### 4.1 Funcionalidades a Probar

- [x] Registro de usuario
- [x] Login
- [x] Ver equipos
- [x] Ver jugadores
- [x] Ver partidos
- [x] Crear alineación (squad)
- [x] Editar perfil
- [x] Logout
- [x] Cambiar tema (dark/light)

### 4.2 Performance

**Primera carga (Render en sleep):**
- Frontend: < 3 segundos
- Backend wake-up: ~30 segundos (solo primera vez)

**Cargas subsecuentes:**
- Frontend: < 1 segundo
- API: < 500ms

### 4.3 Errores Comunes

#### Error: No se conecta al backend

**Solución:**
1. Verificar que `VITE_API_URL` en Vercel tenga `/api` al final
2. Verificar que `CORS_ORIGIN` en Render NO tenga `/` al final
3. Esperar 30s si Render está en sleep

#### Error: CORS policy blocked

**Solución:**
1. Verificar `CORS_ORIGIN` en Render
2. No debe tener espacios ni caracteres extra
3. Debe ser exactamente la URL de Vercel
4. Redeploy en Render si es necesario

#### Error: Prisma migrations failed

**Solución:**
1. Verificar `DATABASE_URL` en Render
2. Ejecutar localmente: `npx prisma migrate deploy`
3. Push cambios y redeploy

---

## 🔧 PARTE 5: Configuración Avanzada (Opcional)

### 5.1 Dominio Personalizado en Vercel

1. Ir a tu proyecto en Vercel
2. Settings → Domains
3. Click **"Add"**
4. Ingresar tu dominio (ej: `fifpro2k26.com`)
5. Vercel te dará instrucciones DNS
6. Configurar DNS en tu proveedor
7. Esperar propagación (5-60 minutos)

**Si usas dominio personalizado:**
- Actualizar `CORS_ORIGIN` en Render con el nuevo dominio
- Actualizar `VITE_API_URL` en Vercel (redeploy automático)

---

### 5.2 Preview Deployments en Vercel

Vercel crea un deploy de preview para cada Pull Request:

1. Crear una rama: `git checkout -b feature/nueva-funcionalidad`
2. Hacer cambios y commit
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request en GitHub
5. **Vercel despliega automáticamente** un preview
6. URL de preview: `https://proyecto-xxxxx-git-feature-nueva-xxx.vercel.app`

Usa esto para probar cambios antes de merge a `master`.

---

### 5.3 Vercel Analytics

Habilitar analytics gratis en Vercel:

1. Ir a tu proyecto en Vercel
2. Analytics tab
3. Click **"Enable"**
4. Instalar paquete en frontend:
   ```bash
   cd frontend
   npm install -D @vercel/analytics
   ```

5. Agregar en `frontend/src/main.jsx`:
   ```javascript
   import { inject } from '@vercel/analytics';
   inject();
   ```

6. Commit y push → deploy automático

---

### 5.4 Seed de Base de Datos (Opcional)

Si quieres poblar la base de datos con datos iniciales:

1. **Conectar localmente a la DB de Render:**
   
   En `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@dpg-xxxxx/dbname"
   ```

2. **Ejecutar seed:**
   ```bash
   cd backend
   npx prisma db seed
   ```

3. Verificar datos en tu app de producción

> ⚠️ **Cuidado:** Esto creará datos reales en producción.

---

### 5.5 Keep-Alive para Render (Evitar Sleep)

Si quieres evitar el sleep mode de Render (opcional):

**Opción 1: Cron Job externo (UptimeRobot)**

1. Crear cuenta en https://uptimerobot.com (gratis)
2. Crear nuevo monitor:
   - Type: HTTP(s)
   - URL: `https://fifpro2k26-api.onrender.com/api/health`
   - Interval: 5 minutes
3. Esto hace ping cada 5 min y mantiene el servicio activo

**Opción 2: Cron Job en Vercel (Serverless Function)**

Crear `frontend/api/cron.js`:
```javascript
export default async function handler(req, res) {
  const response = await fetch('https://fifpro2k26-api.onrender.com/api/health');
  const data = await response.json();
  res.json({ pinged: true, backend: data });
}
```

Luego configurar Vercel Cron Jobs (requiere plan Pro).

> 💡 **Recomendación:** Para proyecto personal, aceptar el sleep mode es razonable.

---

## 📊 Monitoreo y Mantenimiento

### Ver Logs

**Render:**
1. Dashboard → `fifpro2k26-api`
2. Tab "Logs"
3. Ver logs en tiempo real

**Vercel:**
1. Dashboard → Tu proyecto
2. Tab "Deployments"
3. Click en cualquier deployment
4. Ver "Build Logs" o "Function Logs"

---

### Redeploy Manual

**Render:**
1. Dashboard → `fifpro2k26-api`
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Vercel:**
1. Dashboard → Tu proyecto
2. Tab "Deployments"
3. Click en los tres puntos `...` → **"Redeploy"**

---

### Auto Deploy desde GitHub

**Ambas plataformas** despliegan automáticamente cuando haces push a `master`:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master
```

- Render redeploya el backend (~3-5 min)
- Vercel redeploya el frontend (~1-3 min)

---

## 🔒 Seguridad Best Practices

### ✅ Checklist de Seguridad

- [x] `JWT_SECRET` es aleatorio de 64+ caracteres
- [x] `CORS_ORIGIN` es específico (no `*`)
- [x] Variables de entorno están en Render/Vercel (no en código)
- [x] Archivo `.env` está en `.gitignore`
- [x] HTTPS habilitado en ambas plataformas (automático)
- [x] `NODE_ENV=production` en Render
- [x] No hay secrets en el código fuente
- [x] Base de datos solo accesible desde Render (Internal URL)

---

## 🚨 Troubleshooting

### Problema: Vercel no encuentra `frontend/`

**Solución:**
1. Vercel → Project Settings
2. General → Root Directory
3. Cambiar a `frontend`
4. Redeploy

---

### Problema: Build falla en Vercel

**Error típico:** `Cannot find module 'vite'`

**Solución:**
1. Verificar `frontend/package.json` tiene `vite` en dependencies
2. Verificar Build Command: `npm run build`
3. Verificar Install Command: `npm install`
4. Redeploy

---

### Problema: Backend no responde después de 15 min

**Causa:** Render está en sleep mode.

**Solución:**
- Esperar ~30 segundos en la primera petición
- Opcional: Configurar keep-alive (ver sección 5.5)

---

### Problema: Error 500 en API

**Solución:**
1. Ver logs en Render
2. Verificar `DATABASE_URL` es correcta
3. Verificar migraciones aplicadas:
   ```
   Logs debe mostrar:
   ✅ Migrations applied: 2 migrations
   ```
4. Si falta, redeploy manual

---

## 📝 Resumen de URLs

### URLs de Desarrollo
- **Frontend local:** http://localhost:5173
- **Backend local:** http://localhost:3000

### URLs de Producción
- **Frontend:** `https://proyecto-fullstack-fifpro2k26.vercel.app`
- **Backend API:** `https://fifpro2k26-api.onrender.com`
- **Health Check:** `https://fifpro2k26-api.onrender.com/api/health`
- **PostgreSQL:** (solo accesible desde Render internamente)

---

## ✅ Checklist Final

- [ ] Backend desplegado en Render ✅
- [ ] PostgreSQL creada en Render ✅
- [ ] Frontend desplegado en Vercel ✅
- [ ] Variables de entorno configuradas ✅
- [ ] CORS_ORIGIN actualizado ✅
- [ ] Frontend se conecta al backend ✅
- [ ] Login/Registro funcionan ✅
- [ ] Todas las funcionalidades testeadas ✅
- [ ] No hay errores en consola ✅
- [ ] URLs guardadas en lugar seguro ✅

---

## 🎉 ¡Felicidades!

Tu aplicación **FIFPRO2K26** está desplegada y funcionando en producción:

- ✅ **100% GRATIS**
- ✅ **Backend + PostgreSQL:** Render.com
- ✅ **Frontend:** Vercel
- ✅ **HTTPS automático**
- ✅ **Auto-deploy desde GitHub**
- ✅ **CDN global**

---

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite](https://vitejs.dev/guide/)
- [Guía de Prisma](https://www.prisma.io/docs)

---

## 💬 Soporte

Si encuentras problemas:
1. Revisar esta guía
2. Ver logs en Render y Vercel
3. Consultar [COMPARATIVA_PLATAFORMAS.md](COMPARATIVA_PLATAFORMAS.md)
4. Consultar [QUICKSTART_DEPLOY.md](QUICKSTART_DEPLOY.md)

---

**Creado:** Marzo 2026  
**Última actualización:** 29 de Marzo, 2026

