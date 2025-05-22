/**
 * Breadcrumb.js
 * Navigation breadcrumb component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../atoms/Icon';

const Breadcrumb = ({
  items,
  separator = 'chevron-right',
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // If there are no items, don't render the component
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb" {...props}>
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Icon
                  name={separator}
                  size="small"
                  className="mx-2 text-gray-400"
                  aria-hidden="true"
                />
              )}
              
              {isLast ? (
                <span className={`font-medium text-${theme.primaryColor}`}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className={`text-gray-500 hover:text-${theme.primaryColor} hover:underline`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ).isRequired,
  separator: PropTypes.string,
  className: PropTypes.string,
};

export default Breadcrumb;