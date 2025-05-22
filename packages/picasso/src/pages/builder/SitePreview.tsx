/**
 * SitePreview.tsx
 * Component for previewing the site with applied theme settings
 */
import React from 'react';

// Icons (using same icon package as ThemeEditor)
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon as SearchIcon,
  HeartIcon,
  StarIcon,
  Bars3Icon as MenuIcon,
} from '@heroicons/react/24/outline';

// TypeScript interface for theme settings (matching the one from ThemeEditor)
interface ThemeSettings {
  id?: string;
  name: string;
  
  // Color palette
  primaryColor: string;
  primaryColorDark: string;
  secondaryColor: string;
  secondaryColorDark: string;
  accentColor: string;
  
  // Text colors
  textColor: string;
  headingColor: string;
  linkColor: string;
  linkHoverColor: string;
  labelColor: string;
  
  // UI colors
  buttonTextColor: string;
  iconColor: string;
  saleColor: string;
  starColor: string;
  
  // Header and footer
  headerBgColor: string;
  footerBgColor: string;
  footerTextColor: string;
  
  // Typography
  fontFamily: string;
  headingFontFamily: string;
  
  // Button styles
  buttonBorderRadius: string;
  
  // Card styles
  cardBorderRadius: string;
  
  // Custom CSS
  customCSS: string;
  
  // Is this the default theme?
  isDefault?: boolean;
}

interface SitePreviewProps {
  theme: ThemeSettings;
  breakpoint: 'desktop' | 'tablet' | 'mobile';
}

const SitePreview: React.FC<SitePreviewProps> = ({ theme, breakpoint }) => {
  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'Immerse yourself in high-quality audio with these comfortable over-ear headphones.',
      price: 199.99,
      salePrice: 149.99,
      rating: 4.5,
      image: '/headphones.jpg'
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      description: 'Track your fitness, receive notifications, and more with this sleek smartwatch.',
      price: 299.99,
      salePrice: null,
      rating: 4.8,
      image: '/smartwatch.jpg'
    },
    {
      id: 3,
      name: 'Portable Power Bank',
      description: 'Keep your devices charged on the go with this high-capacity power bank.',
      price: 49.99,
      salePrice: 39.99,
      rating: 4.2,
      image: '/powerbank.jpg'
    },
    {
      id: 4,
      name: 'Wireless Earbuds Pro',
      description: 'Experience crystal clear audio with noise cancellation technology.',
      price: 129.99,
      salePrice: null,
      rating: 4.7,
      image: '/earbuds.jpg'
    }
  ];

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className={`h-5 w-5 text-${theme.starColor} fill-current`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className={`h-5 w-5 text-${theme.starColor} fill-current`} />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  // Responsive styles based on breakpoint
  const containerStyle: React.CSSProperties = {
    width: 
      breakpoint === 'desktop' ? '100%' :
      breakpoint === 'tablet' ? '768px' : '375px',
    margin: '0 auto',
    transition: 'width 0.3s ease',
  };

  // Layout adjustments based on breakpoint
  const isDesktop = breakpoint === 'desktop';
  const isTablet = breakpoint === 'tablet';
  const isMobile = breakpoint === 'mobile';

  return (
    <div style={containerStyle} className="overflow-hidden">
      {/* Header */}
      <header className={`bg-${theme.headerBgColor} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo & Navigation */}
            <div className="flex items-center">
              <div className={`text-${theme.headingColor} text-xl font-bold font-${theme.headingFontFamily}`}>
                YourStore
              </div>
              
              {(isDesktop || isTablet) && (
                <nav className="ml-10 flex space-x-8">
                  <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium font-${theme.fontFamily}`}>
                    Home
                  </a>
                  <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium font-${theme.fontFamily}`}>
                    Products
                  </a>
                  <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium font-${theme.fontFamily}`}>
                    Collections
                  </a>
                  <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium font-${theme.fontFamily}`}>
                    About
                  </a>
                </nav>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isMobile ? (
                <>
                  <button className="text-gray-500 hover:text-gray-700">
                    <ShoppingCartIcon className="h-6 w-6" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MenuIcon className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <>
                  <button className="text-gray-500 hover:text-gray-700">
                    <SearchIcon className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <UserIcon className="h-5 w-5" />
                  </button>
                  <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-4 py-2 text-sm font-medium`}>
                    <div className="flex items-center">
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      <span>Cart (2)</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`bg-${theme.secondaryColor} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-${theme.buttonTextColor} text-4xl font-bold mb-4 font-${theme.headingFontFamily}`}>
            Summer Sale Now On
          </h1>
          <p className={`text-${theme.buttonTextColor} text-lg mb-8 max-w-3xl mx-auto font-${theme.fontFamily}`}>
            Get up to 40% off on our latest collection of premium electronics and accessories.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className={`bg-${theme.accentColor} hover:opacity-90 text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-8 py-3 text-base font-medium`}>
              Shop Now
            </button>
            <button className={`bg-transparent border border-${theme.buttonTextColor} text-${theme.buttonTextColor} hover:bg-white hover:bg-opacity-10 ${theme.buttonBorderRadius} px-8 py-3 text-base font-medium`}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-${theme.headingColor} text-3xl font-bold mb-8 font-${theme.headingFontFamily} text-center`}>
            Featured Products
          </h2>
          
          <div className={`grid grid-cols-1 ${isTablet ? 'grid-cols-2' : ''} ${isDesktop ? 'grid-cols-4' : ''} gap-6`}>
            {products.map((product) => (
              <div key={product.id} className={`border ${theme.cardBorderRadius} shadow-sm overflow-hidden`}>
                {/* Product Image Placeholder */}
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className={`text-${theme.textColor} text-sm font-${theme.fontFamily}`}>
                    Product Image
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-${theme.headingColor} font-medium font-${theme.headingFontFamily}`}>
                      {product.name}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className={`text-${theme.textColor} text-sm mt-2 font-${theme.fontFamily}`}>
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mt-2">
                    {renderStars(product.rating)}
                    <span className={`ml-1 text-sm text-${theme.textColor}`}>
                      ({product.rating})
                    </span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      {product.salePrice ? (
                        <>
                          <span className={`text-${theme.saleColor} font-medium`}>
                            ${product.salePrice.toFixed(2)}
                          </span>
                          <span className={`ml-2 text-${theme.textColor} text-sm line-through`}>
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className={`text-${theme.textColor} font-medium`}>
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-3 py-1 text-sm`}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`bg-${theme.accentColor} py-12 px-4 sm:px-6 lg:px-8 mt-12`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-${theme.buttonTextColor} text-3xl font-bold mb-4 font-${theme.headingFontFamily}`}>
            Subscribe to Our Newsletter
          </h2>
          <p className={`text-${theme.buttonTextColor} mb-6 max-w-2xl mx-auto font-${theme.fontFamily}`}>
            Stay updated with our latest products, promotions, and tech news.
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-grow px-4 py-3 ${theme.buttonBorderRadius} border-2 border-transparent focus:outline-none focus:border-${theme.primaryColor}`}
            />
            <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-6 py-3 font-medium`}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-${theme.footerBgColor} text-${theme.footerTextColor} mt-12 py-8 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 ${isTablet || isDesktop ? 'md:grid-cols-4' : ''} gap-8`}>
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                YourStore
              </h3>
              <p className={`text-sm font-${theme.fontFamily}`}>
                Bringing you the latest and greatest tech products since 2023.
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                Shop
              </h3>
              <ul className={`space-y-2 text-sm font-${theme.fontFamily}`}>
                <li><a href="#" className="hover:underline">All Products</a></li>
                <li><a href="#" className="hover:underline">New Arrivals</a></li>
                <li><a href="#" className="hover:underline">Best Sellers</a></li>
                <li><a href="#" className="hover:underline">On Sale</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                Support
              </h3>
              <ul className={`space-y-2 text-sm font-${theme.fontFamily}`}>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">Shipping Policy</a></li>
                <li><a href="#" className="hover:underline">Returns & Exchanges</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                Connect
              </h3>
              <ul className={`space-y-2 text-sm font-${theme.fontFamily}`}>
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className={`text-sm font-${theme.fontFamily}`}>
              &copy; 2025 YourStore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SitePreview;