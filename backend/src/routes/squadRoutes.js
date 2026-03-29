const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getAllSquads,
  getSquadById,
  createSquad,
  updateSquad,
  deleteSquad,
  updatePositions,
  updateFormation,
} = require('../controllers/squadController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', getAllSquads);
router.get('/:id', getSquadById);
router.post('/', createSquad);
router.put('/:id', updateSquad);
router.delete('/:id', deleteSquad);
router.put('/:id/positions', updatePositions);
router.put('/:id/formation', updateFormation);

module.exports = router;
