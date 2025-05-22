/**
 * SiteCreate.tsx
 * Page component for creating a new e-commerce site
 */
import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSite, reset } from '../../store/slices/siteSlice';
import type { RootState } from '../../store';
import { useAppDispatch } from '../../store';

// TypeScript interfaces
interface SiteFormData {
  name: string;
  domain: string;
  description: string;
  logo?: string | File;
}

interface SiteFormErrors {
  name?: string;
  domain?: string;
  description?: string;
  logo?: string;
  form?: string;
}

const SiteCreate: React.FC = () => {
  // Form state with TypeScript typing
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    domain: '',
    description: '',
  });
  const [errors, setErrors] = useState<SiteFormErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Typed dispatch and selector hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading, isSuccess, isError, message, currentSite } = useSelector(
    (state: RootState) => state.site
  );
  
  useEffect(() => {
    if (isError) {
      setErrors({ form: message });
    }
    
    if (isSuccess && currentSite) {
      navigate(`/builder/${currentSite.id}/pages`);
    }
    
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, currentSite, dispatch, navigate]);
  
  const { name, domain, description } = formData;
  
  // Typed onChange handler for text inputs
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name as keyof SiteFormErrors]) {
      setErrors({ 
        ...errors, 
        [e.target.name]: undefined 
      });
    }
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
      
      // Update form data
      setFormData({
        ...formData,
        logo: file,
      });
      
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
    if (!name.trim()) {
      newErrors.name = 'Site name is required';
    }
    
    // Validate domain
    if (!domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else {
      // Simple domain validation (more complex validation can be added)
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        newErrors.domain = 'Please enter a valid domain (e.g., example.com)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Typed onSubmit handler
  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (validateForm()) {
      const siteData = {
        owner: user?.id,
        name: formData.name,
        domain: formData.domain,
        description: formData.description,
        logo: formData.logo,
      };
      dispatch(createSite(siteData));
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create a new site</h1>
          <p className="mt-1 text-sm text-gray-600">
            Get started with your new e-commerce storefront
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
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
                value={name}
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
                value={domain}
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
              <p className="mt-1 text-xs text-gray-500">
                This will be the domain where your store is available. You can connect your own domain later.
              </p>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={description}
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
            </div>
          </div>
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo (optional)</label>
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
          
          {/* General Form Error */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {errors.form}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteCreate;