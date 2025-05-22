/**
 * PageEditor.tsx
 * Main component for the drag-and-drop page editor
 * (Custom implementation without react-grid-layout dependency)
 */
import React, { useState, useEffect, useRef } from 'react';
import ComponentPalette from '../../components/editor/ComponentPalette';
import PropsEditor from '../../components/editor/PropsEditor';
import PagePreview from './PagePreview';
import ComponentRenderer from './ComponentRenderer';
import { useTheme } from '../../context/ThemeContext';

// Define interfaces for the component structure
interface BreakpointLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ComponentLayout {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  order?: number;
  breakpoint?: {
    [key: string]: BreakpointLayout;
  };
}

interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children: any[];
  layout?: ComponentLayout;
}

interface ComponentDefinition {
  defaultProps?: Record<string, any>;
  defaultLayout?: {
    w?: number;
    h?: number;
    minW?: number;
    minH?: number;
  };
  propsSchema?: Record<string, any>;
}

interface ComponentRegistry {
  [key: string]: ComponentDefinition;
}

interface PageData {
  id?: string;
  name?: string;
  path?: string;
  components: Component[];
}

interface PageEditorProps {
  pageData: PageData;
  componentRegistry: ComponentRegistry;
  onSave: (data: PageData) => void;
  className?: string;
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  // Other theme properties
}

// Custom layout interfaces
interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

interface Layouts {
  lg: Layout[];
  md: Layout[];
  sm: Layout[];
  xs: Layout[];
  [key: string]: Layout[];
}

// Grid constants
const GRID_COLS = {
  lg: 12,
  md: 8,
  sm: 6,
  xs: 4
};

const GRID_BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480
};

const PageEditor: React.FC<PageEditorProps> = ({
  pageData,
  componentRegistry,
  onSave,
  className = '',
}) => {
  const theme = useTheme() as Theme;
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Current active breakpoint
  const [activeBreakpoint, setActiveBreakpoint] = useState<string>('lg');
  
  // Layout state
  const [layout, setLayout] = useState<Layouts>({
    lg: [],
    md: [],
    sm: [],
    xs: []
  });
  
  // Components state (actual component instances with props)
  const [components, setComponents] = useState<Component[]>([]);
  
  // Selected component state
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  // Editor mode (edit or preview)
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  
  // Drag state
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    componentId: string | null;
    startPos: { x: number, y: number } | null;
  }>({
    isDragging: false,
    componentId: null,
    startPos: null
  });
  
  // Parse pageData into components and layout on mount
  useEffect(() => {
    if (pageData && pageData.components) {
      // Extract components
      const pageComponents = pageData.components.map(component => ({
        id: component.id,
        type: component.type,
        props: component.props || {},
        children: component.children || []
      }));
      
      // Extract layout information
      const pageLayout: Layouts = pageData.components.reduce((acc: Layouts, component) => {
        // For each breakpoint, add an entry in the layout
        ['lg', 'md', 'sm', 'xs'].forEach(breakpoint => {
          const layoutItem: Layout = {
            i: component.id,
            x: component.layout?.x || 0,
            y: component.layout?.y || 0,
            w: component.layout?.w || 12, // Default to full width
            h: component.layout?.h || 2,
            minW: 2,
            minH: 1
          };
          
          // If there's a specific layout for this breakpoint, use it
          if (component.layout?.breakpoint?.[breakpoint]) {
            const breakpointLayout = component.layout.breakpoint[breakpoint];
            layoutItem.x = breakpointLayout.x || layoutItem.x;
            layoutItem.y = breakpointLayout.y || layoutItem.y;
            layoutItem.w = breakpointLayout.w || layoutItem.w;
            layoutItem.h = breakpointLayout.h || layoutItem.h;
          }
          
          acc[breakpoint] = [...(acc[breakpoint] || []), layoutItem];
        });
        
        return acc;
      }, { lg: [], md: [], sm: [], xs: [] });
      
      setComponents(pageComponents);
      setLayout(pageLayout);
    }
  }, [pageData]);
  
  // Detect breakpoint based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= GRID_BREAKPOINTS.lg) {
        setActiveBreakpoint('lg');
      } else if (width >= GRID_BREAKPOINTS.md) {
        setActiveBreakpoint('md');
      } else if (width >= GRID_BREAKPOINTS.sm) {
        setActiveBreakpoint('sm');
      } else {
        setActiveBreakpoint('xs');
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, componentId: string) => {
    if (e.button !== 0) return; // Only left mouse button
    
    e.preventDefault();
    e.stopPropagation();
    
    const startPos = { x: e.clientX, y: e.clientY };
    
    setDragState({
      isDragging: true,
      componentId,
      startPos
    });
    
    // Add listeners for drag and end
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };
  
  // Handle drag move
  const handleDragMove = (e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.componentId || !dragState.startPos) return;
    
    const deltaX = e.clientX - dragState.startPos.x;
    const deltaY = e.clientY - dragState.startPos.y;
    
    // Only update if we've moved a significant amount
    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
      // Get grid cell size
      const gridContainer = gridContainerRef.current;
      if (!gridContainer) return;
      
      const cellWidth = gridContainer.clientWidth / GRID_COLS[activeBreakpoint];
      const cellHeight = 60; // Row height
      
      // Calculate grid movement
      const gridDeltaX = Math.round(deltaX / cellWidth);
      const gridDeltaY = Math.round(deltaY / cellHeight);
      
      if (gridDeltaX !== 0 || gridDeltaY !== 0) {
        // Update layout for the component being dragged
        setLayout(prev => {
          const updatedLayout = { ...prev };
          
          updatedLayout[activeBreakpoint] = prev[activeBreakpoint].map(item => {
            if (item.i === dragState.componentId) {
              // Calculate new position, constrained to grid
              const newX = Math.max(0, Math.min(GRID_COLS[activeBreakpoint] - item.w, item.x + gridDeltaX));
              const newY = Math.max(0, item.y + gridDeltaY);
              
              return { ...item, x: newX, y: newY };
            }
            return item;
          });
          
          return updatedLayout;
        });
        
        // Update start position for next calculation
        setDragState(prev => ({
          ...prev,
          startPos: { x: e.clientX, y: e.clientY }
        }));
      }
    }
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      componentId: null,
      startPos: null
    });
    
    // Remove listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };
  
  // Handle component props change
  const handlePropsChange = (componentId: string, newProps: Record<string, any>): void => {
    setComponents(prevComponents => 
      prevComponents.map(component => 
        component.id === componentId
          ? { ...component, props: { ...component.props, ...newProps } }
          : component
      )
    );
  };
  
  // Add a new component from the palette
  const handleAddComponent = (componentType: string): void => {
    const componentDef = componentRegistry[componentType];
    
    if (!componentDef) {
      console.error(`Component type ${componentType} not found in registry`);
      return;
    }
    
    // Create a new component instance
    const newComponentId = `component-${Date.now()}`;
    const newComponent: Component = {
      id: newComponentId,
      type: componentType,
      props: componentDef.defaultProps || {},
      children: []
    };
    
    // Add to components
    setComponents(prev => [...prev, newComponent]);
    
    // Add to layout at the bottom
    const maxY = Math.max(
      0,
      ...Object.values(layout).flatMap(
        breakpointLayout => breakpointLayout.map(item => item.y + item.h)
      )
    );
    
    const newLayoutItem: Layout = {
      i: newComponentId,
      x: 0,
      y: maxY,
      w: componentDef.defaultLayout?.w || 12,
      h: componentDef.defaultLayout?.h || 2,
      minW: componentDef.defaultLayout?.minW || 2,
      minH: componentDef.defaultLayout?.minH || 1
    };
    
    setLayout(prev => ({
      ...prev,
      lg: [...(prev.lg || []), newLayoutItem],
      md: [...(prev.md || []), { ...newLayoutItem, w: Math.min(newLayoutItem.w, 8) }],
      sm: [...(prev.sm || []), { ...newLayoutItem, w: Math.min(newLayoutItem.w, 6) }],
      xs: [...(prev.xs || []), { ...newLayoutItem, w: Math.min(newLayoutItem.w, 4) }]
    }));
    
    // Select the newly added component
    setSelectedComponent(newComponentId);
  };
  
  // Delete a component
  const handleDeleteComponent = (componentId: string): void => {
    setComponents(prev => prev.filter(component => component.id !== componentId));
    
    // Update layouts to remove the deleted component
    setLayout(prev => {
      const newLayout: Layouts = {};
      
      Object.keys(prev).forEach(breakpoint => {
        newLayout[breakpoint] = prev[breakpoint].filter(item => item.i !== componentId);
      });
      
      return newLayout;
    });
    
    // If the deleted component was selected, clear the selection
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
  };
  
  // Save the page layout
  const handleSave = (): void => {
    // Convert the layout and components back to the format expected by the API
    const combinedData = components.map(component => {
      // Find layout info for each breakpoint
      const layoutInfo = Object.keys(layout).reduce((acc: { breakpoint: Record<string, BreakpointLayout> }, breakpoint) => {
        const breakpointLayout = layout[breakpoint].find(item => item.i === component.id);
        if (breakpointLayout) {
          acc.breakpoint = {
            ...acc.breakpoint,
            [breakpoint]: {
              x: breakpointLayout.x,
              y: breakpointLayout.y,
              w: breakpointLayout.w,
              h: breakpointLayout.h
            }
          };
        }
        return acc;
      }, { breakpoint: {} });
      
      // Extract the main layout from the lg breakpoint
      const lgLayout = layout.lg.find(item => item.i === component.id);
      
      return {
        id: component.id,
        type: component.type,
        props: component.props,
        children: component.children,
        layout: {
          x: lgLayout?.x || 0,
          y: lgLayout?.y || 0,
          w: lgLayout?.w || 12,
          h: lgLayout?.h || 2,
          order: lgLayout?.y,
          ...layoutInfo
        }
      };
    });
    
    // Call the onSave prop with the combined data
    if (onSave) {
      onSave({
        ...pageData,
        components: combinedData
      });
    }
  };
  
  // Handle component resize
  const handleResize = (componentId: string, delta: { w: number, h: number }) => {
    setLayout(prev => {
      const updatedLayout = { ...prev };
      
      updatedLayout[activeBreakpoint] = prev[activeBreakpoint].map(item => {
        if (item.i === componentId) {
          // Calculate new size with constraints
          const newW = Math.max(item.minW || 2, Math.min(GRID_COLS[activeBreakpoint], item.w + delta.w));
          const newH = Math.max(item.minH || 1, item.h + delta.h);
          
          return { ...item, w: newW, h: newH };
        }
        return item;
      });
      
      return updatedLayout;
    });
  };
  
  // Calculate CSS grid position for a component
  const getGridStyle = (componentId: string) => {
    const componentLayout = layout[activeBreakpoint]?.find(item => item.i === componentId);
    
    if (!componentLayout) return {};
    
    return {
      gridColumn: `span ${componentLayout.w}`,
      gridRow: `span ${componentLayout.h}`,
      // Use CSS Grid's order property for positioning
      order: componentLayout.y * GRID_COLS[activeBreakpoint] + componentLayout.x
    };
  };
  
  // Switch between edit and preview modes
  const toggleEditorMode = (): void => {
    setEditorMode(editorMode === 'edit' ? 'preview' : 'edit');
  };
  
  return (
    <div className={`page-editor ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="text-xl font-semibold">
          {pageData?.name || 'Page Editor'}
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded text-sm font-medium ${
              editorMode === 'edit' 
                ? `bg-${theme.primaryColor} text-white` 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setEditorMode('edit')}
          >
            Edit
          </button>
          <button
            className={`px-4 py-2 rounded text-sm font-medium ${
              editorMode === 'preview' 
                ? `bg-${theme.primaryColor} text-white` 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setEditorMode('preview')}
          >
            Preview
          </button>
          <button
            className={`px-4 py-2 rounded text-sm font-medium bg-${theme.secondaryColor} text-white`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      
      {/* Main Editor Area */}
      <div className="flex h-full">
        {/* Left Sidebar - Component Palette */}
        {editorMode === 'edit' && (
          <div className="w-64 border-r border-gray-200 bg-white h-full overflow-y-auto">
            <ComponentPalette 
              components={componentRegistry} 
              onAddComponent={handleAddComponent} 
            />
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          {editorMode === 'edit' ? (
            <div className="p-4">
              <div 
                ref={gridContainerRef}
                className="grid-layout"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${GRID_COLS[activeBreakpoint]}, 1fr)`,
                  gap: '12px',
                  gridAutoFlow: 'dense'
                }}
              >
                {components.map(component => {
                  const componentLayout = layout[activeBreakpoint]?.find(item => item.i === component.id);
                  
                  if (!componentLayout) return null;
                  
                  return (
                    <div 
                      key={component.id} 
                      className="bg-white rounded shadow"
                      style={getGridStyle(component.id)}
                    >
                      <div 
                        className={`component-container border-2 rounded overflow-hidden ${
                          selectedComponent === component.id ? `border-${theme.primaryColor}` : 'border-transparent'
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        {/* Component header */}
                        <div 
                          className="component-drag-handle flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200 cursor-move"
                          onMouseDown={(e) => handleDragStart(e, component.id)}
                        >
                          <div className="text-sm font-medium">
                            {component.type}
                          </div>
                          <div className="flex">
                            {/* Resize handle */}
                            <button
                              className="text-gray-500 hover:text-gray-700 p-1 mr-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResize(component.id, { w: 1, h: 0 });
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                              </svg>
                            </button>
                            
                            {/* Delete button */}
                            <button
                              className="text-red-500 hover:text-red-700 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteComponent(component.id);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Component content */}
                        <div className="p-4">
                          <ComponentRenderer
                            type={component.type}
                            props={component.props}
                            registry={componentRegistry}
                            isEditing={true}
                            children={component.children}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <PagePreview 
              components={components}
              componentRegistry={componentRegistry}
            />
          )}
        </div>
        
        {/* Right Sidebar - Props Editor */}
        {editorMode === 'edit' && selectedComponent && (
          <div className="w-72 border-l border-gray-200 bg-white h-full overflow-y-auto">
            <PropsEditor
              component={components.find(c => c.id === selectedComponent)}
              componentRegistry={componentRegistry}
              onChange={(newProps: Record<string, any>) => handlePropsChange(selectedComponent, newProps)}
            />
          </div>
        )}
      </div>
      
      {/* CSS for custom grid layout */}
      <style jsx>{`
        .grid-layout {
          position: relative;
          width: 100%;
          min-height: 100px;
        }
        
        .component-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .component-drag-handle {
          cursor: move;
          touch-action: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default PageEditor;