import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, error: authError } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    // Enviar solo los datos necesarios (sin confirmPassword)
    const { confirmPassword, ...registerData } = formData

    const result = await register(registerData)

    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || authError)
    }
  }

  return (
    <div className="min-h-screen bg-uefa-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-uefa-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-uefa-light-blue/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            className="text-6xl mb-4 inline-block"
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            ⚽
          </motion.div>
          <h1 className="text-4xl font-bold text-uefa-gold mb-2 glow-gold">
            Crear Cuenta
          </h1>
          <p className="text-uefa-silver">
            Únete a FIFPRO2K26 Champions League
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", damping: 20 }}
          className="backdrop-blur-2xl bg-black/82 border border-white/10 p-8 relative overflow-hidden"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.85), 0 0 120px rgba(255,255,255,0.025)' }}
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '380%' }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 p-4"
              >
                <p className="text-red-300 text-sm flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-white/60 text-sm font-semibold mb-2 uppercase tracking-wider">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-uefa-gold/50 focus:bg-white/10 transition-all duration-300"
                placeholder="Lionel Messi"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white/60 text-sm font-semibold mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-uefa-gold/50 focus:bg-white/10 transition-all duration-300"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white/60 text-sm font-semibold mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-uefa-gold/50 focus:bg-white/10 transition-all duration-300"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-white/60 text-sm font-semibold mb-2 uppercase tracking-wider">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-uefa-gold/50 focus:bg-white/10 transition-all duration-300"
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-uefa-gold to-yellow-500 hover:from-yellow-500 hover:to-uefa-gold text-black font-bold py-3 px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-uefa-gold/30 active:scale-98 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>

            {/* Link a login */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-uefa-gold hover:text-yellow-400 font-semibold transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
