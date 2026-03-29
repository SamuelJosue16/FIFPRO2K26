import { useState, useEffect } from 'react'
import { useCreateTeam, useUpdateTeam } from '../../hooks/useTeams'

/**
 * Modal para crear o editar un equipo
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.team - Equipo a editar (null para crear nuevo)
 */
function TeamFormModal({ isOpen, onClose, team = null }) {
  const isEditMode = !!team

  const createTeamMutation = useCreateTeam()
  const updateTeamMutation = useUpdateTeam()

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    country: '',
    logoUrl: '',
    colors: {
      primary: '#FFFFFF',
      secondary: '#000000'
    }
  })

  const [error, setError] = useState(null)

  // Cargar datos del equipo si estamos en modo edición
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        shortName: team.shortName || '',
        country: team.country || '',
        logoUrl: team.logoUrl || '',
        colors: team.colors ? JSON.parse(team.colors) : { primary: '#FFFFFF', secondary: '#000000' }
      })
    } else {
      // Reset form para modo creación
      setFormData({
        name: '',
        shortName: '',
        country: '',
        logoUrl: '',
        colors: { primary: '#FFFFFF', secondary: '#000000' }
      })
    }
    setError(null)
  }, [team])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleColorChange = (colorType, value) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Preparar datos para enviar
    const teamData = {
      name: formData.name.trim(),
      shortName: formData.shortName.trim(),
      country: formData.country.trim(),
      logoUrl: formData.logoUrl.trim() || null,
      colors: JSON.stringify(formData.colors)
    }

    try {
      if (isEditMode) {
        await updateTeamMutation.mutateAsync({ id: team.id, data: teamData })
      } else {
        await createTeamMutation.mutateAsync(teamData)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el equipo')
    }
  }

  if (!isOpen) return null

  const isLoading = createTeamMutation.isPending || updateTeamMutation.isPending

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
        className="backdrop-blur-xl bg-black/80 border border-white/10 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-white/8 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <div className="h-px w-5 bg-white/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                {isEditMode ? 'Editar registro' : 'Nuevo registro'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {isEditMode ? 'Editar Equipo' : 'Crear Equipo'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-3">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Nombre del equipo */}
          <div>
            <label htmlFor="name" className={labelCls}>Nombre del Equipo *</label>
            <input type="text" id="name" name="name" value={formData.name}
              onChange={handleChange} required maxLength={100}
              className={inputCls} placeholder="Real Madrid CF" disabled={isLoading} />
          </div>

          {/* Nombre corto */}
          <div>
            <label htmlFor="shortName" className={labelCls}>Nombre Corto *</label>
            <input type="text" id="shortName" name="shortName" value={formData.shortName}
              onChange={handleChange} required maxLength={10}
              className={inputCls} placeholder="RMA" disabled={isLoading} />
          </div>

          {/* País */}
          <div>
            <label htmlFor="country" className={labelCls}>País *</label>
            <input type="text" id="country" name="country" value={formData.country}
              onChange={handleChange} required maxLength={50}
              className={inputCls} placeholder="España" disabled={isLoading} />
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className={labelCls}>
              URL del Logo <span className="normal-case text-white/25">(opcional)</span>
            </label>
            <input type="url" id="logoUrl" name="logoUrl" value={formData.logoUrl}
              onChange={handleChange} className={inputCls}
              placeholder="https://ejemplo.com/logo.png" disabled={isLoading} />
          </div>

          {/* Colores */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-5 bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">Colores del club</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/5">
              {[
                { id: 'primaryColor', type: 'primary', label: 'Color Primario', placeholder: '#FFFFFF' },
                { id: 'secondaryColor', type: 'secondary', label: 'Color Secundario', placeholder: '#000000' },
              ].map(({ id, type, label, placeholder }) => (
                <div key={id} className="bg-black/40 p-3">
                  <label className="block text-white/30 text-[9px] uppercase tracking-wider mb-2">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id={id}
                      value={formData.colors[type]}
                      onChange={(e) => handleColorChange(type, e.target.value)}
                      className="w-9 h-9 cursor-pointer border border-white/15 bg-transparent"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      value={formData.colors[type]}
                      onChange={(e) => handleColorChange(type, e.target.value)}
                      className="flex-1 bg-transparent border border-white/10 text-white text-sm px-2 py-1.5 focus:outline-none focus:border-white/25 font-mono text-xs"
                      placeholder={placeholder}
                      disabled={isLoading}
                    />
                  </div>
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
                isEditMode ? 'Actualizar Equipo' : 'Crear Equipo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TeamFormModal
