/**
 * Badge.js
 * Component for displaying badges, labels or small pieces of information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const Badge = ({
  text,
  variant = 'primary',
  size = 'medium',
  rounded = true,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Define variant-based styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `bg-${theme.primaryColor} text-white`;
      case 'secondary':
        return `bg-${theme.secondaryColor} text-white`;
      case 'success':
        return 'bg-green-500 text-white';
      case 'danger':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'light':
        return 'bg-gray-100 text-gray-800';
      case 'dark':
        return 'bg-gray-800 text-white';
      case 'outline-primary':
        return `border border-${theme.primaryColor} text-${theme.primaryColor}`;
      default:
        return `bg-${theme.primaryColor} text-white`;
    }
  };
  
  // Define size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'medium':
        return 'px-2.5 py-0.5 text-sm';
      case 'large':
        return 'px-3 py-1 text-base';
      default:
        return 'px-2.5 py-0.5 text-sm';
    }
  };
  
  const badgeClasses = `
    inline-flex
    items-center
    justify-center
    font-medium
    ${getVariantStyles()}
    ${getSizeStyles()}
    ${rounded ? 'rounded-full' : 'rounded'}
    ${className}
  `;
  
  return (
    <span className={badgeClasses} {...props}>
      {text}
    </span>
  );
};

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'outline-primary',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  rounded: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;