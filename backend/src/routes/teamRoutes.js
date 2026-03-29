const express = require('express');
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/teamController');

// Rutas públicas
router.get('/', getAllTeams);           // GET /api/teams
router.get('/:id', getTeamById);        // GET /api/teams/:id

// Rutas protegidas (por ahora sin autenticación)
router.post('/', createTeam);           // POST /api/teams
router.put('/:id', updateTeam);         // PUT /api/teams/:id
router.delete('/:id', deleteTeam);      // DELETE /api/teams/:id

module.exports = router;
