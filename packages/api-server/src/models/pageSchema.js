/**
 * pageSchema.js
 * Schema for storing page layouts in the database
 */
import mongoose from 'mongoose';
import ComponentInstanceSchema from './componentInstanceSchema.js';

// Schema Definition
const PageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  path: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  components: [ComponentInstanceSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    ogImage: String
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

// Middleware
PageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update published date if being published
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

// Methods
PageSchema.methods.publish = function() {
  this.isPublished = true;
  this.publishedAt = Date.now();
  return this.save();
};

PageSchema.methods.unpublish = function() {
  this.isPublished = false;
  return this.save();
};

// ✅ Create and export the MODEL, not just the schema
const Page = mongoose.model('Page', PageSchema);
export default Page;