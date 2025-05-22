/**
 * SiteEdit.tsx
 * Page component for editing site settings
 */
import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSiteById, updateSite, deleteSite } from '../../store/slices/siteSlice';
import type { AppDispatch, RootState } from '../../store/index';

// Icons
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  PhotoIcon,
  ChartBarIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// TypeScript interfaces
interface RouteParams {
  siteId: string;
  [key: string]: string | undefined;
}

interface SiteFormData {
  name: string;
  domain: string;
  description: string;
  logo?: string;
  config: {
    currency: string;
    languageCode: string;
    timezone: string;
  };
}

interface SiteFormErrors {
  name?: string;
  domain?: string;
  description?: string;
  logo?: string;
  form?: string;
}

// Tab interface
interface TabItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const SiteEdit: React.FC = () => {
  const { siteId } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const history = useNavigate();
  
  const { currentSite, isLoading, isError, message } = useSelector(
    (state: RootState) => state.site
  );
  
  // Form state with TypeScript typing
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    domain: '',
    description: '',
    config: {
      currency: 'USD',
      languageCode: 'en-US',
      timezone: 'UTC',
    }
  });
  
  const [errors, setErrors] = useState<SiteFormErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  
  // Tabs for different settings sections
  const [activeTab, setActiveTab] = useState<string>('general');
  
  const tabs: TabItem[] = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'domain', label: 'Domain', icon: GlobeAltIcon },
    { id: 'appearance', label: 'Appearance', icon: PhotoIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'advanced', label: 'Advanced', icon: CommandLineIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ];
  
  // Load site data on component mount
  useEffect(() => {
    if (siteId) {
      dispatch(getSiteById(siteId));
    }
  }, [dispatch, siteId]);
  
  // Set form data when site data is loaded
  useEffect(() => {
    if (currentSite) {
      setFormData({
        name: currentSite.name || '',
        domain: currentSite.domain || '',
        description: currentSite.description || '',
        logo: currentSite.logo || undefined,
        config: currentSite.config || {
          currency: 'USD',
          languageCode: 'en-US',
          timezone: 'UTC',
        }
      });
      
      if (currentSite.logo) {
        setLogoPreview(currentSite.logo);
      }
    }
  }, [currentSite]);
  
  // Typed onChange handler for text inputs
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name as keyof SiteFormErrors]) {
      setErrors({ 
        ...errors, 
        [e.target.name]: undefined 
      });
    }
  };
  
  // Handle config change
  const onConfigChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        [name]: value
      }
    });
  };
  
  // Handle logo file change
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          logo: 'Logo must be a JPG, PNG, or SVG file',
        });
        return;
      }
      
      // Validate file size (max 1MB)
      if (file.size > 1048576) {
        setErrors({
          ...errors,
          logo: 'Logo must be less than 1MB',
        });
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      
      // Convert file to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.logo) {
        setErrors({
          ...errors,
          logo: undefined,
        });
      }
    }
  };
  
  // Remove logo
  const handleRemoveLogo = (): void => {
    setLogoPreview(null);
    setFormData({
      ...formData,
      logo: undefined,
    });
  };
  
  const validateForm = (): boolean => {
    const newErrors: SiteFormErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Site name is required';
    }
    
    // Validate domain
    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else {
      // Simple domain validation
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(formData.domain)) {
        newErrors.domain = 'Please enter a valid domain (e.g., example.com)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Typed onSubmit handler
  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (validateForm() && siteId) {
      dispatch(updateSite({ siteId, siteData: formData }));
    }
  };
  
  // Handle delete site
  const handleDeleteSite = (): void => {
    if (siteId) {
      dispatch(deleteSite(siteId));
      history('/dashboard/sites');
    }
  };
  
  // Handle tab change
  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{message || 'Failed to load site data. Please try again.'}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => dispatch(getSiteById(siteId))}
                  className="text-sm font-medium text-red-800 hover:text-red-700"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Site Settings
          </h1>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete Site
            </button>
            
            <button
              type="button"
              form="site-edit-form"
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Save Changes
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => handleTabChange(tab.id)}
              >
                <tab.icon className={`h-5 w-5 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Form */}
        <form id="site-edit-form" onSubmit={onSubmit} className="mt-6 space-y-8">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">General Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Basic information about your site.
                </p>
              </div>
              
              <div className="px-6 py-5 space-y-6">
                {/* Site Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={onChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600" id="name-error">
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={onChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600" id="description-error">
                        {errors.description}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description of your site. This will be visible in search results.
                    </p>
                  </div>
                </div>
                
                {/* Currency */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <div className="mt-1">
                    <select
                      id="currency"
                      name="currency"
                      value={formData.config.currency}
                      onChange={onConfigChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                </div>
                
                {/* Language */}
                <div>
                  <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <div className="mt-1">
                    <select
                      id="languageCode"
                      name="languageCode"
                      value={formData.config.languageCode}
                      onChange={onConfigChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                      <option value="es-ES">Spanish (Spain)</option>
                      <option value="fr-FR">French (France)</option>
                      <option value="de-DE">German (Germany)</option>
                      <option value="ja-JP">Japanese (Japan)</option>
                      <option value="zh-CN">Chinese (Simplified)</option>
                    </select>
                  </div>
                </div>
                
                {/* Timezone */}
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <div className="mt-1">
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.config.timezone}
                      onChange={onConfigChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Domain Settings Tab */}
          {activeTab === 'domain' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Domain Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your site's domain and URL settings.
                </p>
              </div>
              
              <div className="px-6 py-5 space-y-6">
                {/* Domain */}
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                    Domain
                  </label>
                  <div className="mt-1">
                    <input
                      id="domain"
                      name="domain"
                      type="text"
                      placeholder="example.com"
                      value={formData.domain}
                      onChange={onChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.domain ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.domain && (
                      <p className="mt-2 text-sm text-red-600" id="domain-error">
                        {errors.domain}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Your store's domain name (e.g., yourbrand.com)
                    </p>
                  </div>
                </div>
                
                {/* Custom Domain */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Connect Custom Domain</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      To use your own custom domain with this store, you'll need to update your DNS settings.
                      Add the following CNAME record to your domain's DNS configuration:
                    </p>
                    <div className="mt-2 bg-gray-100 p-2 rounded font-mono text-xs">
                      <p><strong>Record Type:</strong> CNAME</p>
                      <p><strong>Host:</strong> www</p>
                      <p><strong>Points to:</strong> {formData.domain}.our-platform.com</p>
                      <p><strong>TTL:</strong> 3600</p>
                    </div>
                    <p className="mt-2">
                      Once you've updated your DNS settings, it may take up to 48 hours for the changes to propagate.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Verify Domain
                    </button>
                  </div>
                </div>
                
                {/* SSL Certificate */}
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldCheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">SSL Certificate Active</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your site is secured with SSL, providing a secure connection for your visitors.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Appearance Settings Tab */}
          {activeTab === 'appearance' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your site's branding and appearance.
                </p>
              </div>
              
              <div className="px-6 py-5 space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo</label>
                  <div className="mt-1 flex items-center">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-16 w-16 object-contain border rounded"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    
                    <div className="ml-4">
                      <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <label
                          htmlFor="logo-upload"
                          className="relative text-sm font-medium text-blue-600 pointer-events-none"
                        >
                          <span>{logoPreview ? 'Change logo' : 'Upload logo'}</span>
                          <span className="sr-only"> file</span>
                        </label>
                        <input
                          id="logo-upload"
                          name="logo"
                          type="file"
                          accept="image/jpeg,image/png,image/svg+xml"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleLogoChange}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, or SVG. Max 1MB.</p>
                    </div>
                  </div>
                  {errors.logo && (
                    <p className="mt-2 text-sm text-red-600" id="logo-error">
                      {errors.logo}
                    </p>
                  )}
                </div>
                
                {/* Theme Settings Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Theme Settings</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your site's theme and appearance from the theme editor.
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => history(`/builder/${siteId}/theme`)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go to Theme Editor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tabs would go here */}
          {/* For brevity, I'm not implementing all tabs in detail */}
          {(activeTab === 'analytics' || activeTab === 'advanced' || activeTab === 'security') && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTab === 'analytics' && 'Analytics Settings'}
                  {activeTab === 'advanced' && 'Advanced Settings'}
                  {activeTab === 'security' && 'Security Settings'}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  This section is under development. Coming soon!
                </p>
              </div>
            </div>
          )}
          
          {/* Form Error */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {errors.form}
            </div>
          )}
        </form>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Site
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this site? All of your data, including pages, products, and settings will be permanently removed.
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteSite}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteEdit;