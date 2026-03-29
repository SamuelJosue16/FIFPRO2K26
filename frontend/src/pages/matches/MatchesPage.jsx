import { useState } from 'react'
import { useMatches } from '../../hooks/useMatches'
import { useTeams } from '../../hooks/useTeams'
import MatchCard from '../../components/matches/MatchCard'

function MatchesPage() {
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedTeamId, setSelectedTeamId] = useState(null)

  // Obtener equipos para el filtro
  const { data: teams } = useTeams()

  // Obtener partidos según filtros
  const { data: matches, isLoading, isError, error } = useMatches({
    status: selectedStatus || undefined,
    teamId: selectedTeamId || undefined
  })

  const statuses = [
    { value: 'scheduled', label: 'Programados' },
    { value: 'live', label: 'En vivo' },
    { value: 'finished', label: 'Finalizados' },
    { value: 'postponed', label: 'Pospuestos' }
  ]

  if (isLoading) {
    return (
      <div className="container-uefa py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-16 h-16 border-4 border-uefa-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-uefa-silver text-lg">Cargando partidos...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-uefa py-12">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 text-lg mb-2">❌ Error al cargar partidos</p>
          <p className="text-uefa-silver">{error?.message || 'Error desconocido'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
    <div className="container-uefa py-12">
      {/* Header editorial */}
      <div className="mb-10 pb-8 border-b border-white/8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-white/40" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">UEFA Champions League</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-2 text-white">
          Partidos
        </h1>
        <p className="text-sm font-mono uppercase tracking-widest text-white/30">
          {matches?.length || 0} encuentros en la competición
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-4">
        {/* Filtro por estado */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-white/35">Estado</label>
          <select 
            value={selectedStatus || ''} 
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="w-full px-4 py-2.5 border text-sm focus:outline-none appearance-none bg-black/30 border-white/10 text-white focus:border-white/30"
          >
            <option value="">Todos los estados</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

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

        {/* Botón limpiar filtros */}
        {(selectedStatus || selectedTeamId) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStatus(null)
                setSelectedTeamId(null)
              }}
              className="py-2.5 px-4 border text-sm font-semibold tracking-wide transition-all duration-200 bg-white/8 hover:bg-white/15 border-white/10 text-white"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de partidos */}
      {matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/30 text-lg">No hay partidos que coincidan con los filtros</p>
        </div>
      )}
    </div>
    </div>
  )
}

export default MatchesPage
