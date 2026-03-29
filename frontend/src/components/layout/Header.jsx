import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const navLinks = [
    { to: '/teams', label: 'Equipos' },
    { to: '/players', label: 'Jugadores' },
    { to: '/matches', label: 'Partidos' },
    { to: '/my-team', label: 'Mi Equipo' },
  ]

  return (
    <div className="sticky top-0 z-50">
    <header className="backdrop-blur-xl border-b shadow-2xl bg-black/40 border-white/5">
      <div className="container-uefa py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                FIFPRO2K26
              </h1>
              <p className="text-xs text-white/30 uppercase tracking-[0.15em]">UEFA Champions League</p>
            </div>
          </Link>

          {/* Navegación Desktop — oculta en homepage */}
          {!isHome && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-semibold uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Controles derecha */}
          <div className="flex items-center gap-3">

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-white/40 text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="py-1.5 px-4 bg-white/8 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block py-1.5 px-4 bg-white text-black text-xs font-black tracking-wider uppercase hover:bg-white/90 transition-all duration-200"
              >
                Entrar
              </Link>
            )}

            {/* Botón menú móvil */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center bg-white/8 border border-white/10 text-white text-xl transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '×' : '≡'}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-1 pb-4 border-t border-white/8 pt-4">
            {!isHome && navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/70 hover:text-white transition-colors py-2.5 text-sm font-semibold uppercase tracking-wider border-b border-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="mt-2 py-2.5 bg-white/8 border border-white/10 text-white text-sm font-semibold"
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="mt-2 py-2.5 bg-white text-black text-sm font-black text-center uppercase tracking-wider"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  </div>
  )
}

export default Header
