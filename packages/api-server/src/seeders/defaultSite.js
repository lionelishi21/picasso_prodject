import mongoose from 'mongoose';
import Site from '../models/siteSchema.js';
import User from '../models/userSchema.js';
import Theme from '../models/themeSchema.js';
import PageSchema from '../models/pageSchema.js';

// Register the Page model if it hasn't been registered yet
let Page;
try {
  Page = mongoose.model('Page');
} catch {
  Page = mongoose.model('Page', PageSchema);
}

export const seedDefaultSite = async () => {
  try {
    // Check if default site exists
    const existingSite = await Site.findOne({ domain: 'demo-store.local' });
    if (existingSite) {
      console.log('Default site already exists');
      return;
    }

    // Get default admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please run user seeder first.');
    }

    // Get default theme
    const defaultTheme = await Theme.findOne({ name: 'Modern Light' });
    if (!defaultTheme) {
      throw new Error('Default theme not found. Please run theme seeder first.');
    }

    // Create default pages
    const homePage = new Page({
      name: 'Home',
      path: '/',
      title: 'Welcome to Demo Store',
      description: 'Your one-stop shop for everything you need',
      components: [],
      isPublished: true,
      seo: {
        metaTitle: 'Demo Store - Home',
        metaDescription: 'Welcome to our demo e-commerce store',
        metaKeywords: 'demo, store, e-commerce, shop'
      }
    });

    const aboutPage = new Page({
      name: 'About Us',
      path: '/about',
      title: 'About Demo Store',
      description: 'Learn more about our story and mission',
      components: [],
      isPublished: true,
      seo: {
        metaTitle: 'About Us - Demo Store',
        metaDescription: 'Learn about our company history and values',
        metaKeywords: 'about us, history, mission, values'
      }
    });

    const contactPage = new Page({
      name: 'Contact',
      path: '/contact',
      title: 'Contact Us',
      description: 'Get in touch with our team',
      components: [],
      isPublished: true,
      seo: {
        metaTitle: 'Contact Us - Demo Store',
        metaDescription: 'Contact our support team for assistance',
        metaKeywords: 'contact, support, help, customer service'
      }
    });

    // Save pages
    const savedPages = await Promise.all([
      homePage.save(),
      aboutPage.save(),
      contactPage.save()
    ]);

    // Create default site
    const defaultSite = new Site({
      name: 'Demo Store',
      owner: adminUser._id,
      domain: 'demo-store.local',
      pages: savedPages.map(page => page._id),
      theme: defaultTheme._id,
      navigation: {
        headerMenuItems: [
          {
            label: 'Home',
            url: '/',
            isExternal: false
          },
          {
            label: 'About',
            url: '/about',
            isExternal: false
          },
          {
            label: 'Contact',
            url: '/contact',
            isExternal: false
          }
        ],
        footerSections: [
          {
            heading: 'Company',
            links: [
              { text: 'About Us', url: '/about', isExternal: false },
              { text: 'Contact', url: '/contact', isExternal: false }
            ]
          },
          {
            heading: 'Follow Us',
            links: [
              { text: 'Twitter', url: 'https://twitter.com', isExternal: true },
              { text: 'Facebook', url: 'https://facebook.com', isExternal: true },
              { text: 'Instagram', url: 'https://instagram.com', isExternal: true }
            ]
          }
        ]
      },
      settings: {
        logo: 'https://placeholder.com/logo.png',
        favicon: 'https://placeholder.com/favicon.ico',
        enableSearch: true,
        showCartIcon: true,
        socialLinks: [
          { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
          { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
          { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' }
        ],
        newsletter: {
          enabled: true,
          title: 'Subscribe to our newsletter',
          description: 'Get the latest updates and offers',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe'
        },
        currency: {
          code: 'USD',
          symbol: '$',
          position: 'prefix'
        }
      },
      status: 'published'
    });

    await defaultSite.save();
    console.log('Default site created successfully');
    return defaultSite;
  } catch (error) {
    console.error('Error seeding default site:', error);
    throw error;
  }
}; 