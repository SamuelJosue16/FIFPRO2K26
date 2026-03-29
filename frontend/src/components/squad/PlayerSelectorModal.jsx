import { useState } from 'react'
import { calculatePlayerRating, abbreviateName } from './squadUtils'

export default function PlayerSelectorModal({ isOpen, position, positionLabel, availablePlayers, onSelect, onClose }) {
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filtered = (availablePlayers || []).filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-black/90 backdrop-blur-xl border border-white/10 w-full max-w-md mx-4 max-h-[80vh] flex flex-col shadow-2xl"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-px w-4 bg-white/30" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Asignar jugador</span>
            </div>
            <h3 className="text-white font-black text-xl uppercase tracking-tight">{positionLabel || position}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-150 text-lg leading-none"
          >✕</button>
        </div>

        {/* Búsqueda */}
        <div className="px-4 py-3 border-b border-white/8">
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/25 transition-colors"
            autoFocus
          />
        </div>

        {/* Lista */}
        <div className="overflow-y-auto flex-1 p-2">
          {filtered.length === 0 ? (
            <p className="text-white/30 text-center py-8 text-sm">
              {search ? 'No se encontraron jugadores' : 'No hay jugadores disponibles'}
            </p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filtered.map((player) => {
                const rating = calculatePlayerRating(player)
                return (
                  <button
                    key={player.id}
                    onClick={() => { onSelect(player); setSearch('') }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-150 text-left"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-white/30 uppercase">
                          {player.position?.slice(0, 3) || '?'}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {abbreviateName(player.firstName, player.lastName)}
                      </p>
                      <p className="text-white/35 text-xs truncate">
                        {player.position} · {player.team?.shortName || player.team?.name || ''}
                      </p>
                    </div>

                    {/* Rating */}
                    <span className="text-white/55 font-black text-sm flex-shrink-0">{rating}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
