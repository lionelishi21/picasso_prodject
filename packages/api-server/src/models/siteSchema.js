/**
 * SiteSchema.js
 * Mongoose schema for storing a complete e-commerce storefront site
 */
import mongoose from 'mongoose';

const SiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  domain: {
    type: String,
    unique: true,
    sparse: true
  },
  pages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  }],
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme'
  },
  navigation: {
    headerMenuItems: [{
      label: String,
      url: String,
      isExternal: Boolean,
      children: [{
        label: String,
        url: String,
        isExternal: Boolean
      }]
    }],
    footerSections: [{
      heading: String,
      links: [{
        text: String,
        url: String,
        isExternal: Boolean
      }]
    }]
  },
  settings: {
    logo: String,
    favicon: String,
    enableSearch: {
      type: Boolean,
      default: true
    },
    showCartIcon: {
      type: Boolean,
      default: true
    },
    socialLinks: [{
      name: String,
      icon: String,
      url: String
    }],
    newsletter: {
      enabled: Boolean,
      title: String,
      description: String,
      placeholder: String,
      buttonText: String,
      apiEndpoint: String
    },
    analytics: {
      googleAnalyticsId: String,
      facebookPixelId: String
    },
    currency: {
      code: {
        type: String,
        default: 'USD'
      },
      symbol: {
        type: String,
        default: '$'
      },
      position: {
        type: String,
        enum: ['prefix', 'suffix'],
        default: 'prefix'
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
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

// Pre-save hook to update the updatedAt timestamp
SiteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get a specific page by path
SiteSchema.methods.getPageByPath = async function(path) {
  await this.populate('pages');
  return this.pages.find(page => page.path === path);
};

// Method to publish the site
SiteSchema.methods.publish = function() {
  this.status = 'published';
  return this.save();
};

// Method to archive the site
SiteSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Static method to find sites by owner
SiteSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId }).populate(['pages', 'theme']);
};

// Create and export the Site model
const Site = mongoose.model('Site', SiteSchema);
export default Site;