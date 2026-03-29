const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'uefa_champions_league_secret_2026'

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization
 * y añade el userId al objeto request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      })
    }

    // El formato esperado es: "Bearer TOKEN"
    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Formato de token inválido. Use: Bearer TOKEN'
      })
    }

    const token = parts[1]

    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Añadir userId al request para uso en controladores
    req.userId = decoded.userId
    req.userEmail = decoded.email

    // Continuar al siguiente middleware o controlador
    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      })
    }

    console.error('Error en authMiddleware:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al verificar autenticación'
    })
  }
}

/**
 * Middleware opcional de autenticación
 * Si hay token, lo valida y añade userId al request
 * Si no hay token, simplemente continúa sin error
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return next()
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next()
    }

    const token = parts[1]

    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    req.userEmail = decoded.email

    next()

  } catch (error) {
    // Si hay error en el token opcional, simplemente continuar
    next()
  }
}

module.exports = {
  authMiddleware,
  optionalAuth
}
