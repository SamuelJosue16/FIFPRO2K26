const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/players - Obtener todos los jugadores
const getAllPlayers = async (req, res) => {
  try {
    const { teamId, position } = req.query;

    // Construir filtros dinámicos
    const where = {};
    if (teamId) where.teamId = teamId;
    if (position) where.position = position;

    const players = await prisma.player.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        }
      },
      orderBy: [
        { team: { name: 'asc' } },
        { number: 'asc' }
      ]
    });

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener jugadores',
      error: error.message
    });
  }
};

// GET /api/players/:id - Obtener un jugador por ID
const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: true
      }
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Error al obtener jugador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener jugador',
      error: error.message
    });
  }
};

// POST /api/players - Crear un nuevo jugador
const createPlayer = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      position, 
      number, 
      teamId,
      nationality,
      birthDate,
      statistics,
      photoUrl 
    } = req.body;

    // Validación básica
    if (!firstName || !lastName || !position || !number || !teamId || !nationality || !birthDate) {
      return res.status(400).json({
        success: false,
        message: 'Los campos firstName, lastName, position, number, teamId, nationality y birthDate son requeridos'
      });
    }

    // Verificar que el equipo existe
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'El equipo especificado no existe'
      });
    }

    // Validar que las estadísticas sean JSON válido si se proporcionan
    let statisticsString = statistics;
    if (statistics && typeof statistics === 'object') {
      statisticsString = JSON.stringify(statistics);
    }

    const player = await prisma.player.create({
      data: {
        firstName,
        lastName,
        position,
        number: parseInt(number),
        teamId,
        nationality,
        birthDate: new Date(birthDate),
        statistics: statisticsString || null,
        photoUrl: photoUrl || null
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            shortName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Jugador creado exitosamente',
      data: player
    });
  } catch (error) {
    console.error('Error al crear jugador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear jugador',
      error: error.message
    });
  }
};

// PUT /api/players/:id - Actualizar un jugador
const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      position, 
      number, 
      teamId,
      nationality,
      birthDate,
      statistics,
      photoUrl 
    } = req.body;

    // Verificar que el jugador existe
    const existingPlayer = await prisma.player.findUnique({
      where: { id }
    });

    if (!existingPlayer) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado'
      });
    }

    // Si se cambia de equipo, verificar que el nuevo equipo existe
    if (teamId && teamId !== existingPlayer.teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId }
      });

      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'El equipo especificado no existe'
        });
      }
    }

    // Preparar datos para actualizar
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (position !== undefined) updateData.position = position;
    if (number !== undefined) updateData.number = parseInt(number);
    if (teamId !== undefined) updateData.teamId = teamId;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    
    if (statistics !== undefined) {
      updateData.statistics = typeof statistics === 'object' 
        ? JSON.stringify(statistics) 
        : statistics;
    }

    const player = await prisma.player.update({
      where: { id },
      data: updateData,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            shortName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Jugador actualizado exitosamente',
      data: player
    });
  } catch (error) {
    console.error('Error al actualizar jugador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar jugador',
      error: error.message
    });
  }
};

// DELETE /api/players/:id - Eliminar un jugador
const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el jugador existe
    const existingPlayer = await prisma.player.findUnique({
      where: { id }
    });

    if (!existingPlayer) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado'
      });
    }

    await prisma.player.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Jugador eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar jugador',
      error: error.message
    });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};
