/**
 * HeroBanner.js
 * A large promotional banner with background image, text, and CTA
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import { useTheme } from '../../context/ThemeContext';

const HeroBanner = ({
  title,
  subtitle,
  backgroundImage,
  ctaText = 'Shop Now',
  ctaLink = '/products',
  textAlign = 'left',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  height = 'h-96 md:h-screen-1/2',
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Get text alignment classes
  const getTextAlignClasses = () => {
    switch (textAlign) {
      case 'left':
        return 'text-left items-start';
      case 'center':
        return 'text-center items-center';
      case 'right':
        return 'text-right items-end';
      default:
        return 'text-left items-start';
    }
  };
  
  const bannerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  const overlayStyle = {
    backgroundColor: overlayColor,
  };
  
  return (
    <div 
      className={`relative ${height} w-full overflow-hidden ${className}`}
      style={bannerStyle}
      {...props}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={overlayStyle}
      ></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 h-full">
        <div className={`flex flex-col justify-center ${getTextAlignClasses()} h-full relative z-10 max-w-lg`}>
          {/* Title */}
          {title && (
            <Text
              text={title}
              type="h1"
              color="white"
              className="font-bold mb-4 text-4xl md:text-5xl"
            />
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <Text
              text={subtitle}
              type="p"
              color="white"
              className="mb-6 text-lg md:text-xl"
            />
          )}
          
          {/* CTA Button */}
          {ctaText && ctaLink && (
            <Link to={ctaLink}>
              <Button
                text={ctaText}
                variant="primary"
                size="large"
                className="font-semibold shadow-lg hover:shadow-xl"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

HeroBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string.isRequired,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  overlayColor: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};

export default HeroBanner;