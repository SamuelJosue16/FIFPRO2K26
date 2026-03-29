import { useState, useEffect, useRef } from 'react'
import { useCreatePlayer, useUpdatePlayer } from '../../hooks/usePlayers'
import { useTeams } from '../../hooks/useTeams'

/**
 * Modal para crear o editar un jugador
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.player - Jugador a editar (null para crear nuevo)
 */
function PlayerFormModal({ isOpen, onClose, player = null }) {
  const isEditMode = !!player

  const createPlayerMutation = useCreatePlayer()
  const updatePlayerMutation = useUpdatePlayer()
  const { data: teams } = useTeams()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    number: '',
    position: 'Delantero',
    nationality: '',
    birthDate: '',
    photoUrl: '',
    teamId: '',
    statistics: {
      goals: 0,
      assists: 0,
      matches: 0,
      yellowCards: 0,
      redCards: 0
    }
  })

  const [error, setError] = useState(null)

  const positions = ['Portero', 'Defensa', 'Centrocampista', 'Delantero']

  // Cargar datos del jugador si estamos en modo edición
  useEffect(() => {
    if (player) {
      setFormData({
        firstName: player.firstName || '',
        lastName: player.lastName || '',
        number: player.number?.toString() || '',
        position: player.position || 'Delantero',
        nationality: player.nationality || '',
        birthDate: player.birthDate ? new Date(player.birthDate).toISOString().split('T')[0] : '',
        photoUrl: player.photoUrl || '',
        teamId: player.teamId || '',
        statistics: player.statistics ? JSON.parse(player.statistics) : {
          goals: 0,
          assists: 0,
          matches: 0,
          yellowCards: 0,
          redCards: 0
        }
      })
    } else {
      // Reset form para modo creación
      setFormData({
        firstName: '',
        lastName: '',
        number: '',
        position: 'Delantero',
        nationality: '',
        birthDate: '',
        photoUrl: '',
        teamId: '',
        statistics: {
          goals: 0,
          assists: 0,
          matches: 0,
          yellowCards: 0,
          redCards: 0
        }
      })
    }
    setError(null)
  }, [player])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFormData(prev => ({ ...prev, photoUrl: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleStatChange = (statName, value) => {
    setFormData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [statName]: parseInt(value) || 0
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validar que se seleccionó un equipo
    if (!formData.teamId) {
      setError('Debe seleccionar un equipo')
      return
    }

    // Preparar datos para enviar
    const playerData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      number: parseInt(formData.number),
      position: formData.position,
      nationality: formData.nationality.trim(),
      birthDate: new Date(formData.birthDate).toISOString(),
      photoUrl: formData.photoUrl.startsWith('data:') ? formData.photoUrl : (formData.photoUrl.trim() || null),
      teamId: formData.teamId,
      statistics: JSON.stringify(formData.statistics)
    }

    try {
      if (isEditMode) {
        await updatePlayerMutation.mutateAsync({ id: player.id, data: playerData })
      } else {
        await createPlayerMutation.mutateAsync(playerData)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el jugador')
    }
  }

  if (!isOpen) return null

  const isLoading = createPlayerMutation.isPending || updatePlayerMutation.isPending

  const inputCls = "w-full bg-white/5 border border-white/12 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/30 placeholder-white/20 transition-colors"
  const labelCls = "block text-white/40 text-[10px] uppercase tracking-[0.18em] mb-1.5 font-semibold"

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="backdrop-blur-xl bg-black/80 border border-white/10 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-white/8 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <div className="h-px w-5 bg-white/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                {isEditMode ? 'Editar ficha' : 'Nueva ficha'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {isEditMode ? 'Editar Jugador' : 'Crear Jugador'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/8 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-lg transition-all"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-3">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelCls}>Nombre *</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName}
                onChange={handleChange} required className={inputCls} placeholder="Lionel" disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelCls}>Apellido *</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName}
                onChange={handleChange} required className={inputCls} placeholder="Messi" disabled={isLoading} />
            </div>
          </div>

          {/* Número + Posición */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="number" className={labelCls}>Número *</label>
              <input type="number" id="number" name="number" value={formData.number}
                onChange={handleChange} required min="1" max="99"
                className={inputCls} placeholder="10" disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="position" className={labelCls}>Posición *</label>
              <select id="position" name="position" value={formData.position}
                onChange={handleChange} required className={inputCls} disabled={isLoading}>
                {positions.map(pos => <option key={pos} value={pos} className="bg-black">{pos}</option>)}
              </select>
            </div>
          </div>

          {/* Nacionalidad + Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nationality" className={labelCls}>Nacionalidad *</label>
              <input type="text" id="nationality" name="nationality" value={formData.nationality}
                onChange={handleChange} required className={inputCls} placeholder="Argentina" disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="birthDate" className={labelCls}>Fecha de Nacimiento *</label>
              <input type="date" id="birthDate" name="birthDate" value={formData.birthDate}
                onChange={handleChange} required className={`${inputCls} [color-scheme:dark]`} disabled={isLoading} />
            </div>
          </div>

          {/* Equipo */}
          <div>
            <label htmlFor="teamId" className={labelCls}>Equipo *</label>
            <select id="teamId" name="teamId" value={formData.teamId}
              onChange={handleChange} required className={inputCls} disabled={isLoading}>
              <option value="" className="bg-black">Seleccione un equipo</option>
              {teams?.map(team => (
                <option key={team.id} value={team.id} className="bg-black">{team.name}</option>
              ))}
            </select>
          </div>

          {/* Foto URL */}
          <div>
            <label className={labelCls}>Foto <span className="normal-case text-white/25">(opcional)</span></label>
            {/* Preview */}
            {formData.photoUrl && (
              <div className="relative w-16 h-20 mb-2 overflow-hidden border border-white/10">
                <img src={formData.photoUrl} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 text-white text-[10px] flex items-center justify-center hover:bg-red-500/70"
                >×</button>
              </div>
            )}
            {/* URL input */}
            <input type="text" id="photoUrl" name="photoUrl" value={formData.photoUrl}
              onChange={handleChange} className={inputCls}
              placeholder="https://ejemplo.com/foto.jpg" disabled={isLoading} />
            {/* File picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed text-white/50 hover:text-white/80 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Subir desde explorador
            </button>
          </div>

          {/* Estadísticas */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-5 bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">Estadísticas</span>
            </div>
            <div className="grid grid-cols-5 gap-px bg-white/5">
              {[
                { key: 'goals', label: 'Goles' },
                { key: 'assists', label: 'Asist.' },
                { key: 'matches', label: 'PJ' },
                { key: 'yellowCards', label: 'TA' },
                { key: 'redCards', label: 'TR' },
              ].map(({ key, label }) => (
                <div key={key} className="bg-black/40 p-3 text-center">
                  <label className="block text-white/30 text-[9px] uppercase tracking-wider mb-2">{label}</label>
                  <input
                    type="number"
                    value={formData.statistics[key]}
                    onChange={(e) => handleStatChange(key, e.target.value)}
                    min="0"
                    className="w-full bg-transparent text-white text-center text-lg font-black focus:outline-none focus:text-white placeholder-white/20"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-white/8 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold tracking-wide transition-all"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-white text-black text-sm font-black uppercase tracking-wider hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </span>
              ) : (
                isEditMode ? 'Actualizar Jugador' : 'Crear Jugador'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlayerFormModal
