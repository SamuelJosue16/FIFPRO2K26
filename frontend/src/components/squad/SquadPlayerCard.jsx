import { useState } from 'react'
import { calculatePlayerRating, getRatingColor, abbreviateName } from './squadUtils'

// Forma octagonal clasica FUT
const FUT_CLIP = 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'

function getCardTheme(rating) {
  if (rating >= 88) return {
    border: 'linear-gradient(160deg, #f9ed76 0%, #b8820a 35%, #f0cc30 65%, #7a5208 100%)',
    inner: 'linear-gradient(175deg, #2e1e02 0%, #160e01 55%, #080501 100%)',
  }
  if (rating >= 75) return {
    border: 'linear-gradient(160deg, #eaf2f8 0%, #7898ac 35%, #b2cad8 65%, #4a6878 100%)',
    inner: 'linear-gradient(175deg, #091620 0%, #050e18 55%, #020608 100%)',
  }
  return {
    border: 'linear-gradient(160deg, #e8a87a 0%, #7a3e14 35%, #c06828 65%, #4a2008 100%)',
    inner: 'linear-gradient(175deg, #1e0e04 0%, #0e0602 55%, #050200 100%)',
  }
}

export default function SquadPlayerCard({ player, positionLabel, onRemove }) {
  const [imgError, setImgError] = useState(false)
  const rating = calculatePlayerRating(player)
  const ratingColor = getRatingColor(rating)
  const displayName = abbreviateName(player.firstName, player.lastName)
  const theme = getCardTheme(rating)

  // Tamaños responsive: más pequeño en mobile
  const W = typeof window !== 'undefined' && window.innerWidth < 768 ? 56 : 112
  const H = typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 156
  const B = 4

  return (
    <div className="group flex flex-col items-center select-none">
      <div
        className="relative cursor-pointer transition-all duration-200 hover:scale-110 hover:-translate-y-1"
        style={{
          width: `${W}px`,
          height: `${H}px`,
          filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.9)) drop-shadow(0 2px 8px rgba(0,0,0,0.7))',
        }}
        onClick={onRemove}
      >
        {/* Marco exterior - gradiente dorado/plateado/bronce */}
        <div
          className="absolute inset-0"
          style={{
            background: theme.border,
            clipPath: FUT_CLIP,
          }}
        />

        {/* Cara interior */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: `${B}px`,
            left: `${B}px`,
            width: `${W - B * 2}px`,
            height: `${H - B * 2}px`,
            background: theme.inner,
            clipPath: FUT_CLIP,
          }}
        >
          {/* Foto del jugador */}
          {player.photoUrl && !imgError ? (
            <img
              src={player.photoUrl}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 50% 35%, ${ratingColor}30 0%, transparent 65%)` }}
            />
          )}

          {/* Gradiente inferior para legibilidad */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92) 100%)' }}
          />

          {/* Tinte del marco sobre la foto */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${ratingColor}18 0%, transparent 40%)` }}
          />

          {/* Rating + posicion - esquina sup-izq */}
          <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 leading-none z-10 flex flex-col gap-0.5">
            <span
              className="text-lg md:text-[22px] font-black leading-none"
              style={{ color: ratingColor, textShadow: '0 2px 8px rgba(0,0,0,1)' }}
            >
              {rating}
            </span>
            <span
              className="text-[8px] md:text-[9px] font-black uppercase leading-none tracking-wider"
              style={{ color: ratingColor, textShadow: '0 1px 4px rgba(0,0,0,1)' }}
            >
              {positionLabel}
            </span>
          </div>

          {/* Nombre - zona inferior */}
          <div className="absolute bottom-0 left-0 right-0 px-1 md:px-1.5 pb-1.5 md:pb-2 pt-1 z-10 text-center">
            <p
              className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-wide truncate leading-none"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,1)' }}
            >
              {displayName}
            </p>
          </div>
        </div>

        {/* Boton quitar en hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full bg-red-600 text-white text-[11px] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center hover:bg-red-400 z-20 shadow-xl"
          title="Quitar"
        >
          x
        </button>
      </div>
    </div>
  )
}
