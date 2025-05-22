/**
 * Button.js
 * Basic button component that can be styled in different ways
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ 
  text, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  onClick, 
  disabled = false,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const theme = useTheme();
  
  // Get styles based on variant and theme
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-white`;
      case 'secondary':
        return `bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-white`;
      case 'outline':
        return `bg-transparent border border-${theme.primaryColor} text-${theme.primaryColor} hover:bg-${theme.primaryColor} hover:text-white`;
      case 'text':
        return `bg-transparent text-${theme.primaryColor} hover:underline`;
      default:
        return `bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-white`;
    }
  };
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-sm';
      case 'medium':
        return 'px-4 py-2';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };
  
  const buttonClasses = `
    ${getVariantStyles()}
    ${getSizeStyles()}
    ${fullWidth ? 'w-full' : ''}
    rounded font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor} focus:ring-opacity-50
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.element,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;