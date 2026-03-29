const express = require('express')
const router = express.Router()
const { runSeed } = require('../controllers/seedController')

// POST /api/seed  — requiere header: x-seed-secret: <SEED_SECRET>
router.post('/', runSeed)

module.exports = router
