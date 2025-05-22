/**
 * Image.js
 * Responsive image component with lazy loading
 */
import React from 'react';
import PropTypes from 'prop-types';

const Image = ({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  rounded = false,
  className = '',
  ...props
}) => {
  const imageClasses = `
    ${width ? `w-${width}` : 'w-full'}
    ${height ? `h-${height}` : 'h-auto'}
    object-${objectFit}
    ${rounded ? 'rounded' : ''}
    ${className}
  `;
  
  return (
    <img
      src={src}
      alt={alt || ''}
      className={imageClasses}
      loading="lazy"
      {...props}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  rounded: PropTypes.bool,
  className: PropTypes.string,
};

export default Image;