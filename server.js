require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes'); // NEW
const noteRoutes = require('./routes/noteRoutes');       // NEW
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TaskFlow API is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes); // NEW
app.use('/notes', noteRoutes);       // NEW

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TaskFlow API',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server only if run directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`🌐 Swagger docs available at http://localhost:${PORT}/api-docs`);

        // Extra info when running on Render
        if (process.env.RENDER_EXTERNAL_HOSTNAME) {
          console.log(`🔗 Public URL: https://${process.env.RENDER_EXTERNAL_HOSTNAME}`);
        }
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

// Export app (for tests or external use)
module.exports = app;
