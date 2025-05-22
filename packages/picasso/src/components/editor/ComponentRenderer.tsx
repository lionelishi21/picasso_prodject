/**
 * ComponentPalette.tsx
 * Sidebar component showing available components that can be dragged onto the page
 */
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ComponentDefinition {
  displayName?: string;
  description?: string;
  category?: string;
  [key: string]: any;
}

interface ComponentsRegistry {
  [key: string]: ComponentDefinition;
}

interface ComponentPaletteProps {
  components: ComponentsRegistry;
  onAddComponent: (componentType: string) => void;
  className?: string;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ 
  components, 
  onAddComponent, 
  className = '' 
}) => {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Organize components by category
  const componentsByCategory = Object.entries(components).reduce<Record<string, Array<ComponentDefinition & { type: string }>>>((acc, [key, component]) => {
    const category = component.category || 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({ 
      type: key, 
      ...component 
    });
    
    return acc;
  }, {});

  // Get unique categories
  const categories = ['all', ...Object.keys(componentsByCategory)];

  // Filter components based on search query and active category
  const filteredComponents = Object.entries(componentsByCategory).flatMap(([category, categoryComponents]) => {
    if (activeCategory !== 'all' && activeCategory !== category) {
      return [];
    }
    
    return categoryComponents.filter(component => 
      component.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
      component.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      component.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`component-palette p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      
      {/* Search Box */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search components..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm" 
        />
      </div>
      
      {/* Category Tabs */}
      <div className="mb-4 flex flex-wrap">
        {categories.map(category => (
          <button 
            key={category} 
            className={`mr-2 mb-2 px-3 py-1 text-xs font-medium rounded ${
              activeCategory === category 
                ? `bg-${theme.primaryColor} text-white` 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`} 
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Component List */}
      <div className="space-y-2">
        {filteredComponents.map(component => (
          <div 
            key={component.type} 
            className="bg-white border border-gray-200 rounded p-3 cursor-pointer hover:border-gray-400 transition-colors duration-150" 
            onClick={() => onAddComponent(component.type)}
          >
            <div className="font-medium mb-1">{component.displayName || component.type}</div>
            {component.description && (
              <div className="text-xs text-gray-600">{component.description}</div>
            )}
          </div>
        ))}
        
        {filteredComponents.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No components found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPalette;