/**
 * ProductCard.js
 * Component for displaying a product in a grid or list
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import ProductPrice from '../molecules/ProductPrice';
import RatingDisplay from '../molecules/RatingDisplay';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({
  product,
  showRating = true,
  showAddToCart = true,
  layout = 'vertical',
  cardStyle = 'standard',
  onAddToCart,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  const { 
    id, 
    name, 
    price, 
    originalPrice, 
    image, 
    rating, 
    ratingCount,
    isOnSale,
    isNew,
    isOutOfStock,
    category,
  } = product;
  
  // Get card style classes
  const getCardStyleClasses = () => {
    switch (cardStyle) {
      case 'standard':
        return 'border border-gray-200 hover:shadow-lg';
      case 'shadow':
        return 'shadow-md hover:shadow-xl';
      case 'minimal':
        return 'hover:opacity-90';
      case 'border-primary':
        return `border-2 border-${theme.primaryColor} hover:shadow-lg`;
      default:
        return 'border border-gray-200 hover:shadow-lg';
    }
  };
  
  // Get layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col';
      case 'horizontal':
        return 'flex flex-row';
      default:
        return 'flex flex-col';
    }
  };
  
  const cardClasses = `
    rounded
    overflow-hidden
    transition-all
    duration-300
    bg-white
    ${getCardStyleClasses()}
    ${getLayoutClasses()}
    ${className}
  `;
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  
  return (
    <Link 
      to={`/product/${id}`} 
      className={cardClasses}
      {...props}
    >
      {/* Product Image Section */}
      <div className={`relative ${layout === 'horizontal' ? 'w-1/3' : 'w-full'}`}>
        <Image
          src={image}
          alt={name}
          className="w-full h-auto object-cover aspect-square"
        />
        
        {/* Badges (Sale, New, etc.) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <Badge
              text="Sale"
              variant="danger"
              size="small"
            />
          )}
          {isNew && (
            <Badge
              text="New"
              variant="primary"
              size="small"
            />
          )}
          {isOutOfStock && (
            <Badge
              text="Out of Stock"
              variant="dark"
              size="small"
            />
          )}
        </div>
        
        {/* Quick Action Buttons - e.g., wishlist */}
        <div className="absolute top-2 right-2">
          <button
            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Wishlist action would go here
            }}
          >
            <Icon name="heart" size="small" color={theme.primaryColor} />
          </button>
        </div>
      </div>
      
      {/* Product Info Section */}
      <div className={`p-4 flex flex-col ${layout === 'horizontal' ? 'w-2/3' : 'w-full'}`}>
        {/* Category (optional) */}
        {category && (
          <Text
            text={category}
            type="span"
            className="text-xs text-gray-500 mb-1"
          />
        )}
        
        {/* Product Name */}
        <Text
          text={name}
          type="h3"
          className="font-medium mb-1 line-clamp-2"
        />
        
        {/* Rating */}
        {showRating && rating && (
          <RatingDisplay
            rating={rating}
            count={ratingCount}
            showCount={true}
            size="small"
            className="mb-2"
          />
        )}
        
        {/* Price */}
        <ProductPrice
          price={price}
          originalPrice={originalPrice}
          size="medium"
          className="mb-2"
        />
        
        {/* Add to Cart Button */}
        {showAddToCart && !isOutOfStock && (
          <Button
            text="Add to Cart"
            variant="primary"
            size="small"
            onClick={handleAddToCart}
            fullWidth={layout === 'vertical'}
            className="mt-auto"
          />
        )}
        
        {/* Out of Stock Message */}
        {isOutOfStock && (
          <Text
            text="Out of Stock"
            type="span"
            className="text-gray-500 mt-auto"
          />
        )}
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string.isRequired,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    isOnSale: PropTypes.bool,
    isNew: PropTypes.bool,
    isOutOfStock: PropTypes.bool,
    category: PropTypes.string,
  }).isRequired,
  showRating: PropTypes.bool,
  showAddToCart: PropTypes.bool,
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
  cardStyle: PropTypes.oneOf(['standard', 'shadow', 'minimal', 'border-primary']),
  onAddToCart: PropTypes.func,
  className: PropTypes.string,
};

export default ProductCard;