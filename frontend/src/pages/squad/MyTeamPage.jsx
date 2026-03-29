import { useState, useEffect } from 'react'
import { usePlayers } from '../../hooks/usePlayers'
import { useSquads, useCreateSquad, useUpdateSquad, useDeleteSquad } from '../../hooks/useSquads'
import { FORMATIONS } from '../../components/squad/formations'
import FootballField from '../../components/squad/FootballField'
import PlayerSelectorModal from '../../components/squad/PlayerSelectorModal'
import fieldBg from '../../assets/FIFA ULTIMATE TEAM BACKGROUND.jpg'

export default function MyTeamPage() {
  const [formation, setFormation]           = useState('4-3-3')
  const [squadPositions, setSquadPositions] = useState({})      // { GK: player, LB: player, ... }
  const [selectedPosition, setSelectedPosition] = useState(null) // clave de posición abierta en modal
  const [showSaveModal, setShowSaveModal]   = useState(false)
  const [squadName, setSquadName]           = useState('')
  const [loadedSquadId, setLoadedSquadId]   = useState(null)
  const [notification, setNotification]     = useState(null)

  const { data: players = [] }  = usePlayers()
  const { data: squads = [] }   = useSquads()
  const createSquadMutation     = useCreateSquad()
  const updateSquadMutation     = useUpdateSquad()
  const deleteSquadMutation     = useDeleteSquad()

  // Jugadores disponibles = los que no están asignados a ninguna posición
  const assignedIds = new Set(Object.values(squadPositions).filter(Boolean).map((p) => p.id))
  const availablePlayers = players.filter((p) => !assignedIds.has(p.id))

  // Mostrar notificación temporal
  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Abrir modal selector al hacer click en slot vacío
  const handlePositionClick = (posKey) => {
    setSelectedPosition(posKey)
  }

  // Asignar jugador seleccionado del modal a la posición
  const handlePlayerSelect = (player) => {
    setSquadPositions((prev) => ({ ...prev, [selectedPosition]: player }))
    setSelectedPosition(null)
  }

  // Quitar jugador de una posición
  const handlePlayerRemove = (posKey) => {
    setSquadPositions((prev) => {
      const updated = { ...prev }
      delete updated[posKey]
      return updated
    })
  }

  // Cambiar formación: mantener portero y defender, resto se limpia
  const handleFormationChange = (newFormation) => {
    setFormation(newFormation)
    const newSlots = FORMATIONS[newFormation]?.positions || {}

    setSquadPositions((prev) => {
      const kept = {}
      Object.keys(newSlots).forEach((key) => {
        if (prev[key]) kept[key] = prev[key]
      })
      // Intentar mantener portero aunque cambie el key
      if (!kept['GK'] && prev['GK']) kept['GK'] = prev['GK']
      return kept
    })
  }

  // Limpiar todas las posiciones
  const handleClearSquad = () => {
    setSquadPositions({})
    setLoadedSquadId(null)
  }

  // Guardar alineación
  const handleSaveSquad = async () => {
    if (!squadName.trim()) return

    const positionsToSave = {}
    Object.entries(squadPositions).forEach(([key, player]) => {
      if (player) positionsToSave[key] = player.id
    })

    try {
      if (loadedSquadId) {
        await updateSquadMutation.mutateAsync({
          id: loadedSquadId,
          data: { name: squadName.trim(), formation, positions: positionsToSave },
        })
        notify('✅ Alineación actualizada')
      } else {
        await createSquadMutation.mutateAsync({
          name: squadName.trim(),
          formation,
          positions: positionsToSave,
        })
        notify('✅ Alineación guardada')
      }
      setShowSaveModal(false)
      setSquadName('')
    } catch {
      notify('❌ Error al guardar la alineación', 'error')
    }
  }

  // Cargar alineación guardada
  const handleLoadSquad = (squad) => {
    const savedPositions = typeof squad.positions === 'string'
      ? JSON.parse(squad.positions)
      : squad.positions

    // Reconstruir posiciones con objetos de jugador completos
    const rebuilt = {}
    Object.entries(savedPositions).forEach(([posKey, playerId]) => {
      const player = players.find((p) => p.id === playerId)
      if (player) rebuilt[posKey] = player
    })

    setFormation(squad.formation)
    setSquadPositions(rebuilt)
    setLoadedSquadId(squad.id)
    setSquadName(squad.name)
    notify(`📂 "${squad.name}" cargada`)
  }

  // Eliminar alineación guardada
  const handleDeleteSquad = async (squadId) => {
    try {
      await deleteSquadMutation.mutateAsync(squadId)
      if (loadedSquadId === squadId) {
        setLoadedSquadId(null)
        setSquadName('')
      }
      notify('🗑️ Alineación eliminada')
    } catch {
      notify('❌ Error al eliminar', 'error')
    }
  }

  // Info del slot seleccionado para el modal
  const selectedSlotInfo = selectedPosition
    ? FORMATIONS[formation]?.positions[selectedPosition]
    : null

  const assignedCount = Object.keys(squadPositions).length

  return (
    <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>

      {/* ── Fondo: campo FIFA (esta imagen ES el campo) ── */}
      <img
        src={fieldBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable="false"
      />

      {/* ── Capa de profundidad: perspectiva atmosférica ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 25%, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.22) 100%)' }}
      />

      {/* ── Viñeta bordes ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 85% at 50% 50%, transparent 42%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.88) 100%)' }}
      />

      {/* ── Contenido sobre el campo ── */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Notificación Toast */}
        {notification && (
          <div className={`absolute top-3 right-4 z-[100] px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold transition-all duration-300 ${
            notification.type === 'error'
              ? 'bg-red-900/90 border-red-500 text-red-200'
              : 'bg-green-900/90 border-green-500 text-green-200'
          }`}>
            {notification.message}
          </div>
        )}

        {/* ── Barra superior compacta flotando sobre el campo ── */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-2.5 flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 100%)', backdropFilter: 'blur(4px)' }}
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-px w-5 bg-white/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Tácticas</span>
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                Mi Equipo
              </h1>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <select
                value={formation}
                onChange={(e) => handleFormationChange(e.target.value)}
                className="bg-black/40 border border-white/15 px-3 py-1.5 text-white text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-white/30 cursor-pointer appearance-none backdrop-blur-sm"
              >
                {Object.entries(FORMATIONS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <span className="text-white/25 text-xs font-mono">{assignedCount}/11</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearSquad}
              className="py-2 px-3 bg-black/40 hover:bg-red-900/40 border border-white/10 hover:border-red-500/40 text-white/50 hover:text-red-400 text-xs font-semibold tracking-wide transition-all duration-200"
              title="Limpiar alineación"
            >
              Limpiar
            </button>
            <button
              onClick={() => { setSquadName(loadedSquadId ? (squads.find(s => s.id === loadedSquadId)?.name || '') : ''); setShowSaveModal(true) }}
              className="py-2 px-5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 backdrop-blur-sm"
            >
              {loadedSquadId ? 'Actualizar' : 'Guardar'}
            </button>
            {loadedSquadId && (
              <button
                onClick={() => { setLoadedSquadId(null); setSquadName(''); notify('Nueva alineación') }}
                className="py-2 px-3 bg-black/40 hover:bg-black/60 border border-white/15 text-white text-xs font-semibold tracking-wide transition-all duration-200"
              >
                Nueva
              </button>
            )}
          </div>
        </div>

        {/* ── Campo: ocupa todo el espacio disponible ── */}
        <div className="flex-1 relative min-h-0">
          <FootballField
            formation={formation}
            positions={squadPositions}
            onPositionClick={handlePositionClick}
            onPlayerRemove={handlePlayerRemove}
          />
        </div>
      </div>

      {/* Modal: Selector de jugador */}
      <PlayerSelectorModal
        isOpen={!!selectedPosition}
        position={selectedPosition}
        positionLabel={selectedSlotInfo?.label}
        availablePlayers={availablePlayers}
        onSelect={handlePlayerSelect}
        onClose={() => setSelectedPosition(null)}
      />

      {/* Modal: Guardar alineación */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowSaveModal(false)}>
          <div
            className="backdrop-blur-xl bg-black/80 border border-white/10 w-full max-w-sm mx-4 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-white/30" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                {loadedSquadId ? 'Actualizar Alineación' : 'Guardar Alineación'}
              </span>
            </div>
            <p className="text-white/40 text-sm mb-4">
              {assignedCount < 11
                ? `${assignedCount}/11 jugadores asignados`
                : 'Alineación completa'}
            </p>

            <input
              type="text"
              placeholder="Nombre de la alineación..."
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              maxLength={50}
              className="w-full bg-black/30 border border-white/15 px-3 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/30 mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSquad()}
            />

            <div className="flex gap-3">
              <button
                onClick={handleSaveSquad}
                disabled={!squadName.trim() || createSquadMutation.isPending || updateSquadMutation.isPending}
                className="flex-1 py-2.5 px-4 bg-white text-black text-sm font-black uppercase tracking-wider hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createSquadMutation.isPending || updateSquadMutation.isPending ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="py-2.5 px-4 bg-white/8 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold tracking-wide transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
