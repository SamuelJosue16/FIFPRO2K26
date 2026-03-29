require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const squadRoutes = require('./routes/squadRoutes');
const seedRoutes = require('./routes/seedRoutes');

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api/seed', seedRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FIFPRO2K26 API - UEFA Champions League Theme',
    timestamp: new Date().toISOString(),
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║  🏆 FIFPRO2K26 Backend Server                     ║
║  ⚽ UEFA Champions League Theme                   ║
╠═══════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${PORT}    ║
║  📊 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║  ⭐ Status: Online                                 ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
