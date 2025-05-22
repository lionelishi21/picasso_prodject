/**
 * siteService.js
 * Service for site API calls
 */
import api from './api';

// Get all sites for a user
const getUserSites = async (userId) => {
  const response = await api.get(`/sites/user/${userId}`);
  console.log(response.data.data);
  return response.data.data;
};

// Get site by ID
const getSiteById = async (siteId) => {
  const response = await api.get(`/sites/${siteId}`);
  return response.data.data;
};

// Get site by domain
const getSiteByDomain = async (domain) => {
  const response = await api.get(`/sites/domain/${domain}`);
  return response.data.data;
};

// Create new site
const createSite = async (siteData) => {
  const response = await api.post('/sites', siteData);
  return response.data.data;
};

// Update site
const updateSite = async (siteId, siteData) => {
  const response = await api.put(`/sites/${siteId}`, siteData);
  return response.data.data;
};

// Delete site
const deleteSite = async (siteId) => {
  const response = await api.delete(`/sites/${siteId}`);
  return siteId; // Return the ID for use in the reducer
};

// Update site menu
const updateSiteMenu = async (siteId, menuItems) => {
  const response = await api.patch(`/sites/${siteId}/menu`, { menuItems });
  return response.data.data;
};

// Update site status
const updateSiteStatus = async (siteId, status) => {
  const response = await api.patch(`/sites/${siteId}/status`, { status });
  return response.data.data;
};

const siteService = {
  getUserSites,
  getSiteById,
  getSiteByDomain,
  createSite,
  updateSite,
  deleteSite,
  updateSiteMenu,
  updateSiteStatus,
};

export default siteService;