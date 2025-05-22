// controllers/themeController.js
import mongoose from 'mongoose';
import  Theme  from '../models/themeSchema.js';

class ThemeController {
  // Get all themes for a site
  async getAllThemes(req, res) {
    try {
      const { siteId } = req.params;
      const themes = await Theme.find({ site: siteId })
        .select('name primaryColor secondaryColor isDefault createdAt updatedAt');
      return res.status(200).json({ success: true, data: themes });
    } catch (error) {
      console.error('Error getting themes:', error);
      return res.status(500).json({ success: false, message: 'Error getting themes', error: error.message });
    }
  }

  // Get a theme by ID
  async getThemeById(req, res) {
    try {
      const { id } = req.params;
      const theme = await Theme.findById(id);
      if (!theme) {
        return res.status(404).json({ success: false, message: 'Theme not found' });
      }
      return res.status(200).json({ success: true, data: theme });
    } catch (error) {
      console.error('Error getting theme:', error);
      return res.status(500).json({ success: false, message: 'Error getting theme', error: error.message });
    }
  }

  // Get the default theme for a site
  async getDefaultTheme(req, res) {
    try {
      const { siteId } = req.params;
      const theme = await Theme.findOne({ site: siteId, isDefault: true });
      if (!theme) {
        return res.status(404).json({ success: false, message: 'Default theme not found' });
      }
      return res.status(200).json({ success: true, data: theme });
    } catch (error) {
      console.error('Error getting default theme:', error);
      return res.status(500).json({ success: false, message: 'Error getting default theme', error: error.message });
    }
  }

  // Create a new theme
  async createTheme(req, res) {
    try {
      const {
        name,
        site,
        primaryColor,
        secondaryColor,
        accentColor,
        textColor,
        headingColor,
        fontFamily,
        headingFontFamily,
        isDefault
      } = req.body;

      if (!name || !site) {
        return res.status(400).json({ success: false, message: 'Missing required fields (name, site)' });
      }

      const theme = new Theme({
        name,
        site,
        primaryColor,
        secondaryColor,
        accentColor,
        textColor,
        headingColor,
        fontFamily,
        headingFontFamily,
        isDefault: isDefault || false
      });

      await theme.save();
      return res.status(201).json({ success: true, data: theme });
    } catch (error) {
      console.error('Error creating theme:', error);
      return res.status(500).json({ success: false, message: 'Error creating theme', error: error.message });
    }
  }

  // Update a theme
  async updateTheme(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      if (updateData.site) delete updateData.site;

      const updatedTheme = await Theme.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedTheme) {
        return res.status(404).json({ success: false, message: 'Theme not found' });
      }

      return res.status(200).json({ success: true, data: updatedTheme });
    } catch (error) {
      console.error('Error updating theme:', error);
      return res.status(500).json({ success: false, message: 'Error updating theme', error: error.message });
    }
  }

  // Delete a theme
  async deleteTheme(req, res) {
    try {
      const { id } = req.params;
      const theme = await Theme.findById(id);
      if (!theme) {
        return res.status(404).json({ success: false, message: 'Theme not found' });
      }
      if (theme.isDefault) {
        return res.status(400).json({ success: false, message: 'Cannot delete the default theme. Please set another theme as default first.' });
      }
      await Theme.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Theme deleted successfully' });
    } catch (error) {
      console.error('Error deleting theme:', error);
      return res.status(500).json({ success: false, message: 'Error deleting theme', error: error.message });
    }
  }

  // Clone a theme
  async cloneTheme(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'New theme name is required' });
      }

      const sourceTheme = await Theme.findById(id);
      if (!sourceTheme) {
        return res.status(404).json({ success: false, message: 'Source theme not found' });
      }

      const newThemeData = sourceTheme.toObject();
      delete newThemeData._id;
      newThemeData.name = name;
      newThemeData.isDefault = false;
      newThemeData.createdAt = new Date();
      newThemeData.updatedAt = new Date();

      const newTheme = new Theme(newThemeData);
      await newTheme.save();
      return res.status(201).json({ success: true, data: newTheme });
    } catch (error) {
      console.error('Error cloning theme:', error);
      return res.status(500).json({ success: false, message: 'Error cloning theme', error: error.message });
    }
  }

  // Set a theme as default
  async setDefaultTheme(req, res) {
    try {
      const { id } = req.params;
      const theme = await Theme.findById(id);
      if (!theme) {
        return res.status(404).json({ success: false, message: 'Theme not found' });
      }
      if (theme.isDefault) {
        return res.status(200).json({ success: true, data: theme });
      }

      await Theme.updateMany({ site: theme.site, isDefault: true }, { $set: { isDefault: false } });
      theme.isDefault = true;
      await theme.save();
      return res.status(200).json({ success: true, data: theme });
    } catch (error) {
      console.error('Error setting default theme:', error);
      return res.status(500).json({ success: false, message: 'Error setting default theme', error: error.message });
    }
  }
}

export default new ThemeController();