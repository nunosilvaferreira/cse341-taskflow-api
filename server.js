// /server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load passport configuration
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- Health check route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TaskFlow API is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// --- Swagger docs ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);
app.use('/notes', noteRoutes);

// --- Root route ---
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TaskFlow API',
    documentation: '/api-docs',
    health: '/health',
    googleLogin: '/auth/google/login'
  });
});

// --- Error handling middleware ---
app.use(errorHandler);

// --- MongoDB connection and server start ---
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🌐 Swagger docs available at http://localhost:${PORT}/api-docs`);

      // Display OAuth URLs if available
      if (process.env.RENDER_EXTERNAL_HOSTNAME) {
        console.log(`🔗 Public URL: https://${process.env.RENDER_EXTERNAL_HOSTNAME}`);
        console.log(`🔑 OAuth callback: https://${process.env.RENDER_EXTERNAL_HOSTNAME}/auth/google/callback`);
      } else {
        console.log(`🔑 Local OAuth callback: http://localhost:${PORT}/auth/google/callback`);
      }
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
