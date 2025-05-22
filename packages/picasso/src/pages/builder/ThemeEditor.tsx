/**
 * ThemeEditor.tsx
 * Component for customizing the site's theme
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDefaultTheme, updateTheme, cloneTheme } from '../../store/slices/themeSlice';
import { getSiteById } from '../../store/slices/siteSlice';
import type { AppDispatch, RootState } from '../../store';
import type { ThemeSettings, ThemeState } from '../../types/theme';

// Icons
import {
  SwatchIcon,
  DocumentIcon,
  Squares2X2Icon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

// TypeScript interfaces
interface RouteParams {
  [key: string]: string | undefined;
  siteId: string;
}

interface ColorSetting {
  id: string;
  label: string;
  description?: string;
  default: string;
}

interface FontSetting {
  id: string;
  label: string;
  description?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

interface BorderRadiusSetting {
  id: string;
  label: string;
  description?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

// Tab interface
interface TabItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

// Define breakpoints for the preview
type Breakpoint = 'desktop' | 'tablet' | 'mobile';

const ThemeEditor: React.FC = (): JSX.Element => {
  const { siteId = '' } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const { currentSite } = useSelector((state: RootState) => state.site);
  const themeState = useSelector((state: RootState) => state.theme as ThemeState);
  
  // Local state
  const [theme, setTheme] = useState<ThemeSettings>({
    name: 'Default Theme',
    primaryColor: 'blue-600',
    primaryColorDark: 'blue-700',
    secondaryColor: 'purple-600',
    secondaryColorDark: 'purple-700',
    accentColor: 'amber-500',
    textColor: 'gray-800',
    headingColor: 'gray-900',
    linkColor: 'blue-600',
    linkHoverColor: 'blue-700',
    labelColor: 'gray-700',
    buttonTextColor: 'white',
    iconColor: 'currentColor',
    saleColor: 'red-600',
    starColor: 'yellow-400',
    headerBgColor: 'white',
    footerBgColor: 'gray-900',
    footerTextColor: 'white',
    fontFamily: 'sans',
    headingFontFamily: 'sans',
    buttonBorderRadius: 'rounded',
    cardBorderRadius: 'rounded',
    customCSS: '',
  });
  
  // Local UI state
  const [activeTab, setActiveTab] = useState<string>('colors');
  const [previewBreakpoint, setPreviewBreakpoint] = useState<Breakpoint>('desktop');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [themeName, setThemeName] = useState<string>('Default Theme');
  const [showCreateThemeModal, setShowCreateThemeModal] = useState<boolean>(false);
  const [newThemeName, setNewThemeName] = useState<string>('');
  
  const tabs: TabItem[] = [
    { id: 'colors', label: 'Colors', icon: SwatchIcon },
    { id: 'typography', label: 'Typography', icon: DocumentIcon },
    { id: 'layout', label: 'Layout', icon: Squares2X2Icon },
    { id: 'advanced', label: 'Advanced', icon: ArrowPathIcon },
  ];
  
  // Color settings definitions
  const colorSettings: ColorSetting[] = [
    { id: 'primaryColor', label: 'Primary Color', default: 'blue-600' },
    { id: 'primaryColorDark', label: 'Primary Color (Dark)', description: 'Used for hover states', default: 'blue-700' },
    { id: 'secondaryColor', label: 'Secondary Color', default: 'purple-600' },
    { id: 'secondaryColorDark', label: 'Secondary Color (Dark)', description: 'Used for hover states', default: 'purple-700' },
    { id: 'accentColor', label: 'Accent Color', description: 'Used for highlights and special elements', default: 'amber-500' },
    { id: 'textColor', label: 'Text Color', default: 'gray-800' },
    { id: 'headingColor', label: 'Heading Color', default: 'gray-900' },
    { id: 'linkColor', label: 'Link Color', default: 'blue-600' },
    { id: 'linkHoverColor', label: 'Link Hover Color', default: 'blue-700' },
    { id: 'saleColor', label: 'Sale Price Color', default: 'red-600' },
    { id: 'starColor', label: 'Rating Star Color', default: 'yellow-400' },
    { id: 'headerBgColor', label: 'Header Background', default: 'white' },
    { id: 'footerBgColor', label: 'Footer Background', default: 'gray-900' },
    { id: 'footerTextColor', label: 'Footer Text', default: 'white' },
  ];
  
  // Font family options
  const fontFamilySettings: FontSetting[] = [
    {
      id: 'fontFamily',
      label: 'Body Font',
      options: [
        { value: 'sans', label: 'Sans-serif (Modern)' },
        { value: 'serif', label: 'Serif (Traditional)' },
        { value: 'mono', label: 'Monospace (Technical)' },
        { value: 'inter', label: 'Inter' },
        { value: 'roboto', label: 'Roboto' },
        { value: 'lato', label: 'Lato' },
        { value: 'opensans', label: 'Open Sans' },
        { value: 'montserrat', label: 'Montserrat' },
      ],
    },
    {
      id: 'headingFontFamily',
      label: 'Heading Font',
      options: [
        { value: 'sans', label: 'Sans-serif (Modern)' },
        { value: 'serif', label: 'Serif (Traditional)' },
        { value: 'mono', label: 'Monospace (Technical)' },
        { value: 'playfair', label: 'Playfair Display' },
        { value: 'merriweather', label: 'Merriweather' },
        { value: 'raleway', label: 'Raleway' },
        { value: 'poppins', label: 'Poppins' },
        { value: 'oswald', label: 'Oswald' },
      ],
    },
  ];
  
  // Border radius options
  const borderRadiusSettings: BorderRadiusSetting[] = [
    {
      id: 'buttonBorderRadius',
      label: 'Button Corners',
      options: [
        { value: 'rounded-none', label: 'Square' },
        { value: 'rounded-sm', label: 'Slightly Rounded' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'rounded-lg', label: 'More Rounded' },
        { value: 'rounded-xl', label: 'Very Rounded' },
        { value: 'rounded-full', label: 'Full/Pill' },
      ],
    },
    {
      id: 'cardBorderRadius',
      label: 'Card Corners',
      options: [
        { value: 'rounded-none', label: 'Square' },
        { value: 'rounded-sm', label: 'Slightly Rounded' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'rounded-lg', label: 'More Rounded' },
        { value: 'rounded-xl', label: 'Very Rounded' },
      ],
    },
  ];
  
  // Load site data
  useEffect(() => {
    if (siteId && (!currentSite || currentSite.id !== siteId)) {
      dispatch(getSiteById(siteId));
    }
  }, [dispatch, siteId, currentSite]);
  
  // Load theme data
  useEffect(() => {
    if (siteId) {
      dispatch(getDefaultTheme(siteId));
    }
  }, [dispatch, siteId]);
  
  // Update local theme state when the theme data loads
  useEffect(() => {
    if (themeState.currentTheme) {
      setTheme(prevTheme => ({
        ...prevTheme,
        ...themeState.currentTheme,
      }));
      setThemeName(themeState.currentTheme.name || 'Default Theme');
    }
  }, [themeState.currentTheme]);
  
  // Show success message when theme is updated
  useEffect(() => {
    if (themeState.isSuccess) {
      setShowSaveSuccess(true);
      const timer = setTimeout(() => setShowSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [themeState.isSuccess]);
  
  // Handle color change
  const handleColorChange = (id: string, value: string): void => {
    setTheme(prevTheme => ({
      ...prevTheme,
      [id]: value,
    }));
  };
  
  // Handle font family change
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setTheme(prevTheme => ({
      ...prevTheme,
      [name]: value,
    }));
  };
  
  // Handle border radius change
  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setTheme(prevTheme => ({
      ...prevTheme,
      [name]: value,
    }));
  };
  
  // Handle custom CSS change
  const handleCustomCSSChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTheme(prevTheme => ({
      ...prevTheme,
      customCSS: e.target.value,
    }));
  };
  
  // Handle tab change
  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
  };
  
  // Handle preview breakpoint change
  const handleBreakpointChange = (breakpoint: Breakpoint): void => {
    setPreviewBreakpoint(breakpoint);
  };
  
  // Handle save theme
  const handleSaveTheme = (): void => {
    if (theme.id && siteId) {
      dispatch(updateTheme({ 
        themeId: theme.id, 
        themeData: theme 
      }));
    }
  };
  
  // Handle reset theme to defaults
  const handleResetTheme = (): void => {
    setTheme({
      ...theme,
      primaryColor: 'blue-600',
      primaryColorDark: 'blue-700',
      secondaryColor: 'purple-600',
      secondaryColorDark: 'purple-700',
      accentColor: 'amber-500',
      textColor: 'gray-800',
      headingColor: 'gray-900',
      linkColor: 'blue-600',
      linkHoverColor: 'blue-700',
      labelColor: 'gray-700',
      buttonTextColor: 'white',
      iconColor: 'currentColor',
      saleColor: 'red-600',
      starColor: 'yellow-400',
      headerBgColor: 'white',
      footerBgColor: 'gray-900',
      footerTextColor: 'white',
      fontFamily: 'sans',
      headingFontFamily: 'sans',
      buttonBorderRadius: 'rounded',
      cardBorderRadius: 'rounded',
      customCSS: '',
    });
    
    setShowResetConfirm(false);
  };
  
  // Handle create new theme
  const handleCreateTheme = (): void => {
    if (newThemeName.trim() && theme.id) {
      dispatch(cloneTheme({ 
        themeId: theme.id, 
        name: newThemeName 
      }));
      setShowCreateThemeModal(false);
      setNewThemeName('');
    }
  };
  
  // Get preview style based on breakpoint
  const getPreviewStyle = (): React.CSSProperties => {
    switch (previewBreakpoint) {
      case 'desktop':
        return { width: '100%', maxWidth: '1200px' };
      case 'tablet':
        return { width: '768px' };
      case 'mobile':
        return { width: '375px' };
      default:
        return { width: '100%' };
    }
  };
  
  // Get font family display name
  const getFontFamilyDisplayName = (value: string): string => {
    const allFontOptions = [
      ...fontFamilySettings[0].options,
      ...fontFamilySettings[1].options.filter(
        opt => !fontFamilySettings[0].options.find(o => o.value === opt.value)
      )
    ];
    
    const fontOption = allFontOptions.find(opt => opt.value === value);
    return fontOption ? fontOption.label : value;
  };
  
  // Get border radius display name
  const getBorderRadiusDisplayName = (id: string, value: string): string => {
    const setting = borderRadiusSettings.find(s => s.id === id);
    if (!setting) return value;
    
    const option = setting.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };
  
  // Render preview content based on active tab
  const renderPreviewContent = (): JSX.Element => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="space-y-8">
            {/* Header Preview */}
            <div className={`bg-${theme.headerBgColor} p-4 shadow`}>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">Store Name</div>
                <div className="flex space-x-4">
                  <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} px-4 py-2 ${theme.buttonBorderRadius}`}>
                    Sign In
                  </button>
                  <button className={`bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-${theme.buttonTextColor} px-4 py-2 ${theme.buttonBorderRadius}`}>
                    Cart (0)
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content Preview */}
            <div>
              <h1 className={`text-${theme.headingColor} text-2xl font-semibold mb-2 font-${theme.headingFontFamily}`}>
                Welcome to Our Store
              </h1>
              <p className={`text-${theme.textColor} mb-4 font-${theme.fontFamily}`}>
                This is a preview of your site's color scheme. The text you're reading now uses your body text color.
              </p>
              <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-${theme.fontFamily}`}>
                This is a link
              </a>
              
              <div className="mt-6 flex space-x-4">
                <div className={`p-6 border ${theme.cardBorderRadius} shadow-sm`}>
                  <div className={`text-${theme.headingColor} font-${theme.headingFontFamily} font-medium mb-2`}>
                    Product Item
                  </div>
                  <div className={`text-${theme.textColor} font-${theme.fontFamily} mb-2`}>
                    Product description goes here
                  </div>
                  <div className={`text-${theme.saleColor} font-medium mb-3`}>$99.99</div>
                  <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} px-4 py-2 ${theme.buttonBorderRadius} w-full`}>
                    Add to Cart
                  </button>
                </div>
                
                <div className={`p-6 border ${theme.cardBorderRadius} shadow-sm`}>
                  <div className={`text-${theme.headingColor} font-${theme.headingFontFamily} font-medium mb-2`}>
                    Featured Item
                  </div>
                  <div className={`text-${theme.textColor} font-${theme.fontFamily} mb-2`}>
                    Another product description
                  </div>
                  <div className={`text-${theme.saleColor} font-medium mb-3`}>$149.99</div>
                  <button className={`bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-${theme.buttonTextColor} px-4 py-2 ${theme.buttonBorderRadius} w-full`}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer Preview */}
            <div className={`bg-${theme.footerBgColor} text-${theme.footerTextColor} p-4 mt-6`}>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-2">Company</h3>
                  <ul className="space-y-1">
                    <li><a href="#" className="hover:underline">About</a></li>
                    <li><a href="#" className="hover:underline">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Legal</h3>
                  <ul className="space-y-1">
                    <li><a href="#" className="hover:underline">Privacy</a></li>
                    <li><a href="#" className="hover:underline">Terms</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                &copy; 2025 Your Store. All rights reserved.
              </div>
            </div>
          </div>
        );
        
      case 'typography':
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold text-${theme.headingColor} font-${theme.headingFontFamily} mb-4`}>
                Heading 1 - Main Title
              </h1>
              <h2 className={`text-3xl font-semibold text-${theme.headingColor} font-${theme.headingFontFamily} mb-3`}>
                Heading 2 - Section Title
              </h2>
              <h3 className={`text-2xl font-medium text-${theme.headingColor} font-${theme.headingFontFamily} mb-3`}>
                Heading 3 - Subsection Title
              </h3>
              <h4 className={`text-xl font-medium text-${theme.headingColor} font-${theme.headingFontFamily} mb-3`}>
                Heading 4 - Card Title
              </h4>
              <h5 className={`text-lg font-medium text-${theme.headingColor} font-${theme.headingFontFamily} mb-3`}>
                Heading 5 - Small Section
              </h5>
              <h6 className={`text-base font-medium text-${theme.headingColor} font-${theme.headingFontFamily} mb-3`}>
                Heading 6 - Minor Heading
              </h6>
            </div>
            
            <div className={`text-${theme.textColor} font-${theme.fontFamily} space-y-4`}>
              <p className="text-base">
                This is a paragraph of text that demonstrates the body text styling. 
                The font family is set to {getFontFamilyDisplayName(theme.fontFamily)}. 
                The text color is applied based on your selection.
              </p>
              
              <p className="text-base">
                Links appear like <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor}`}>this</a> and 
                will use your selected link colors.
              </p>
              
              <blockquote className="border-l-4 pl-4 italic">
                This is a blockquote that also inherits your typography settings.
              </blockquote>
              
              <div>
                <span className="font-bold">Bold text</span> and 
                <span className="italic ml-1">italic text</span> will maintain your font family selection.
              </div>
              
              <div className="text-sm">
                Smaller text like this will still use your selected font family.
              </div>
            </div>
          </div>
        );
        
      case 'layout':
        return (
          <div className="space-y-8">
            <div>
              <h2 className={`text-${theme.headingColor} text-xl font-medium mb-4`}>
                Button Styles
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} px-4 py-2 ${theme.buttonBorderRadius}`}>
                    Primary Button
                  </button>
                  
                  <button className={`bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-${theme.buttonTextColor} px-4 py-2 ${theme.buttonBorderRadius}`}>
                    Secondary Button
                  </button>
                  
                  <button className={`border border-${theme.primaryColor} text-${theme.primaryColor} hover:bg-${theme.primaryColor} hover:text-white px-4 py-2 ${theme.buttonBorderRadius}`}>
                    Outline Button
                  </button>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Button corner style: {getBorderRadiusDisplayName('buttonBorderRadius', theme.buttonBorderRadius)}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className={`text-${theme.headingColor} text-xl font-medium mb-4`}>
                Card Styles
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div className={`border ${theme.cardBorderRadius} shadow-sm p-4`}>
                  <h3 className={`text-${theme.headingColor} font-medium mb-2`}>Card Title</h3>
                  <p className={`text-${theme.textColor} text-sm mb-4`}>
                    This is a product card using your selected border radius style.
                  </p>
                  <div className="mt-auto">
                    <button className={`bg-${theme.primaryColor} text-${theme.buttonTextColor} w-full py-1 ${theme.buttonBorderRadius}`}>
                      Action
                    </button>
                  </div>
                </div>
                
                <div className={`border ${theme.cardBorderRadius} shadow-sm p-4`}>
                  <h3 className={`text-${theme.headingColor} font-medium mb-2`}>Feature Card</h3>
                  <p className={`text-${theme.textColor} text-sm mb-4`}>
                    Another example card with the same border radius.
                  </p>
                  <div className="mt-auto">
                    <button className={`bg-${theme.secondaryColor} text-${theme.buttonTextColor} w-full py-1 ${theme.buttonBorderRadius}`}>
                      Learn More
                    </button>
                  </div>
                </div>
                
                <div className={`border ${theme.cardBorderRadius} shadow-sm p-4`}>
                  <h3 className={`text-${theme.headingColor} font-medium mb-2`}>Info Card</h3>
                  <p className={`text-${theme.textColor} text-sm mb-4`}>
                    A third example showing your card styling.
                  </p>
                  <div className="mt-auto">
                    <button className={`border border-${theme.primaryColor} text-${theme.primaryColor} w-full py-1 ${theme.buttonBorderRadius}`}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Card corner style: {getBorderRadiusDisplayName('cardBorderRadius', theme.cardBorderRadius)}
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'advanced':
        return (
          <div className="bg-white p-6 border rounded shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Custom CSS Preview</h2>
            <p className="text-sm text-gray-500 mb-6">
              This panel shows a preview of your custom CSS. Any styles you add will affect the live site,
              but are not reflected in this preview.
            </p>
            
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {theme.customCSS || '/* No custom CSS added yet */'}
              </pre>
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab to preview theme settings</div>;
    }
  };
  
  if (themeState.isLoading && !themeState.currentTheme) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (themeState.isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{themeState.message || 'Failed to load theme data. Please try again.'}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => dispatch(getDefaultTheme(siteId))}
                  className="text-sm font-medium text-red-800 hover:text-red-700"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Theme Editor Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Theme Editor: {themeName}
            </h1>
            {theme.isDefault && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Default
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Reset to Defaults
            </button>
            
            <button
              type="button"
              onClick={() => setShowCreateThemeModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
              Save as New
            </button>
            
            <button
              type="button"
              onClick={handleSaveTheme}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Save Changes
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => handleTabChange(tab.id)}
              >
                <tab.icon className={`h-5 w-5 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Settings */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* Colors Tab Content */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Color Settings</h2>
                
                {colorSettings.map((color) => (
                  <div key={color.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor={color.id} className="block text-sm font-medium text-gray-700">
                        {color.label}
                      </label>
                      <div className="flex items-center">
                        <div 
                          className={`h-5 w-5 rounded mr-2 border border-gray-300 bg-${theme[color.id as keyof ThemeSettings] as string}`}
                        ></div>
                        <select
                          id={color.id}
                          value={theme[color.id as keyof ThemeSettings] as string}
                          onChange={(e) => handleColorChange(color.id, e.target.value)}
                          className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <optgroup label="Gray">
                            <option value="gray-50">Gray 50</option>
                            <option value="gray-100">Gray 100</option>
                            <option value="gray-200">Gray 200</option>
                            <option value="gray-300">Gray 300</option>
                            <option value="gray-400">Gray 400</option>
                            <option value="gray-500">Gray 500</option>
                            <option value="gray-600">Gray 600</option>
                            <option value="gray-700">Gray 700</option>
                            <option value="gray-800">Gray 800</option>
                            <option value="gray-900">Gray 900</option>
                          </optgroup>
                          <optgroup label="Red">
                            <option value="red-400">Red 400</option>
                            <option value="red-500">Red 500</option>
                            <option value="red-600">Red 600</option>
                            <option value="red-700">Red 700</option>
                          </optgroup>
                          <optgroup label="Blue">
                            <option value="blue-400">Blue 400</option>
                            <option value="blue-500">Blue 500</option>
                            <option value="blue-600">Blue 600</option>
                            <option value="blue-700">Blue 700</option>
                          </optgroup>
                          <optgroup label="Green">
                            <option value="green-400">Green 400</option>
                            <option value="green-500">Green 500</option>
                            <option value="green-600">Green 600</option>
                            <option value="green-700">Green 700</option>
                          </optgroup>
                          <optgroup label="Purple">
                            <option value="purple-400">Purple 400</option>
                            <option value="purple-500">Purple 500</option>
                            <option value="purple-600">Purple 600</option>
                            <option value="purple-700">Purple 700</option>
                          </optgroup>
                          <optgroup label="Yellow">
                            <option value="yellow-300">Yellow 300</option>
                            <option value="yellow-400">Yellow 400</option>
                            <option value="yellow-500">Yellow 500</option>
                          </optgroup>
                          <optgroup label="Amber">
                            <option value="amber-400">Amber 400</option>
                            <option value="amber-500">Amber 500</option>
                            <option value="amber-600">Amber 600</option>
                          </optgroup>
                          <optgroup label="Other">
                            <option value="pink-500">Pink 500</option>
                            <option value="indigo-500">Indigo 500</option>
                            <option value="teal-500">Teal 500</option>
                            <option value="orange-500">Orange 500</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                    {color.description && (
                      <p className="text-xs text-gray-500">{color.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Typography Tab Content */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Typography Settings</h2>
                
                {fontFamilySettings.map((font) => (
                  <div key={font.id} className="space-y-2">
                    <label htmlFor={font.id} className="block text-sm font-medium text-gray-700">
                      {font.label}
                    </label>
                    <select
                      id={font.id}
                      name={font.id}
                      value={theme[font.id as keyof ThemeSettings] as string}
                      onChange={handleFontFamilyChange}
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {font.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {font.description && (
                      <p className="text-xs text-gray-500">{font.description}</p>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Font Preview</h3>
                  
                  <div className="space-y-4">
                    <div className={`p-3 border rounded-md bg-gray-50 font-${theme.headingFontFamily}`}>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Heading Font</h4>
                      <p className="text-lg">
                        {getFontFamilyDisplayName(theme.headingFontFamily)}
                      </p>
                      <p className="text-sm text-gray-500">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                      <p className="text-sm text-gray-500">abcdefghijklmnopqrstuvwxyz</p>
                      <p className="text-sm text-gray-500">0123456789</p>
                    </div>
                    
                    <div className={`p-3 border rounded-md bg-gray-50 font-${theme.fontFamily}`}>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Body Font</h4>
                      <p className="text-lg">
                        {getFontFamilyDisplayName(theme.fontFamily)}
                      </p>
                      <p className="text-sm text-gray-500">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                      <p className="text-sm text-gray-500">abcdefghijklmnopqrstuvwxyz</p>
                      <p className="text-sm text-gray-500">0123456789</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Layout Tab Content */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Layout & UI Settings</h2>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Border Radius</h3>
                  
                  {borderRadiusSettings.map((setting) => (
                    <div key={setting.id} className="space-y-2">
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <select
                        id={setting.id}
                        name={setting.id}
                        value={theme[setting.id as keyof ThemeSettings] as string}
                        onChange={handleBorderRadiusChange}
                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {setting.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Advanced Tab Content */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Advanced Settings</h2>
                
                <div className="space-y-2">
                  <label htmlFor="customCSS" className="block text-sm font-medium text-gray-700">
                    Custom CSS
                  </label>
                  <textarea
                    id="customCSS"
                    name="customCSS"
                    rows={15}
                    value={theme.customCSS}
                    onChange={handleCustomCSSChange}
                    className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="/* Add your custom CSS here */"
                  />
                  <p className="text-xs text-gray-500">
                    Advanced users can add custom CSS styles here. These styles will be applied to your site.
                    Use with caution as this can override theme settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleBreakpointChange('desktop')}
                  className={`p-2 rounded ${
                    previewBreakpoint === 'desktop'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <ComputerDesktopIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleBreakpointChange('tablet')}
                  className={`p-2 rounded ${
                    previewBreakpoint === 'tablet'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <DeviceTabletIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleBreakpointChange('mobile')}
                  className={`p-2 rounded ${
                    previewBreakpoint === 'mobile'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <DevicePhoneMobileIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div
                className="bg-white shadow rounded overflow-hidden transition-all duration-300"
                style={getPreviewStyle()}
              >
                {renderPreviewContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Reset to Defaults
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to reset all theme settings to default values?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleResetTheme}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reset to Defaults
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Theme Modal */}
      {showCreateThemeModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DocumentDuplicateIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Save as New Theme
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        This will create a copy of your current theme with a new name.
                        The original theme will remain unchanged.
                      </p>
                      <div>
                        <label htmlFor="new-theme-name" className="block text-sm font-medium text-gray-700">
                          New Theme Name
                        </label>
                        <input
                          type="text"
                          id="new-theme-name"
                          value={newThemeName}
                          onChange={(e) => setNewThemeName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter a name for your new theme"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateTheme}
                  disabled={!newThemeName.trim()}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                    newThemeName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Create Theme
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateThemeModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Success Toast */}
      {showSaveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Theme settings saved successfully!
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setShowSaveSuccess(false)}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeEditor;