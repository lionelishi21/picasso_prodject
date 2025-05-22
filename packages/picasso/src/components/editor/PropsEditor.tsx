/**
 * PropsEditor.tsx
 * Panel for editing component properties
 */
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface PropDefinition {
  type: string;
  label?: string;
  description?: string;
  category?: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface ComponentRegistry {
  [key: string]: {
    displayName?: string;
    description?: string;
    propDefinitions?: Record<string, PropDefinition>;
  };
}

interface PropsEditorProps {
  component: Component | null;
  componentRegistry: ComponentRegistry;
  onChange: (props: Record<string, unknown>) => void;
  className?: string;
}

// Fieldset for grouping related props
const PropFieldset: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <fieldset className="border border-gray-200 rounded p-3 mb-4">
    <legend className="text-sm font-medium px-1">{title}</legend>
    {children}
  </fieldset>
);

const PropsEditor: React.FC<PropsEditorProps> = ({
  component,
  componentRegistry,
  onChange,
  className = ''
}) => {
  const theme = useTheme();
  
  if (!component) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a component to edit its properties.
      </div>
    );
  }
  
  // Get the component definition from the registry
  const componentDef = componentRegistry[component.type];
  
  if (!componentDef) {
    return (
      <div className="p-4 text-center text-gray-500">
        Component definition not found.
      </div>
    );
  }
  
  // Get the prop definitions
  const propDefs: Record<string, PropDefinition> = componentDef.propDefinitions || {} as Record<string, Array<PropDefinition & { name: string }>>;
  
  // Handle prop change
  const handlePropChange = (propName: string, value: unknown): void => {
    const newProps = {
      ...component.props,
      [propName]: value
    };
    
    onChange(newProps);
  };
  
  // Render the appropriate input based on prop type
  const renderPropInput = (
    propName: string, 
    propDef: PropDefinition, 
    propValue: unknown
  ) => {
    const {
      type,
      options,
      placeholder,
      min,
      max,
      step
    } = propDef;
    
    switch (type) {
      case 'string':
        return (
          <input
            type="text"
            value={String(propValue || '')}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            placeholder={placeholder || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={propValue !== undefined ? Number(propValue) : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Number(e.target.value);
              handlePropChange(propName, val);
            }}
            placeholder={placeholder || ''}
            min={min}
            max={max}
            step={step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(propValue)}
            onChange={(e) => handlePropChange(propName, e.target.checked)}
            className="h-4 w-4 border-gray-300 rounded"
          />
        );
        
      case 'select':
        return (
          <select
            value={String(propValue || '')}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'textarea':
        return (
          <textarea
            value={propValue || ''}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            placeholder={placeholder || ''}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'color':
        return (
          <div className="flex items-center">
            <input
              type="color"
              value={propValue || '#000000'}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              className="h-8 w-8 border-0 p-0 mr-2"
            />
            <input
              type="text"
              value={propValue || ''}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        );
        
      case 'image':
        return (
          <div>
            <input
              type="text"
              value={propValue || ''}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              placeholder="Image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
            />
            {typeof propValue === 'string' && propValue && (
              <div className="mt-2 border border-gray-200 rounded p-2">
                <img
                  src={propValue}
                  alt="Preview"
                  className="max-h-24 max-w-full object-contain mx-auto"
                />
              </div>
            )}
          </div>
        );
        
      case 'array':
        // Simple array editor (comma-separated values)
        return (
          <textarea
            value={Array.isArray(propValue) ? propValue.join(',') : propValue || ''}
            onChange={(e) => {
              const val = e.target.value ? e.target.value.split(',').map(item => item.trim()) : [];
              handlePropChange(propName, val);
            }}
            placeholder="value1, value2, value3"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        );
        
      default:
        return (
          <input
            type="text"
            value={propValue !== undefined ? String(propValue) : ''}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            placeholder={placeholder || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        );
    }
  };
  
  // Group props by category
  const groupedProps: Record<string, Array<PropDefinition & { name: string }>> = Object.entries(propDefs).reduce((acc, [propName, propDef]) => {
    const category = propDef.category || 'General';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({ name: propName, ...propDef });
    
    return acc;
  }, {});
  
  return (
    <div className={`props-editor p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">
        {componentDef.displayName || component.type} Properties
      </h2>
      
      {/* Component description */}
      {componentDef.description && (
        <p className="text-sm text-gray-600 mb-4">{componentDef.description}</p>
      )}
      
      {/* Props form */}
      <form className="space-y-4">
        {Object.entries(groupedProps).map(([category, props]) => (
          <PropFieldset key={category} title={category}>
            {props.map(({ name, label, description, ...propDef }) => (
              <div key={name} className="mb-3 last:mb-0">
                <label className="block mb-1 text-sm font-medium">
                  {label || name}
                </label>
                {renderPropInput(name, propDef, component.props[name])}
                {description && (
                  <p className="mt-1 text-xs text-gray-500">{description}</p>
                )}
              </div>
            ))}
          </PropFieldset>
        ))}
        
        {/* If no props are defined */}
        {Object.keys(groupedProps).length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No editable properties for this component.
          </div>
        )}
      </form>
    </div>
  );
};

// No PropTypes needed with TypeScript

export default PropsEditor;