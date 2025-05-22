/**
 * Text.js
 * Component for displaying text elements (headings, paragraphs, etc.)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const Text = ({
  text,
  type = 'p',
  color,
  size,
  weight = 'normal',
  align = 'left',
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Get font size based on type or explicit size
  const getFontSize = () => {
    if (size) return size;
    
    switch (type) {
      case 'h1':
        return 'text-4xl md:text-5xl';
      case 'h2':
        return 'text-3xl md:text-4xl';
      case 'h3':
        return 'text-2xl md:text-3xl';
      case 'h4':
        return 'text-xl md:text-2xl';
      case 'h5':
        return 'text-lg md:text-xl';
      case 'h6':
        return 'text-base md:text-lg';
      case 'p':
      default:
        return 'text-base';
    }
  };
  
  // Get font weight
  const getFontWeight = () => {
    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  };
  
  const textColor = color || (type.startsWith('h') ? theme.headingColor : theme.textColor);
  
  const textClasses = `
    ${getFontSize()}
    ${getFontWeight()}
    text-${textColor}
    text-${align}
    font-${theme.fontFamily}
    ${className}
  `;
  
  const Component = type;
  
  return (
    <Component className={textClasses} {...props}>
      {text}
    </Component>
  );
};

Text.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']),
  color: PropTypes.string,
  size: PropTypes.string,
  weight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  className: PropTypes.string,
};

export default Text;