/**
 * PagePreview.tsx
 * Preview mode for the page editor
 */
import React from 'react';
import ComponentRenderer from '../../components/editor/ComponentRenderer';

type EditorComponent = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: EditorComponent[];
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
    order?: number;
    breakpoint?: Record<string, {
      x: number;
      y: number;
      w: number;
      h: number;
    }>;
  };
};

interface ComponentRegistry {
  [key: string]: {
    component: React.ComponentType<Record<string, unknown>>;
  };
}

interface PagePreviewProps {
  components: EditorComponent[];
  componentRegistry: ComponentRegistry;
  className?: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({
  components = [],
  componentRegistry,
  className = ''
}) => {
  // Sort components by their vertical position (y coordinate)
  const sortedComponents = [...components].sort((a, b) => {
    // Get y position from layout if available
    const aY = a.layout?.y || 0;
    const bY = b.layout?.y || 0;
    return aY - bY;
  });
  
  return (
    <div className={`page-preview ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {sortedComponents.map(component => (
          <div key={component.id} className="mb-8">
            <ComponentRenderer
              type={component.type}
              props={component.props}
              children={component.children}
              registry={componentRegistry}
              isEditing={false}
            />
          </div>
        ))}
        
        {components.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <h2 className="text-2xl font-semibold mb-2">This page is empty</h2>
            <p>Add components to build your page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagePreview;