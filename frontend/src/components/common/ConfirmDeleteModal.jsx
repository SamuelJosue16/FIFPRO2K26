/**
 * Modal de confirmación para eliminaciones
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onConfirm - Función a ejecutar al confirmar
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje de confirmación
 * @param {boolean} props.isLoading - Si está procesando la eliminación
 */
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message, isLoading = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-uefa-dark border-2 border-red-600 max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-red-600">
          <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
            ⚠️ {title || 'Confirmar Eliminación'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white text-lg mb-2">
            {message || '¿Está seguro que desea eliminar este elemento?'}
          </p>
          <p className="text-uefa-silver text-sm">
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Buttons */}
        <div className="p-6 border-t border-uefa-blue flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-uefa-secondary flex-1"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shine-effect"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </span>
            ) : (
              'Eliminar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
