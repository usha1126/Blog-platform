require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

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

// Simple in-memory data store for testing
const users = [
  { _id: '1', username: 'john_doe', email: 'john@example.com', password: 'password123' },
  { _id: '2', username: 'jane_smith', email: 'jane@example.com', password: 'password123' },
  { _id: '3', username: 'mike_wilson', email: 'mike@example.com', password: 'password123' }
];

const posts = [
  {
    _id: '1',
    title: 'Getting Started with Node.js',
    content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows developers to run JavaScript on the server-side, opening up new possibilities for web development.',
    author: { _id: '1', username: 'john_doe', email: 'john@example.com' },
    createdAt: new Date(),
    formattedDate: 'March 15, 2024'
  },
  {
    _id: '2',
    title: 'Building RESTful APIs with Express',
    content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
    author: { _id: '2', username: 'jane_smith', email: 'jane@example.com' },
    createdAt: new Date(),
    formattedDate: 'March 15, 2024'
  }
];

const comments = [
  { _id: '1', content: 'Great post! Very helpful.', post: '1', author: { _id: '2', username: 'jane_smith', email: 'jane@example.com' }, createdAt: new Date() },
  { _id: '2', content: 'Thanks for sharing!', post: '1', author: { _id: '3', username: 'mike_wilson', email: 'mike@example.com' }, createdAt: new Date() }
];

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email or username already exists'
    });
  }
  
  // Create new user
  const newUser = {
    _id: String(users.length + 1),
    username,
    email,
    password // In real app, this would be hashed
  };
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: { ...newUser },
      token: 'fake-jwt-token-' + newUser._id
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: { ...user },
      token: 'fake-jwt-token-' + user._id
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  // In real app, verify JWT token
  res.status(200).json({
    success: true,
    data: {
      user: users[0] // Return first user as current user
    }
  });
});

// Posts routes
app.get('/api/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const paginatedPosts = posts.slice(skip, skip + limit);
  const total = posts.length;
  
  res.status(200).json({
    success: true,
    data: {
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p._id === req.params.id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      post,
      isAuthor: true // Simple version - all users can edit
    }
  });
});

// Comments routes
app.get('/api/comments/post/:postId', (req, res) => {
  const postComments = comments.filter(c => c.post === req.params.postId);
  
  res.status(200).json({
    success: true,
    data: {
      comments: postComments,
      pagination: {
        page: 1,
        limit: 20,
        total: postComments.length,
        pages: 1
      }
    }
  });
});

app.post('/api/comments', (req, res) => {
  const { content, post } = req.body;
  
  if (!content || !post) {
    return res.status(400).json({
      success: false,
      message: 'Content and post are required'
    });
  }
  
  const newComment = {
    _id: String(comments.length + 1),
    content,
    post,
    author: { _id: '1', username: 'john_doe', email: 'john@example.com' },
    createdAt: new Date()
  };
  comments.push(newComment);
  
  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: {
      comment: newComment
    }
  });
});

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using simple in-memory data - no MongoDB required');
});

module.exports = app;
