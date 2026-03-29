import { Link } from 'react-router-dom'
import backgroundDesktop from '../../assets/BACKGROUND.jpg'
import backgroundMobile from '../../assets/BACKGROUND MOBILE.jpg'

const NAV_ITEMS = [
  {
    to: '/teams',
    number: '01',
    label: 'Equipos',
    description: 'Explora los clubes participantes en la competición',
  },
  {
    to: '/players',
    number: '02',
    label: 'Jugadores',
    description: 'Descubre el plantel de las estrellas del fútbol europeo',
  },
  {
    to: '/matches',
    number: '03',
    label: 'Partidos',
    description: 'Calendario, resultados y estadísticas de cada encuentro',
  },
  {
    to: '/my-team',
    number: '04',
    label: 'Mi Equipo',
    description: 'Arma tu alineación ideal con tu formación favorita',
  },
]

const STATS = [
  { value: '32', label: 'Equipos clasificados' },
  { value: '125', label: 'Partidos en competición' },
  { value: '67', label: 'Años de historia' },
]

function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background - Desktop */}
      <div className="fixed inset-0 z-0 hidden md:block">
        <img
          src={backgroundDesktop}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/40" />
      </div>

      {/* Background - Mobile */}
      <div className="fixed inset-0 z-0 md:hidden">
        <img
          src={backgroundMobile}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="flex-1 flex items-center">
          <div className="container-uefa py-24 md:py-32">

            {/* Badge de temporada */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-white/50" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Temporada 2025 / 26
              </span>
            </div>

            {/* Título principal */}
            <div className="max-w-3xl mb-10">
              <h1 className="mb-2">
                <span className="block text-white/40 text-lg md:text-xl font-light tracking-widest uppercase">
                  UEFA
                </span>
                <span className="block text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tight uppercase">
                  Champions
                </span>
                <span className="block text-5xl md:text-8xl font-black leading-[0.9] tracking-tight uppercase"
                  style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.5)', color: 'transparent' }}>
                  League
                </span>
              </h1>
            </div>

            {/* Bajada */}
            <p className="text-base md:text-lg text-white/50 max-w-md font-light leading-relaxed">
              La competición de clubes más prestigiosa del mundo. 
              Gestiona equipos, jugadores y resultados en tiempo real.
            </p>

          </div>
        </section>

        {/* ── NAVEGACIÓN EDITORIAL ────────────────────────── */}
        <section className="container-uefa pb-0">
          {/* Línea separadora */}
          <div className="h-px bg-white/10 mb-0" />

          <nav>
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center justify-between py-5 md:py-6 border-b border-white/8 hover:bg-white/3 transition-all duration-300 -mx-4 px-4 md:-mx-8 md:px-8"
              >
                {/* Izquierda: número + info */}
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-xs font-mono text-white/25 group-hover:text-white/50 transition-colors duration-300 w-6 tabular-nums">
                    {item.number}
                  </span>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white group-hover:text-white/90 transition-colors duration-300 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-sm text-white/35 group-hover:text-white/55 transition-colors duration-300 hidden md:block mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Derecha: flecha */}
                <div className="flex items-center gap-3">
                  <span className="text-white/20 group-hover:text-white/70 text-xl font-light transition-all duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </section>

        {/* ── STATS ──────────────────────────────────────── */}
        <section className="container-uefa py-12 md:py-16">
          <div className="grid grid-cols-3 gap-0 border border-white/8">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-3 md:px-6 py-6 md:py-8 text-center ${i < STATS.length - 1 ? 'border-r border-white/8' : ''}`}
              >
                <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-[9px] md:text-xs uppercase tracking-widest text-white/35 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default HomePage
