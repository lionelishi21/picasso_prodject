/**
 * ProductListingTemplate.js
 * Template for product listing page (category or search results)
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import Breadcrumb from '../molecules/Breadcrumb';
import ProductCardGrid from '../organisms/ProductCardGrid';
import Text from '../atoms/Text';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';
import Icon from '../atoms/Icon';
import { useTheme } from '../../context/ThemeContext';

const ProductListingTemplate = ({
  logo,
  menuItems,
  title = 'Products',
  products = [],
  categories = [],
  filters = [],
  sortOptions = [],
  breadcrumbItems = [],
  footerSections = [],
  socialLinks = [],
  onAddToCart,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // State for filters and sorting
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Default sort options if none provided
  const defaultSortOptions = sortOptions.length > 0 ? sortOptions : [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];
  
  // Handle filter change
  const handleFilterChange = (filterGroup, option, checked) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[filterGroup]) {
        newFilters[filterGroup] = [];
      }
      
      if (checked) {
        // Add the option if it's not already in the array
        if (!newFilters[filterGroup].includes(option)) {
          newFilters[filterGroup] = [...newFilters[filterGroup], option];
        }
      } else {
        // Remove the option
        newFilters[filterGroup] = newFilters[filterGroup].filter(item => item !== option);
        
        // Clean up empty filter groups
        if (newFilters[filterGroup].length === 0) {
          delete newFilters[filterGroup];
        }
      }
      
      return newFilters;
    });
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
  };
  
  // Toggle mobile filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
          
          {/* Page Title */}
          <Text text={title} type="h1" className="text-3xl font-bold mb-8" />
          
          {/* Product Filters and Grid */}
          <div className="flex flex-col lg:flex-row">
            {/* Filters Sidebar (desktop) */}
            <div className="hidden lg:block w-64 pr-8">
              <div className="sticky top-24">
                <Text text="Filters" type="h2" className="text-xl font-semibold mb-4" />
                
                {/* Clear Filters Button */}
                {Object.keys(activeFilters).length > 0 && (
                  <Button
                    text="Clear All Filters"
                    variant="text"
                    onClick={clearFilters}
                    className="mb-4 text-sm"
                  />
                )}
                
                {/* Filter Groups */}
                {filters.map((filter, index) => (
                  <div key={index} className="mb-6">
                    <Text text={filter.name} type="h3" className="font-medium mb-2" />
                    <div className="space-y-2">
                      {filter.options.map((option, optIndex) => (
                        <Checkbox
                          key={optIndex}
                          label={`${option.label} ${option.count ? `(${option.count})` : ''}`}
                          checked={activeFilters[filter.id]?.includes(option.value) || false}
                          onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Grid and Controls */}
            <div className="flex-1">
              {/* Sorting and Filter Controls */}
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  text="Filters"
                  variant="outline"
                  icon={<Icon name="filter" size="small" />}
                  onClick={toggleFilters}
                  className="lg:hidden"
                />
                
                {/* Results Count */}
                <Text text={`${products.length} Products`} type="span" className="text-gray-600" />
                
                {/* Sort Dropdown */}
                <div className="w-48">
                  <Select
                    options={defaultSortOptions}
                    value={sortOption}
                    onChange={handleSortChange}
                    placeholder="Sort by"
                  />
                </div>
              </div>
              
              {/* Mobile Filters (slide down when toggled) */}
              {showFilters && (
                <div className="lg:hidden mb-6 border rounded p-4 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <Text text="Filters" type="h2" className="text-xl font-semibold" />
                    <Button
                      text="Close"
                      variant="text"
                      icon={<Icon name="x" size="small" />}
                      onClick={toggleFilters}
                    />
                  </div>
                  
                  {/* Clear Filters Button */}
                  {Object.keys(activeFilters).length > 0 && (
                    <Button
                      text="Clear All Filters"
                      variant="text"
                      onClick={clearFilters}
                      className="mb-4 text-sm"
                    />
                  )}
                  
                  {/* Filter Groups */}
                  {filters.map((filter, index) => (
                    <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <Text text={filter.name} type="h3" className="font-medium mb-2" />
                      <div className="space-y-2">
                        {filter.options.map((option, optIndex) => (
                          <Checkbox
                            key={optIndex}
                            label={`${option.label} ${option.count ? `(${option.count})` : ''}`}
                            checked={activeFilters[filter.id]?.includes(option.value) || false}
                            onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Apply Filters Button */}
                  <Button
                    text="Apply Filters"
                    variant="primary"
                    onClick={toggleFilters}
                    fullWidth={true}
                  />
                </div>
              )}
              
              {/* Product Grid */}
              <ProductCardGrid
                products={products}
                columns={{ sm: 2, md: 3, lg: 3 }}
                onAddToCart={onAddToCart}
              />
              
              {/* Pagination (if needed) */}
              {/* Pagination component would go here */}
            </div>
          </div>
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

ProductListingTemplate.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  menuItems: PropTypes.array.isRequired,
  title: PropTypes.string,
  products: PropTypes.array.isRequired,
  categories: PropTypes.array,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          count: PropTypes.number,
        })
      ).isRequired,
    })
  ),
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  breadcrumbItems: PropTypes.array,
  footerSections: PropTypes.array.isRequired,
  socialLinks: PropTypes.array,
  onAddToCart: PropTypes.func,
  className: PropTypes.string,
};

export default ProductListingTemplate;