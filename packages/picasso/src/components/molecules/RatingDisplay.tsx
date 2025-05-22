/**
 * RatingDisplay.js
 * Displays star ratings with optional count
 */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import { useTheme } from '../../context/ThemeContext';

const RatingDisplay = ({
  rating,
  maxRating = 5,
  showCount = false,
  reviewCount,
  size = 'medium',
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Convert rating to a float and ensure it's within 0-maxRating
  const normalizedRating = Math.max(0, Math.min(parseFloat(rating) || 0, maxRating));
  
  // Determine the star sizes
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'medium';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };
  
  // Generate stars
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      // Determine if this star should be full, half, or empty
      let starType;
      
      if (i <= Math.floor(normalizedRating)) {
        starType = 'star-filled';
      } else if (i - 0.5 <= normalizedRating) {
        starType = 'star-half';
      } else {
        starType = 'star-empty';
      }
      
      stars.push(
        <Icon
          key={i}
          name="star"
          size={getStarSize()}
          color={starType === 'star-empty' ? 'gray-300' : theme.starColor || 'yellow-400'}
          className={`${i < maxRating ? 'mr-1' : ''}`}
          aria-hidden="true"
        />
      );
    }
    
    return stars;
  };
  
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <div className="flex">{renderStars()}</div>
      
      {showCount && reviewCount !== undefined && (
        <Text
          text={`(${reviewCount})`}
          type="span"
          className="ml-2 text-gray-600 text-sm"
        />
      )}
    </div>
  );
};

RatingDisplay.propTypes = {
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxRating: PropTypes.number,
  showCount: PropTypes.bool,
  reviewCount: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
};

export default RatingDisplay;