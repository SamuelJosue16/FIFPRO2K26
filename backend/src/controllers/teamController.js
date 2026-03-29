const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/teams - Obtener todos los equipos
const getAllTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: { 
            players: true,
            homeMatches: true,
            awayMatches: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener equipos',
      error: error.message
    });
  }
};

// GET /api/teams/:id - Obtener un equipo por ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: {
          orderBy: {
            number: 'asc'
          }
        },
        homeMatches: {
          include: {
            awayTeam: {
              select: {
                id: true,
                name: true,
                shortName: true,
                logoUrl: true
              }
            }
          }
        },
        awayMatches: {
          include: {
            homeTeam: {
              select: {
                id: true,
                name: true,
                shortName: true,
                logoUrl: true
              }
            }
          }
        }
      }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener equipo',
      error: error.message
    });
  }
};

// POST /api/teams - Crear un nuevo equipo
const createTeam = async (req, res) => {
  try {
    const { name, shortName, country, colors, logoUrl } = req.body;

    // Validación básica
    if (!name || !shortName || !country) {
      return res.status(400).json({
        success: false,
        message: 'Los campos name, shortName y country son requeridos'
      });
    }

    // Validar que los colores sean JSON válido si se proporciona
    let colorsString = colors;
    if (colors && typeof colors === 'object') {
      colorsString = JSON.stringify(colors);
    }

    const team = await prisma.team.create({
      data: {
        name,
        shortName,
        country,
        colors: colorsString || JSON.stringify({ primary: '#FFFFFF', secondary: '#000000' }),
        logoUrl: logoUrl || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Equipo creado exitosamente',
      data: team
    });
  } catch (error) {
    console.error('Error al crear equipo:', error);
    
    // Error de unicidad (nombre duplicado)
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un equipo con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear equipo',
      error: error.message
    });
  }
};

// PUT /api/teams/:id - Actualizar un equipo
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName, country, colors, logoUrl } = req.body;

    // Verificar que el equipo existe
    const existingTeam = await prisma.team.findUnique({
      where: { id }
    });

    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Preparar datos para actualizar
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (shortName !== undefined) updateData.shortName = shortName;
    if (country !== undefined) updateData.country = country;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    
    if (colors !== undefined) {
      updateData.colors = typeof colors === 'object' 
        ? JSON.stringify(colors) 
        : colors;
    }

    const team = await prisma.team.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Equipo actualizado exitosamente',
      data: team
    });
  } catch (error) {
    console.error('Error al actualizar equipo:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un equipo con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar equipo',
      error: error.message
    });
  }
};

// DELETE /api/teams/:id - Eliminar un equipo
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el equipo existe
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: {
        _count: {
          select: { players: true }
        }
      }
    });

    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Eliminar el equipo (los jugadores se eliminarán en cascada)
    await prisma.team.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: `Equipo eliminado exitosamente (${existingTeam._count.players} jugadores también eliminados)`
    });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar equipo',
      error: error.message
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};
