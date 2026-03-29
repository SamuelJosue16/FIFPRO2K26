import { useState } from 'react'
import { usePlayers, useDeletePlayer } from '../../hooks/usePlayers'
import { useTeams } from '../../hooks/useTeams'
import PlayerCard from '../../components/players/PlayerCard'
import PlayerDetailModal from '../../components/players/PlayerDetailModal'
import PlayerFormModal from '../../components/players/PlayerFormModal'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'

function PlayersPage() {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [selectedTeamId, setSelectedTeamId] = useState(null)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [playerToDelete, setPlayerToDelete] = useState(null)
  
  // Modal de detalles
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPlayerDetail, setSelectedPlayerDetail] = useState(null)

  // Obtener equipos para el filtro
  const { data: teams } = useTeams()

  // Obtener jugadores según filtros
  const { data: players, isLoading, isError, error } = usePlayers({
    teamId: selectedTeamId || undefined,
    position: selectedPosition || undefined
  })

  const deletePlayerMutation = useDeletePlayer()

  const positions = ['Portero', 'Defensa', 'Centrocampista', 'Delantero']

  const handleCreatePlayer = () => {
    setSelectedPlayer(null)
    setIsFormModalOpen(true)
  }

  const handleCardClick = (player) => {
    setSelectedPlayerDetail(player)
    setIsDetailModalOpen(true)
  }

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (player) => {
    setPlayerToDelete(player)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return
    
    try {
      await deletePlayerMutation.mutateAsync(playerToDelete.id)
      setIsDeleteModalOpen(false)
      setPlayerToDelete(null)
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="container-uefa py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-16 h-16 border-4 border-uefa-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-uefa-silver text-lg">Cargando jugadores...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-uefa py-12">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 text-lg mb-2">❌ Error al cargar jugadores</p>
          <p className="text-uefa-silver">{error?.message || 'Error desconocido'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-uefa py-12">
      {/* Header editorial */}
      <div className="mb-10 flex items-end justify-between flex-wrap gap-6 pb-8 border-b border-white/8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-white/40" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">UEFA Champions League</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-2 text-white">
            Jugadores
          </h1>
          <p className="text-sm font-mono uppercase tracking-widest text-white/30">
            {players?.length || 0} futbolistas en la competición
          </p>
        </div>
        <button 
          onClick={handleCreatePlayer}
          className="py-2.5 px-6 text-sm font-black uppercase tracking-wider transition-all duration-200 bg-white text-black hover:bg-white/90"
        >
          Crear Jugador
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-4">
        {/* Filtro por equipo */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-white/35">Equipo</label>
          <select 
            value={selectedTeamId || ''} 
            onChange={(e) => setSelectedTeamId(e.target.value || null)}
            className="w-full px-4 py-2.5 border text-sm focus:outline-none appearance-none bg-black/30 border-white/10 text-white focus:border-white/30"
          >
            <option value="">Todos los equipos</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por posición */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-white/35">Posición</label>
          <select 
            value={selectedPosition || ''} 
            onChange={(e) => setSelectedPosition(e.target.value || null)}
            className="w-full px-4 py-2.5 border text-sm focus:outline-none appearance-none bg-black/30 border-white/10 text-white focus:border-white/30"
          >
            <option value="">Todas las posiciones</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {(selectedTeamId || selectedPosition) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedTeamId(null)
                setSelectedPosition(null)
              }}
              className="py-2.5 px-4 border text-sm font-semibold tracking-wide transition-all duration-200 bg-white/8 hover:bg-white/15 border-white/10 text-white"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Grid de jugadores */}
      {players && players.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {players.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player}
              onClick={() => handleCardClick(player)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/30 text-lg mb-4">No hay jugadores que coincidan con los filtros</p>
          <button 
            onClick={handleCreatePlayer}
            className="py-2.5 px-6 bg-white text-black text-sm font-black uppercase tracking-wider hover:bg-white/90 transition-all"
          >
            Crear Primer Jugador
          </button>
        </div>
      )}

      {/* Modales */}
      <PlayerDetailModal
        player={selectedPlayerDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPlayerDetail(null)
        }}
        onEdit={() => handleEditPlayer(selectedPlayerDetail)}
        onDelete={() => handleDeleteClick(selectedPlayerDetail)}
      />

      <PlayerFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedPlayer(null)
        }}
        player={selectedPlayer}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPlayerToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Jugador"
        message={`¿Está seguro que desea eliminar al jugador "${playerToDelete?.firstName} ${playerToDelete?.lastName}"?`}
        isLoading={deletePlayerMutation.isPending}
      />
      </div>
    </div>
  )
}

export default PlayersPage
