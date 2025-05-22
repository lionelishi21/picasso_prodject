/**
 * ComponentRenderer.tsx
 * Renders a component dynamically based on type and props
 */
import React from 'react';

// Define the component structure
type EditorComponent = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: EditorComponent[];
};

// Define the registry structure
interface ComponentRegistry {
  [key: string]: {
    component: React.ComponentType<Record<string, unknown>>;
  };
}

// Props interface for the ComponentRenderer
interface ComponentRendererProps {
  type: string;
  props?: Record<string, unknown>;
  children?: EditorComponent[];
  registry: ComponentRegistry;
  isEditing?: boolean;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  type,
  props = {},
  children = [],
  registry,
  isEditing = false
}) => {
  // Get the component from the registry
  const Component = registry[type]?.component;
  
  if (!Component) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded text-red-600">
        Component "{type}" not found in registry
      </div>
    );
  }
  
  // Render nested children if any
  const renderedChildren = children.length > 0
    ? children.map(child => (
        <ComponentRenderer
          key={child.id}
          type={child.type}
          props={child.props}
          children={child.children}
          registry={registry}
          isEditing={isEditing}
        />
      ))
    : null;
  
  // Combine props with children if needed
  const componentProps = renderedChildren
    ? { ...props, children: renderedChildren }
    : props;
  
  // Add editing props if in edit mode
  if (isEditing) {
    // We can add any editor-specific props here
    // e.g. special styling, placeholder content, etc.
  }
  
  // Render the component with the given props
  try {
    return <Component {...componentProps} />;
  } catch (error: unknown) {
    console.error(`Error rendering component "${type}":`, error);
    
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded text-red-600">
        <p>Error rendering component: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

export default ComponentRenderer;