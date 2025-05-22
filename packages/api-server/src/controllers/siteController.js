// controllers/siteController.js
import mongoose from 'mongoose';
import  Site  from '../models/siteSchema.js';
import  Page  from '../models/pageSchema.js';
import  Theme  from '../models/themeSchema.js';

class SiteController {
  // Get all sites for a user
  async getUserSites(req, res) {
    try {
      const { userId } = req.params;
      const sites = await Site.find({ owner: userId })
        .select('name domain description status createdAt updatedAt');
      return res.status(200).json({ success: true, data: sites });
    } catch (error) {
      console.error('Error getting user sites:', error);
      return res.status(500).json({ success: false, message: 'Error getting user sites', error: error.message });
    }
  }

  // Get a site by ID
  async getSiteById(req, res) {
    try {
      const { id } = req.params;
      const site = await Site.findById(id);
      if (!site) return res.status(404).json({ success: false, message: 'Site not found' });
      return res.status(200).json({ success: true, data: site });
    } catch (error) {
      console.error('Error getting site:', error);
      return res.status(500).json({ success: false, message: 'Error getting site', error: error.message });
    }
  }

  // Get a site by domain
  async getSiteByDomain(req, res) {
    try {
      const { domain } = req.params;
      const site = await Site.findOne({ domain });
      if (!site) return res.status(404).json({ success: false, message: 'Site not found' });
      return res.status(200).json({ success: true, data: site });
    } catch (error) {
      console.error('Error getting site by domain:', error);
      return res.status(500).json({ success: false, message: 'Error getting site by domain', error: error.message });
    }
  }

  // Create a new site
  async createSite(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(req.body);
    const owner = '66496024022c392bc200015e';
    try {
      const { name, domain, description,logo } = req.body;
      if (!name || !domain || !owner) {
        return res.status(400).json({ success: false, message: 'Missing required fields (name, domain, owner)' });
      }
      const existing = await Site.findOne({ domain });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A site with this domain already exists' });
      }

      // Create site with correct structure
      const site = new Site({
        name,
        domain,
        owner,
        status: 'draft', // ✅ Use valid enum value
        navigation: {
          headerMenuItems: [
            { label: 'Home', url: '/', isExternal: false },
            { label: 'Products', url: '/products', isExternal: false },
            { label: 'About', url: '/about', isExternal: false },
            { label: 'Contact', url: '/contact', isExternal: false },
          ],
          footerSections: [] // Initialize empty
        },
        settings: {
          logo: logo || '', // ✅ Put logo under settings
          enableSearch: true,
          showCartIcon: true,
          socialLinks: [],
          newsletter: {
            enabled: false
          }
        }
      });

      await site.save({ session });

      // Default theme
      const defaultTheme = new Theme({
        name: 'Default Theme',
        site: site._id,
        primaryColor: 'blue-600',
        secondaryColor: 'purple-600',
        accentColor: 'amber-500',
        textColor: 'gray-800',
        headingColor: 'gray-900',
        fontFamily: 'sans',
        isDefault: true,
      });
      
      await defaultTheme.save({ session });

      // Default pages
      const pages = [
        { name: 'Home', path: '/', type: 'home', isDefault: true },
        { name: 'Products', path: '/products', type: 'product-listing', isDefault: true },
        { name: 'Product Detail', path: '/product/:id', type: 'product-detail', isDefault: true },
      ];
      for (const cfg of pages) {
        const page = new Page({ ...cfg, site: site._id, published: true, components: [] });
        await page.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
      return res.status(201).json({ success: true, data: site });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error creating site:', error);
      return res.status(500).json({ success: false, message: 'Error creating site', error: error.message });
    }
  }


  /**
   * Create a new site with default theme and pages
   * Note: Transactions require a replica set. This version drops transactions so it works on standalone servers.
   */
  async createSite(req, res) {
    try {
      // Use authenticated user or fallback to hardcoded owner ID
      const owner = req.user?._id || '66496024022c392bc200015e';

      // Destructure and validate required fields
      const { name, domain, description, logo } = req.body;
      if (!name || !domain || !description) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, domain, or description',
        });
      }

      // Check for domain uniqueness
      const existing = await Site.findOne({ domain });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A site with this domain already exists',
        });
      }

      // Create the site document
      const site = await Site.create({
        name,
        domain,
        owner,
        description,
        status: 'draft',
        navigation: {
          headerMenuItems: [
            { label: 'Home', url: '/', isExternal: false },
            { label: 'Products', url: '/products', isExternal: false },
            { label: 'About', url: '/about', isExternal: false },
            { label: 'Contact', url: '/contact', isExternal: false },
          ],
          footerSections: [],
        },
        settings: {
          logo: logo || '',
          enableSearch: true,
          showCartIcon: true,
          socialLinks: [],
          newsletter: { enabled: false },
        },
      });

      // Create default theme
      await Theme.create({
        name: 'Default Theme',
        site: site._id,
        primaryColor: 'blue-600',
        secondaryColor: 'purple-600',
        accentColor: 'amber-500',
        textColor: 'gray-800',
        headingColor: 'gray-900',
        fontFamily: 'sans',
        isDefault: true,
      });

      // Create default pages
      const pagesConfig = [
        { name: 'Home', path: '/', type: 'home' },
        { name: 'Products', path: '/products', type: 'product-listing' },
        { name: 'Product Detail', path: '/product/:id', type: 'product-detail' },
      ];
      const pages = pagesConfig.map(cfg => ({
        ...cfg,
        site: site._id,
        isDefault: true,
        published: true,
        components: [],
      }));
      await Page.insertMany(pages);

      // Respond with created site
      res.status(201).json({ success: true, data: site });
    } catch (error) {
      console.error('Error creating site:', error);
      res.status(500).json({ success: false, message: 'Error creating site', error: error.message });
    }
  }

  // Update a site
  async updateSite(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      if (updateData.owner) delete updateData.owner;
      if (updateData.domain) {
        const exists = await Site.findOne({ domain: updateData.domain, _id: { $ne: id } });
        if (exists) return res.status(400).json({ success: false, message: 'A site with this domain already exists' });
      }
      const updated = await Site.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Site not found' });
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating site:', error);
      return res.status(500).json({ success: false, message: 'Error updating site', error: error.message });
    }
  }

  // Delete a site
  async deleteSite(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;
      const site = await Site.findById(id);
      if (!site) return res.status(404).json({ success: false, message: 'Site not found' });

      await Page.deleteMany({ site: id }, { session });
      await Theme.deleteMany({ site: id }, { session });
      await Site.findByIdAndDelete(id, { session });

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ success: true, message: 'Site and related data deleted successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error deleting site:', error);
      return res.status(500).json({ success: false, message: 'Error deleting site', error: error.message });
    }
  }

  // Update site menu items
  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { menuItems } = req.body;
      if (!Array.isArray(menuItems)) {
        return res.status(400).json({ success: false, message: 'Menu items must be an array' });
      }
      for (const item of menuItems) {
        if (!item.label || !item.url) {
          return res.status(400).json({ success: false, message: 'Each menu item must have a label and url' });
        }
      }
      const updated = await Site.findByIdAndUpdate(id, { $set: { menuItems } }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Site not found' });
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating menu:', error);
      return res.status(500).json({ success: false, message: 'Error updating menu', error: error.message });
    }
  }

  // Update site status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const valid = ['active', 'inactive', 'maintenance', 'building'];
      if (!status || !valid.includes(status)) {
        return res.status(400).json({ success: false, message: 'Valid status is required (active, inactive, maintenance, building)' });
      }
      const updated = await Site.findByIdAndUpdate(id, { $set: { status } }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Site not found' });
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating status:', error);
      return res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
    }
  }
}

export default new SiteController();
