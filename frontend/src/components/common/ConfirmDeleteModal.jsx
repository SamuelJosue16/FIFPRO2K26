import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isLoading, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirm-delete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={isLoading ? undefined : onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <motion.div
            key="confirm-delete-panel"
            initial={{ opacity: 0, scale: 0.90, y: 48 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360, mass: 0.75 }}
            className="backdrop-blur-2xl bg-black/82 border border-red-500/30 max-w-md w-full relative overflow-hidden"
            style={{ boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.1), 0 40px 80px rgba(0,0,0,0.85), 0 0 120px rgba(239, 68, 68, 0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Shimmer sweep al abrir */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '380%' }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>

            {/* Header */}
            <div className="p-6 border-b border-red-500/20 relative z-10">
              <h2 id="confirm-delete-title" className="text-2xl font-bold text-red-400 flex items-center gap-3">
                <motion.span
                  className="text-3xl"
                  animate={{
                    rotate: [0, -10, 10, -5, 5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  ⚠️
                </motion.span>
                {title || 'Confirmar Eliminación'}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
              <p className="text-white text-lg mb-3">
                {message || '¿Está seguro que desea eliminar este elemento?'}
              </p>
              <p className="text-white/40 text-sm flex items-center gap-2">
                <span className="text-base">🔒</span>
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Buttons */}
            <div className="p-6 border-t border-white/10 flex gap-3 relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-semibold py-3 px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/30 active:scale-98"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Eliminando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🗑️ Eliminar
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDeleteModal
