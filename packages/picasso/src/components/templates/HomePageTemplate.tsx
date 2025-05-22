/**
 * HomePageTemplate.js
 * Template for the home page
 */
import React from 'react';
import PropTypes from 'prop-types';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import HeroBanner from '../organisms/HeroBanner';
import ProductCardGrid from '../organisms/ProductCardGrid';

const HomePageTemplate = ({
  logo,
  menuItems,
  heroProps,
  featuredProducts = [],
  newArrivalsProducts = [],
  footerSections = [],
  socialLinks = [],
  onAddToCart,
  className = '',
  ...props
}) => {
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
        {/* Hero Banner */}
        {heroProps && (
          <HeroBanner {...heroProps} />
        )}
        
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="container mx-auto px-4 py-12">
            <ProductCardGrid
              title="Featured Products"
              products={featuredProducts}
              showViewMore={true}
              viewMoreLink="/products/featured"
              viewMoreText="View All Featured"
              onAddToCart={onAddToCart}
            />
          </div>
        )}
        
        {/* New Arrivals Section */}
        {newArrivalsProducts.length > 0 && (
          <div className="container mx-auto px-4 py-12 bg-gray-50">
            <ProductCardGrid
              title="New Arrivals"
              products={newArrivalsProducts}
              showViewMore={true}
              viewMoreLink="/products/new"
              viewMoreText="View All New Arrivals"
              onAddToCart={onAddToCart}
            />
          </div>
        )}
        
        {/* Additional sections could be added here */}
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

HomePageTemplate.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  menuItems: PropTypes.array.isRequired,
  heroProps: PropTypes.object.isRequired,
  featuredProducts: PropTypes.array,
  newArrivalsProducts: PropTypes.array,
  footerSections: PropTypes.array.isRequired,
  socialLinks: PropTypes.array,
  onAddToCart: PropTypes.func,
  className: PropTypes.string,
};

export default HomePageTemplate;