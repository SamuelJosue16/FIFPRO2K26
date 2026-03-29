import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-uefa-gradient flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-4xl font-bold text-uefa-gold mb-2">
            Crear Cuenta
          </h1>
          <p className="text-uefa-silver">
            Únete a FIFPRO2K26 Champions League
          </p>
        </div>

        {/* Formulario */}
        <div className="card-uefa">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <p className="text-red-400 text-sm">❌ {error}</p>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-uefa-silver text-sm font-semibold mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-uefa"
                placeholder="Lionel Messi"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-uefa-silver text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-uefa"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-uefa-silver text-sm font-semibold mb-2">
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
                className="input-uefa"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-uefa-silver text-sm font-semibold mb-2">
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
                className="input-uefa"
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-uefa-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>

            {/* Link a login */}
            <div className="text-center pt-4 border-t border-uefa-blue">
              <p className="text-uefa-silver text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-uefa-gold hover:text-yellow-400 font-semibold">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
