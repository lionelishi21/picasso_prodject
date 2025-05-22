import mongoose from 'mongoose';
import { Component } from '../models/Component.js';

const testComponents = [
  {
    componentType: 'hero-section',
    displayName: 'Test Hero Section',
    description: 'A full-width hero section with background image and text overlay',
    defaultProps: {
      title: 'Welcome to our store',
      subtitle: 'Discover amazing products',
      backgroundImage: 'https://example.com/hero-bg.jpg',
      ctaText: 'Shop Now',
      ctaLink: '/products'
    }
  },
  {
    componentType: 'product-grid',
    displayName: 'Test Product Grid',
    description: 'A responsive grid of product cards',
    defaultProps: {
      columns: 3,
      gap: '1rem',
      products: []
    }
  }
];

export const setupTestDatabase = async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-driven-ecommerce-test');
  
  // Clear existing data
  await Component.deleteMany({});
  
  // Insert test data
  await Component.insertMany(testComponents);
};

export const teardownTestDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}; 