# ✅ FASE 5 COMPLETADA - Sistema de Autenticación

## 🎯 Objetivo
Implementar sistema completo de autenticación con JWT en backend y frontend.

---

## 📦 Backend - Autenticación API

### Dependencias Instaladas
```bash
npm install jsonwebtoken  # Manejo de tokens JWT
# bcryptjs ya estaba instalado de FASE 2
```

### Archivos Creados

#### 1. **authController.js** (358 líneas)
**Ubicación:** `backend/src/controllers/authController.js`

**Métodos implementados:**
- ✅ `register` - Registrar nuevo usuario con validaciones
- ✅ `login` - Iniciar sesión y generar token JWT
- ✅ `getMe` - Obtener perfil del usuario autenticado
- ✅ `updateProfile` - Actualizar nombre y email
- ✅ `changePassword` - Cambiar contraseña con validación

**Validaciones incluidas:**
- Email con formato válido (regex)
- Password mínimo 6 caracteres
- Email único (no duplicados)
- Verificación de credenciales con bcrypt
- Tokens JWT con expiración de 7 días

#### 2. **authMiddleware.js** (100 líneas)
**Ubicación:** `backend/src/middlewares/authMiddleware.js`

**Middlewares:**
- ✅ `authMiddleware` - Verifica token JWT y bloquea acceso no autorizado
- ✅ `optionalAuth` - Verifica token si existe, pero no bloquea

**Funcionalidad:**
- Extrae token del header `Authorization: Bearer TOKEN`
- Valida y decodifica token con jwt.verify()
- Añade `userId` y `userEmail` al objeto `req`
- Manejo de errores: token inválido, token expirado

#### 3. **authRoutes.js** (15 líneas)
**Ubicación:** `backend/src/routes/authRoutes.js`

**Rutas públicas:**
- `POST /api/auth/register` - Crear cuenta
- `POST /api/auth/login` - Iniciar sesión

**Rutas protegidas (requieren token):**
- `GET /api/auth/me` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

#### 4. **auth.http** (Actualizado)
**Ubicación:** `backend/api-requests/auth.http`

Casos de prueba incluidos:
- Registro de usuarios
- Login exitoso
- Obtener perfil con token
- Actualizar perfil
- Cambiar contraseña
- Casos de error (email duplicado, credenciales inválidas, token inválido)

### Integración en server.js
```javascript
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
```

---

## 🎨 Frontend - Sistema de Autenticación

### Archivos Creados

#### 1. **authService.js** (55 líneas)
**Ubicación:** `frontend/src/services/authService.js`

Métodos API:
- `register(userData)` - POST /auth/register
- `login(credentials)` - POST /auth/login
- `getProfile()` - GET /auth/me
- `updateProfile(profileData)` - PUT /auth/profile
- `changePassword(passwords)` - PUT /auth/change-password

#### 2. **AuthContext.jsx** (155 líneas)
**Ubicación:** `frontend/src/context/AuthContext.jsx`

**Estado global:**
```javascript
{
  user: null | Object,
  token: string | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

**Métodos del contexto:**
- `register(userData)` - Registrar y guardar en localStorage
- `login(credentials)` - Login y guardar token
- `logout()` - Limpiar estado y localStorage
- `updateProfile(profileData)` - Actualizar datos del usuario
- `changePassword(passwords)` - Cambiar contraseña

**Persistencia:**
- Token guardado en `localStorage` con clave `auth_token`
- Usuario guardado en `localStorage` con clave `auth_user`
- Verificación automática al montar la app

#### 3. **useAuth.js** (15 líneas)
**Ubicación:** `frontend/src/hooks/useAuth.js`

Hook personalizado para acceder al AuthContext fácilmente:
```javascript
const { user, isAuthenticated, login, logout } = useAuth()
```

#### 4. **LoginPage.jsx** (140 líneas)
**Ubicación:** `frontend/src/pages/auth/LoginPage.jsx`

**Características:**
- Formulario con validación HTML5
- Estados de loading con spinner
- Manejo de errores visualizado
- Redirección automática tras login exitoso
- Link a página de registro
- Credenciales de prueba mostradas

#### 5. **RegisterPage.jsx** (170 líneas)
**Ubicación:** `frontend/src/pages/auth/RegisterPage.jsx`

**Características:**
- Validación de contraseñas coincidentes
- Campos: name, email, password, confirmPassword
- Estados de loading
- Manejo de errores del backend
- Redirección automática tras registro
- Link a página de login

#### 6. **ProtectedRoute.jsx** (30 líneas)
**Ubicación:** `frontend/src/components/auth/ProtectedRoute.jsx`

**Funcionalidad:**
- Verifica si usuario está autenticado
- Muestra spinner mientras carga
- Redirecciona a /login si no está autenticado
- Renderiza children si está autenticado

### Actualizaciones en Archivos Existentes

#### **App.jsx**
```javascript
import { AuthProvider } from './context/AuthContext'

<AuthProvider>
  <BrowserRouter>
    <Routes>
      {/* Rutas de auth sin Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas principales */}
      <Route path="/" element={<Layout />}>
        ...
      </Route>
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

#### **Header.jsx**
Actualizado con:
- Hook `useAuth()` para acceder al estado de autenticación
- Mostrar nombre del usuario cuando está autenticado
- Botón "Cerrar Sesión" para usuarios autenticados
- Botón "Iniciar Sesión" para usuarios no autenticados
- Soporte mobile con menú desplegable

#### **axios.js**
Actualizado interceptor:
```javascript
// Usa 'auth_token' en lugar de 'token'
const token = localStorage.getItem('auth_token')
if (token) {
  config.headers.Authorization = `Bearer ${token}`
}
```

---

## 🔐 Seguridad Implementada

### Backend
- ✅ Hash de contraseñas con bcryptjs (salt rounds: 10)
- ✅ Tokens JWT con secret y expiración
- ✅ Validación de formato de email
- ✅ Validación de longitud de password (mínimo 6 caracteres)
- ✅ Middleware de autenticación en rutas protegidas
- ✅ No exponer contraseñas en respuestas JSON

### Frontend
- ✅ Token almacenado en localStorage (HTTPS en producción)
- ✅ Token incluido automáticamente en headers de Axios
- ✅ Redirección automática si token inválido/expirado
- ✅ Estado de autenticación global con Context API
- ✅ Validación de contraseñas coincidentes en registro

---

## 📊 Flujo de Autenticación

### Registro
1. Usuario completa formulario en `/register`
2. Frontend valida contraseñas coincidentes
3. POST `/api/auth/register` con { name, email, password }
4. Backend valida, hashea password, crea usuario
5. Backend genera token JWT y retorna { user, token }
6. Frontend guarda token y usuario en localStorage
7. Frontend actualiza contexto de autenticación
8. Redirección automática a home (`/`)

### Login
1. Usuario completa formulario en `/login`
2. POST `/api/auth/login` con { email, password }
3. Backend verifica credenciales con bcrypt.compare()
4. Backend genera token JWT si credenciales válidas
5. Frontend guarda token y usuario en localStorage
6. Frontend actualiza contexto de autenticación
7. Redirección automática a home (`/`)

### Persistencia de Sesión
1. Al cargar la app, AuthContext verifica localStorage
2. Si existe token, intenta validarlo con GET `/api/auth/me`
3. Si token válido, restaura sesión automáticamente
4. Si token inválido/expirado, limpia localStorage

### Rutas Protegidas (para futuro uso)
```javascript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🧪 Testing

### Probar con Bruno / REST Client
```http
### Registrar usuario
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@champions.com",
  "password": "test123",
  "name": "Test User"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@champions.com",
  "password": "test123"
}

# Copiar el token de la respuesta

### Obtener perfil (requiere token)
GET http://localhost:3000/api/auth/me
Authorization: Bearer <TOKEN_AQUI>
```

### Probar en la UI
1. Iniciar backend: `cd backend && npm run dev`
2. Iniciar frontend: `cd frontend && npm run dev`
3. Visitar `http://localhost:5173`
4. Hacer click en "Iniciar Sesión"
5. Probar login con credenciales de prueba:
   - Email: admin@fifpro.com
   - Password: Admin123!
6. Verificar que aparece nombre en Header
7. Probar "Cerrar Sesión"
8. Probar registro de nuevo usuario

---

## ✅ Checklist de Completado

### Backend
- [x] Instalar jsonwebtoken
- [x] Crear authController con 5 métodos
- [x] Crear authMiddleware (required y optional)
- [x] Crear authRoutes (3 públicas, 3 protegidas)
- [x] Integrar rutas en server.js
- [x] Actualizar auth.http con casos de prueba

### Frontend
- [x] Crear authService con APIs
- [x] Crear AuthContext con estado global
- [x] Crear hook useAuth
- [x] Crear LoginPage con diseño UEFA
- [x] Crear RegisterPage con validación
- [x] Crear ProtectedRoute component
- [x] Actualizar App.jsx con AuthProvider
- [x] Actualizar Header con login/logout
- [x] Actualizar axios interceptor para auth_token

---

## 🚀 Próximos Pasos (FASE 6)

Posibles mejoras para autenticación:
- [ ] Página de perfil del usuario
- [ ] Función "Olvidé mi contraseña"
- [ ] Refresh tokens para sesiones largas
- [ ] OAuth con Google/Facebook
- [ ] Roles y permisos (admin, user)
- [ ] Two-factor authentication (2FA)

Continuar con FASE 6:
- [ ] Formularios CRUD completos para Teams
- [ ] Formularios CRUD completos para Players
- [ ] Formularios CRUD completos para Matches
- [ ] Páginas de detalle individual
- [ ] Modales para crear/editar
- [ ] Confirmación de eliminación

---

## 📝 Notas Importantes

**Variables de Entorno Recomendadas:**
Crear `.env` en backend con:
```env
JWT_SECRET=tu_secret_super_seguro_aqui_2026
JWT_EXPIRES_IN=7d
```

**Seguridad en Producción:**
- Cambiar JWT_SECRET a valor aleatorio fuerte
- Usar HTTPS (no HTTP)
- Considerar httpOnly cookies en lugar de localStorage
- Implementar rate limiting en rutas de auth
- Agregar CAPTCHA en login/register

**Base de Datos:**
- El modelo User ya existía desde FASE 2
- Los 2 usuarios de seed siguen disponibles:
  - admin@fifpro.com / Admin123!
  - user@fifpro.com / User123!

