// controllers/pageController.js
import Page from '../models/pageSchema.js';
import mongoose from 'mongoose';

// Get all pages for a site
export const getPages = async (req, res) => {
  try {
    const { siteId } = req.params;
    const pages = await Page.find({ site: siteId })
      .select('name path type isDefault published createdAt updatedAt');
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error('Error getting pages:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting pages',
      error: error.message
    });
  }
};

// Get a page by ID
export const getPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error getting page:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting page',
      error: error.message
    });
  }
};

// Get a page by path for a site
export const getPageByPath = async (req, res) => {
  try {
    const { siteId, path } = req.params;
    const page = await Page.findOne({
      site: siteId,
      path,
      published: true
    });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error('Error getting page by path:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting page by path',
      error: error.message
    });
  }
};

// Create a new page
export const createPage = async (req, res) => {
  try {
    const { name, path, type, components, site, isDefault, published } = req.body;

    if (!name || !path || !type || !site) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (name, path, type, site)'
      });
    }

    const existingPage = await Page.findOne({ site, path });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'A page with this path already exists for this site'
      });
    }

    const page = new Page({
      name,
      path,
      type,
      components: components || [],
      site,
      isDefault: isDefault || false,
      published: published || false
    });

    await page.save();
    return res.status(201).json({ success: true, data: page });
  } catch (error) {
    console.error('Error creating page:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating page',
      error: error.message
    });
  }
};

// Update a page
export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.site) delete updateData.site;

    if (updateData.path) {
      const page = await Page.findById(id);
      if (!page) {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }

      const existingPage = await Page.findOne({
        site: page.site,
        path: updateData.path,
        _id: { $ne: id }
      });

      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: 'A page with this path already exists for this site'
        });
      }
    }

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    return res.status(200).json({ success: true, data: updatedPage });
  } catch (error) {
    console.error('Error updating page:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating page',
      error: error.message
    });
  }
};

// Delete a page
export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    if (page.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a default page. Please set another page as default first.'
      });
    }
    await Page.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting page',
      error: error.message
    });
  }
};

// Clone a page
export const clonePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path } = req.body;
    if (!name || !path) {
      return res.status(400).json({
        success: false,
        message: 'New page name and path are required'
      });
    }
    const sourcePage = await Page.findById(id);
    if (!sourcePage) {
      return res.status(404).json({ success: false, message: 'Source page not found' });
    }
    const existingPage = await Page.findOne({ site: sourcePage.site, path });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'A page with this path already exists for this site'
      });
    }

    const newPage = new Page({
      name,
      path,
      type: sourcePage.type,
      components: sourcePage.components,
      site: sourcePage.site,
      isDefault: false,
      published: false
    });

    await newPage.save();
    return res.status(201).json({ success: true, data: newPage });
  } catch (error) {
    console.error('Error cloning page:', error);
    return res.status(500).json({
      success: false,
      message: 'Error cloning page',
      error: error.message
    });
  }
};

// Toggle page published status 
export const togglePublished = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    page.published = !page.published;
    await page.save();

    return res.status(200).json({ 
      success: true, 
      data: page,
      message: `Page ${page.published ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    console.error('Error toggling page published status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error toggling page published status',
      error: error.message
    });
  }
};

export const getPagesBySite = async (req, res) => {
  const { siteId } = req.params;
  console.log('getPagesBySite options', req.params);

  try {
    
    // const {
    //   published,
    //   search,
    //   limit,
    //   skip,
    //   sortBy = 'createdAt',
    //   sortOrder = -1
    // } = options;
    const sortBy = 'createdAt';
    const sortOrder = -1;
    
    // Build query
    const query = { site: siteId };
    
    // if (published !== undefined) {
    //   query.isPublished = published;
    // }
    
    // if (search) {
    //   query.$or = [
    //     { name: { $regex: search, $options: 'i' } },
    //     { title: { $regex: search, $options: 'i' } },
    //     { description: { $regex: search, $options: 'i' } },
    //     { path: { $regex: search, $options: 'i' } }
    //   ];
    // }
    
    // Execute query
    let dbQuery = Page.find(query)
      .select('name path title description components isPublished publishedAt createdAt updatedAt isDefault')
      .sort({ [sortBy]: sortOrder });
    
    // if (skip) {
    //   dbQuery = dbQuery.skip(skip);
    // }
    
    // if (limit) {
    //   dbQuery = dbQuery.limit(limit);
    // }
    
    const pages = await dbQuery;
    console.log('pages', pages);
    
    // Get total count for pagination
    const total = await Page.countDocuments(query);
    
    return {
      pages,
      total,
      // hasMore: skip + limit < total
    };
  } catch (error) {
    console.error('Error getting pages by site:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting pages by site',
      error: error.message
    });
  }
};




