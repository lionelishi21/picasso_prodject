/**
 * ThemeContext.ts
 * Context provider for theming the application
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
// Define theme interface
interface Theme {
  // Colors
  primaryColor: string;
  primaryColorDark: string;
  secondaryColor: string;
  secondaryColorDark: string;
  textColor: string;
  headingColor: string;
  labelColor: string;
  iconColor: string;
  saleColor: string;
  linkColor: string;
  linkHoverColor: string;
  starColor: string;
  
  // Header and Footer
  headerBgColor: string;
  footerBgColor: string;
  footerTextColor: string;
  
  // Typography
  fontFamily: string;
  headingFontFamily: string;
  
  // Border Radius
  borderRadius: string;
  
  // Box Shadow
  boxShadow: string;
  
  // Allow dynamic property access for CSS variables
  [key: string]: string;
}

// Define theme context interface with methods
interface ThemeContextType extends Theme {
  updateTheme: (newTheme: Partial<Theme>) => void;
  setNewTheme: (newTheme: Partial<Theme>) => void;
}

// Define props interface
interface ThemeProviderProps {
  initialTheme?: Partial<Theme>;
  children: ReactNode;
}

// Create the theme context with proper typing
const ThemeContext = createContext<ThemeContextType | null>(null);

// Custom hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default theme values
const defaultTheme: Theme = {
  // Colors
  primaryColor: 'blue-600',
  primaryColorDark: 'blue-700',
  secondaryColor: 'indigo-500',
  secondaryColorDark: 'indigo-600',
  textColor: 'gray-800',
  headingColor: 'gray-900',
  labelColor: 'gray-700',
  iconColor: 'gray-600',
  saleColor: 'red-600',
  linkColor: 'blue-600',
  linkHoverColor: 'blue-700',
  starColor: 'yellow-400',
  
  // Header and Footer
  headerBgColor: 'white',
  footerBgColor: 'gray-900',
  footerTextColor: 'white',
  
  // Typography
  fontFamily: 'sans',
  headingFontFamily: 'sans',
  
  // Border Radius
  borderRadius: 'rounded',
  
  // Box Shadow
  boxShadow: 'shadow-md',
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ initialTheme = {}, children }) => {
  // Merge the initial theme with the default theme
  const [theme, setTheme] = useState<Theme>({ ...defaultTheme, ...initialTheme });
  
  // Apply CSS variables for theme colors
  useEffect(() => {
    // Convert theme to CSS custom properties
    Object.keys(theme).forEach(key => {
      if (typeof theme[key] === 'string') {
        document.documentElement.style.setProperty(`--theme-${key}`, theme[key]);
      }
    });
  }, [theme]);
  
  // Update the theme
  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme(prevTheme => ({ ...prevTheme, ...newTheme }));
  };
  
  // Set a completely new theme
  const setNewTheme = (newTheme: Partial<Theme>) => {
    setTheme({ ...defaultTheme, ...newTheme });
  };
  
  return (
    <ThemeContext.Provider value={{ ...theme, updateTheme, setNewTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;