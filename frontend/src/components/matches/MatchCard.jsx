function MatchCard({ match }) {
  // Parsear estadísticas desde JSON
  const stats = match.statistics ? JSON.parse(match.statistics) : null

  // Formatear fecha
  const matchDate = new Date(match.date)
  const dateStr = matchDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  const timeStr = matchDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Badge de estado (sin emojis)
  const statusConfig = {
    scheduled: { text: 'Programado', dot: 'bg-blue-400/70' },
    live:      { text: 'En vivo',    dot: 'bg-red-500' },
    finished:  { text: 'Finalizado', dot: 'bg-green-500/70' },
    postponed: { text: 'Pospuesto',  dot: 'bg-white/30' }
  }
  const statusInfo = statusConfig[match.status] || statusConfig.scheduled

  const hasScore = match.homeScore !== null && match.awayScore !== null

  return (
    <div className="bg-black/30 border border-white/8 hover:border-white/15 transition-all duration-200">
      {/* Top row: status + fecha */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 ${statusInfo.dot}`} />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">{statusInfo.text}</span>
        </div>
        <span className="text-xs font-mono text-white/30">{dateStr} · {timeStr}</span>
      </div>

      {/* Equipos + marcador */}
      <div className="px-5 py-4">
        {/* Equipo local */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            {match.homeTeam.logoUrl ? (
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-7 h-7 object-contain" />
            ) : (
              <div className="w-7 h-7 bg-white/5 border border-white/8" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-sm uppercase tracking-tight leading-tight truncate">{match.homeTeam.name}</p>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Local</p>
          </div>
          {hasScore && (
            <span className="text-3xl font-black text-white tabular-nums">{match.homeScore}</span>
          )}
        </div>

        {/* Divisor VS */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] font-mono text-white/15 uppercase tracking-[0.2em]">vs</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Equipo visitante */}
        <div className="flex items-center gap-3 mt-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            {match.awayTeam.logoUrl ? (
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-7 h-7 object-contain" />
            ) : (
              <div className="w-7 h-7 bg-white/5 border border-white/8" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-sm uppercase tracking-tight leading-tight truncate">{match.awayTeam.name}</p>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Visitante</p>
          </div>
          {hasScore && (
            <span className="text-3xl font-black text-white tabular-nums">{match.awayScore}</span>
          )}
        </div>
      </div>

      {/* Estadio */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <div className="h-px w-4 bg-white/15" />
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-[0.15em] truncate">{match.venue}</p>
      </div>

      {/* Estadísticas del partido */}
      {stats && (
        <div className="grid grid-cols-4 gap-px bg-white/5 border-t border-white/5">
          {stats.possession && (
            <div className="bg-black/40 px-3 py-2 text-center">
              <p className="text-sm font-black text-white">{stats.possession}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/30">Posesión</p>
            </div>
          )}
          {stats.shots && (
            <div className="bg-black/40 px-3 py-2 text-center">
              <p className="text-sm font-black text-white">{stats.shots}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/30">Remates</p>
            </div>
          )}
          {stats.shotsOnTarget && (
            <div className="bg-black/40 px-3 py-2 text-center">
              <p className="text-sm font-black text-white">{stats.shotsOnTarget}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/30">A puerta</p>
            </div>
          )}
          {stats.corners && (
            <div className="bg-black/40 px-3 py-2 text-center">
              <p className="text-sm font-black text-white">{stats.corners}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/30">Corners</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MatchCard
