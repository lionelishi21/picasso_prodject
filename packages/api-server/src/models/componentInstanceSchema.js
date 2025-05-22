/**
 * componentInstanceSchema.js
 * Schema for storing component instances in the database
 */
import mongoose from 'mongoose';

// Schema Definition
const ComponentInstanceSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    trim: true
  },
  props: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed, 
    default: () => new Map() 
  },
  children: {
    type: [], // Will be populated with ComponentInstanceSchema after definition
    default: []
  },
  layout: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    w: { type: Number, default: 12 },
    h: { type: Number, default: 1 },
    order: { type: Number },
    breakpoint: {
      type: Map,
      of: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        w: { type: Number, default: 12 },
        h: { type: Number, default: 1 }
      },
      default: () => new Map()
    }
  },
  createdAt: { 
    type: Date,
    default: Date.now 
  },
  updatedAt: { 
    type: Date,
    default: Date.now 
  }
});

// Add the recursive children schema after definition
ComponentInstanceSchema.add({
  children: [ComponentInstanceSchema]
});

// Middleware
ComponentInstanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default ComponentInstanceSchema;