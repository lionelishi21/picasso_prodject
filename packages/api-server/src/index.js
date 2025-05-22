/**
 * server.js
 * Server entry point
 */
import app from './app.js';
import mongoose from 'mongoose';

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI ='mongodb://localhost:27017/ecommerce-builder';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});