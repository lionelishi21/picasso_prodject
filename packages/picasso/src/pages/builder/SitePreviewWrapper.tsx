/**
 * SitePreviewWrapper.tsx
 * Integrates the SitePreview component with the ThemeEditor
 */
import React from 'react';
import SitePreview from './SitePreview';
import { useSelector } from 'react-redux';

const SitePreviewWrapper: React.FC = () => {
  // Get theme from Redux store (as in your ThemeEditor component)
  const { currentTheme } = useSelector((state) => state.theme);
  
  // Default to desktop breakpoint or get from state if needed
  const [breakpoint, setBreakpoint] = React.useState('desktop');
  
  // Ensure we have theme data to work with
  if (!currentTheme) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Controls header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Site Preview: {currentTheme.name}
          </h1>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setBreakpoint('desktop')}
              className={`p-2 rounded ${
                breakpoint === 'desktop'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setBreakpoint('tablet')}
              className={`p-2 rounded ${
                breakpoint === 'tablet'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Tablet
            </button>
            <button
              type="button"
              onClick={() => setBreakpoint('mobile')}
              className={`p-2 rounded ${
                breakpoint === 'mobile'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Mobile
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Preview Area */}
      <div className="flex-1 bg-gray-100 overflow-auto p-4">
        <div className="mx-auto">
          <SitePreview 
            theme={currentTheme} 
            breakpoint={breakpoint} 
          />
        </div>
      </div>
    </div>
  );
};

export default SitePreviewWrapper;