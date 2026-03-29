const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function runSeed(req, res) {
  const secret = req.headers['x-seed-secret']
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const teamCount = await prisma.team.count()
  if (teamCount > 0) {
    return res.status(200).json({ message: 'La base de datos ya tiene datos. Seed omitido.', teams: teamCount })
  }

  try {
    const { autoSeedIfEmpty } = require('../utils/autoSeed')
    await autoSeedIfEmpty()
    return res.status(200).json({ message: 'Seed ejecutado exitosamente', summary: { users: 2, teams: 6, players: 9, matches: 5 } })
  } catch (error) {
    console.error('Error en seed endpoint:', error)
    return res.status(500).json({ error: error.message })
  }
}

module.exports = { runSeed }
