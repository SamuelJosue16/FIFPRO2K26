# ⚡ Skill: React Optimization

## 📋 Propósito
Este skill guía la creación de componentes React optimizados, evitando renders innecesarios y manteniendo el código limpio y mantenible.

---

## 🎯 Reglas Fundamentales

### 1. Componentes Pequeños y Enfocados

**Regla:** Un componente debe tener UNA responsabilidad y no exceder 200 líneas.

```jsx
// ❌ INCORRECTO - Componente monolítico (500+ líneas)
const PlayerPage = () => {
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // ... 50+ líneas de lógica
  // ... 400+ líneas de JSX
  return (/* componente gigante */);
};

// ✅ CORRECTO - Componentes separados
const PlayerPage = () => {
  const { id } = useParams();
  const { data: player, isLoading } = usePlayer(id);
  
  if (isLoading) return <PlayerPageSkeleton />;
  
  return (
    <div className="container mx-auto p-6">
      <PlayerHeader player={player} />
      <PlayerStats playerId={player.id} />
      <PlayerMatches playerId={player.id} />
    </div>
  );
};

// Cada sub-componente en su propio archivo
// PlayerHeader.jsx - < 100 líneas
// PlayerStats.jsx - < 150 líneas
// PlayerMatches.jsx - < 150 líneas
```

---

### 2. React.memo para Componentes Pesados

**Regla:** Usar `React.memo` cuando el componente:
- Recibe props que no cambian frecuentemente
- Renderiza contenido costoso (listas, gráficos)
- Se renderiza múltiples veces en la página

```jsx
// ✅ CORRECTO - Card memoizado
const PlayerCard = React.memo(({ player, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(player.id)}
      className="player-card bg-uefa-dark rounded-lg p-4 hover:scale-105 transition-transform"
    >
      <img src={player.photo} alt={player.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-bold text-white mt-2">{player.name}</h3>
      <p className="text-uefa-silver">{player.position}</p>
    </div>
  );
});

PlayerCard.displayName = 'PlayerCard';

// Cuando se usa en lista:
const PlayersList = ({ players }) => {
  const handleSelect = useCallback((id) => {
    navigate(`/player/${id}`);
  }, [navigate]);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {players.map(player => (
        <PlayerCard 
          key={player.id} 
          player={player} 
          onSelect={handleSelect}  // Misma referencia gracias a useCallback
        />
      ))}
    </div>
  );
};
```

---

### 3. useMemo para Cálculos Costosos

**Regla:** Usar `useMemo` cuando:
- Se realizan cálculos complejos (filtros, ordenamientos, agregaciones)
- Se procesan arrays grandes
- Se crean objetos/arrays que se pasan como props

```jsx
// ✅ CORRECTO - Filtrado memoizado
const TeamPlayers = ({ teamId }) => {
  const { data: allPlayers } = useQuery({ queryKey: ['players'], queryFn: getPlayers });
  
  // Memoizar el filtrado costoso
  const teamPlayers = useMemo(() => {
    if (!allPlayers) return [];
    
    return allPlayers
      .filter(p => p.teamId === teamId)
      .sort((a, b) => a.number - b.number)
      .map(p => ({
        ...p,
        fullName: `${p.firstName} ${p.lastName}`,
        age: calculateAge(p.birthDate)
      }));
  }, [allPlayers, teamId]);  // Solo recalcula si cambian estas dependencias
  
  return (
    <div>
      {teamPlayers.map(player => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};

// ❌ INCORRECTO - Recalcula en cada render
const TeamPlayers = ({ teamId }) => {
  const { data: allPlayers } = useQuery({ queryKey: ['players'], queryFn: getPlayers });
  
  // Esto se ejecuta en CADA render, incluso si allPlayers no cambió
  const teamPlayers = allPlayers
    ?.filter(p => p.teamId === teamId)
    .sort((a, b) => a.number - b.number)
    .map(p => ({...p, fullName: `${p.firstName} ${p.lastName}`}));
  
  return (/* ... */);
};
```

---

### 4. useCallback para Funciones

**Regla:** Usar `useCallback` cuando se pasa una función como prop a componentes memoizados o como dependencia de otro hook.

```jsx
// ✅ CORRECTO
const MatchesList = ({ matches }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Función estable que no cambia entre renders
  const handleMatchClick = useCallback((matchId) => {
    navigate(`/match/${matchId}`);
  }, [navigate]);
  
  // Función de delete con dependencia
  const handleDelete = useCallback((matchId) => {
    deleteMatch(matchId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    });
  }, [queryClient]);
  
  return (
    <div>
      {matches.map(match => (
        <MatchCard 
          key={match.id}
          match={match}
          onClick={handleMatchClick}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

// ❌ INCORRECTO - Nueva función en cada render
const MatchesList = ({ matches }) => {
  return (
    <div>
      {matches.map(match => (
        <MatchCard 
          key={match.id}
          match={match}
          onClick={(id) => navigate(`/match/${id}`)}  // Nueva función cada vez
          onDelete={(id) => deleteMatch(id)}          // Nueva función cada vez
        />
      ))}
    </div>
  );
};
```

---

### 5. Custom Hooks para Lógica Reutilizable

**Regla:** Extraer lógica repetitiva en custom hooks.

```jsx
// ✅ CORRECTO - Custom hook reutilizable

// hooks/usePlayer.js
export const usePlayer = (playerId) => {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: () => getPlayer(playerId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// hooks/usePlayerMutation.js
export const usePlayerMutation = () => {
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePlayer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
  
  return { updateMutation, deleteMutation };
};

// Uso en componente
const PlayerEdit = ({ playerId }) => {
  const { data: player, isLoading } = usePlayer(playerId);
  const { updateMutation } = usePlayerMutation();
  
  const handleSubmit = (formData) => {
    updateMutation.mutate({ id: playerId, data: formData });
  };
  
  if (isLoading) return <Skeleton />;
  
  return <PlayerForm player={player} onSubmit={handleSubmit} />;
};
```

---

### 6. Lazy Loading y Code Splitting

**Regla:** Lazy load páginas y componentes pesados que no se usan inmediatamente.

```jsx
// ✅ CORRECTO - Lazy loading de páginas

// App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas cargadas lazy
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Players = lazy(() => import('./pages/Players'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const Teams = lazy(() => import('./pages/Teams'));
const Matches = lazy(() => import('./pages/Matches'));

// Componente de loading UEFA themed
const PageLoader = () => (
  <div className="min-h-screen bg-uefa-dark flex items-center justify-center">
    <div className="animate-spin">⭐</div>
    <p className="text-uefa-gold ml-3">Cargando...</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Lazy loading de componentes pesados
const ChartComponent = lazy(() => import('./components/HeavyChart'));

const Statistics = ({ data }) => (
  <div>
    <h2>Estadísticas</h2>
    <Suspense fallback={<div>Cargando gráfico...</div>}>
      <ChartComponent data={data} />
    </Suspense>
  </div>
);
```

---

### 7. Evitar Props Drilling

**Regla:** Usar Context API para datos que necesitan muchos níveis de componentes.

```jsx
// ✅ CORRECTO - Context para usuario autenticado

// contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = async (credentials) => {
    const userData = await loginAPI(credentials);
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const value = { user, isAuthenticated, login, logout };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Uso en cualquier componente
const Header = () => {
  const { user, logout } = useAuth();  // Sin props drilling
  
  return (
    <header>
      <span>Hola, {user.name}</span>
      <button onClick={logout}>Salir</button>
    </header>
  );
};
```

---

### 8. Virtualización para Listas Largas

**Regla:** Usar virtualización (react-window/react-virtual) para listas de 100+ elementos.

```jsx
// ✅ CORRECTO - Lista virtualizada con react-window

import { FixedSizeList as List } from 'react-window';

const PlayersList = ({ players }) => {
  // Renderizar solo los items visibles
  const Row = ({ index, style }) => {
    const player = players[index];
    return (
      <div style={style} className="p-2 border-b border-uefa-blue">
        <PlayerCard player={player} />
      </div>
    );
  };
  
  return (
    <List
      height={600}           // Altura del contenedor
      itemCount={players.length}
      itemSize={100}          // Altura de cada item
      width="100%"
    >
      {Row}
    </List>
  );
};

// ❌ INCORRECTO - Renderizar 1000 elementos a la vez
const PlayersList = ({ players }) => {
  return (
    <div>
      {players.map(player => (  // Renderiza TODOS, aunque no sean visibles
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};
```

---

### 9. Optimistic Updates con TanStack Query

**Regla:** Usar optimistic updates para acciones predecibles (like, favorite, etc).

```jsx
// ✅ CORRECTO - Optimistic update

const useFavoriteTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, isFavorite }) => toggleFavorite(teamId, isFavorite),
    
    // Actualización optimista ANTES de la respuesta del servidor
    onMutate: async ({ teamId, isFavorite }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      
      // Guardar snapshot del estado anterior
      const previousTeams = queryClient.getQueryData(['teams']);
      
      // Actualizar optimísticamente
      queryClient.setQueryData(['teams'], (old) =>
        old.map(team => 
          team.id === teamId 
            ? { ...team, isFavorite: !isFavorite }
            : team
        )
      );
      
      // Retornar context con el snapshot
      return { previousTeams };
    },
    
    // Si falla, revertir al estado anterior
    onError: (err, variables, context) => {
      queryClient.setQueryData(['teams'], context.previousTeams);
    },
    
    // Siempre refetch después de error o éxito
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

// Uso
const TeamCard = ({ team }) => {
  const { mutate: toggleFavorite } = useFavoriteTeam();
  
  const handleFavorite = () => {
    // UI se actualiza inmediatamente
    toggleFavorite({ teamId: team.id, isFavorite: team.isFavorite });
  };
  
  return (
    <div>
      <h3>{team.name}</h3>
      <button onClick={handleFavorite}>
        {team.isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
};
```

---

### 10. Debouncing en Búsquedas

**Regla:** Debounce de inputs que hacen requests (búsqueda, autocomplete).

```jsx
// ✅ CORRECTO - Búsqueda con debounce

// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Uso en búsqueda
const PlayerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);  // 300ms delay
  
  const { data: players, isLoading } = useQuery({
    queryKey: ['players', 'search', debouncedSearch],
    queryFn: () => searchPlayers(debouncedSearch),
    enabled: debouncedSearch.length > 2,  // Solo buscar con 3+ caracteres
  });
  
  return (
    <div>
      <input 
        type="text"
        placeholder="Buscar jugador..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Se actualiza inmediatamente
        className="input-uefa"
      />
      
      {isLoading && <Spinner />}
      
      {players?.map(player => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};
```

---

## 📊 Métricas de Performance

### Herramientas para Medir:
1. **React DevTools Profiler** - Ver qué componentes se renderizan
2. **Chrome DevTools Performance** - Analizar tiempo de render
3. **Lighthouse** - Score general de performance

### Objetivos:
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Re-renders innecesarios = 0
- ✅ Lighthouse Performance > 90

---

## 🚫 Anti-patrones a Evitar

### 1. Inline Functions en Props
```jsx
// ❌ INCORRECTO
{items.map(item => (
  <Card onClick={() => handleClick(item.id)} />  // Nueva función cada render
))}

// ✅ CORRECTO
const handleClick = useCallback((id) => {/* ... */}, []);
{items.map(item => (
  <Card onClick={() => handleClick(item.id)} />
))}
```

### 2. Objetos/Arrays Inline en Props
```jsx
// ❌ INCORRECTO
<Component style={{ margin: 10 }} />  // Nuevo objeto cada render
<Component data={items.filter(i => i.active)} />  // Nuevo array cada render

// ✅ CORRECTO
const style = { margin: 10 };
const activeItems = useMemo(() => items.filter(i => i.active), [items]);
<Component style={style} data={activeItems} />
```

### 3. useState para Valores Derivados
```jsx
// ❌ INCORRECTO
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);

// ✅ CORRECTO - Calcular directamente
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

---

## ✅ Checklist de Optimización

Antes de considerar un componente optimizado, verificar:

- [ ] ¿El componente tiene < 200 líneas?
- [ ] ¿Se usa React.memo si se renderiza múltiples veces?
- [ ] ¿Se usa useMemo para cálculos costosos?
- [ ] ¿Se usa useCallback para funciones pasadas como props?
- [ ] ¿La lógica compleja está en custom hooks?
- [ ] ¿Se usa lazy loading para componentes pesados?
- [ ] ¿Se evita props drilling con Context API?
- [ ] ¿Listas largas usan virtualización?
- [ ] ¿Búsquedas tienen debounce?
- [ ] ¿Se usan optimistic updates donde aplica?

---

Aplica estas optimizaciones de forma INCREMENTAL. No optimizar prematuramente - primero hacer que funcione, luego optimizar lo que sea lento.
