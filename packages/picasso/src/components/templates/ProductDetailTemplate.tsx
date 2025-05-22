/**
 * ProductDetailTemplate.js
 * Template for the product detail page
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import Breadcrumb from '../molecules/Breadcrumb';
import ProductCardGrid from '../organisms/ProductCardGrid';
import RatingDisplay from '../molecules/RatingDisplay';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Select from '../atoms/Select';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';
import ProductPrice from '../molecules/ProductPrice';
import { useTheme } from '../../context/ThemeContext';

const ImageGallery = ({ images = [], productName }) => {
  const [mainImage, setMainImage] = useState(images[0] || '');
  
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded border border-gray-200">
        <img 
          src={mainImage} 
          alt={productName} 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`w-20 h-20 border rounded overflow-hidden flex-shrink-0 ${
                img === mainImage ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setMainImage(img)}
            >
              <img src={img} alt={`${productName} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailTemplate = ({
  logo,
  menuItems,
  product,
  relatedProducts = [],
  breadcrumbItems = [],
  footerSections = [],
  socialLinks = [],
  onAddToCart,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Product data destructuring
  const {
    id,
    name,
    description,
    price,
    originalPrice,
    images = [],
    rating,
    ratingCount = 0,
    variants = [],
    options = [],
    stockStatus = 'in-stock', // 'in-stock', 'low-stock', 'out-of-stock'
    sku,
    brand,
    category,
    specifications = [],
    reviews = []
  } = product;
  
  // State for selected variants and quantity
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Handle option change
  const handleOptionChange = (optionId, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        quantity,
        selectedOptions
      });
    }
  };
  
  // Check if product is available to purchase
  const isAvailable = stockStatus !== 'out-of-stock';
  
  // Determine stock status badge
  const getStockBadge = () => {
    switch (stockStatus) {
      case 'in-stock':
        return <Badge text="In Stock" variant="success" size="small" />;
      case 'low-stock':
        return <Badge text="Low Stock" variant="warning" size="small" />;
      case 'out-of-stock':
        return <Badge text="Out of Stock" variant="danger" size="small" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${className}`} {...props}>
      {/* Header */}
      <Header
        logo={logo}
        menuItems={menuItems}
        showSearch={true}
        showCartIcon={true}
      />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumb items={breadcrumbItems} className="mb-6" />
          )}
          
          {/* Product Detail Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div>
              <ImageGallery images={images} productName={name} />
            </div>
            
            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Name */}
              <Text text={name} type="h1" className="text-3xl font-bold" />
              
              {/* Brand (if available) */}
              {brand && (
                <Text text={`Brand: ${brand}`} type="p" className="text-gray-600" />
              )}
              
              {/* Rating */}
              {rating && (
                <div className="flex items-center space-x-2">
                  <RatingDisplay rating={rating} count={ratingCount} showCount={true} />
                </div>
              )}
              
              {/* Price */}
              <div className="flex items-center space-x-4">
                <ProductPrice 
                  price={price} 
                  originalPrice={originalPrice} 
                  size="xlarge" 
                />
                {getStockBadge()}
              </div>
              
              {/* Short Description (if available) */}
              {description && (
                <Text 
                  text={typeof description === 'string' ? description.slice(0, 150) + (description.length > 150 ? '...' : '') : ''} 
                  type="p" 
                  className="text-gray-700" 
                />
              )}
              
              {/* Product Options */}
              {options.length > 0 && (
                <div className="space-y-4">
                  {options.map((option) => (
                    <div key={option.id}>
                      <Text text={option.name} type="h3" className="font-medium mb-2" />
                      
                      {/* Render different option selector based on type */}
                      {option.type === 'select' ? (
                        <Select
                          options={option.values.map(val => ({ 
                            value: val.id, 
                            label: val.name,
                            disabled: !val.available
                          }))}
                          value={selectedOptions[option.id] || ''}
                          onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          placeholder={`Select ${option.name}`}
                        />
                      ) : option.type === 'color' ? (
                        <div className="flex space-x-2">
                          {option.values.map((value) => (
                            <button
                              key={value.id}
                              className={`
                                w-10 h-10 rounded-full border-2 
                                ${selectedOptions[option.id] === value.id 
                                  ? `border-${theme.primaryColor}` 
                                  : 'border-gray-200'}
                                ${!value.available ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              style={{ backgroundColor: value.color }}
                              onClick={() => handleOptionChange(option.id, value.id)}
                              disabled={!value.available}
                              aria-label={value.name}
                              title={value.name}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => (
                            <button
                              key={value.id}
                              className={`
                                px-4 py-2 border rounded
                                ${selectedOptions[option.id] === value.id
                                  ? `bg-${theme.primaryColor} text-white border-${theme.primaryColor}`
                                  : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'}
                                ${!value.available ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              onClick={() => handleOptionChange(option.id, value.id)}
                              disabled={!value.available}
                            >
                              {value.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quantity Selector */}
              <div>
                <Text text="Quantity" type="h3" className="font-medium mb-2" />
                <div className="flex items-center border rounded w-32">
                  <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Icon name="minus" size="small" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-center"
                  />
                  <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Icon name="plus" size="small" />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="flex space-x-4">
                <Button
                  text="Add to Cart"
                  variant="primary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className="flex-grow"
                />
                
                {/* Wishlist Button */}
                <Button
                  text=""
                  variant="outline"
                  icon={<Icon name="heart" size="medium" />}
                  aria-label="Add to Wishlist"
                />
              </div>
              
              {/* SKU */}
              {sku && (
                <Text text={`SKU: ${sku}`} type="span" className="text-sm text-gray-500" />
              )}
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mb-12">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-3 px-6 font-medium mr-4 border-b-2 ${
                  activeTab === 'description' 
                    ? `border-${theme.primaryColor} text-${theme.primaryColor}` 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`py-3 px-6 font-medium mr-4 border-b-2 ${
                  activeTab === 'specifications' 
                    ? `border-${theme.primaryColor} text-${theme.primaryColor}` 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`py-3 px-6 font-medium mr-4 border-b-2 ${
                  activeTab === 'reviews' 
                    ? `border-${theme.primaryColor} text-${theme.primaryColor}` 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white p-6 rounded">
              {activeTab === 'description' && (
                <div>
                  <Text text="Product Description" type="h2" className="text-2xl font-semibold mb-4" />
                  <div className="prose max-w-none">
                    {typeof description === 'string' 
                      ? description.split('\n').map((para, idx) => (
                          <Text key={idx} text={para} type="p" className="mb-4" />
                        ))
                      : <Text text={description} type="p" />
                    }
                  </div>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <Text text="Product Specifications" type="h2" className="text-2xl font-semibold mb-4" />
                  {specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {specifications.map((spec, idx) => (
                        <div key={idx} className="flex">
                          <div className="w-1/3 font-medium text-gray-600">{spec.name}</div>
                          <div className="w-2/3">{spec.value}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text text="No specifications available for this product." type="p" />
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <Text text="Customer Reviews" type="h2" className="text-2xl font-semibold mb-4" />
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Text text={review.name} type="h4" className="font-medium" />
                              <div className="text-sm text-gray-500">{review.date}</div>
                            </div>
                            <RatingDisplay rating={review.rating} size="small" />
                          </div>
                          <Text text={review.comment} type="p" className="text-gray-700" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <Text text="No reviews yet!" type="p" className="mb-4" />
                      <Button text="Be the first to review" variant="outline" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <ProductCardGrid
                title="You May Also Like"
                products={relatedProducts}
                columns={{ sm: 2, md: 3, lg: 4 }}
                onAddToCart={onAddToCart}
              />
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer
        sections={footerSections}
        showNewsletter={true}
        socialLinks={socialLinks}
      />
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  productName: PropTypes.string.isRequired,
};

ProductDetailTemplate.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  menuItems: PropTypes.array.isRequired,
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    images: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    variants: PropTypes.array,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            available: PropTypes.bool,
            color: PropTypes.string,
          })
        ).isRequired,
      })
    ),
    stockStatus: PropTypes.string,
    sku: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.string,
    specifications: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  relatedProducts: PropTypes.array,
  breadcrumbItems: PropTypes.array,
  footerSections: PropTypes.array.isRequired,
  socialLinks: PropTypes.array,
  onAddToCart: PropTypes.func,
  className: PropTypes.string,
};

export default ProductDetailTemplate;