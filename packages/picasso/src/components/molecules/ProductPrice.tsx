/**
 * ProductPrice.js
 * Displays formatted product price with optional sale price
 */
import React from 'react';
import PropTypes from 'prop-types';
import Text from '../atoms/Text';
import { useTheme } from '../../context/ThemeContext';

const ProductPrice = ({
  price,
  originalPrice,
  currency = '$',
  size = 'medium',
  showDiscountPercentage = false,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Format price to always have 2 decimal places
  const formatPrice = (amount) => {
    return parseFloat(amount).toFixed(2);
  };
  
  // Calculate discount percentage if needed
  const getDiscountPercentage = () => {
    if (!originalPrice || originalPrice <= price) return null;
    
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return discount > 0 ? discount : null;
  };
  
  // Determine font size based on the size prop
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };
  
  const discountPercentage = getDiscountPercentage();
  const hasDiscount = !!discountPercentage;
  
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <Text
        text={`${currency}${formatPrice(price)}`}
        type="span"
        weight="bold"
        color={hasDiscount ? theme.saleColor || 'red-600' : theme.priceColor || 'gray-900'}
        className={`${getFontSize()} mr-2`}
      />
      
      {hasDiscount && originalPrice && (
        <Text
          text={`${currency}${formatPrice(originalPrice)}`}
          type="span"
          className={`${getFontSize()} text-gray-500 line-through mr-2`}
        />
      )}
      
      {hasDiscount && showDiscountPercentage && (
        <span className={`${getFontSize()} bg-${theme.saleColor || 'red-600'} text-white px-1.5 py-0.5 rounded-md text-xs font-medium`}>
          {`-${discountPercentage}%`}
        </span>
      )}
    </div>
  );
};

ProductPrice.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showDiscountPercentage: PropTypes.bool,
  className: PropTypes.string,
};

export default ProductPrice;