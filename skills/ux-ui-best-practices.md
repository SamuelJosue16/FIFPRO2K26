# 🎨 Skill: UX/UI Best Practices

## 📋 Propósito
Este skill guía la implementación de mejores prácticas de UX/UI para crear interfaces intuitivas, atractivas y accesibles con temática UEFA Champions League.

---

## ✨ Principios Fundamentales

### 1. Feedback Inmediato
**Regla:** El usuario debe recibir feedback en < 100ms después de cualquier acción.

#### Implementación:
```jsx
// ✅ CORRECTO
const Button = ({ onClick, children, loading }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleClick = () => {
    setIsPressed(true);
    onClick();
    setTimeout(() => setIsPressed(false), 200);
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`transition-transform ${isPressed ? 'scale-95' : 'scale-100'}`}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

// ❌ INCORRECTO - Sin feedback visual
const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```

---

### 2. Estados de Carga (Loading States)

**Regla:** Toda operación asíncrona debe mostrar un estado de carga apropiado.

#### Tipos de Loading:
1. **Skeleton Loaders** - Para contenido inicial
2. **Spinners** - Para acciones puntuales
3. **Progress Bars** - Para operaciones largas
4. **Optimistic UI** - Para acciones predecibles

```jsx
// ✅ CORRECTO - Skeleton loader temático UEFA
const PlayerCardSkeleton = () => (
  <div className="bg-uefa-dark animate-pulse rounded-lg p-4">
    <div className="h-32 bg-uefa-blue/20 rounded mb-3"></div>
    <div className="h-4 bg-uefa-blue/20 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-uefa-blue/20 rounded w-1/2"></div>
  </div>
);

// Uso con TanStack Query
const PlayersList = () => {
  const { data, isLoading } = useQuery({ queryKey: ['players'], queryFn: getPlayers });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => <PlayerCardSkeleton key={i} />)}
      </div>
    );
  }
  
  return data.map(player => <PlayerCard key={player.id} {...player} />);
};
```

---

### 3. Manejo de Errores Amigable

**Regla:** Los errores deben ser claros, útiles y ofrecer soluciones.

```jsx
// ✅ CORRECTO
const ErrorMessage = ({ error, retry }) => {
  const getMessage = () => {
    if (error.code === 'NETWORK_ERROR') {
      return {
        title: 'Sin conexión',
        message: 'Verifica tu conexión a internet e intenta nuevamente',
        icon: '📡'
      };
    }
    if (error.code === 404) {
      return {
        title: 'No encontrado',
        message: 'El recurso que buscas no existe',
        icon: '🔍'
      };
    }
    return {
      title: 'Algo salió mal',
      message: 'Ocurrió un error inesperado. Por favor intenta nuevamente',
      icon: '⚠️'
    };
  };
  
  const { title, message, icon } = getMessage();
  
  return (
    <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-red-300 mb-2">{title}</h3>
      <p className="text-red-200 mb-4">{message}</p>
      {retry && (
        <button onClick={retry} className="btn-uefa-gold">
          Reintentar
        </button>
      )}
    </div>
  );
};

// ❌ INCORRECTO
<div>Error: {error.message}</div>
```

---

### 4. Jerarquía Visual Clara

**Regla:** La información más importante debe destacar visualmente.

#### Escala de Importancia UEFA:
1. **Crítico:** Dorado con glow (`--uefa-gold`)
2. **Alto:** Azul brillante (`--uefa-light-blue`)
3. **Normal:** Azul UEFA (`--uefa-blue`)
4. **Secundario:** Gris/Plateado (`--uefa-silver`)

```jsx
// ✅ CORRECTO - Jerarquía clara
<div className="bg-uefa-dark p-6">
  {/* Título principal - Más grande y dorado */}
  <h1 className="text-4xl font-bold text-uefa-gold mb-4">
    Champions League
  </h1>
  
  {/* Subtítulo - Azul brillante */}
  <h2 className="text-2xl text-uefa-light-blue mb-6">
    Tabla de Posiciones
  </h2>
  
  {/* Contenido - Blanco/Gris */}
  <p className="text-gray-300">
    Descripción del contenido...
  </p>
</div>
```

---

### 5. Micro-interacciones

**Regla:** Añadir animaciones sutiles que mejoren la experiencia sin distraer.

```jsx
// ✅ CORRECTO - Hover effect UEFA
const TeamCard = ({ team }) => (
  <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-uefa-dark to-uefa-blue
                  transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-uefa-gold/30">
    
    {/* Efecto de brillo al hacer hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
    
    <img src={team.logo} alt={team.name} className="w-full h-48 object-cover" />
    
    <div className="p-4">
      <h3 className="text-xl font-bold text-white group-hover:text-uefa-gold transition-colors">
        {team.name}
      </h3>
    </div>
  </div>
);
```

---

### 6. Responsive Design

**Regla:** Mobile first, siempre probar en móviles, tablets y desktop.

#### Breakpoints TailwindCSS:
- `sm`: 640px (móvil grande)
- `md`: 768px (tablet)
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (wide screen)

```jsx
// ✅ CORRECTO - Mobile first
<div className="
  grid grid-cols-1          // móvil: 1 columna
  sm:grid-cols-2            // móvil grande: 2 columnas
  lg:grid-cols-3            // laptop: 3 columnas
  xl:grid-cols-4            // desktop: 4 columnas
  gap-4
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// ❌ INCORRECTO - Desktop first
<div className="grid grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

### 7. Accesibilidad (a11y)

**Regla:** La aplicación debe ser usable con teclado y lectores de pantalla.

```jsx
// ✅ CORRECTO - Accesible
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      role="dialog" 
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-uefa-dark rounded-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-2xl font-bold mb-4">
          {title}
        </h2>
        
        {children}
        
        <button 
          onClick={onClose}
          aria-label="Cerrar modal"
          className="mt-4 btn-uefa-secondary"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
```

---

### 8. Consistencia Visual

**Regla:** Usar componentes reutilizables con el mismo estilo en toda la app.

#### Componentes Base Requeridos:
```
components/common/
├── Button.jsx          // Botones UEFA (primary, secondary, ghost)
├── Card.jsx           // Cards con estilo UEFA
├── Input.jsx          // Inputs temáticos
├── Badge.jsx          // Badges dorados/plateados
├── Avatar.jsx         // Avatares circulares
├── Tooltip.jsx        // Tooltips con animación
└── Modal.jsx          // Modales UEFA
```

---

### 9. Performance Visual

**Regla:** Las animaciones deben correr a 60 FPS (16.6ms por frame).

#### Propiedades que se pueden animar sin layout shift:
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ⚠️ `filter` (usar con cuidado)
- ❌ `width`, `height`, `top`, `left` (causan reflow)

```jsx
// ✅ CORRECTO - Animación con transform
const SlideIn = ({ children }) => (
  <div className="animate-slideIn">
    {children}
  </div>
);

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out'
      }
    }
  }
};
```

---

### 10. Formularios Intuitivos

**Regla:** Validación en tiempo real con mensajes claros.

```jsx
// ✅ CORRECTO
const FormInput = ({ label, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    
    <input 
      {...props}
      className={`
        w-full px-4 py-2 rounded-lg bg-uefa-dark border-2
        ${error ? 'border-red-500' : 'border-uefa-blue'}
        focus:outline-none focus:border-uefa-gold
        transition-colors
      `}
    />
    
    {error && (
      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
        <span>⚠️</span> {error}
      </p>
    )}
  </div>
);

// Uso con validación
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const validateEmail = (value) => {
    if (!value) {
      setEmailError('El email es requerido');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };
  
  return (
    <FormInput 
      label="Email"
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
      }}
      error={emailError}
    />
  );
};
```

---

## 🎯 Checklist de UX/UI

Antes de considerar un componente completo, verificar:

- [ ] ¿Tiene feedback visual inmediato en interacciones?
- [ ] ¿Muestra loading states apropiados?
- [ ] ¿Maneja errores de forma amigable?
- [ ] ¿La jerarquía visual es clara?
- [ ] ¿Funciona en móvil, tablet y desktop?
- [ ] ¿Es accesible con teclado?
- [ ] ¿Tiene labels y ARIA attributes?
- [ ] ¿Las animaciones son suaves (60fps)?
- [ ] ¿Sigue el tema UEFA consistentemente?
- [ ] ¿La validación de formularios es clara?

---

## 🚫 Anti-patrones a Evitar

1. **Animaciones excesivas** - Distrae y reduce performance
2. **Textos de error técnicos** - "Error 500" sin contexto
3. **Botones sin estados de loading** - Usuario no sabe si funcionó
4. **Formularios sin validación** - Errores después de submit
5. **Colores inconsistentes** - Rompe la identidad UEFA
6. **Modals sin backdrop** - Confunde al usuario
7. **Inputs sin labels** - Problemas de accesibilidad
8. **Hover effects en móvil** - No funciona en touch

---

## 📚 Recursos UEFA

### Colores Exactos
```css
--uefa-dark: #001D3D
--uefa-blue: #003F88
--uefa-light-blue: #0066CC
--uefa-gold: #FFD700
--uefa-silver: #C0C0C0
```

### Sombras UEFA
```css
.uefa-shadow-sm { box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1); }
.uefa-shadow-md { box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2); }
.uefa-shadow-lg { box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3); }
```

Sigue estos principios en TODOS los componentes que crees. La experiencia de usuario es prioritaria.
