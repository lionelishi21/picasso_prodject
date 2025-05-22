/**
 * PagePreview.tsx
 * Renders components in preview mode based on their layout
 */
import React from 'react';
import ComponentRenderer from './ComponentRenderer';

// Define the structure of a single component in the preview
interface LayoutInfo {
  y?: number;
  [key: string]: any;
}

interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: Component[];
}

interface ComponentDefinition {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: Component[];
  layout?: LayoutInfo;
}

interface ComponentRegistry {
  [key: string]: {
    component: React.ComponentType<any>;
  };
}

interface PagePreviewProps {
  /** Array of components to render in preview mode */
  components?: ComponentDefinition[];
  /** Registry mapping component types to React components */
  componentRegistry: ComponentRegistry;
  /** Optional additional CSS classes for the container */
  className?: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({
  components = [],
  componentRegistry,
  className = ''
}) => {
  // Sort components by their vertical position (y coordinate)
  const sortedComponents = [...components].sort((a, b) => {
    const aY = a.layout?.y ?? 0;
    const bY = b.layout?.y ?? 0;
    return aY - bY;
  });

  return (
    <div className={`page-preview ${className}`.trim()}>
      <div className="container mx-auto px-4 py-8">
        {sortedComponents.length > 0 ? (
          sortedComponents.map(component => (
            <div key={component.id} className="mb-8">
              <ComponentRenderer
                type={component.type}
                props={component.props || {}}
                children={component.children || []}
                registry={componentRegistry}
                isEditing={false}
              />
            </div>
          ))
        ) : (
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