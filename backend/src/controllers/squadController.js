const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VALID_FORMATIONS = ['4-3-3', '4-2-3-1', '4-2-4'];

// GET /api/squads - Obtener todas las alineaciones del usuario autenticado
const getAllSquads = async (req, res) => {
  try {
    const userId = req.userId;

    const squads = await prisma.squad.findMany({
      where: { userId, isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, count: squads.length, data: squads });
  } catch (error) {
    console.error('Error al obtener alineaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener alineaciones', error: error.message });
  }
};

// GET /api/squads/:id - Obtener una alineación específica
const getSquadById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const squad = await prisma.squad.findUnique({ where: { id } });

    if (!squad) {
      return res.status(404).json({ success: false, message: 'Alineación no encontrada' });
    }

    if (squad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver esta alineación' });
    }

    res.json({ success: true, data: squad });
  } catch (error) {
    console.error('Error al obtener alineación:', error);
    res.status(500).json({ success: false, message: 'Error al obtener alineación', error: error.message });
  }
};

// POST /api/squads - Crear nueva alineación
const createSquad = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, formation, positions } = req.body;

    if (!name || !formation) {
      return res.status(400).json({ success: false, message: 'Nombre y formación son requeridos' });
    }

    if (name.length < 1 || name.length > 50) {
      return res.status(400).json({ success: false, message: 'El nombre debe tener entre 1 y 50 caracteres' });
    }

    if (!VALID_FORMATIONS.includes(formation)) {
      return res.status(400).json({
        success: false,
        message: `Formación no válida. Las formaciones permitidas son: ${VALID_FORMATIONS.join(', ')}`,
      });
    }

    const positionsObj = positions || {};

    // Validar que los jugadores existen (si hay posiciones asignadas)
    const playerIds = Object.values(positionsObj).filter(Boolean);
    if (playerIds.length > 0) {
      const foundPlayers = await prisma.player.findMany({
        where: { id: { in: playerIds } },
        select: { id: true },
      });

      if (foundPlayers.length !== playerIds.length) {
        return res.status(400).json({ success: false, message: 'Uno o más jugadores no existen' });
      }

      // Verificar que no haya jugadores duplicados
      const uniqueIds = new Set(playerIds);
      if (uniqueIds.size !== playerIds.length) {
        return res.status(400).json({ success: false, message: 'No se puede asignar el mismo jugador a dos posiciones' });
      }
    }

    const squad = await prisma.squad.create({
      data: {
        userId,
        name: name.trim(),
        formation,
        positions: JSON.stringify(positionsObj),
      },
    });

    res.status(201).json({ success: true, data: squad });
  } catch (error) {
    console.error('Error al crear alineación:', error);
    res.status(500).json({ success: false, message: 'Error al crear alineación', error: error.message });
  }
};

// PUT /api/squads/:id - Actualizar alineación completa
const updateSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, formation, positions } = req.body;

    const existing = await prisma.squad.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Alineación no encontrada' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para modificar esta alineación' });
    }

    if (formation && !VALID_FORMATIONS.includes(formation)) {
      return res.status(400).json({
        success: false,
        message: `Formación no válida. Las formaciones permitidas son: ${VALID_FORMATIONS.join(', ')}`,
      });
    }

    if (name && (name.length < 1 || name.length > 50)) {
      return res.status(400).json({ success: false, message: 'El nombre debe tener entre 1 y 50 caracteres' });
    }

    const positionsObj = positions !== undefined ? positions : JSON.parse(existing.positions);
    const playerIds = Object.values(positionsObj).filter(Boolean);

    if (playerIds.length > 0) {
      const foundPlayers = await prisma.player.findMany({
        where: { id: { in: playerIds } },
        select: { id: true },
      });

      if (foundPlayers.length !== playerIds.length) {
        return res.status(400).json({ success: false, message: 'Uno o más jugadores no existen' });
      }

      const uniqueIds = new Set(playerIds);
      if (uniqueIds.size !== playerIds.length) {
        return res.status(400).json({ success: false, message: 'No se puede asignar el mismo jugador a dos posiciones' });
      }
    }

    const updated = await prisma.squad.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(formation && { formation }),
        positions: JSON.stringify(positionsObj),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar alineación:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar alineación', error: error.message });
  }
};

// DELETE /api/squads/:id - Eliminar (soft delete) alineación
const deleteSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existing = await prisma.squad.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Alineación no encontrada' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta alineación' });
    }

    await prisma.squad.delete({ where: { id } });

    res.json({ success: true, message: 'Alineación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar alineación:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar alineación', error: error.message });
  }
};

// PUT /api/squads/:id/positions - Actualizar solo las posiciones
const updatePositions = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { positions } = req.body;

    if (!positions || typeof positions !== 'object') {
      return res.status(400).json({ success: false, message: 'El campo positions es requerido y debe ser un objeto' });
    }

    const existing = await prisma.squad.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Alineación no encontrada' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para modificar esta alineación' });
    }

    const playerIds = Object.values(positions).filter(Boolean);
    if (playerIds.length > 0) {
      const foundPlayers = await prisma.player.findMany({
        where: { id: { in: playerIds } },
        select: { id: true },
      });

      if (foundPlayers.length !== playerIds.length) {
        return res.status(400).json({ success: false, message: 'Uno o más jugadores no existen' });
      }

      const uniqueIds = new Set(playerIds);
      if (uniqueIds.size !== playerIds.length) {
        return res.status(400).json({ success: false, message: 'No se puede asignar el mismo jugador a dos posiciones' });
      }
    }

    const updated = await prisma.squad.update({
      where: { id },
      data: { positions: JSON.stringify(positions) },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar posiciones:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar posiciones', error: error.message });
  }
};

// PUT /api/squads/:id/formation - Cambiar formación
const updateFormation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { formation } = req.body;

    if (!formation || !VALID_FORMATIONS.includes(formation)) {
      return res.status(400).json({
        success: false,
        message: `Formación no válida. Las formaciones permitidas son: ${VALID_FORMATIONS.join(', ')}`,
      });
    }

    const existing = await prisma.squad.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Alineación no encontrada' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para modificar esta alineación' });
    }

    const updated = await prisma.squad.update({
      where: { id },
      data: { formation },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar formación:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar formación', error: error.message });
  }
};

module.exports = {
  getAllSquads,
  getSquadById,
  createSquad,
  updateSquad,
  deleteSquad,
  updatePositions,
  updateFormation,
};
