function TeamCard({ team, onClick }) {
  const colors = team.colors ? JSON.parse(team.colors) : { primary: '#FFFFFF', secondary: '#000000' }

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const primaryGlow = hexToRgba(colors.primary || '#ffffff', 0.10)

  return (
    <div
      className="relative overflow-hidden cursor-pointer aspect-[3/4] md:aspect-[3/4] card-hover-scale"
      onClick={onClick}
      style={{
        background: `radial-gradient(circle at 50% 40%, ${primaryGlow}, #000B1E 65%)`
      }}
    >
      {/* Logo centrado en la zona superior */}
      <div className="absolute inset-0 flex items-center justify-center pb-12 md:pb-20">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={`${team.name} logo`}
            className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-2xl"
            loading="lazy"
          />
        ) : (
          <span className="text-4xl md:text-7xl opacity-20 select-none">
            {team.shortName?.charAt(0) || '?'}
          </span>
        )}
      </div>

      {/* Gradiente inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />

      {/* Texto del equipo en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-4 z-10">
        <p className="text-[10px] md:text-xs uppercase tracking-widest mb-0.5 md:mb-1 font-mono text-black/50">
          {team.country} · {team.shortName}
        </p>
        <h3 className="text-xs md:text-lg font-black leading-tight mb-1 md:mb-2 uppercase tracking-tight text-black">
          {team.name}
        </h3>
        <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] uppercase tracking-wider text-black/35">
          <span>{team._count?.players || 0} jugadores</span>
          <span>{(team._count?.homeMatches || 0) + (team._count?.awayMatches || 0)} partidos</span>
        </div>
      </div>

      {/* Línea de color del equipo */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: colors.primary }}
      />
    </div>
  )
}

export default TeamCard
