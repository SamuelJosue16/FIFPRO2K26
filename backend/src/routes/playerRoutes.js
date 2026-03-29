const express = require('express');
const router = express.Router();
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');

// Rutas públicas
router.get('/', getAllPlayers);         // GET /api/players (soporta ?teamId=xxx&position=xxx)
router.get('/:id', getPlayerById);      // GET /api/players/:id

// Rutas protegidas (por ahora sin autenticación)
router.post('/', createPlayer);         // POST /api/players
router.put('/:id', updatePlayer);       // PUT /api/players/:id
router.delete('/:id', deletePlayer);    // DELETE /api/players/:id

module.exports = router;
