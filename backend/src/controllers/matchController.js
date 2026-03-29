const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/matches - Obtener todos los partidos
const getAllMatches = async (req, res) => {
  try {
    const { status, teamId } = req.query;

    // Construir filtros dinámicos
    const where = {};
    if (status) where.status = status;
    if (teamId) {
      where.OR = [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ];
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error al obtener partidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partidos',
      error: error.message
    });
  }
};

// GET /api/matches/:id - Obtener un partido por ID
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error al obtener partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partido',
      error: error.message
    });
  }
};

// POST /api/matches - Crear un nuevo partido
const createMatch = async (req, res) => {
  try {
    const { 
      homeTeamId, 
      awayTeamId, 
      date,
      venue,
      homeScore,
      awayScore,
      status,
      statistics
    } = req.body;

    // Validación básica
    if (!homeTeamId || !awayTeamId || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Los campos homeTeamId, awayTeamId, date y venue son requeridos'
      });
    }

    // Validar que no sea el mismo equipo
    if (homeTeamId === awayTeamId) {
      return res.status(400).json({
        success: false,
        message: 'Un equipo no puede jugar contra sí mismo'
      });
    }

    // Verificar que ambos equipos existen
    const [homeTeam, awayTeam] = await Promise.all([
      prisma.team.findUnique({ where: { id: homeTeamId } }),
      prisma.team.findUnique({ where: { id: awayTeamId } })
    ]);

    if (!homeTeam) {
      return res.status(404).json({
        success: false,
        message: 'El equipo local no existe'
      });
    }

    if (!awayTeam) {
      return res.status(404).json({
        success: false,
        message: 'El equipo visitante no existe'
      });
    }

    // Validar que las estadísticas sean JSON válido si se proporcionan
    let statisticsString = statistics;
    if (statistics && typeof statistics === 'object') {
      statisticsString = JSON.stringify(statistics);
    }

    const match = await prisma.match.create({
      data: {
        homeTeamId,
        awayTeamId,
        date: new Date(date),
        venue,
        homeScore: homeScore !== undefined ? parseInt(homeScore) : null,
        awayScore: awayScore !== undefined ? parseInt(awayScore) : null,
        status: status || 'scheduled',
        statistics: statisticsString || null
      },
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Partido creado exitosamente',
      data: match
    });
  } catch (error) {
    console.error('Error al crear partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear partido',
      error: error.message
    });
  }
};

// PUT /api/matches/:id - Actualizar un partido
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      homeTeamId, 
      awayTeamId, 
      date,
      venue,
      homeScore,
      awayScore,
      status,
      statistics
    } = req.body;

    // Verificar que el partido existe
    const existingMatch = await prisma.match.findUnique({
      where: { id }
    });

    if (!existingMatch) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    // Validar que no sea el mismo equipo
    const finalHomeTeamId = homeTeamId || existingMatch.homeTeamId;
    const finalAwayTeamId = awayTeamId || existingMatch.awayTeamId;
    
    if (finalHomeTeamId === finalAwayTeamId) {
      return res.status(400).json({
        success: false,
        message: 'Un equipo no puede jugar contra sí mismo'
      });
    }

    // Preparar datos para actualizar
    const updateData = {};
    if (homeTeamId !== undefined) updateData.homeTeamId = homeTeamId;
    if (awayTeamId !== undefined) updateData.awayTeamId = awayTeamId;
    if (date !== undefined) updateData.date = new Date(date);
    if (venue !== undefined) updateData.venue = venue;
    if (homeScore !== undefined) updateData.homeScore = homeScore !== null ? parseInt(homeScore) : null;
    if (awayScore !== undefined) updateData.awayScore = awayScore !== null ? parseInt(awayScore) : null;
    if (status !== undefined) updateData.status = status;
    
    if (statistics !== undefined) {
      updateData.statistics = typeof statistics === 'object' 
        ? JSON.stringify(statistics) 
        : statistics;
    }

    const match = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Partido actualizado exitosamente',
      data: match
    });
  } catch (error) {
    console.error('Error al actualizar partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar partido',
      error: error.message
    });
  }
};

// DELETE /api/matches/:id - Eliminar un partido
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el partido existe
    const existingMatch = await prisma.match.findUnique({
      where: { id }
    });

    if (!existingMatch) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    await prisma.match.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Partido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar partido',
      error: error.message
    });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};
