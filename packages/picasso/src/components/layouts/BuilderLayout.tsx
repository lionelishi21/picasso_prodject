/**
 * BuilderLayout.tsx
 * Layout for the page builder interface
 */
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSiteById } from '../../store/slices/siteSlice';
import { getDefaultTheme } from '../../store/slices/themeSlice';
import type { RootState, AppDispatch } from '../../store';

// Icons
import {
  HomeIcon,
  Squares2X2Icon as ViewGridIcon,
  SwatchIcon as ColorSwatchIcon,
  ComputerDesktopIcon as DesktopComputerIcon,
  DeviceTabletIcon as TabletIcon,
  DevicePhoneMobileIcon as PhoneIcon,
  ArrowDownTrayIcon as SaveIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  EyeIcon,
  PencilIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

interface BuilderLayoutProps {
  children: React.ReactNode;
}

interface RouteParams {
  siteId: string;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const siteId = params.siteId || '';
  
  const { currentSite } = useSelector((state: RootState) => state.site);
  const { currentTheme } = useSelector((state: RootState) => state.theme);
  const { hasUnsavedChanges, mode, currentBreakpoint } = useSelector((state: RootState) => state.editor);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Load site data if not already loaded
  useEffect(() => {
    if (siteId && (!currentSite || currentSite.id !== siteId)) {
      dispatch(getSiteById(siteId));
    }
  }, [dispatch, siteId, currentSite]);
  
  // Load default theme if not already loaded
  useEffect(() => {
    if (siteId && !currentTheme) {
      dispatch(getDefaultTheme(siteId));
    }
  }, [dispatch, siteId, currentTheme]);
  
  // Handle before unload (page refresh/close) if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Pages', href: `/builder/${siteId}/pages`, icon: ViewGridIcon },
    { name: 'Theme', href: `/builder/${siteId}/theme`, icon: ColorSwatchIcon },
  ];
  
  const deviceOptions = [
    { name: 'Desktop', icon: DesktopComputerIcon, breakpoint: 'lg' },
    { name: 'Tablet', icon: TabletIcon, breakpoint: 'md' },
    { name: 'Mobile', icon: PhoneIcon, breakpoint: 'sm' },
  ];
  
  // Warning before navigation if unsaved changes
  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    
    navigate('/dashboard/sites');
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="inline-flex items-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-1">Back to sites</span>
            </button>
            
            <span className="ml-4 text-gray-900 font-medium truncate">
              {currentSite?.name || 'Site Builder'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Device Options - only show in edit mode */}
            {mode === 'edit' && (
              <div className="flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
                {deviceOptions.map((device) => (
                  <button
                    key={device.breakpoint}
                    className={`p-1.5 rounded ${
                      currentBreakpoint === device.breakpoint
                        ? 'bg-white shadow text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title={device.name}
                  >
                    <device.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Mode Toggle */}
            <div className="flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
               <button
                className={`p-1.5 rounded inline-flex items-center ${
                  mode === 'edit'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Edit Mode">
                <PencilIcon className="h-5 w-5" />
                <span className="ml-1 text-sm font-medium hidden sm:inline">Edit</span>
               </button>
              
               <button
                className={`p-1.5 rounded inline-flex items-center ${
                  mode === 'preview'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Preview Mode"
              >
                <EyeIcon className="h-5 w-5" />
                <span className="ml-1 text-sm font-medium hidden sm:inline">Preview</span>
               </button>
            </div>
            
            {/* Save Button */}
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                hasUnsavedChanges
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!hasUnsavedChanges} >
              <SaveIcon className="h-4 w-4 mr-1" />
              Save
            </button>
            
            {/* View Site Button */}
            <a
              href={`https://${currentSite?.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" >
              <ExternalLinkIcon className="h-4 w-4 mr-1" />
              View Site
            </a>
          </div>
        </div>
        
        {/* Secondary Navigation */}
        <div className="border-t border-gray-200">
            <nav className="flex px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                </Link>
              ))}
            </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default BuilderLayout;