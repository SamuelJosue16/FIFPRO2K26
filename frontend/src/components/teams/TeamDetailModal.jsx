import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function TeamDetailModal({ team, isOpen, onClose, onEdit, onDelete }) {
  const colors     = team?.colors ? JSON.parse(team.colors) : { primary: '#FFFFFF', secondary: '#000000' }
  const primaryGlow = colors.primary

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && team && (
        <motion.div
          key="team-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="team-modal-panel"
            initial={{ opacity: 0, scale: 0.90, y: 48 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360, mass: 0.75 }}
            className="backdrop-blur-2xl bg-black/82 border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
            style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.85), 0 0 120px ${primaryGlow}18` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Shimmer sweep al abrir */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '380%' }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
        {/* Header visual con logo */}
        <div
          className="relative h-64 overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${colors.primary}18, #000000 70%)` }}
        >
          {/* Logo grande centrado */}
          <div className="absolute inset-0 flex items-center justify-center pb-16">
            {team.logoUrl ? (
              <img 
                src={team.logoUrl} 
                alt={`${team.name} logo`}
                className="w-36 h-36 object-contain drop-shadow-2xl"
              />
            ) : (
              <span className="text-[8rem] font-black text-white/5 uppercase tracking-tighter leading-none select-none">
                {team.shortName?.slice(0, 3) || '?'}
              </span>
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-lg leading-none transition-all duration-200 z-10 border border-white/10"
            title="Cerrar"
          >
            ×
          </button>

          {/* Nombre del equipo */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-1 font-mono">
              {team.country} · {team.shortName}
            </p>
            <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">
              {team.name}
            </h2>
          </div>

          {/* Línea de color del equipo */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: colors.primary }} />
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información principal */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-white/30" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Información</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/5">
              <div className="bg-black/40 p-3">
                <p className="text-xs text-white/35 uppercase tracking-wider mb-1">Nombre corto</p>
                <p className="text-white font-semibold text-sm">{team.shortName}</p>
              </div>
              <div className="bg-black/40 p-3">
                <p className="text-xs text-white/35 uppercase tracking-wider mb-1">País</p>
                <p className="text-white font-semibold text-sm">{team.country}</p>
              </div>
              <div className="col-span-2 bg-black/40 p-3">
                <p className="text-xs text-white/35 uppercase tracking-wider mb-2">Colores</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 border border-white/15" style={{ backgroundColor: colors.primary }} />
                    <span className="text-white/60 text-xs">Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 border border-white/15" style={{ backgroundColor: colors.secondary }} />
                    <span className="text-white/60 text-xs">Secundario</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-white/30" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Estadísticas</span>
            </div>
            <div className="grid grid-cols-3 gap-px bg-white/5">
              <div className="bg-black/40 p-4 text-center">
                <p className="text-4xl font-black text-white">{team._count?.players || 0}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mt-1">Jugadores</p>
              </div>
              <div className="bg-black/40 p-4 text-center">
                <p className="text-4xl font-black text-white">{(team._count?.homeMatches || 0) + (team._count?.awayMatches || 0)}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mt-1">Partidos</p>
              </div>
              <div className="bg-black/40 p-4 text-center">
                <p className="text-4xl font-black text-white">{team._count?.homeMatches || 0}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mt-1">De local</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-5 border-t border-white/8">
            <button
              onClick={() => { onEdit(); onClose() }}
              className="flex-1 py-2.5 px-4 bg-white/8 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold tracking-wide transition-all duration-200"
            >
              Editar
            </button>
            <button
              onClick={() => { onDelete(); onClose() }}
              className="py-2.5 px-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 text-sm font-semibold tracking-wide transition-all duration-200"
            >
              Eliminar
            </button>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TeamDetailModal
