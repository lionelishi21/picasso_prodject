/**
 * ProductCardGrid.js
 * Grid layout for displaying product cards
 */
import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import { useTheme } from '../../context/ThemeContext';

const ProductCardGrid = ({
  title,
  products = [],
  columns = { sm: 2, md: 3, lg: 4 },
  showViewMore = false,
  viewMoreLink = '/products',
  viewMoreText = 'View More',
  onAddToCart,
  gridGap = 'gap-4',
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Empty state check
  if (products.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`} {...props}>
        <Text text="No products found" type="h3" />
      </div>
    );
  }
  
  // Generate responsive grid columns classes
  const getGridColumnsClasses = () => {
    return `
      grid-cols-1
      ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''}
      ${columns.md ? `md:grid-cols-${columns.md}` : ''}
      ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    `;
  };
  
  return (
    <div className={`w-full py-4 ${className}`} {...props}>
      {/* Section Title */}
      {title && (
        <div className="flex justify-between items-center mb-6">
          <Text 
            text={title} 
            type="h2" 
            className="font-bold"
          />
          
          {/* View More Link */}
          {showViewMore && (
            <Button
              text={viewMoreText}
              variant="text"
              as="link"
              to={viewMoreLink}
              className={`text-${theme.primaryColor}`}
            />
          )}
        </div>
      )}
      
      {/* Product Grid */}
      <div className={`grid ${getGridColumnsClasses()} ${gridGap}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

ProductCardGrid.propTypes = {
  title: PropTypes.string,
  products: PropTypes.array.isRequired,
  columns: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
  }),
  showViewMore: PropTypes.bool,
  viewMoreLink: PropTypes.string,
  viewMoreText: PropTypes.string,
  onAddToCart: PropTypes.func,
  gridGap: PropTypes.string,
  className: PropTypes.string,
};

export default ProductCardGrid;