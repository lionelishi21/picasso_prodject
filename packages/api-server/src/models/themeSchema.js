/**
 * ThemeSchema.js
 * Mongoose schema for storing theme/styling configurations
 */
import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  primaryColor: {
    type: String,
    default: 'blue-600'
  },
  secondaryColor: {
    type: String,
    default: 'gray-700'
  },
  accentColor: {
    type: String,
    default: 'amber-400'
  },
  successColor: {
    type: String,
    default: 'green-500'
  },
  dangerColor: {
    type: String,
    default: 'red-500'
  },
  warningColor: {
    type: String,
    default: 'yellow-500'
  },
  infoColor: {
    type: String,
    default: 'blue-400'
  },
  saleColor: {
    type: String,
    default: 'red-600'
  },
  starColor: {
    type: String,
    default: 'yellow-400'
  },
  fontFamily: {
    type: String,
    default: 'sans'
  },
  headingFontFamily: {
    type: String,
    default: 'sans'
  },
  textColor: {
    type: String,
    default: 'gray-800'
  },
  headingColor: {
    type: String,
    default: 'gray-900'
  },
  linkColor: {
    type: String,
    default: 'blue-600'
  },
  linkHoverColor: {
    type: String,
    default: 'blue-700'
  },
  borderRadius: {
    type: String,
    default: 'md'
  },
  headerBgColor: {
    type: String,
    default: 'white'
  },
  footerBgColor: {
    type: String,
    default: 'gray-900'
  },
  footerTextColor: {
    type: String,
    default: 'white'
  },
  buttonStyles: {
    primary: {
      bg: String,
      text: String,
      hover: String,
      active: String
    },
    secondary: {
      bg: String,
      text: String,
      hover: String,
      active: String
    }
  },
  customCss: String,
  fonts: [{
    name: String,
    url: String,
    weight: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

// Pre-save hook to update the updatedAt timestamp
ThemeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
const Theme = mongoose.model('Theme', ThemeSchema);
export default Theme;