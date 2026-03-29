const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

// Rutas públicas (no requieren autenticación)
router.post('/register', authController.register)
router.post('/login', authController.login)

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, authController.getMe)
router.put('/profile', authMiddleware, authController.updateProfile)
router.put('/change-password', authMiddleware, authController.changePassword)

module.exports = router
