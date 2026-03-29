const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/matchController');

// Rutas públicas
router.get('/', getAllMatches);         // GET /api/matches (soporta ?status=xxx&teamId=xxx)
router.get('/:id', getMatchById);       // GET /api/matches/:id

// Rutas protegidas (por ahora sin autenticación)
router.post('/', createMatch);          // POST /api/matches
router.put('/:id', updateMatch);        // PUT /api/matches/:id
router.delete('/:id', deleteMatch);     // DELETE /api/matches/:id

module.exports = router;
