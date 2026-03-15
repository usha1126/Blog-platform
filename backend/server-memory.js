require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection with in-memory MongoDB
let mongod;

async function startServer() {
  try {
    // Start in-memory MongoDB with specific configuration
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'blog_platform_test'
      }
    });
    const uri = mongod.getUri();
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to in-memory MongoDB');
    
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Seed the database with sample data
    const { seedDatabase } = require('./seed');
    await seedDatabase();
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Serve frontend for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
console.log('Environment PORT:', process.env.PORT);
const PORT = process.env.PORT || 3000;

startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Using in-memory MongoDB - data will be lost when server stops');
  });
});

// Cleanup on exit
process.on('SIGINT', async () => {
  if (mongod) {
    await mongod.stop();
  }
  process.exit(0);
});

module.exports = app;
