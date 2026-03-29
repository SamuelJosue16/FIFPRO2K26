import { useState } from 'react'
import { useTeams, useDeleteTeam } from '../../hooks/useTeams'
import TeamCard from '../../components/teams/TeamCard'
import TeamDetailModal from '../../components/teams/TeamDetailModal'
import TeamFormModal from '../../components/teams/TeamFormModal'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'

function TeamsPage() {
  const { data: teams, isLoading, isError, error } = useTeams()
  const deleteTeamMutation = useDeleteTeam()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState(null)
  
  // Modal de detalles
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null)

  const handleCreateTeam = () => {
    setSelectedTeam(null)
    setIsFormModalOpen(true)
  }

  const handleCardClick = (team) => {
    setSelectedTeamDetail(team)
    setIsDetailModalOpen(true)
  }

  const handleEditTeam = (team) => {
    setSelectedTeam(team)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (team) => {
    setTeamToDelete(team)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return
    
    try {
      await deleteTeamMutation.mutateAsync(teamToDelete.id)
      setIsDeleteModalOpen(false)
      setTeamToDelete(null)
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="container-uefa py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-16 h-16 border-4 border-uefa-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-uefa-silver text-lg">Cargando equipos...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-uefa py-12">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 text-lg mb-2">❌ Error al cargar equipos</p>
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
            Equipos
          </h1>
          <p className="text-sm font-mono uppercase tracking-widest text-white/30">
            {teams?.length || 0} equipos participantes
          </p>
        </div>
        <button 
          onClick={handleCreateTeam}
          className="py-2.5 px-6 text-sm font-black uppercase tracking-wider transition-all duration-200 bg-white text-black hover:bg-white/90"
        >
          Crear Equipo
        </button>
      </div>

      {/* Grid de equipos */}
      {teams && teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {teams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team}
              onClick={() => handleCardClick(team)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/30 text-lg mb-4">No hay equipos registrados</p>
          <button 
            onClick={handleCreateTeam}
            className="py-2.5 px-6 bg-white text-black text-sm font-black uppercase tracking-wider hover:bg-white/90 transition-all"
          >
            Crear Primer Equipo
          </button>
        </div>
      )}

      {/* Modales */}
      <TeamDetailModal
        team={selectedTeamDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedTeamDetail(null)
        }}
        onEdit={() => handleEditTeam(selectedTeamDetail)}
        onDelete={() => handleDeleteClick(selectedTeamDetail)}
      />

      <TeamFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedTeam(null)
        }}
        team={selectedTeam}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setTeamToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Equipo"
        message={`¿Está seguro que desea eliminar el equipo "${teamToDelete?.name}"?`}
        isLoading={deleteTeamMutation.isPending}
      />
      </div>
    </div>
  )
}

export default TeamsPage
