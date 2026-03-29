# 📋 PLAN DE IMPLEMENTACIÓN - MI EQUIPO (Squad Builder)

## 🎯 Objetivo General

Crear una vista interactiva estilo **FIFA Ultimate Team** que permita a los usuarios:
- Seleccionar jugadores de su colección personal
- Armar alineaciones tácticas con formaciones predefinidas
- Visualizar el equipo en un campo de fútbol con diseño UEFA Champions League
- Guardar y gestionar múltiples alineaciones

Esta funcionalidad **reemplazará la pestaña de Partidos** en la navegación principal.

---

## 🖼️ Referencia Visual

**Diseño basado en:** FIFA Ultimate Team Squad Builder
- Campo de fútbol en vista táctica (verde)
- Cartas de jugadores posicionadas según formación
- Interfaz drag & drop para asignar posiciones
- Selector de formación táctica
- Visualización de química/estadísticas del equipo

---

## 📊 Análisis de Componentes Necesarios

### **1. Backend - Base de Datos**

#### **1.1 Nuevo Modelo: `Squad` (Alineación)**

```prisma
model Squad {
  id          String   @id @default(uuid())
  userId      String   // Dueño de la alineación
  name        String   // Nombre del equipo (ej: "Mi Equipo Titular")
  formation   String   // Formación: "4-3-3", "4-2-3-1", "4-2-4"
  positions   String   // JSON con posiciones: { "GK": playerId, "LB": playerId, ... }
  isActive    Boolean  @default(true) // Alineación activa/inactiva
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

**Estructura del campo `positions` (JSON):**
```json
{
  "GK": "player-id-1",
  "LB": "player-id-2",
  "CB1": "player-id-3",
  "CB2": "player-id-4",
  "RB": "player-id-5",
  "CM1": "player-id-6",
  "CM2": "player-id-7",
  "CM3": "player-id-8",
  "LW": "player-id-9",
  "ST": "player-id-10",
  "RW": "player-id-11"
}
```

#### **1.2 Relación User-Squad**

Actualizar modelo `User`:
```prisma
model User {
  // ... campos existentes
  squads      Squad[]
}
```

---

### **2. Backend - API Endpoints**

#### **Controlador: `squadController.js`**

**Endpoints a crear:**

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/squads` | Obtener todas las alineaciones del usuario | ✅ |
| GET | `/api/squads/:id` | Obtener una alineación específica | ✅ |
| POST | `/api/squads` | Crear nueva alineación | ✅ |
| PUT | `/api/squads/:id` | Actualizar alineación | ✅ |
| DELETE | `/api/squads/:id` | Eliminar alineación | ✅ |
| PUT | `/api/squads/:id/positions` | Actualizar solo las posiciones | ✅ |
| PUT | `/api/squads/:id/formation` | Cambiar formación | ✅ |

**Validaciones:**
- Verificar que el usuario solo acceda a sus propias alineaciones
- Validar que los jugadores asignados existan en la base de datos
- Validar formaciones permitidas: `["4-3-3", "4-2-3-1", "4-2-4"]`
- Validar que no se asignen dos jugadores a la misma posición
- Opcional: Validar que el jugador sea compatible con la posición (portero en GK, etc.)

---

### **3. Frontend - Estructura de Rutas**

#### **3.1 Actualizar Router**

**Archivo: `App.jsx`**

```jsx
// ANTES:
<Route path="/matches" element={<MatchesPage />} />

// DESPUÉS:
<Route path="/my-team" element={<MyTeamPage />} />
```

#### **3.2 Actualizar Header**

**Archivo: `Header.jsx`**

```jsx
// Cambiar enlace de "Partidos" a "Mi Equipo"
<NavLink to="/my-team">⚽ Mi Equipo</NavLink>
```

---

### **4. Frontend - Componentes Principales**

#### **4.1 MyTeamPage (Página Principal)**

**Archivo: `frontend/src/pages/squad/MyTeamPage.jsx`**

**Estructura:**

```
┌─────────────────────────────────────────────┐
│  HEADER: Mi Equipo | [Guardar] [Cargar]    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌────────────────────┐  │
│  │  SIDEBAR     │  │   CAMPO (CANVAS)   │  │
│  │              │  │                    │  │
│  │ Formación:   │  │      🟢            │  │
│  │ [4-3-3 ▼]    │  │    Jugadores      │  │
│  │              │  │    posicionados   │  │
│  │ Jugadores    │  │                    │  │
│  │ Disponibles: │  │                    │  │
│  │              │  │                    │  │
│  │ [Card 1]     │  │                    │  │
│  │ [Card 2]     │  │                    │  │
│  │ [Card 3]     │  │                    │  │
│  │ ...          │  │                    │  │
│  └──────────────┘  └────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Estados y hooks:**
```jsx
const [selectedFormation, setSelectedFormation] = useState('4-3-3')
const [squadPositions, setSquadPositions] = useState({}) // { GK: player, LB: player, ... }
const [availablePlayers, setAvailablePlayers] = useState([]) // Jugadores sin asignar
const [currentSquad, setCurrentSquad] = useState(null) // Alineación cargada

// Hooks
const { data: players } = usePlayers() // Todos los jugadores
const { data: squads } = useSquads() // Alineaciones del usuario
const createSquadMutation = useCreateSquad()
const updateSquadMutation = useUpdateSquad()
```

**Funciones principales:**
- `handleFormationChange(formation)` - Cambiar formación y reorganizar
- `handlePlayerSelect(player, position)` - Asignar jugador a posición
- `handlePlayerRemove(position)` - Quitar jugador de posición
- `handleSaveSquad()` - Guardar alineación en backend
- `handleLoadSquad(squadId)` - Cargar alineación existente
- `handleClearSquad()` - Limpiar todas las posiciones

---

#### **4.2 FootballField (Canvas del Campo)**

**Archivo: `frontend/src/components/squad/FootballField.jsx`**

**Props:**
```jsx
{
  formation: "4-3-3",
  positions: { GK: player, LB: player, ... },
  onPositionClick: (position) => {},
  onPlayerRemove: (position) => {}
}
```

**Características:**
- Fondo verde estilo campo de fútbol UEFA
- Líneas del campo (área grande, área chica, centro)
- Slots de posiciones según formación (círculos o rectángulos)
- Cartas de jugadores miniaturizadas en sus posiciones
- Click en posición vacía para abrir selector
- Click en jugador asignado para ver opciones (remover, cambiar)

**Coordenadas de posiciones por formación:**

```javascript
const FORMATION_POSITIONS = {
  '4-3-3': {
    GK: { top: '85%', left: '50%' },
    LB: { top: '65%', left: '10%' },
    CB1: { top: '65%', left: '35%' },
    CB2: { top: '65%', left: '65%' },
    RB: { top: '65%', left: '90%' },
    CM1: { top: '40%', left: '25%' },
    CM2: { top: '40%', left: '50%' },
    CM3: { top: '40%', left: '75%' },
    LW: { top: '15%', left: '20%' },
    ST: { top: '10%', left: '50%' },
    RW: { top: '15%', left: '80%' }
  },
  '4-2-3-1': {
    GK: { top: '85%', left: '50%' },
    LB: { top: '65%', left: '10%' },
    CB1: { top: '65%', left: '35%' },
    CB2: { top: '65%', left: '65%' },
    RB: { top: '65%', left: '90%' },
    CDM1: { top: '50%', left: '35%' },
    CDM2: { top: '50%', left: '65%' },
    CAM1: { top: '30%', left: '20%' },
    CAM2: { top: '25%', left: '50%' },
    CAM3: { top: '30%', left: '80%' },
    ST: { top: '10%', left: '50%' }
  },
  '4-2-4': {
    GK: { top: '85%', left: '50%' },
    LB: { top: '65%', left: '10%' },
    CB1: { top: '65%', left: '35%' },
    CB2: { top: '65%', left: '65%' },
    RB: { top: '65%', left: '90%' },
    CM1: { top: '45%', left: '35%' },
    CM2: { top: '45%', left: '65%' },
    LW: { top: '15%', left: '15%' },
    ST1: { top: '10%', left: '38%' },
    ST2: { top: '10%', left: '62%' },
    RW: { top: '15%', left: '85%' }
  }
}
```

---

#### **4.3 PlayerSelectorModal**

**Archivo: `frontend/src/components/squad/PlayerSelectorModal.jsx`**

**Props:**
```jsx
{
  isOpen: boolean,
  position: "LW" | "ST" | "GK" | ...,
  availablePlayers: Player[],
  onSelect: (player) => {},
  onClose: () => {}
}
```

**Características:**
- Modal con lista de jugadores disponibles
- Filtro por posición compatible (opcional)
- Búsqueda por nombre
- Cards de jugadores con foto, nombre, posición, stats
- Click en jugador para seleccionar
- Indicador visual si jugador ya está asignado

---

#### **4.4 SquadPlayerCard (Mini)**

**Archivo: `frontend/src/components/squad/SquadPlayerCard.jsx`**

**Props:**
```jsx
{
  player: Player,
  position: "GK",
  size: "small" | "medium",
  onRemove: () => {},
  showStats: boolean
}
```

**Diseño:**
- Carta estilo FUT reducida (80x120px)
- Foto del jugador o emoji de posición
- Número de camiseta
- Rating general (calculado o estático)
- Nombre abreviado
- Posición
- Colores del equipo como borde/fondo

---

#### **4.5 SquadSidebar**

**Archivo: `frontend/src/components/squad/SquadSidebar.jsx`**

**Props:**
```jsx
{
  formation: "4-3-3",
  onFormationChange: (formation) => {},
  availablePlayers: Player[],
  onPlayerDragStart: (player) => {},
  savedSquads: Squad[],
  onLoadSquad: (squadId) => {}
}
```

**Secciones:**

1. **Selector de Formación**
   ```jsx
   <select>
     <option value="4-3-3">4-3-3 (Ataque)</option>
     <option value="4-2-3-1">4-2-3-1 (Equilibrado)</option>
     <option value="4-2-4">4-2-4 (Ultra Ataque)</option>
   </select>
   ```

2. **Jugadores Disponibles**
   - Lista con scroll de todos los jugadores del usuario
   - Indicador de qué jugadores ya están en el campo
   - Búsqueda/filtro rápido

3. **Alineaciones Guardadas** (opcional)
   - Dropdown o lista de squads guardados
   - Botón "Cargar" para cada uno

---

### **5. Frontend - Servicios y Hooks**

#### **5.1 Squad Service**

**Archivo: `frontend/src/services/squadService.js`**

```javascript
export const squadApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/squads')
    return response.data
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`/squads/${id}`)
    return response.data
  },
  
  create: async (squadData) => {
    const response = await axiosInstance.post('/squads', squadData)
    return response.data
  },
  
  update: async (id, squadData) => {
    const response = await axiosInstance.put(`/squads/${id}`, squadData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await axiosInstance.delete(`/squads/${id}`)
    return response.data
  },
  
  updatePositions: async (id, positions) => {
    const response = await axiosInstance.put(`/squads/${id}/positions`, { positions })
    return response.data
  }
}
```

#### **5.2 Custom Hooks**

**Archivo: `frontend/src/hooks/useSquads.js`**

```javascript
export const useSquads = () => {
  return useQuery({
    queryKey: ['squads'],
    queryFn: squadApi.getAll,
    select: (data) => data.data
  })
}

export const useSquad = (id) => {
  return useQuery({
    queryKey: ['squads', id],
    queryFn: () => squadApi.getById(id),
    select: (data) => data.data,
    enabled: !!id
  })
}

export const useCreateSquad = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: squadApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    }
  })
}

export const useUpdateSquad = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => squadApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    }
  })
}

export const useDeleteSquad = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: squadApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    }
  })
}
```

---

### **6. Lógica de Interacción**

#### **6.1 Flujo: Asignar Jugador a Posición**

1. Usuario hace click en **slot vacío** del campo
2. Se abre `PlayerSelectorModal` con lista de jugadores disponibles
3. Usuario selecciona jugador
4. Jugador se asigna a la posición en `squadPositions`
5. Jugador se remueve de `availablePlayers`
6. Se actualiza el canvas del campo

#### **6.2 Flujo: Remover Jugador**

1. Usuario hace click en **jugador asignado** en el campo
2. Aparece tooltip o mini-modal con opción "Remover"
3. Usuario confirma
4. Jugador se remueve de `squadPositions`
5. Jugador regresa a `availablePlayers`
6. Slot queda vacío en el campo

#### **6.3 Flujo: Cambiar Formación**

1. Usuario selecciona nueva formación en dropdown
2. Se calcula el mapeo de posiciones antiguas a nuevas:
   - Portero siempre se mantiene
   - Defensas se distribuyen según nueva formación
   - Mediocampistas se reorganizan
   - Delanteros se ajustan
3. Posiciones incompatibles se marcan como "no asignadas"
4. Se actualiza el canvas con nuevas coordenadas
5. Usuario puede reasignar jugadores manualmente

**Mapeo sugerido:**
```javascript
const positionMapping = {
  '4-3-3 -> 4-2-3-1': {
    GK: 'GK',
    LB: 'LB',
    CB1: 'CB1',
    CB2: 'CB2',
    RB: 'RB',
    CM1: 'CDM1',
    CM2: 'CAM2',
    CM3: 'CDM2',
    LW: 'CAM1',
    ST: 'ST',
    RW: 'CAM3'
  },
  // ... otros mapeos
}
```

#### **6.4 Flujo: Guardar Alineación**

1. Usuario hace click en "Guardar Alineación"
2. Se abre mini-modal pidiendo nombre (ej: "Mi Equipo Principal")
3. Se valida que haya al menos 11 jugadores asignados
4. Se envía POST a `/api/squads` con:
   ```json
   {
     "name": "Mi Equipo Principal",
     "formation": "4-3-3",
     "positions": { ... }
   }
   ```
5. Backend guarda y responde con el squad creado
6. Frontend actualiza lista de alineaciones guardadas

---

### **7. Diseño Visual (Tema UEFA)**

#### **7.1 Campo de Fútbol**

**Colores:**
- Fondo campo: `linear-gradient(180deg, #2d5016 0%, #1a3d0a 100%)` (verde césped)
- Líneas del campo: `rgba(255, 255, 255, 0.3)` (blancas semitransparentes)
- Área grande: borde blanco 2px
- Círculo central: borde blanco 2px

**Textura (opcional):**
- Agregar patrón de rayas diagonales sutiles para simular césped cortado

#### **7.2 Slots de Posiciones**

**Vacíos:**
```css
.position-slot {
  background: rgba(0, 102, 204, 0.2);
  border: 3px dashed #FFD700;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s;
}

.position-slot:hover {
  background: rgba(255, 215, 0, 0.3);
  border-color: #FFD700;
  transform: scale(1.1);
}
```

**Ocupados:**
- Mostrar carta del jugador escalada al 70%
- Borde dorado brillante
- Sombra pronunciada

#### **7.3 Sidebar**

```css
.squad-sidebar {
  background: linear-gradient(180deg, #001D3D 0%, #003F88 100%);
  border-right: 3px solid #FFD700;
  padding: 20px;
  overflow-y: auto;
}
```

#### **7.4 Botones de Acción**

- **Guardar:** `btn-uefa-primary` (dorado)
- **Cargar:** `btn-uefa-secondary` (transparente con borde dorado)
- **Limpiar:** `bg-red-600` (rojo)

---

### **8. Validaciones y Reglas de Negocio**

#### **8.1 Frontend**

- ✅ No permitir asignar el mismo jugador a dos posiciones
- ✅ Advertir si la formación tiene slots vacíos
- ✅ Mostrar mensaje si no hay jugadores disponibles
- ✅ Validar nombre de alineación (1-50 caracteres)

#### **8.2 Backend**

- ✅ Verificar que el usuario sea dueño de la alineación
- ✅ Validar que los jugadores existan en la base de datos
- ✅ Validar que la formación sea una de las permitidas
- ✅ No permitir más de 11 jugadores en una alineación
- ✅ (Opcional) Validar compatibilidad posición-jugador

---

### **9. Mejoras Futuras (Post-MVP)**

#### **9.1 Drag & Drop**

- Arrastrar jugadores desde sidebar al campo
- Arrastrar jugadores entre posiciones
- Biblioteca sugerida: `react-beautiful-dnd` o HTML5 Drag API

#### **9.2 Estadísticas del Equipo**

- Rating general del equipo (promedio)
- Química (basada en nacionalidad, liga, equipo)
- Estadísticas acumuladas (goles totales, etc.)

#### **9.3 Comparación de Alineaciones**

- Ver dos squads lado a lado
- Comparar estadísticas

#### **9.4 Sustitutos (Banca)**

- Agregar 7 posiciones de suplentes
- Total: 11 titulares + 7 suplentes = 18 jugadores

#### **9.5 Exportar/Compartir**

- Generar imagen PNG del squad
- Compartir enlace público de la alineación
- Código de squad para importar

#### **9.6 Múltiples Squads**

- Crear varios squads (ej: "Titular", "Rotación", "Jóvenes")
- Selector de squad activo

---

## 📅 Cronograma de Implementación

### **FASE 1: Backend (2-3 horas)**

- [ ] Crear modelo `Squad` en Prisma schema
- [ ] Migrar base de datos
- [ ] Crear `squadController.js` con 7 endpoints
- [ ] Crear rutas protegidas en `squadRoutes.js`
- [ ] Probar endpoints con REST Client

### **FASE 2: Frontend - Servicios (30 min)**

- [ ] Crear `squadService.js`
- [ ] Crear `useSquads.js` con 5 hooks

### **FASE 3: Frontend - Componentes Básicos (3-4 horas)**

- [ ] Crear `MyTeamPage.jsx` (estructura y lógica)
- [ ] Crear `SquadSidebar.jsx` (selector de formación + lista jugadores)
- [ ] Crear `PlayerSelectorModal.jsx`
- [ ] Crear `SquadPlayerCard.jsx` (versión mini)

### **FASE 4: Frontend - Campo de Fútbol (4-5 horas)**

- [ ] Crear `FootballField.jsx` (canvas con diseño)
- [ ] Implementar posicionamiento según formaciones
- [ ] Agregar interactividad (click en slots)
- [ ] Estilos UEFA theme

### **FASE 5: Integración y Lógica (2-3 horas)**

- [ ] Conectar sidebar con campo
- [ ] Implementar asignación/remoción de jugadores
- [ ] Implementar cambio de formación
- [ ] Implementar guardar/cargar alineaciones

### **FASE 6: Navegación (30 min)**

- [ ] Actualizar `App.jsx` (remover `/matches`, agregar `/my-team`)
- [ ] Actualizar `Header.jsx` (cambiar enlace)
- [ ] Verificar navegación funcional

### **FASE 7: Pruebas y Ajustes (1-2 horas)**

- [ ] Probar flujo completo de creación de squad
- [ ] Probar cambio de formaciones
- [ ] Probar guardado y carga
- [ ] Ajustes de diseño responsive
- [ ] Validaciones y manejo de errores

### **FASE 8: Documentación (30 min)**

- [ ] Crear `FASE_7_MI_EQUIPO_COMPLETADA.md`
- [ ] Documentar uso de la feature
- [ ] Screenshots/GIFs de demostración

---

## 🎨 Wireframe Simplificado

```
╔═══════════════════════════════════════════════════════════════╗
║  🏆 MI EQUIPO                    [💾 Guardar] [📂 Cargar]    ║
╠═══════════════════╦═══════════════════════════════════════════╣
║  SIDEBAR          ║           CAMPO DE FÚTBOL                 ║
║  ════════════     ║   ┌─────────────────────────────────┐     ║
║                   ║   │                                 │     ║
║  Formación:       ║   │        LW    ST     RW         │     ║
║  ┌──────────────┐ ║   │         🟡    🟡    🟡         │     ║
║  │ 4-3-3     ▼  │ ║   │                                 │     ║
║  └──────────────┘ ║   │    CM1    CM2    CM3           │     ║
║                   ║   │     🟡     🟡     🟡            │     ║
║  Buscar:          ║   │                                 │     ║
║  [__________🔍]   ║   │  LB   CB1  CB2   RB            │     ║
║                   ║   │   🟡   🟡   🟡   🟡            │     ║
║  Jugadores:       ║   │                                 │     ║
║  ┌──────────────┐ ║   │         GK                     │     ║
║  │ [Messi]      │ ║   │         🟡                     │     ║
║  │ [Ronaldo]    │ ║   │                                 │     ║
║  │ [Haaland]    │ ║   └─────────────────────────────────┘     ║
║  │ [Mbappé]     │ ║                                           ║
║  │ ...          │ ║   Rating General: 85 ⭐                   ║
║  └──────────────┘ ║                                           ║
╚═══════════════════╩═══════════════════════════════════════════╝
```

---

## 🔧 Tecnologías y Librerías

### **Nuevas (a instalar):**

- **react-beautiful-dnd** (opcional): Drag & Drop avanzado
  ```bash
  npm install react-beautiful-dnd
  ```

- **html2canvas** (opcional): Exportar squad como imagen
  ```bash
  npm install html2canvas
  ```

### **Existentes (ya disponibles):**

- ✅ TanStack Query: Gestión de estado servidor
- ✅ Axios: HTTP requests
- ✅ TailwindCSS: Estilos
- ✅ React Router: Navegación

---

## ✅ Checklist de Entrega

### **Backend:**
- [ ] Modelo `Squad` creado y migrado
- [ ] 7 endpoints funcionando con autenticación
- [ ] Validaciones implementadas
- [ ] Probado con REST Client

### **Frontend:**
- [ ] Vista `/my-team` funcionando
- [ ] 3 formaciones implementadas (4-3-3, 4-2-3-1, 4-2-4)
- [ ] Asignar/remover jugadores funcional
- [ ] Guardar alineaciones funcional
- [ ] Cargar alineaciones funcional
- [ ] Diseño responsive
- [ ] Tema UEFA aplicado

### **Integración:**
- [ ] Navegación actualizada (botón "Mi Equipo" en header)
- [ ] Ruta `/matches` removida
- [ ] Sin errores en consola
- [ ] Probado en navegador

### **Documentación:**
- [ ] README actualizado con nueva funcionalidad
- [ ] Archivo de documentación de fase creado

---

## 🚀 Comandos Útiles

### **Backend - Migración:**
```bash
cd backend
npx prisma migrate dev --name add_squad_model
npx prisma generate
```

### **Iniciar servidores:**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## 📝 Notas Técnicas

### **Cálculo de Rating General (opcional):**

```javascript
function calculatePlayerRating(player) {
  const stats = JSON.parse(player.statistics || '{}')
  
  // Fórmula simple basada en estadísticas
  const goalsScore = (stats.goals || 0) * 0.4
  const assistsScore = (stats.assists || 0) * 0.3
  const matchesScore = (stats.matches || 0) * 0.2
  const cardsScore = ((stats.yellowCards || 0) + (stats.redCards || 0) * 2) * -0.1
  
  const rating = Math.min(99, Math.max(50, 75 + goalsScore + assistsScore + matchesScore + cardsScore))
  
  return Math.round(rating)
}
```

### **Sincronización de Estado:**

```javascript
// En MyTeamPage.jsx

useEffect(() => {
  if (players) {
    // Filtrar jugadores que NO están en squadPositions
    const assigned = Object.values(squadPositions).map(p => p?.id)
    const available = players.filter(p => !assigned.includes(p.id))
    setAvailablePlayers(available)
  }
}, [players, squadPositions])
```

---

## 🎯 Resultado Esperado

Al finalizar la implementación, el usuario podrá:

1. ✅ Acceder a `/my-team` desde el menú principal
2. ✅ Ver un campo de fútbol estilo UEFA Champions League
3. ✅ Seleccionar formación táctica (4-3-3, 4-2-3-1, 4-2-4)
4. ✅ Hacer click en posiciones vacías para asignar jugadores
5. ✅ Ver cartas de jugadores posicionadas en el campo
6. ✅ Remover jugadores de posiciones
7. ✅ Guardar alineaciones con nombre personalizado
8. ✅ Cargar alineaciones previamente guardadas
9. ✅ Ver lista de jugadores disponibles en sidebar
10. ✅ Experimentar UI fluida, responsive y temática UEFA

---

## 📌 Prioridades

### **MVP (Mínimo Viable):**
- [x] Backend: CRUD de squads
- [x] Vista básica del campo
- [x] 3 formaciones
- [x] Asignar/remover jugadores (click básico)
- [x] Guardar/cargar alineaciones

### **Nice to Have:**
- [ ] Drag & Drop
- [ ] Estadísticas del equipo
- [ ] Exportar como imagen
- [ ] Sustitutos/banca
- [ ] Múltiples squads

### **Futuro:**
- [ ] Química entre jugadores
- [ ] Simulador de partidos con el squad
- [ ] Comparador de alineaciones
- [ ] Modo táctica avanzada (instrucciones personalizadas)

---

**¡Listo para implementar! 🚀⚽**
