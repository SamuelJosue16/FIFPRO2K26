import { useState } from 'react'

function PlayerCard({ player, onClick }) {
  const [imgError, setImgError] = useState(false)
  // Calcular edad desde birthDate
  const age = Math.floor((new Date() - new Date(player.birthDate)) / (365.25 * 24 * 60 * 60 * 1000))

  return (
    <div 
      className="relative overflow-hidden cursor-pointer aspect-[3/4] md:aspect-[3/4] shine-effect card-hover-scale"
      onClick={onClick}
    >
      {/* Imagen de fondo */}
      {player.photoUrl && !imgError ? (
        <img 
          src={player.photoUrl} 
          alt={`${player.firstName} ${player.lastName}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#001450] to-[#000B1E] flex items-center justify-center">
          <span className="text-4xl md:text-6xl font-black text-white/10 uppercase">
            {player.position?.slice(0, 2) || '?'}
          </span>
        </div>
      )}

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />

      {/* Dorsal decorativo */}
      <div className="absolute top-2 right-2 md:top-3 md:right-3 text-5xl md:text-8xl font-black leading-none select-none pointer-events-none text-black/[0.07]">
        {player.number}
      </div>

      {/* Área de información */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-4 z-10">
        {/* Posición • Equipo */}
        <p className="text-[10px] md:text-xs uppercase tracking-widest mb-0.5 md:mb-1 text-black/60">
          {player.position} • {player.team?.shortName || player.team?.name || 'Sin equipo'}
        </p>
        {/* Nombre completo */}
        <h3 className="text-sm md:text-xl font-bold leading-tight mb-0.5 md:mb-1 text-black">
          {player.firstName} {player.lastName}
        </h3>
        {/* Nacionalidad • Edad */}
        <p className="text-[10px] md:text-xs text-black/50">
          {player.nationality} • {age} años
        </p>
      </div>
    </div>
  )
}

export default PlayerCard
