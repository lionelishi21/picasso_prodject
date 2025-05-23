/**
 * pageService.js
 * Service for page API calls
 */
import api from './api';

// Get all pages for a site
const getSitePages = async (siteId: string, options: any) => {  
  const response = await api.get(`/pages/site/${siteId}`);
  console.log('getSitePages response', response);  
  return response.data.data;
};

// Get page by ID
const getPageById = async (pageId) => {
  const response = await api.get(`/pages/${pageId}`);
  console.log('getPageById response', response);
  return response.data.data;
};

// Get page by path for a site
const getPageByPath = async (siteId, path) => {
  const response = await api.get(`/pages/site/${siteId}/path/${path}`);
  return response.data.data;
};

// Create new page
const createPage = async (pageData) => {
  const response = await api.post('/pages', pageData);
  return response.data.data;
};

// Update page
const updatePage = async (pageId, pageData) => {
  const response = await api.put(`/pages/${pageId}`, pageData);
  return response.data.data;
};

// Delete page
const deletePage = async (pageId) => {
  const response = await api.delete(`/pages/${pageId}`);
  return pageId; // Return the ID for use in the reducer
};

// Clone page
const clonePage = async (pageId, name, path) => {
  const response = await api.post(`/pages/${pageId}/clone`, { name, path });
  return response.data.data;
};

// Toggle page published status
const togglePagePublished = async (pageId, published) => {
  const response = await api.patch(`/pages/${pageId}/publish`, { published });
  return response.data.data;
};

const pageService = {
  getSitePages,
  getPageById,
  getPageByPath,
  createPage,
  updatePage,
  deletePage,
  clonePage,
  togglePagePublished,
};

export default pageService;