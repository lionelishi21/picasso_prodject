// controllers/siteController.js
import mongoose from 'mongoose';
import Site from '../models/SiteSchema.js';
import Page from '../models/pageSchema.js';
import Theme from '../models/themeSchema.js';

class SiteController {
  // Get all sites for a user
  async getUserSites(req, res) {
    try {
      const { userId } = req.params;
      const sites = await Site.find({ owner: userId })
        .populate('theme', 'name primaryColor secondaryColor isDefault')
        .select('name domain description status createdAt updatedAt theme');
      return res.status(200).json({ success: true, data: sites });
    } catch (error) {
      console.error('Error getting user sites:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error getting user sites', 
        error: error.message 
      });
    }
  }

  // Get a site by ID
  async getSiteById(req, res) {
    try {
      const { id } = req.params;
      const site = await Site.findById(id)
        .populate('theme')
        .populate('pages');
      
      if (!site) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }
      
      return res.status(200).json({ success: true, data: site });
    } catch (error) {
      console.error('Error getting site:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error getting site', 
        error: error.message 
      });
    }
  }

  // Get a site by domain
  async getSiteByDomain(req, res) {
    try {
      const { domain } = req.params;
      const site = await Site.findOne({ domain })
        .populate('theme')
        .populate('pages');
        
      if (!site) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }
      
      return res.status(200).json({ success: true, data: site });
    } catch (error) {
      console.error('Error getting site by domain:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error getting site by domain', 
        error: error.message 
      });
    }
  }

  // Create a new site with default theme and pages
  async createSite(req, res) {
    try {
      // Use authenticated user or fallback for development
      const owner = req.user?._id || '66496024022c392bc200015e';
      const { name, domain, description, logo } = req.body;

      // Validate required fields
      if (!name || !domain) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name and domain are required',
        });
      }

      // Check for domain uniqueness
      const existingSite = await Site.findOne({ domain });
      if (existingSite) {
        return res.status(400).json({
          success: false,
          message: 'A site with this domain already exists',
        });
      }

      // Create the site document (without theme reference yet)
      const siteData = {
        name,
        domain,
        owner,
        description: description || `${name} - E-commerce Store`,
        status: 'draft',
        navigation: {
          headerMenuItems: [
            { label: 'Home', url: '/', isExternal: false },
            { label: 'Products', url: '/products', isExternal: false },
            { label: 'About', url: '/about', isExternal: false },
            { label: 'Contact', url: '/contact', isExternal: false },
          ],
          footerSections: [
            {
              heading: 'Company',
              links: [
                { text: 'About Us', url: '/about', isExternal: false },
                { text: 'Contact', url: '/contact', isExternal: false }
              ]
            }
          ],
        },
        settings: {
          logo: logo || '',
          enableSearch: true,
          showCartIcon: true,
          socialLinks: [],
          newsletter: { 
            enabled: false,
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
      };

      const site = new Site(siteData);
      await site.save();

      // Create default theme tied to this site
      const defaultTheme = await SiteController.createDefaultTheme(site._id);

      // Update site with theme reference
      site.theme = defaultTheme._id;
      await site.save();

      // Create default pages
      await SiteController.createDefaultPages(site._id);

      // Return site with populated theme
      const createdSite = await Site.findById(site._id).populate('theme');
      
      res.status(201).json({ 
        success: true, 
        data: createdSite,
        message: 'Site created successfully with default theme and pages'
      });

    } catch (error) {
      console.error('Error creating site:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating site', 
        error: error.message 
      });
    }
  }

  // Helper method to create default theme
  static async createDefaultTheme(siteId) {
    const defaultThemeData = {
      name: 'Default Theme',
      site: siteId,
      primaryColor: 'blue-600',
      primaryColorDark: 'blue-700',
      secondaryColor: 'purple-600',
      secondaryColorDark: 'purple-700',
      accentColor: 'amber-500',
      successColor: 'green-500',
      dangerColor: 'red-500',
      warningColor: 'yellow-500',
      infoColor: 'blue-400',
      saleColor: 'red-600',
      starColor: 'yellow-400',
      fontFamily: 'sans',
      headingFontFamily: 'sans',
      textColor: 'gray-800',
      headingColor: 'gray-900',
      linkColor: 'blue-600',
      linkHoverColor: 'blue-700',
      borderRadius: 'md',
      headerBgColor: 'white',
      footerBgColor: 'gray-900',
      footerTextColor: 'white',
      buttonStyles: {
        primary: {
          bg: 'blue-600',
          text: 'white',
          hover: 'blue-700',
          active: 'blue-800'
        },
        secondary: {
          bg: 'purple-600',
          text: 'white',
          hover: 'purple-700',
          active: 'purple-800'
        }
      },
      customCss: '',
      fonts: [],
      isDefault: true
    };

    const theme = new Theme(defaultThemeData);
    await theme.save();
    return theme;
  }

  // Helper method to create default pages
  static async createDefaultPages(siteId) {
    const defaultPages = [
      {
        name: 'Home',
        path: '/',
        title: 'Welcome to Your Store',
        description: 'Your home page',
        site: siteId,
        type: 'home',
        isDefault: true,
        isPublished: true,
        components: [],
        seo: {
          metaTitle: 'Home - Your Store',
          metaDescription: 'Welcome to our online store',
          metaKeywords: 'home, store, ecommerce'
        }
      },
      {
        name: 'Products',
        path: '/products',
        title: 'Our Products',
        description: 'Browse our product catalog',
        site: siteId,
        type: 'product-listing',
        isDefault: false,
        isPublished: true,
        components: [],
        seo: {
          metaTitle: 'Products - Your Store',
          metaDescription: 'Browse our amazing products',
          metaKeywords: 'products, catalog, shop'
        }
      },
      {
        name: 'About',
        path: '/about',
        title: 'About Us',
        description: 'Learn more about our company',
        site: siteId,
        type: 'page',
        isDefault: false,
        isPublished: true,
        components: [],
        seo: {
          metaTitle: 'About Us - Your Store',
          metaDescription: 'Learn about our company and mission',
          metaKeywords: 'about, company, mission'
        }
      },
      {
        name: 'Contact',
        path: '/contact',
        title: 'Contact Us',
        description: 'Get in touch with us',
        site: siteId,
        type: 'page',
        isDefault: false,
        isPublished: true,
        components: [],
        seo: {
          metaTitle: 'Contact Us - Your Store',
          metaDescription: 'Contact our support team',
          metaKeywords: 'contact, support, help'
        }
      }
    ];

    await Page.insertMany(defaultPages);
  }

  // Update a site
  async updateSite(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Prevent updating certain fields
      delete updateData.owner;
      delete updateData._id;
      
      // Check domain uniqueness if domain is being updated
      if (updateData.domain) {
        const existingSite = await Site.findOne({ 
          domain: updateData.domain, 
          _id: { $ne: id } 
        });
        
        if (existingSite) {
          return res.status(400).json({ 
            success: false, 
            message: 'A site with this domain already exists' 
          });
        }
      }
      
      const updatedSite = await Site.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('theme');
      
      if (!updatedSite) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }
      
      return res.status(200).json({ success: true, data: updatedSite });
    } catch (error) {
      console.error('Error updating site:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating site', 
        error: error.message 
      });
    }
  }

  // Delete a site and its associated data
  async deleteSite(req, res) {
    try {
      const { id } = req.params;
      
      const site = await Site.findById(id);
      if (!site) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }

      // Delete all associated pages
      await Page.deleteMany({ site: id });
      
      // Delete all associated themes
      await Theme.deleteMany({ site: id });
      
      // Delete the site
      await Site.findByIdAndDelete(id);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Site and all associated data deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting site:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting site', 
        error: error.message 
      });
    }
  }

  // Update site menu items
  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { menuItems } = req.body;
      
      if (!Array.isArray(menuItems)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Menu items must be an array' 
        });
      }
      
      // Validate menu items structure
      for (const item of menuItems) {
        if (!item.label || !item.url) {
          return res.status(400).json({ 
            success: false, 
            message: 'Each menu item must have a label and url' 
          });
        }
      }
      
      const updatedSite = await Site.findByIdAndUpdate(
        id,
        { 
          $set: { 
            'navigation.headerMenuItems': menuItems 
          } 
        },
        { new: true }
      ).populate('theme');
      
      if (!updatedSite) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }
      
      return res.status(200).json({ success: true, data: updatedSite });
    } catch (error) {
      console.error('Error updating menu:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating menu', 
        error: error.message 
      });
    }
  }

  // Update site status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['draft', 'published', 'archived'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: `Valid status is required (${validStatuses.join(', ')})` 
        });
      }
      
      const updatedSite = await Site.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      ).populate('theme');
      
      if (!updatedSite) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }
      
      return res.status(200).json({ success: true, data: updatedSite });
    } catch (error) {
      console.error('Error updating status:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating status', 
        error: error.message 
      });
    }
  }

  // Get site's default theme
  async getSiteTheme(req, res) {
    try {
      const { id } = req.params;
      
      const site = await Site.findById(id).populate('theme');
      if (!site) {
        return res.status(404).json({ success: false, message: 'Site not found' });
      }
      
      if (!site.theme) {
        return res.status(404).json({ 
          success: false, 
          message: 'No theme found for this site' 
        });
      }
      
      return res.status(200).json({ success: true, data: site.theme });
    } catch (error) {
      console.error('Error getting site theme:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error getting site theme', 
        error: error.message 
      });
    }
  }
}

export default new SiteController();