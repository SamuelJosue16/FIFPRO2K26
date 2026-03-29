# 🚀 Skill: Performance Guidelines

## 📋 Propósito
Guía completa para mantener la aplicación FIFPRO2K26 rápida, eficiente y con excelente experiencia de usuario en frontend y backend.

---

## 🎯 Objetivos de Performance

### Frontend Targets
- ⚡ First Contentful Paint (FCP): < 1.5s
- ⚡ Largest Contentful Paint (LCP): < 2.5s
- ⚡ Time to Interactive (TTI): < 3.5s
- ⚡ First Input Delay (FID): < 100ms
- ⚡ Cumulative Layout Shift (CLS): < 0.1
- ⚡ Lighthouse Performance Score: > 90

### Backend Targets
- ⚡ API Response Time: < 200ms (promedio)
- ⚡ Database Queries: < 50ms
- ⚡ Concurrent Users: 100+ sin degradación
- ⚡ Memory Usage: < 512MB

---

## 🌐 Frontend Performance

### 1. Bundle Size Optimization

**Regla:** El bundle inicial debe ser < 200KB (gzipped).

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({  // Visualizar tamaño del bundle
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query', 'axios'],
          'ui-vendor': ['@emotion/react', '@emotion/styled', 'framer-motion'],
        },
      },
    },
    // Optimizaciones
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remover console.log en producción
        drop_debugger: true,
      },
    },
    // Chunks más pequeños
    chunkSizeWarningLimit: 500,
  },
});
```

**Análisis de Bundle:**
```bash
# Ver tamaño del bundle
npm run build
npx vite-bundle-visualizer
```

---

### 2. Optimización de Imágenes

**Regla:** Todas las imágenes deben estar optimizadas y en formatos modernos.

```jsx
// ✅ CORRECTO - Imágenes optimizadas

// 1. Usar formatos modernos (WebP, AVIF)
const TeamLogo = ({ team }) => (
  <picture>
    <source srcSet={`${team.logoUrl}.avif`} type="image/avif" />
    <source srcSet={`${team.logoUrl}.webp`} type="image/webp" />
    <img 
      src={`${team.logoUrl}.jpg`} 
      alt={team.name}
      loading="lazy"  // Lazy loading nativo
      width="200"
      height="200"
    />
  </picture>
);

// 2. Lazy loading para imágenes fuera del viewport
const PlayerPhoto = ({ src, alt }) => (
  <img 
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    className="player-photo"
  />
);

// 3. Placeholders mientras carga
const PlayerCard = ({ player }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-uefa-dark animate-pulse" />
      )}
      <img 
        src={player.photo}
        alt={player.name}
        onLoad={() => setImageLoaded(true)}
        className={`transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
```

**Script de Optimización:**
```bash
# Instalar sharp para optimizar imágenes
npm install -D sharp

# Script Node.js para optimizar
# scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath.replace(/\.\w+$/, '.webp'));
  
  await sharp(inputPath)
    .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 70 })
    .toFile(outputPath.replace(/\.\w+$/, '.avif'));
};
```

---

### 3. Code Splitting Estratégico

**Regla:** Dividir código por rutas y cargar solo lo necesario.

```jsx
// ✅ CORRECTO - Code splitting por rutas

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load de páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Players = lazy(() => import('./pages/Players'));
const Teams = lazy(() => import('./pages/Teams'));

// Lazy load de componentes pesados
const Chart = lazy(() => import('./components/HeavyChart'));
const Map = lazy(() => import('./components/StadiumMap'));

// Loader UEFA themed
const SuspenseLoader = () => (
  <div className="min-h-screen bg-uefa-dark flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin text-4xl">⭐</div>
      <p className="text-uefa-gold font-medium">Cargando...</p>
    </div>
  </div>
);

const App = () => (
  <Suspense fallback={<SuspenseLoader />}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/players/*" element={<Players />} />
      <Route path="/teams/*" element={<Teams />} />
    </Routes>
  </Suspense>
);
```

---

### 4. Caché con TanStack Query

**Regla:** Configurar caché agresivo para datos estáticos y moderado para dinámicos.

```jsx
// src/config/queryClient.js

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración por defecto
      staleTime: 1 * 60 * 1000,      // 1 minuto (datos "frescos")
      cacheTime: 5 * 60 * 1000,       // 5 minutos (mantener en caché)
      refetchOnWindowFocus: false,    // No refetch al hacer focus
      refetchOnReconnect: true,       // Sí refetch al reconectar
      retry: 1,                       // Reintentar 1 vez si falla
    },
    mutations: {
      retry: 0,  // No reintentar mutations
    },
  },
});

// Queries con configuración específica
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    staleTime: 10 * 60 * 1000,  // Equipos cambian poco: 10 min stale
    cacheTime: 30 * 60 * 1000,  // Mantener 30 min en caché
  });
};

export const useLiveMatch = (matchId) => {
  return useQuery({
    queryKey: ['match', matchId, 'live'],
    queryFn: () => getLiveMatch(matchId),
    staleTime: 0,               // Siempre "stale" (refetch frecuente)
    refetchInterval: 5000,      // Refetch cada 5 segundos
    enabled: !!matchId,
  });
};

export const usePlayerStats = (playerId) => {
  return useQuery({
    queryKey: ['player', playerId, 'stats'],
    queryFn: () => getPlayerStats(playerId),
    staleTime: 5 * 60 * 1000,   // Stats: 5 min stale
    enabled: !!playerId,
    // Prefetch relacionados
    onSuccess: (data) => {
      if (data.teamId) {
        queryClient.prefetchQuery({
          queryKey: ['team', data.teamId],
          queryFn: () => getTeam(data.teamId),
        });
      }
    },
  });
};
```

---

### 5. Prefetching Inteligente

**Regla:** Prefetch de datos que probablemente el usuario necesitará.

```jsx
// ✅ CORRECTO - Prefetch on hover

const TeamCard = ({ team }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Prefetch de detalle al hacer hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['team', team.id],
      queryFn: () => getTeamDetail(team.id),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  const handleClick = () => {
    navigate(`/team/${team.id}`);
    // Datos ya estarán en caché por el prefetch
  };
  
  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className="team-card cursor-pointer"
    >
      <img src={team.logo} alt={team.name} />
      <h3>{team.name}</h3>
    </div>
  );
};

// Prefetch de página siguiente en paginación
const PlayersList = ({ page }) => {
  const queryClient = useQueryClient();
  const { data } = usePlayers(page);
  
  useEffect(() => {
    // Prefetch página siguiente
    if (data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['players', page + 1],
        queryFn: () => getPlayers(page + 1),
      });
    }
  }, [page, data, queryClient]);
  
  return (/* ... */);
};
```

---

### 6. Web Vitals Monitoring

**Regla:** Monitorear métricas reales de performance en producción.

```jsx
// src/utils/webVitals.js

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);  // Cumulative Layout Shift
    getFID(onPerfEntry);  // First Input Delay
    getFCP(onPerfEntry);  // First Contentful Paint
    getLCP(onPerfEntry);  // Largest Contentful Paint
    getTTFB(onPerfEntry); // Time to First Byte
  }
};

// main.jsx
import { reportWebVitals } from './utils/webVitals';

reportWebVitals((metric) => {
  console.log(metric);
  
  // Opcional: Enviar a analytics
  if (import.meta.env.PROD) {
    sendToAnalytics(metric);
  }
});

const sendToAnalytics = ({ name, value, id }) => {
  // Enviar a Google Analytics, Sentry, etc.
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
};
```

---

## ⚙️ Backend Performance

### 1. Database Query Optimization

**Regla:** Solo seleccionar campos necesarios y usar índices apropiados.

```javascript
// ✅ CORRECTO - Query optimizado con Prisma

// schema.prisma - Índices estratégicos
model Player {
  id        Int      @id @default(autoincrement())
  name      String
  teamId    Int
  position  String
  number    Int
  
  team      Team     @relation(fields: [teamId], references: [id])
  
  // Índices para queries frecuentes
  @@index([teamId])           // Para filtrar por equipo
  @@index([position])         // Para filtrar por posición
  @@index([teamId, number])   // Para buscar jugador por equipo + número
}

// controllers/playerController.js

// ✅ CORRECTO - Select específico
const getPlayers = async (req, res) => {
  const { teamId, position } = req.query;
  
  const players = await prisma.player.findMany({
    where: {
      ...(teamId && { teamId: parseInt(teamId) }),
      ...(position && { position }),
    },
    select: {
      // Solo campos necesarios
      id: true,
      name: true,
      number: true,
      position: true,
      team: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    orderBy: { number: 'asc' },
  });
  
  res.json(players);
};

// ❌ INCORRECTO - Select de todo
const getPlayers = async (req, res) => {
  const players = await prisma.player.findMany({
    include: { team: true },  // Trae TODOS los campos
  });
  res.json(players);
};
```

---

### 2. Paginación en Queries Grandes

**Regla:** Siempre paginar queries que pueden retornar muchos resultados.

```javascript
// ✅ CORRECTO - Paginación cursor-based (más eficiente)

const getPlayers = async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const limitNum = parseInt(limit);
  
  const players = await prisma.player.findMany({
    take: limitNum + 1,  // +1 para saber si hay más
    ...(cursor && {
      skip: 1,
      cursor: { id: parseInt(cursor) },
    }),
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      number: true,
      position: true,
    },
  });
  
  const hasMore = players.length > limitNum;
  const results = hasMore ? players.slice(0, -1) : players;
  const nextCursor = hasMore ? results[results.length - 1].id : null;
  
  res.json({
    data: results,
    nextCursor,
    hasMore,
  });
};

// Alternativa: Paginación offset-based (más simple)
const getPlayersOffset = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const [players, total] = await Promise.all([
    prisma.player.findMany({
      skip,
      take: limitNum,
      orderBy: { id: 'asc' },
    }),
    prisma.player.count(),
  ]);
  
  res.json({
    data: players,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
};
```

---

### 3. Caché en Backend (Redis opcional)

**Regla:** Cachear respuestas costosas con node-cache.

```javascript
// ✅ CORRECTO - Cache en memoria

const NodeCache = require('node-cache');
const cache = new NodeCache({ 
  stdTTL: 300,  // 5 minutos por defecto
  checkperiod: 60  // Limpiar caché expirado cada 60s
});

// Middleware de caché
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    // Guardar respuesta original
    res.originalJson = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.originalJson(body);
    };
    
    next();
  };
};

// Uso en rutas
router.get('/teams', cacheMiddleware(600), getTeams);  // Cache 10 min
router.get('/players', cacheMiddleware(300), getPlayers);  // Cache 5 min

// Invalidar caché al actualizar
router.post('/teams', async (req, res) => {
  const team = await createTeam(req.body);
  cache.del('__express__/api/teams');  // Invalidar caché de teams
  res.json(team);
});
```

---

### 4. Batch Requests

**Regla:** Permitir múltiples queries en una sola request cuando sea apropiado.

```javascript
// ✅ CORRECTO - Endpoint batch

// GET /api/batch?queries=teams,players,matches
router.get('/batch', async (req, res) => {
  const { queries } = req.query;
  const queryList = queries.split(',');
  
  const results = {};
  
  const promises = queryList.map(async (query) => {
    switch(query) {
      case 'teams':
        results.teams = await prisma.team.findMany({ take: 10 });
        break;
      case 'players':
        results.players = await prisma.player.findMany({ take: 20 });
        break;
      case 'matches':
        results.matches = await prisma.match.findMany({ take: 10 });
        break;
    }
  });
  
  await Promise.all(promises);
  
  res.json(results);
});

// En frontend - Una sola request en lugar de 3
const { data } = await axios.get('/api/batch?queries=teams,players,matches');
// data = { teams: [...], players: [...], matches: [...] }
```

---

### 5. Compression

**Regla:** Comprimir todas las respuestas HTTP.

```javascript
// server.js

const express = require('express');
const compression = require('compression');

const app = express();

// Middleware de compresión
app.use(compression({
  level: 6,  // Nivel de compresión (0-9, 6 es un buen balance)
  threshold: 1024,  // Solo comprimir si > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

// Resultado: Respuestas JSON reducidas en ~70-80%
```

---

### 6. Database Connection Pooling

**Regla:** Configurar pool de conexiones apropiado.

```javascript
// prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  // Configuración de pool
  previewFeatures = ["driverAdapters"]
}

// src/config/database.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Para SQLite no hay pool, pero con PostgreSQL/MySQL:
  // datasources: {
  //   db: {
  //     url: process.env.DATABASE_URL,
  //   },
  // },
});

// Shutdown graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

---

## 📊 Monitoring y Profiling

### 1. Logging de Performance

```javascript
// middleware/performanceLogger.js

const performanceLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log si la request es lenta
    if (duration > 1000) {
      console.warn(`[SLOW] ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Opcional: Enviar a servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      sendToMonitoring({
        method: req.method,
        path: req.path,
        duration,
        statusCode: res.statusCode,
      });
    }
  });
  
  next();
};

app.use(performanceLogger);
```

### 2. Memory Monitoring

```javascript
// utils/memoryMonitor.js

const logMemoryUsage = () => {
  const usage = process.memoryUsage();
  
  console.log({
    rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,  // Total
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(usage.external / 1024 / 1024)} MB`,
  });
};

// Log cada 5 minutos en desarrollo
if (process.env.NODE_ENV === 'development') {
  setInterval(logMemoryUsage, 5 * 60 * 1000);
}
```

---

## ✅ Performance Checklist

### Frontend
- [ ] Bundle inicial < 200KB gzipped
- [ ] Todas las imágenes optimizadas (WebP/AVIF)
- [ ] Lazy loading de rutas y componentes pesados
- [ ] TanStack Query con caché configurado
- [ ] Listas largas virtualizadas
- [ ] Debouncing en inputs de búsqueda
- [ ] Prefetching de datos probables
- [ ] Web Vitals monitoreados

### Backend
- [ ] Queries con select específico
- [ ] Índices en campos filtrados frecuentemente
- [ ] Paginación en todas las listas
- [ ] Compresión  habilitada
- [ ] Caché en endpoints estáticos
- [ ] Logging de requests lentas
- [ ] Pool de conexiones configurado

---

**Monitorear constantemente y optimizar basado en datos reales, no suposiciones.**
