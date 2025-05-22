/**
 * Header.js
 * Main navigation header component for the storefront
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import SearchBar from '../molecules/SearchBar';
import { useTheme } from '../../context/ThemeContext';

const Header = ({
  logo,
  menuItems = [],
  showSearch = true,
  showCartIcon = true,
  cartCount = 0,
  onCartClick,
  sticky = true,
  backgroundColor,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll for sticky header
  useEffect(() => {
    if (!sticky) return;
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Handle search
  const handleSearch = (searchValue) => {
    // Navigate to search results page 
    // (This would typically be handled by a router)
    console.log('Search for:', searchValue);
    // For example: history.push(`/search?q=${encodeURIComponent(searchValue)}`);
  };
  
  // Determine background color and text color
  const bgColor = backgroundColor || theme.headerBgColor || 'white';
  const textColor = bgColor === 'white' ? 'gray-800' : 'white';
  
  const headerClasses = `
    w-full
    bg-${bgColor}
    text-${textColor}
    ${sticky ? 'sticky top-0 z-50' : ''}
    ${isScrolled ? 'shadow-md' : ''}
    transition-shadow
    duration-300
    ${className}
  `;
  
  return (
    <header className={headerClasses} {...props}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            {typeof logo === 'string' ? (
              <Image
                src={logo}
                alt="Store Logo"
                className="h-10 w-auto"
              />
            ) : (
              logo
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                className={`text-${textColor} hover:text-${theme.primaryColor} font-medium transition-colors duration-200`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Search, Cart, Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {showSearch && (
              <div className="hidden md:block w-64">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search products..."
                  withButton={true}
                />
              </div>
            )}
            
            {/* Cart Icon */}
            {showCartIcon && (
              <button
                className="relative p-2"
                onClick={onCartClick}
                aria-label="Shopping Cart"
              >
                <Icon 
                  name="cart" 
                  size="medium" 
                  color={textColor} 
                />
                {cartCount > 0 && (
                  <Badge
                    text={cartCount.toString()}
                    variant="primary"
                    size="small"
                    className="absolute -top-1 -right-1"
                  />
                )}
              </button>
            )}
            
            {/* Account Icon */}
            <Link to="/account" className="p-2" aria-label="Account">
              <Icon 
                name="user" 
                size="medium" 
                color={textColor}
              />
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <Icon 
                name={isMobileMenuOpen ? 'x' : 'menu'} 
                size="medium" 
                color={textColor}
              />
            </button>
          </div>
        </div>
        
        {/* Mobile Search (shown below header on mobile) */}
        {showSearch && (
          <div className="md:hidden py-2 pb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products..."
              withButton={true}
            />
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.url}
                    className="block py-2 px-4 hover:bg-gray-100 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

Header.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  showSearch: PropTypes.bool,
  showCartIcon: PropTypes.bool,
  cartCount: PropTypes.number,
  onCartClick: PropTypes.func,
  sticky: PropTypes.bool,
  backgroundColor: PropTypes.string,
  className: PropTypes.string,
};

export default Header;