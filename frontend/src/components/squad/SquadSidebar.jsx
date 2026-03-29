import { useState } from 'react'
import { FORMATIONS } from './formations'
import { calculatePlayerRating, abbreviateName } from './squadUtils'

export default function SquadSidebar({
  formation,
  onFormationChange,
  availablePlayers,
  squadPositions,
  savedSquads,
  onLoadSquad,
  onClearSquad,
}) {
  const [search, setSearch] = useState('')
  const [showSquads, setShowSquads] = useState(false)

  const assignedIds = new Set(Object.values(squadPositions || {}).filter(Boolean).map((p) => p.id))

  const filtered = (availablePlayers || []).filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  const assignedCount = assignedIds.size

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Cabecera sidebar */}
      <div className="px-4 pt-12">
        
        <p className="text-white/35 text-xs mt-0.5 font-mono">{assignedCount}/11 asignados</p>

        {/* Barra de progreso */}
        <div className="mt-2 h-1 bg-white/8 overflow-hidden">
          <div
            className="h-full bg-white/60 transition-all duration-500"
            style={{ width: `${(assignedCount / 11) * 100}%` }}
          />
        </div>
      </div>

      {/* Selector de formación */}
      <div className="p-3">
        <label className="text-white/35 text-xs uppercase tracking-[0.15em] font-semibold block mb-1.5">
          Formación
        </label>
        <select
          value={formation}
          onChange={(e) => onFormationChange(e.target.value)}
          className="w-full bg-black/30 border border-white/15 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 cursor-pointer appearance-none"
        >
          {Object.entries(FORMATIONS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Jugadores disponibles */}
      <div className="flex-1 flex flex-col overflow-hidden p-3 pt-1">
        <label className="text-white/35 text-xs uppercase tracking-[0.15em] font-semibold block mb-1.5">
          Disponibles ({filtered.filter((p) => !assignedIds.has(p.id)).length})
        </label>

        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/30 border border-white/10 px-2.5 py-1.5 text-white placeholder-white/20 text-xs focus:outline-none focus:border-white/25 mb-2"
        />

        {/* Lista */}
        <div className="relative overflow-y-auto flex-1 space-y-1 pr-0.5">
          {/* Fade scroll inferior */}
          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-4">Sin jugadores</p>
          ) : (
            filtered.map((player) => {
              const isAssigned = assignedIds.has(player.id)
              const rating = calculatePlayerRating(player)
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 px-2 py-1.5 border transition-all duration-150 ${
                    isAssigned
                      ? 'opacity-40 border-transparent bg-transparent'
                      : 'border-transparent hover:border-white/10 hover:bg-white/5 cursor-default'
                  }`}
                >
                  {/* Avatar mini */}
                  <div className="w-7 h-7 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                    {player.photoUrl ? (
                      <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-black text-white/30 uppercase">
                        {player.position?.slice(0,3) || '?'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isAssigned ? 'text-gray-500' : 'text-white'}`}>
                      {abbreviateName(player.firstName, player.lastName)}
                    </p>
                    <p className="text-gray-500 text-[10px] truncate">{player.team?.shortName || ''}</p>
                  </div>

                  <span className={`text-xs font-black flex-shrink-0 ${isAssigned ? 'text-white/20' : 'text-white/50'}`}>
                    {rating}
                  </span>

                  {isAssigned && (
                    <span className="text-[9px] text-green-400 font-bold flex-shrink-0">✓</span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Alineaciones guardadas */}
      {savedSquads && savedSquads.length > 0 && (
        <div className="p-3">
          <button
            onClick={() => setShowSquads(!showSquads)}
            className="w-full text-left text-white/35 text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-between"
          >
            <span>Alineaciones ({savedSquads.length})</span>
            <span>{showSquads ? '▲' : '▼'}</span>
          </button>

          {showSquads && (
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {savedSquads.map((squad) => (
                <button
                  key={squad.id}
                  onClick={() => onLoadSquad(squad)}
                  className="w-full text-left px-2 py-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-150"
                >
                  <p className="text-white text-xs font-semibold truncate">{squad.name}</p>
                  <p className="text-white/30 text-[10px]">{squad.formation}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botón limpiar */}
      <div className="p-3">
        <button
          onClick={onClearSquad}
          className="w-full py-2 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-200 text-xs font-bold uppercase tracking-wider"
        >
          Limpiar campo
        </button>
      </div>
    </div>
  )
}
