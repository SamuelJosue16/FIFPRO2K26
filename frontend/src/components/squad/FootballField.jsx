import { FORMATIONS } from './formations'
import SquadPlayerCard from './SquadPlayerCard'

export default function FootballField({ formation, positions, onPositionClick, onPlayerRemove }) {
  const formationData = FORMATIONS[formation] || FORMATIONS['4-3-3']
  const positionSlots = formationData.positions
  
  // Tamaños responsive para slots vacíos
  const slotWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 56 : 72
  const slotHeight = typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 96

  return (
    <div className="relative w-full h-full">

      {/* ── Slots de jugadores ── */}
      {Object.entries(positionSlots).map(([posKey, coords]) => {
        const player = positions[posKey]
        return (
          <div
            key={posKey}
            className="absolute z-[3] transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: coords.top, left: coords.left }}
          >
            {player ? (
              <SquadPlayerCard
                player={player}
                positionLabel={coords.label}
                onRemove={() => onPlayerRemove(posKey)}
              />
            ) : (
              <button
                className="flex flex-col items-center gap-1.5 group"
                onClick={() => onPositionClick(posKey)}
                title={`Asignar: ${coords.label}`}
              >
                {/* Slot vacío estilo FUT */}
                <div
                  className="flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                  style={{
                    width: `${slotWidth}px`,
                    height: `${slotHeight}px`,
                    background: 'rgba(0,0,0,0.42)',
                    backdropFilter: 'blur(8px)',
                    border: '1.5px dashed rgba(255,255,255,0.32)',
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
                  }}
                >
                  <span className="text-white/35 group-hover:text-white/70 text-xl md:text-2xl font-thin leading-none transition-colors">+</span>
                </div>
                <span
                  className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-white/50 group-hover:text-white/80 px-1.5 md:px-2 py-0.5 transition-colors"
                  style={{ backdropFilter: 'blur(4px)', borderRadius: '20px' }}
                >
                  {coords.label}
                </span>
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}