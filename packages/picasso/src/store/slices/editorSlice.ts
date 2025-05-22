/**
 * editorSlice.js
 * Redux slice for page editor state
 */
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Currently selected component
  selectedComponent: null,
  
  // Components on the canvas
  components: [],
  
  // Layout for the current breakpoint
  currentLayout: [],
  
  // Current breakpoint (lg, md, sm, xs)
  currentBreakpoint: 'lg',
  
  // All layouts for responsive design
  layouts: {
    lg: [],
    md: [],
    sm: [],
    xs: []
  },
  
  // Edit/preview mode
  mode: 'edit',
  
  // Unsaved changes status
  hasUnsavedChanges: false,
  
  // History for undo/redo
  history: [],
  historyIndex: -1,
  
  // Editor status
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Editor slice
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Set selected component
    setSelectedComponent: (state, action) => {
      state.selectedComponent = action.payload;
    },
    
    // Update canvas components
    setComponents: (state, action) => {
      state.components = action.payload;
      state.hasUnsavedChanges = true;
      
      // Add to history
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        { components: [...action.payload], layouts: { ...state.layouts } }
      ];
      state.historyIndex = state.history.length - 1;
    },
    
    // Add a component to the canvas
    addComponent: (state, action) => {
      const newComponent = action.payload;
      state.components.push(newComponent);
      state.hasUnsavedChanges = true;
      
      // Add to history
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        { components: [...state.components], layouts: { ...state.layouts } }
      ];
      state.historyIndex = state.history.length - 1;
    },
    
    // Update a component's props
    updateComponent: (state, action) => {
      const { id, props } = action.payload;
      state.components = state.components.map(component => 
        component.id === id ? { ...component, props: { ...component.props, ...props } } : component
      );
      state.hasUnsavedChanges = true;
      
      // Add to history
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        { components: [...state.components], layouts: { ...state.layouts } }
      ];
      state.historyIndex = state.history.length - 1;
    },
    
    // Delete a component
    deleteComponent: (state, action) => {
      const id = action.payload;
      state.components = state.components.filter(component => component.id !== id);
      
      // Remove from layouts
      Object.keys(state.layouts).forEach(breakpoint => {
        state.layouts[breakpoint] = state.layouts[breakpoint].filter(item => item.i !== id);
      });
      
      state.hasUnsavedChanges = true;
      
      // If deleted component was selected, clear selection
      if (state.selectedComponent === id) {
        state.selectedComponent = null;
      }
      
      // Add to history
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        { components: [...state.components], layouts: { ...state.layouts } }
      ];
      state.historyIndex = state.history.length - 1;
    },
    
    // Update layout for a breakpoint
    updateLayout: (state, action) => {
      const { breakpoint, layout } = action.payload;
      state.layouts[breakpoint] = layout;
      state.currentLayout = layout;
      state.hasUnsavedChanges = true;
      
      // Add to history
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        { components: [...state.components], layouts: { ...state.layouts } }
      ];
      state.historyIndex = state.history.length - 1;
    },
    
    // Change current breakpoint
    setBreakpoint: (state, action) => {
      state.currentBreakpoint = action.payload;
      state.currentLayout = state.layouts[action.payload] || [];
    },
    
    // Switch between edit and preview mode
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    
    // Undo
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        const previousState = state.history[state.historyIndex];
        state.components = previousState.components;
        state.layouts = previousState.layouts;
        state.currentLayout = previousState.layouts[state.currentBreakpoint] || [];
        state.hasUnsavedChanges = true;
      }
    },
    
    // Redo
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        const nextState = state.history[state.historyIndex];
        state.components = nextState.components;
        state.layouts = nextState.layouts;
        state.currentLayout = nextState.layouts[state.currentBreakpoint] || [];
        state.hasUnsavedChanges = true;
      }
    },
    
    // Reset editor state
    resetEditor: () => initialState,
    
    // Clear just the status flags
    resetStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    
    // Mark changes as saved
    setChangesSaved: (state) => {
      state.hasUnsavedChanges = false;
    },
    
    // Initialize editor with page data
    initializeEditor: (state, action) => {
      const { components, layouts } = action.payload;
      state.components = components || [];
      state.layouts = layouts || {
        lg: [],
        md: [],
        sm: [],
        xs: []
      };
      state.currentLayout = state.layouts[state.currentBreakpoint] || [];
      state.hasUnsavedChanges = false;
      state.selectedComponent = null;
      
      // Reset history
      state.history = [{ components: [...state.components], layouts: { ...state.layouts } }];
      state.historyIndex = 0;
    }
  }
});

export const {
  setSelectedComponent,
  setComponents,
  addComponent,
  updateComponent,
  deleteComponent,
  updateLayout,
  setBreakpoint,
  setMode,
  undo,
  redo,
  resetEditor,
  resetStatus,
  setChangesSaved,
  initializeEditor
} = editorSlice.actions;

export default editorSlice.reducer;