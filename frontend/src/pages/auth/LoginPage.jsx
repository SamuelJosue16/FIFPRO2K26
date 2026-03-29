import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const { login, error: authError } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    const result = await login(formData)

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
            Iniciar Sesión
          </h1>
          <p className="text-uefa-silver">
            Accede a tu cuenta de FIFPRO2K26
          </p>
        </div>

        {/* Formulario */}
        <div className="card-uefa">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <p className="text-red-400 text-sm">❌ {error}</p>
              </div>
            )}

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
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-uefa-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Link a registro */}
            <div className="text-center pt-4 border-t border-uefa-blue">
              <p className="text-uefa-silver text-sm">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-uefa-gold hover:text-yellow-400 font-semibold">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 card-uefa bg-uefa-blue/20">
          <p className="text-uefa-silver text-xs mb-2 font-semibold">💡 Credenciales de prueba:</p>
          <p className="text-white text-xs">Email: admin@fifpro.com</p>
          <p className="text-white text-xs">Password: Admin123!</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
