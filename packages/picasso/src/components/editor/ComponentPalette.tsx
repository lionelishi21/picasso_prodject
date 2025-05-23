/**
 * ComponentPalette.tsx
 * Sidebar component showing available components that can be dragged onto the page
 */
import React, { useState } from 'react';

interface ComponentDefinition {
  displayName?: string;
  category?: string;
  description?: string;
  defaultProps?: Record<string, unknown>;
  defaultLayout?: {
    w?: number;
    h?: number;
    minW?: number;
    minH?: number;
  };
  propDefinitions?: Record<string, unknown>;
}

interface ComponentPaletteProps {
  components: Record<string, ComponentDefinition>;
  onAddComponent: (type: string) => void;
  className?: string;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ 
  components = {},
  onAddComponent,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Organize components by category
  const componentsByCategory = Object.entries(components).reduce<Record<string, { type: string; definition: ComponentDefinition }[]>>((acc, [type, definition]) => {
    const category = definition.category || 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({ type, definition });
    return acc;
  }, {});
  
  // Get unique categories
  const categories = ['all', ...Object.keys(componentsByCategory)].sort();
  
  // Filter components based on search query
  const filteredComponents = Object.entries(componentsByCategory).reduce<Record<string, { type: string; definition: ComponentDefinition }[]>>((acc, [category, components]) => {
    const filtered = components.filter(({ type, definition }) => {
      const searchString = `${type} ${definition.displayName || ''} ${definition.description || ''}`.toLowerCase();
      return searchString.includes(searchQuery.toLowerCase());
    });
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {});
  
  return (
    <div className={`component-palette ${className}`}>
      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search components..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Category tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeCategory === category
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Component list */}
      <div className="overflow-y-auto">
        {Object.entries(filteredComponents).map(([category, components]) => {
          // Skip if not matching active category
          if (activeCategory !== 'all' && activeCategory !== category) {
            return null;
          }
          
          return (
            <div key={category} className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {components.map(({ type, definition }) => (
                  <button
                    key={type}
                    className="w-full p-3 text-left bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => onAddComponent(type)}
                  >
                    <div className="text-sm font-medium">
                      {definition.displayName || type}
                    </div>
                    {definition.description && (
                      <div className="mt-1 text-xs text-gray-500">
                        {definition.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Empty state */}
        {Object.keys(filteredComponents).length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No components found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPalette;