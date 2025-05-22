/**
 * theme.ts
 * Theme type definitions
 */

export interface ThemeSettings {
  id?: string;
  name: string;
  
  // Color palette
  primaryColor: string;
  primaryColorDark: string;
  secondaryColor: string;
  secondaryColorDark: string;
  accentColor: string;
  
  // Text colors
  textColor: string;
  headingColor: string;
  linkColor: string;
  linkHoverColor: string;
  labelColor: string;
  
  // UI colors
  buttonTextColor: string;
  iconColor: string;
  saleColor: string;
  starColor: string;
  
  // Header and footer
  headerBgColor: string;
  footerBgColor: string;
  footerTextColor: string;
  
  // Typography
  fontFamily: string;
  headingFontFamily: string;
  
  // Button styles
  buttonBorderRadius: string;
  
  // Card styles
  cardBorderRadius: string;
  
  // Custom CSS
  customCSS: string;
  
  // Is this the default theme?
  isDefault?: boolean;
}

export interface ThemeState {
  themes: ThemeSettings[];
  currentTheme: ThemeSettings | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
} 