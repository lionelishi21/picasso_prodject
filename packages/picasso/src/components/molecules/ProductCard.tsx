/**
 * ProductCard.js
 * Card displaying product information in grids and lists
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import ProductPrice from './ProductPrice';
import RatingDisplay from './RatingDisplay';
import Badge from '../atoms/Badge';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({
  product,
  showRating = true,
  showAddToCart = true,
  onAddToCart,
  layout = 'vertical',
  cardStyle = {},
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  if (!product) return null;
  
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    rating,
    reviewCount,
    isOnSale,
    isNew,
    isFeatured,
    isOutOfStock,
    categoryName,
    slug
  } = product;
  
  // Generate product URL
  const productUrl = slug ? `/product/${slug}` : `/product/${id}`;
  
  // Determine if the card is horizontal (image beside text) or vertical (image above text)
  const isHorizontal = layout === 'horizontal';
  
  return (
    <div 
      className={`
        group
        border
        border-gray-200
        rounded-lg
        overflow-hidden
        transition-shadow
        duration-300
        hover:shadow-lg
        ${isHorizontal ? 'flex' : 'flex-col'}
        ${className}
      `}
      style={cardStyle}
      {...props}
    >
      {/* Product Image */}
      <Link
        to={productUrl}
        className={`
          relative
          block
          ${isHorizontal ? 'w-1/3' : 'w-full'}
          overflow-hidden
        `}
      >
        <Image
          src={image}
          alt={name}
          className={`
            w-full
            h-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-105
            ${isOutOfStock ? 'opacity-70' : ''}
          `}
        />
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
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
          
          {isFeatured && (
            <Badge
              text="Featured"
              variant="secondary"
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
      </Link>
      
      {/* Product Info */}
      <div 
        className={`
          p-4 
          flex 
          flex-col 
          ${isHorizontal ? 'w-2/3' : 'w-full'}
        `}
      >
        {categoryName && (
          <Text
            text={categoryName}
            type="span"
            className="text-sm text-gray-500 mb-1"
          />
        )}
        
        <Link to={productUrl} className="group-hover:underline">
          <Text
            text={name}
            type="h3"
            weight="medium"
            className="mb-2 line-clamp-2"
          />
        </Link>
        
        {/* Price */}
        <ProductPrice
          price={price}
          originalPrice={originalPrice}
          showDiscountPercentage={isOnSale}
          className="mb-2"
        />
        
        {/* Rating */}
        {showRating && typeof rating !== 'undefined' && (
          <RatingDisplay
            rating={rating}
            showCount={true}
            reviewCount={reviewCount}
            size="small"
            className="mb-2"
          />
        )}
        
        {/* Add to Cart button */}
        {showAddToCart && (
          <div className="mt-auto pt-2">
            <Button
              text="Add to Cart"
              icon={<Icon name="cart" size="small" />}
              onClick={e => {
                e.preventDefault();
                if (onAddToCart && !isOutOfStock) {
                  onAddToCart(product);
                }
              }}
              disabled={isOutOfStock}
              variant={isOutOfStock ? 'outline' : 'primary'}
              fullWidth
            />
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reviewCount: PropTypes.number,
    isOnSale: PropTypes.bool,
    isNew: PropTypes.bool,
    isFeatured: PropTypes.bool,
    isOutOfStock: PropTypes.bool,
    categoryName: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  showRating: PropTypes.bool,
  showAddToCart: PropTypes.bool,
  onAddToCart: PropTypes.func,
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
  cardStyle: PropTypes.object,
  className: PropTypes.string,
};

export default ProductCard;