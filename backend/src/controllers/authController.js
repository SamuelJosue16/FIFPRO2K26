const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

// Secret para JWT (en producción debe estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'uefa_champions_league_secret_2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Registrar un nuevo usuario
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validar campos requeridos
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password y name son requeridos'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      })
    }

    // Validar longitud de password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Usuario registrado exitosamente'
    })

  } catch (error) {
    console.error('Error en register:', error)
    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario'
    })
  }
}

/**
 * Login de usuario
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y password son requeridos'
      })
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      })
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      })
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Retornar usuario sin password
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login exitoso'
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión'
    })
  }
}

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    // El userId viene del middleware de autenticación
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Error en getMe:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener perfil'
    })
  }
}

/**
 * Actualizar perfil del usuario
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    // Validar que al menos un campo esté presente
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar al menos un campo para actualizar'
      })
    }

    // Si se está actualizando el email, verificar que no exista
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de email inválido'
        })
      }

      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser && existingUser.id !== req.userId) {
        return res.status(409).json({
          success: false,
          error: 'El email ya está en uso'
        })
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Perfil actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error en updateProfile:', error)
    res.status(500).json({
      success: false,
      error: 'Error al actualizar perfil'
    })
  }
}

/**
 * Cambiar contraseña
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validar campos requeridos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña actual y nueva contraseña son requeridas'
      })
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      })
    }

    // Obtener usuario con password
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña actual incorrecta'
      })
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    })

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error en changePassword:', error)
    res.status(500).json({
      success: false,
      error: 'Error al cambiar contraseña'
    })
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
}
