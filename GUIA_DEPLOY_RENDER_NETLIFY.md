# 🚀 Guía Completa de Despliegue - Render + Netlify

## 📋 Resumen de la Arquitectura

- **Backend + Base de Datos**: Render (PostgreSQL + Express API)
- **Frontend**: Netlify (React SPA estático)

**Ventajas:**
- ✅ Backend en Render con PostgreSQL incluido (100% GRATIS)
- ✅ Frontend en Netlify con CDN global (100% GRATIS)
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS automático en ambos
- ✅ Fácil de usar
- ✅ No requiere tarjeta de crédito

---

## 📦 Requisitos Previos

- [x] Cuenta en GitHub
- [x] Cuenta en Render (https://render.com) - 100% gratis, no se requiere tarjeta
- [x] Cuenta en Netlify (https://netlify.com) - 100% gratis
- [x] Código en repositorio de GitHub

---

## 🎯 PARTE 1: Desplegar Backend en Render

### Paso 1.1: Crear Cuenta en Render

1. **Ir a Render.com**
   - Visita: https://render.com
   - Click en "Get Started for Free"
   - Regístrate con GitHub (recomendado) o email

2. **Verificar Email**
   - Revisa tu bandeja de entrada
   - Click en el link de verificación

### Paso 1.2: Crear Base de Datos PostgreSQL

1. **Crear PostgreSQL Database**
   - En el Dashboard de Render, click en "New +"
   - Selecciona "PostgreSQL"

2. **Configurar Database**
   - **Name**: `fifpro2k26-db` (o el nombre que prefieras)
   - **Database**: `fifpro2k26`
   - **User**: (se crea automáticamente)
   - **Region**: Elegir la más cercana (ej: Oregon - USA)
   - **Plan**: **Free** (seleccionar el plan gratuito)

3. **Crear Database**
   - Click en "Create Database"
   - Espera 1-2 minutos mientras se provisiona

4. **Copiar Connection String**
   - Una vez creada, busca "Internal Database URL" o "External Database URL"
   - Click en "Copy" al lado de "Internal Database URL"
   - **Guardar esta URL** - la necesitarás en el siguiente paso

   Ejemplo:
   ```
   postgresql://user:password@dpg-xxxxx.oregon-postgres.render.com/fifpro2k26_db
   ```

### Paso 1.3: Crear Web Service (Backend API)

1. **Crear Nuevo Web Service**
   - En Dashboard, click en "New +" → "Web Service"
   - Conectar con GitHub si aún no lo has hecho
   - Selecciona tu repositorio: `PROYECTO FULLSTACK FIFPRO2K26`
   - Click en "Connect"

2. **Configurar Web Service**
   
   **Configuración Básica:**
   - **Name**: `fifpro2k26-api` (o el nombre que prefieras)
   - **Region**: Misma región que la base de datos (Oregon)
   - **Branch**: `master` (o `main`)
   - **Root Directory**: `backend` ⚠️ **MUY IMPORTANTE**
   - **Runtime**: Node
   - **Build Command**: 
     ```
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```
     npm start
     ```
   - **Plan**: **Free** (seleccionar plan gratuito)

3. **Configurar Variables de Entorno**
   
   Scroll down hasta "Environment Variables" y agrega:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `<pegar la Internal Database URL que copiaste antes>`

   **Variable 2:**
   - Key: `NODE_ENV`
   - Value: `production`

   **Variable 3:**
   - Key: `JWT_SECRET`
   - Value: `<generar un secreto seguro con el comando de abajo>`

   **Variable 4:**
   - Key: `JWT_EXPIRES_IN`
   - Value: `7d`

   **Variable 5:**
   - Key: `CORS_ORIGIN`
   - Value: `https://tu-app.netlify.app` (actualizar después con la URL real de Netlify)

   **Generar JWT_SECRET seguro:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Crear Web Service**
   - Verifica que todo esté correcto
   - Click en "Create Web Service"

### Paso 1.4: Esperar el Deploy

1. **Ver Logs del Build**
   - Render comenzará a hacer el build automáticamente
   - Verás los logs en tiempo real
   - El proceso incluirá:
     - Clonar el repositorio
     - Instalar dependencias
     - Generar Prisma Client
     - Ejecutar migraciones
     - Iniciar el servidor

2. **Tiempo de Espera**
   - Primera vez: 5-10 minutos
   - Siguientes deploys: 3-5 minutos

3. **Verificar que Terminó**
   - Espera hasta ver "Your service is live 🎉"
   - El estado cambiará a "Live" (verde)

### Paso 1.5: Obtener URL del Backend

1. **Copiar URL**
   - En la parte superior de tu Web Service, verás una URL como:
     ```
     https://fifpro2k26-api.onrender.com
     ```
   - Click en el ícono de copiar
   - **Guardar esta URL** - la necesitarás para Netlify

2. **Probar la API**
   - Abre en tu navegador:
     ```
     https://tu-app.onrender.com/api/health
     ```
   
   - Deberías ver:
     ```json
     {
       "status": "ok",
       "message": "FIFPRO2K26 API - UEFA Champions League Theme",
       "timestamp": "2026-03-29T..."
     }
     ```

### Paso 1.6: Ejecutar Seed (Opcional - Datos de Ejemplo)

Si quieres poblar la base de datos con datos iniciales:

**Opción 1: Desde Render Shell**
1. En tu Web Service → pestaña "Shell"
2. Ejecutar:
   ```bash
   npx prisma db seed
   ```

**Opción 2: Desde tu máquina local**
```bash
# Copiar DATABASE_URL de Render
export DATABASE_URL="postgresql://user:pass@dpg-xxxx.render.com/db"

# Ejecutar seed
cd backend
npx prisma db seed
```

---

## 🌐 PARTE 2: Desplegar Frontend en Netlify

### Paso 2.1: Crear Cuenta en Netlify

1. **Ir a Netlify**
   - Visita: https://app.netlify.com
   - Click en "Sign up"
   - Regístrate con GitHub (recomendado)

2. **Autorizar Netlify**
   - Permite acceso a GitHub

### Paso 2.2: Crear Nuevo Sitio

1. **Importar Proyecto**
   - Click en "Add new site" → "Import an existing project"
   - Click en "Deploy with GitHub"
   - Autoriza Netlify para acceder a tus repositorios
   - Busca y selecciona: `PROYECTO FULLSTACK FIFPRO2K26`

### Paso 2.3: Configurar Build Settings

1. **Configuración del Sitio**
   - **Branch to deploy**: `master` (o `main`)
   - **Base directory**: `frontend` ⚠️ **MUY IMPORTANTE**
   - **Build command**: 
     ```
     npm install && npm run build
     ```
   - **Publish directory**: 
     ```
     frontend/dist
     ```

2. **Variables de Entorno**
   
   Click en "Show advanced" →  "New variable":

   **Variable 1:**
   - Key: `VITE_API_URL`
   - Value: `https://tu-app.onrender.com/api` (tu URL de Render + /api)

   Ejemplo: `https://fifpro2k26-api.onrender.com/api`

3. **Deploy Site**
   - Click en "Deploy site"
   - Netlify comenzará el build

### Paso 2.4: Esperar el Deploy

1. **Ver Production Deploys**
   - Verás el progreso del build
   - Espera 2-4 minutos

2. **Verificar Completado**
   - Estado cambia a "Published"
   - Verás un mensaje de éxito

### Paso 2.5: Obtener URL de Netlify

1. **Copiar URL**
   - Netlify asigna una URL aleatoria como:
     ```
     https://random-name-12345.netlify.app
     ```

2. **Cambiar Nombre (Opcional)**
   - Site settings → "Change site name"
   - Elige algo como: `fifpro2k26`
   - Tu URL será: `https://fifpro2k26.netlify.app`

### Paso 2.6: Verificar Frontend

1. **Abrir la Aplicación**
   - Visita tu URL de Netlify
   - Deberías ver la aplicación con tema UEFA Champions League

2. **Probar Navegación**
   - Click en "Login"
   - Click en "Register"
   - Verifica que carga sin errores

---

## 🔄 PARTE 3: Conectar Frontend y Backend

### Paso 3.1: Actualizar CORS en Render

Ahora que tienes la URL de Netlify, debes actualizar el backend:

1. **Volver a Render**
   - Ve a tu Web Service del backend
   - Pestaña "Environment"

2. **Editar CORS_ORIGIN**
   - Busca la variable `CORS_ORIGIN`
   - Click en "Edit"
   - Cambiar valor a tu URL de Netlify:
     ```
     https://fifpro2k26.netlify.app
     ```
   - ⚠️ **Sin la barra final** `/`

3. **Guardar Cambios**
   - Click en "Save Changes"
   - Render hará redeploy automático (1-2 minutos)

### Paso 3.2: Verificar Conexión

1. **Abrir App de Netlify**
   - Visita `https://tu-app.netlify.app`

2. **Probar Funcionalidades**
   - Crear cuenta nueva
   - Iniciar sesión
   - Ver equipos
   - Ver jugadores
   - Ver partidos
   - Crear alineación

3. **Verificar Sin Errores**
   - Abrir DevTools (F12)
   - Pestaña Console
   - No debe haber errores CORS

---

## 🔄 PARTE 4: CI/CD - Despliegue Automático

### Auto-Deploy Configurado

Ambos servicios están configurados para auto-deploy:

1. **Hacer Cambios en el Código**
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin master
   ```

2. **Deploy Automático**
   - ✅ Render detecta el push y redeploya backend (3-5 min)
   - ✅ Netlify detecta el push y redeploya frontend (2-3 min)

3. **Ver Progreso**
   - Render: Dashboard → Events
   - Netlify: Dashboard → Deploys

### Preview Deployments (Netlify)

Netlify crea previews para cada Pull Request:

1. Crear PR en GitHub
2. Netlify genera URL de preview automáticamente
3. Probar cambios antes de mergear
4. Al mergear a master → deploy a producción

---

## 📊 PARTE 5: Monitoreo y Mantenimiento

### Render - Backend

**Ver Logs:**
1. Dashboard → Tu Web Service
2. Pestaña "Logs"
3. Ver logs en tiempo real

**Métricas:**
- CPU usage
- Memory usage
- HTTP requests

**Base de Datos:**
1. Dashboard → Tu PostgreSQL database
2. Pestaña "Info" → Ver connection string
3. Conectar con cliente PostgreSQL externo o Prisma Studio

**Shell Access:**
- Pestaña "Shell" → Terminal interactivo
- Ejecutar comandos directamente en el servidor

### Netlify - Frontend

**Deploy Log:**
- Dashboard → Deploys
- Click en cualquier deploy para ver log completo

**Analytics:**
- Dashboard → Analytics (plan de pago)
- O usar Google Analytics gratis

**Functions (si usas):**
- Netlify puede servir functions serverless también

---

## 🐛 Troubleshooting

### Backend no se conecta a la base de datos

**Síntoma:** Error `P1001: Can't reach database server`

**Solución:**
1. Verificar que PostgreSQL esté activo en Render
2. Verificar `DATABASE_URL` en variables de entorno
3. Usar "Internal Database URL" (no External)
4. Ver logs del Web Service para más detalles

### Frontend no se conecta al Backend

**Síntoma:** Errores CORS o "Network Error"

**Solución:**
1. Verificar `VITE_API_URL` en variables de Netlify
2. Asegurar que incluya `/api` al final
3. Verificar `CORS_ORIGIN` en Render
4. Verificar que backend esté "Live"

### Build falla en Render

**Síntoma:** "Build failed" en Render

**Solución:**
1. Verificar logs del build
2. Asegurar Root Directory = `backend`
3. Verificar que `package.json` exista en backend/
4. Verificar que `prisma/schema.prisma` exista

### Render Web Service está "Sleeping"

**Síntoma:** Primera petición tarda mucho (30 segundos)

**Explicación:**
- El plan gratuito de Render pone servicios inactivos después de 15 minutos sin uso
- La primera petición "despierta" el servicio (esto es normal)

**Solución:**
- Usar un servicio de "keep-alive" como UptimeRobot (gratis)
- O aceptar el delay inicial (es parte del tier gratuito)

### Migraciones no se ejecutan

**Síntoma:** Tablas no existen en producción

**Solución:**
```bash
# Desde Render Shell (pestaña Shell del Web Service)
npx prisma migrate deploy

# O desde local
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

---

## 💰 Costos y Límites

### Render Free Tier

**Web Service (Backend):**
- ✅ 750 horas/mes (suficiente para 1 servicio 24/7)
- ✅ Shared CPU
- ✅ 512 MB RAM
- ✅ HTTPS gratis
- ⏸️ Se "duerme" después de 15 min inactivo
- ⏱️ "Wake up" en ~30 segundos en primera petición

**PostgreSQL:**
- ✅ 1GB storage
- ✅ Disponible 90 días consecutivos
- ✅ Después de 90 días se pausa (pero no se borra)
- ✅ Puedes crear nueva database gratis después

### Netlify Free Tier

- ✅ 100 GB bandwidth/mes
- ✅ 300 build minutos/mes
- ✅ Sites ilimitados
- ✅ HTTPS gratis
- ✅ CDN global

**Uso estimado del proyecto:**
- Gratis con tráfico bajo-medio
- Frontend estático consume muy poco

---

## 🔐 Seguridad en Producción

### Checklist de Seguridad

- [x] `JWT_SECRET` único y seguro (64+ caracteres)
- [x] `CORS_ORIGIN` específico (no `*`)
- [x] HTTPS habilitado (automático)
- [x] Variables de entorno en servicios (no en código)
- [x] `.env` en `.gitignore`
- [x] Helmet.js habilitado (ya está)
- [x] Backups de BD (considerar plan de pago o export manual)

### Rotar JWT_SECRET

1. Generar nuevo secret
2. Actualizar en Render → Environment
3. Render redeploya automáticamente
4. ⚠️ Usuarios deberán volver a iniciar sesión

---

## 📝 Resumen de URLs

**Desarrollo:**
- Backend local: `http://localhost:3000`
- Frontend local: `http://localhost:5173`

**Producción:**
- Frontend: `https://tu-app.netlify.app`
- Backend: `https://tu-app.onrender.com`
- API Health: `https://tu-app.onrender.com/api/health`
- Database: Solo accesible desde backend de Render

---

## 🆚 Render vs Railway - Diferencias

| Feature | Render (Gratis) | Railway ($5 crédito) |
|---------|-----------------|----------------------|
| Web Service | ✅ 750h/mes | ✅ Incluido |
| PostgreSQL | ✅ 1GB, 90 días | ✅ Incluido |
| Sleep after idle | ✅ 15 min | ❌ No sleep |
| Wake up time | ~30 segundos | Instantáneo |
| Tarjeta requerida | ❌ No | ✅ Sí |
| Build time | 5-10 min | 2-5 min |

**Conclusión:** Render es 100% gratis pero con limitación de "sleep". Railway es más rápido pero requiere tarjeta.

---

## 🎉 ¡Listo!

Tu aplicación está completamente desplegada en Render + Netlify.

**Próximos pasos:**
1. ✅ Probar todas las funcionalidades
2. ✅ Compartir con usuarios
3. ✅ Monitorear logs en Render
4. ✅ Configurar dominio personalizado (opcional)
5. ✅ Configurar UptimeRobot para mantener despierto (opcional)

---

## 📚 Recursos Adicionales

- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Prisma Docs:** https://www.prisma.io/docs
- **UptimeRobot:** https://uptimerobot.com (mantener servicio despierto)

---

**¿Problemas?** Revisa la sección de Troubleshooting o consulta los logs en Render/Netlify.
