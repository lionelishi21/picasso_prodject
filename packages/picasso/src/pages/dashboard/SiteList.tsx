/**
 * SiteList.tsx
 * Page component for listing and managing user's sites
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSites, deleteSite, updateSiteStatus } from '../../store/slices/siteSlice';
import type { AppDispatch, RootState } from '../../store/index';

// Icons
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LockClosedIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

// TypeScript interfaces
interface Site {
  id: string;
  name: string;
  domain: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'building';
  createdAt: string;
  updatedAt: string;
}

interface SiteCardProps {
  site: Site;
  onDelete: (siteId: string) => void;
  onStatusChange: (siteId: string, status: Site['status']) => void;
}

// Site status badge component
const StatusBadge: React.FC<{ status: Site['status'] }> = ({ status }) => {
  const getStatusClasses = (): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'building':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (): string => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'maintenance':
        return 'Maintenance';
      case 'building':
        return 'Building';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses()}`}>
      {getStatusLabel()}
    </span>
  );
};

// Site card component
const SiteCard: React.FC<SiteCardProps> = ({ site, onDelete, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState<boolean>(false);
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${site.name}"? This action cannot be undone.`)) {
      onDelete(site.id);
    }
  };
  
  const handleStatusChange = (status: Site['status']) => {
    onStatusChange(site._id, status);
    setIsStatusMenuOpen(false);
  };
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {site.logo ? (
              <img src={site.logo} alt={site.name} className="h-10 w-10 rounded" />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                {site.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
              <p className="text-sm text-gray-500">{site.domain}</p>
            </div>
          </div>
          
          <StatusBadge status={site.status} />
        </div>
        
        {site.description && (
          <p className="mt-2 text-sm text-gray-600">{site.description}</p>
        )}
      </div>
      
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Created {new Date(site.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex space-x-2 relative">
        
          {/* Visit Site Button */}
          <a 
            href={`https://${site.domain}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
            Visit
          </a>
          
          {/* Edit Button */}
          <Link
            to={`/builder/${site._id}/pages`}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Link>
          
          {/* More options dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" >
              <CogIcon className="h-4 w-4" />
            </button>
            
            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {/* Status dropdown trigger */}
                  <button
                    type="button"
                    onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <span className="flex-1 text-left">Change Status</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Edit Settings */}
                  <Link
                    to={`/dashboard/sites/${site.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <CogIcon className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  
                  {/* Delete site */}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    role="menuitem"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
            
            {isStatusMenuOpen && (
              <div className="origin-top-right absolute right-12 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="status-menu">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('active')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <EyeIcon className="h-4 w-4 mr-2 text-green-500" />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('inactive')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <LockClosedIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Inactive
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('maintenance')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <CogIcon className="h-4 w-4 mr-2 text-yellow-500" />
                    Maintenance
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main SiteList page component
const SiteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { sites, isLoading, isError, message } = useSelector((state: RootState) => state.site);
  
  useEffect(() => {
    console.log(user.user?._id);
    if (user?.user?._id) {
      dispatch(getUserSites(user.user?._id));
    }
  }, [user, dispatch]);
  
  const handleDeleteSite = (siteId: string) => {
    dispatch(deleteSite(siteId));
  };
  
  const handleStatusChange = (siteId: string, status: Site['status']) => {
    dispatch(updateSiteStatus({ siteId, status }));
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Your Sites</h1>
          <Link
            to="/dashboard/sites/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Site
          </Link>
        </div>
        
        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading sites</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!isLoading && !isError && sites.length === 0 && (
          <div className="text-center my-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sites</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new site.</p>
            <div className="mt-6">
              <Link
                to="/dashboard/sites/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Site
              </Link>
            </div>
          </div>
        )}
        
        {!isLoading && !isError && sites.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site: Site) => (
              <>
                  <SiteCard
                key={site._id}
                site={site}
                onDelete={handleDeleteSite}
                onStatusChange={handleStatusChange}
              />
              </>
            
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteList;