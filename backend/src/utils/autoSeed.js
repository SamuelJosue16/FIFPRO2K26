const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function autoSeedIfEmpty() {
  try {
    const teamCount = await prisma.team.count()
    if (teamCount > 0) {
      console.log('🌱 Base de datos ya tiene datos. Auto-seed omitido.')
      return
    }

    console.log('🌱 Base de datos vacía detectada. Ejecutando seed automático...')

    // Usuarios
    const adminPassword = await bcrypt.hash('admin123', 10)
    const userPassword = await bcrypt.hash('user123', 10)

    await prisma.user.upsert({
      where: { email: 'admin@fifpro2k26.com' },
      update: {},
      create: { email: 'admin@fifpro2k26.com', password: adminPassword, name: 'Administrador', role: 'admin' },
    })
    await prisma.user.upsert({
      where: { email: 'user@fifpro2k26.com' },
      update: {},
      create: { email: 'user@fifpro2k26.com', password: userPassword, name: 'Usuario Demo', role: 'user' },
    })

    // Equipos
    const realMadrid = await prisma.team.create({ data: { name: 'Real Madrid', shortName: 'RMA', country: 'España', colors: JSON.stringify({ primary: '#FFFFFF', secondary: '#FFD700' }), logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' } })
    const barcelona  = await prisma.team.create({ data: { name: 'FC Barcelona', shortName: 'BAR', country: 'España', colors: JSON.stringify({ primary: '#A50044', secondary: '#004D98' }), logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg' } })
    const bayern     = await prisma.team.create({ data: { name: 'Bayern Munich', shortName: 'BAY', country: 'Alemania', colors: JSON.stringify({ primary: '#DC052D', secondary: '#FFFFFF' }), logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' } })
    const liverpool  = await prisma.team.create({ data: { name: 'Liverpool FC', shortName: 'LIV', country: 'Inglaterra', colors: JSON.stringify({ primary: '#C8102E', secondary: '#00B2A9' }), logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' } })
    const manCity    = await prisma.team.create({ data: { name: 'Manchester City', shortName: 'MCI', country: 'Inglaterra', colors: JSON.stringify({ primary: '#6CABDD', secondary: '#1C2C5B' }), logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' } })
    const psg        = await prisma.team.create({ data: { name: 'Paris Saint-Germain', shortName: 'PSG', country: 'Francia', colors: JSON.stringify({ primary: '#004170', secondary: '#DA291C' }), logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' } })

    // Jugadores
    await prisma.player.createMany({
      data: [
        { firstName: 'Vinícius',  lastName: 'Júnior',      position: 'Delantero',      number: 7,  nationality: 'Brasil',    birthDate: new Date('2000-07-12'), statistics: JSON.stringify({ goals: 24, assists: 11, matches: 43 }), photoUrl: null, teamId: realMadrid.id },
        { firstName: 'Jude',      lastName: 'Bellingham',   position: 'Centrocampista', number: 5,  nationality: 'Inglaterra', birthDate: new Date('2003-06-29'), statistics: JSON.stringify({ goals: 19, assists: 8,  matches: 42 }), photoUrl: null, teamId: realMadrid.id },
        { firstName: 'Robert',    lastName: 'Lewandowski',  position: 'Delantero',      number: 9,  nationality: 'Polonia',   birthDate: new Date('1988-08-21'), statistics: JSON.stringify({ goals: 26, assists: 7,  matches: 40 }), photoUrl: null, teamId: barcelona.id  },
        { firstName: 'Pedri',     lastName: 'González',     position: 'Centrocampista', number: 8,  nationality: 'España',    birthDate: new Date('2002-11-25'), statistics: JSON.stringify({ goals: 5,  assists: 12, matches: 38 }), photoUrl: null, teamId: barcelona.id  },
        { firstName: 'Harry',     lastName: 'Kane',         position: 'Delantero',      number: 9,  nationality: 'Inglaterra', birthDate: new Date('1993-07-28'), statistics: JSON.stringify({ goals: 36, assists: 11, matches: 41 }), photoUrl: null, teamId: bayern.id     },
        { firstName: 'Jamal',     lastName: 'Musiala',      position: 'Centrocampista', number: 42, nationality: 'Alemania',  birthDate: new Date('2003-02-26'), statistics: JSON.stringify({ goals: 14, assists: 10, matches: 39 }), photoUrl: null, teamId: bayern.id     },
        { firstName: 'Mohamed',   lastName: 'Salah',        position: 'Delantero',      number: 11, nationality: 'Egipto',    birthDate: new Date('1992-06-15'), statistics: JSON.stringify({ goals: 28, assists: 14, matches: 44 }), photoUrl: null, teamId: liverpool.id  },
        { firstName: 'Erling',    lastName: 'Haaland',      position: 'Delantero',      number: 9,  nationality: 'Noruega',   birthDate: new Date('2000-07-21'), statistics: JSON.stringify({ goals: 42, assists: 8,  matches: 45 }), photoUrl: null, teamId: manCity.id    },
        { firstName: 'Kylian',    lastName: 'Mbappé',       position: 'Delantero',      number: 7,  nationality: 'Francia',   birthDate: new Date('1998-12-20'), statistics: JSON.stringify({ goals: 29, assists: 11, matches: 40 }), photoUrl: null, teamId: psg.id        },
      ],
    })

    // Partidos
    await prisma.match.createMany({
      data: [
        { homeTeamId: realMadrid.id, awayTeamId: barcelona.id, homeScore: 3, awayScore: 2, date: new Date('2026-03-15T20:00:00Z'), status: 'finished',  venue: 'Santiago Bernabéu', statistics: JSON.stringify({ possession: '52-48', shots: '18-14', shotsOnTarget: '9-7', corners: '7-5' }) },
        { homeTeamId: bayern.id,     awayTeamId: manCity.id,   homeScore: 2, awayScore: 2, date: new Date('2026-03-16T20:00:00Z'), status: 'finished',  venue: 'Allianz Arena',     statistics: JSON.stringify({ possession: '48-52', shots: '15-17', shotsOnTarget: '6-8', corners: '6-9' }) },
        { homeTeamId: liverpool.id,  awayTeamId: psg.id,       homeScore: null, awayScore: null, date: new Date('2026-04-05T20:00:00Z'), status: 'scheduled', venue: 'Anfield',   statistics: null },
        { homeTeamId: barcelona.id,  awayTeamId: bayern.id,    homeScore: null, awayScore: null, date: new Date('2026-04-06T20:00:00Z'), status: 'scheduled', venue: 'Camp Nou',  statistics: null },
        { homeTeamId: manCity.id,    awayTeamId: realMadrid.id, homeScore: 1, awayScore: 3, date: new Date('2026-03-10T20:00:00Z'), status: 'finished', venue: 'Etihad Stadium', statistics: JSON.stringify({ possession: '58-42', shots: '19-12', shotsOnTarget: '8-9', corners: '10-4' }) },
      ],
    })

    console.log('✅ Auto-seed completado: 2 usuarios, 6 equipos, 9 jugadores, 5 partidos.')
  } catch (error) {
    console.error('❌ Error en auto-seed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

module.exports = { autoSeedIfEmpty }
