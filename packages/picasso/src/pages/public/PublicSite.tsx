/**
 * PublicSite.tsx
 * Public-facing site component that renders the complete site with applied theme
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Icons
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon as SearchIcon,
  HeartIcon,
  StarIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ChevronDownIcon,
  PhoneIcon,
  MapPinIcon as LocationMarkerIcon,
} from '@heroicons/react/24/outline';

// TypeScript interfaces
interface RouteParams {
  siteId: string;
}

interface ThemeSettings {
  id: string;
  name: string;
  primaryColor: string;
  primaryColorDark: string;
  secondaryColor: string;
  secondaryColorDark: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  linkHoverColor: string;
  labelColor: string;
  buttonTextColor: string;
  iconColor: string;
  saleColor: string;
  starColor: string;
  headerBgColor: string;
  footerBgColor: string;
  footerTextColor: string;
  fontFamily: string;
  headingFontFamily: string;
  buttonBorderRadius: string;
  cardBorderRadius: string;
  customCSS: string;
  isDefault?: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  rating: number;
  image: string;
  category: string;
  featured?: boolean;
  inStock: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SiteData {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  theme: ThemeSettings;
  products: Product[];
  categories: Category[];
  featuredProducts: number[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroCTA?: string;
  heroBackgroundImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

const PublicSite: React.FC = () => {
  const { siteId } = useParams<RouteParams>();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch this from your API
        // const response = await axios.get(`/api/sites/${siteId}/public`);
        
        // For now, we'll simulate a response with mock data
        // In production, replace this with your actual API call
        setTimeout(() => {
          const mockData: SiteData = {
            id: siteId,
            name: "TechGadgets Store",
            logo: "/logo.png",
            description: "Your one-stop shop for premium electronics and accessories.",
            theme: {
              id: "theme1",
              name: "Default Theme",
              primaryColor: "blue-600",
              primaryColorDark: "blue-700",
              secondaryColor: "purple-600",
              secondaryColorDark: "purple-700",
              accentColor: "amber-500",
              textColor: "gray-800",
              headingColor: "gray-900",
              linkColor: "blue-600",
              linkHoverColor: "blue-700",
              labelColor: "gray-700",
              buttonTextColor: "white",
              iconColor: "gray-500",
              saleColor: "red-600",
              starColor: "yellow-400",
              headerBgColor: "white",
              footerBgColor: "gray-900",
              footerTextColor: "white",
              fontFamily: "sans",
              headingFontFamily: "sans",
              buttonBorderRadius: "rounded",
              cardBorderRadius: "rounded",
              customCSS: "",
            },
            products: [
              {
                id: 1,
                name: "Premium Wireless Headphones",
                description: "Immerse yourself in high-quality audio with these comfortable over-ear headphones.",
                price: 199.99,
                salePrice: 149.99,
                rating: 4.5,
                image: "/headphones.jpg",
                category: "audio",
                featured: true,
                inStock: true
              },
              {
                id: 2,
                name: "Smart Watch Series 5",
                description: "Track your fitness, receive notifications, and more with this sleek smartwatch.",
                price: 299.99,
                salePrice: null,
                rating: 4.8,
                image: "/smartwatch.jpg",
                category: "wearables",
                featured: true,
                inStock: true
              },
              {
                id: 3,
                name: "Portable Power Bank",
                description: "Keep your devices charged on the go with this high-capacity power bank.",
                price: 49.99,
                salePrice: 39.99,
                rating: 4.2,
                image: "/powerbank.jpg",
                category: "accessories",
                featured: true,
                inStock: true
              },
              {
                id: 4,
                name: "Wireless Earbuds Pro",
                description: "Experience crystal clear audio with noise cancellation technology.",
                price: 129.99,
                salePrice: null,
                rating: 4.7,
                image: "/earbuds.jpg",
                category: "audio",
                featured: true,
                inStock: true
              },
              {
                id: 5,
                name: "Ultra HD Smart TV 55\"",
                description: "Stunning 4K resolution with smart features for all your entertainment needs.",
                price: 799.99,
                salePrice: 699.99,
                rating: 4.6,
                image: "/tv.jpg",
                category: "tv-video",
                inStock: true
              },
              {
                id: 6,
                name: "Professional Digital Camera",
                description: "Capture amazing photos and videos with this high-performance digital camera.",
                price: 899.99,
                salePrice: null,
                rating: 4.9,
                image: "/camera.jpg",
                category: "cameras",
                inStock: false
              },
              {
                id: 7,
                name: "Bluetooth Speaker",
                description: "Portable speaker with rich sound and long battery life.",
                price: 89.99,
                salePrice: 69.99,
                rating: 4.3,
                image: "/speaker.jpg",
                category: "audio",
                inStock: true
              },
              {
                id: 8,
                name: "Gaming Laptop",
                description: "Powerful gaming laptop with dedicated graphics and high refresh rate display.",
                price: 1499.99,
                salePrice: null,
                rating: 4.8,
                image: "/laptop.jpg",
                category: "computers",
                inStock: true
              }
            ],
            categories: [
              { id: 1, name: "Audio", slug: "audio" },
              { id: 2, name: "Wearables", slug: "wearables" },
              { id: 3, name: "Accessories", slug: "accessories" },
              { id: 4, name: "TV & Video", slug: "tv-video" },
              { id: 5, name: "Cameras", slug: "cameras" },
              { id: 6, name: "Computers", slug: "computers" }
            ],
            featuredProducts: [1, 2, 3, 4],
            heroTitle: "Summer Sale Now On",
            heroSubtitle: "Get up to 40% off on our latest collection of premium electronics and accessories.",
            heroCTA: "Shop Now",
            heroBackgroundImage: "/hero-bg.jpg",
            contactEmail: "info@techgadgetsstore.com",
            contactPhone: "+1 (555) 123-4567",
            address: "123 Tech Street, San Francisco, CA 94107",
            socialLinks: {
              facebook: "https://facebook.com/techgadgetsstore",
              instagram: "https://instagram.com/techgadgetsstore",
              twitter: "https://twitter.com/techgadgetsstore",
              youtube: "https://youtube.com/techgadgetsstore"
            }
          };
          
          setSiteData(mockData);
          setLoading(false);
        }, 1000); // Simulate network delay

      } catch (err) {
        setError("Failed to load site data. Please try again later.");
        setLoading(false);
        console.error("Error fetching site data:", err);
      }
    };

    fetchSiteData();
  }, [siteId]);

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className={`h-5 w-5 text-${siteData?.theme.starColor} fill-current`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className={`h-5 w-5 text-${siteData?.theme.starColor} fill-current`} />
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

  // Handle adding product to cart
  const handleAddToCart = (productId: number) => {
    setCartCount(prevCount => prevCount + 1);
    // In a real implementation, you would add the product to the cart in your state management
    console.log(`Added product ${productId} to cart`);
  };

  // Handle searching
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would filter products based on search query
    console.log(`Searching for: ${searchQuery}`);
  };

  // Filter products by category
  const getFilteredProducts = () => {
    if (!activeCategory) {
      return siteData?.products || [];
    }
    
    return siteData?.products.filter(product => product.category === activeCategory) || [];
  };

  // Get featured products
  const getFeaturedProducts = () => {
    if (!siteData) return [];
    
    return siteData.products.filter(product => 
      siteData.featuredProducts.includes(product.id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error || "Failed to load site data"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const theme = siteData.theme;

  return (
    <div className={`font-${theme.fontFamily}`}>
      {/* Apply custom CSS if provided */}
      {theme.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: theme.customCSS }} />
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
               onClick={() => setMobileMenuOpen(false)}></div>
          
          <div className={`fixed inset-y-0 right-0 max-w-xs w-full bg-${theme.headerBgColor} overflow-y-auto`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className={`text-xl font-bold text-${theme.headingColor} font-${theme.headingFontFamily}`}>
                Menu
              </h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-${theme.textColor} hover:text-${theme.linkHoverColor}`}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="py-4">
              <nav className="px-4 space-y-4">
                <a href="#" className={`block py-2 text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-medium`}>
                  Home
                </a>
                <div>
                  <button 
                    className={`flex items-center justify-between w-full py-2 text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-medium`}
                    onClick={() => setActiveCategory(activeCategory ? null : siteData.categories[0].slug)}
                  >
                    <span>Products</span>
                    <ChevronDownIcon className="h-5 w-5" />
                  </button>
                  
                  {activeCategory && (
                    <div className="pl-4 mt-2 space-y-2">
                      {siteData.categories.map(category => (
                        <a 
                          key={category.id}
                          href={`#category-${category.slug}`}
                          className={`block py-1 text-${theme.linkColor} hover:text-${theme.linkHoverColor}`}
                          onClick={() => setActiveCategory(category.slug)}
                        >
                          {category.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <a href="#about" className={`block py-2 text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-medium`}>
                  About
                </a>
                <a href="#contact" className={`block py-2 text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-medium`}>
                  Contact
                </a>
              </nav>
              
              <div className="mt-6 px-4 space-y-4">
                <button className={`w-full bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-4 py-2`}>
                  Sign In
                </button>
                <button className={`w-full flex items-center justify-center bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-4 py-2`}>
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Cart ({cartCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-80 flex items-start justify-center pt-16">
          <div className="w-full max-w-2xl px-4">
            <div className={`bg-${theme.headerBgColor} rounded-lg shadow-xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium text-${theme.headingColor}`}>Search Products</h3>
                <button 
                  onClick={() => setShowSearch(false)}
                  className={`text-${theme.textColor} hover:text-${theme.linkHoverColor}`}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSearch}>
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className={`flex-grow ${theme.buttonBorderRadius} border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor} focus:border-transparent`}
                  />
                  <button 
                    type="submit"
                    className={`ml-2 bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-4 py-2`}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`bg-${theme.headerBgColor} shadow-md sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className={`text-${theme.headingColor} text-xl font-bold font-${theme.headingFontFamily}`}>
              {siteData.name}
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium`}>
                Home
              </a>
              <div className="relative group">
                <button className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium flex items-center`}>
                  Products
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150 ease-in-out z-10 py-1">
                  {siteData.categories.map(category => (
                    <a 
                      key={category.id}
                      href={`#category-${category.slug}`}
                      className={`block px-4 py-2 text-${theme.textColor} hover:bg-gray-100`}
                      onClick={() => setActiveCategory(category.slug)}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
              <a href="#about" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium`}>
                About
              </a>
              <a href="#contact" className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} px-3 py-2 text-sm font-medium`}>
                Contact
              </a>
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setShowSearch(true)}
                className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
              >
                <SearchIcon className="h-5 w-5" />
              </button>
              <button className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}>
                <UserIcon className="h-5 w-5" />
              </button>
              <button className={`bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-4 py-2 text-sm font-medium flex items-center`}>
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                <span>Cart ({cartCount})</span>
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-4">
              <button 
                onClick={() => setShowSearch(true)}
                className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
              >
                <SearchIcon className="h-5 w-5" />
              </button>
              <button 
                className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor} relative`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-${theme.primaryColor} text-${theme.buttonTextColor} text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`bg-${theme.secondaryColor} py-16 px-4 sm:px-6 lg:px-8 relative`}>
        {siteData.heroBackgroundImage && (
          <div className="absolute inset-0 bg-black opacity-40"></div>
        )}
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className={`text-${theme.buttonTextColor} text-4xl md:text-5xl font-bold mb-4 font-${theme.headingFontFamily}`}>
            {siteData.heroTitle || "Welcome to our Store"}
          </h1>
          <p className={`text-${theme.buttonTextColor} text-lg mb-8 max-w-3xl mx-auto font-${theme.fontFamily}`}>
            {siteData.heroSubtitle || "Discover our collection of premium products"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className={`bg-${theme.accentColor} hover:opacity-90 text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-8 py-3 text-base font-medium`}>
              {siteData.heroCTA || "Shop Now"}
            </button>
            <button className={`bg-transparent border border-${theme.buttonTextColor} text-${theme.buttonTextColor} hover:bg-white hover:bg-opacity-10 ${theme.buttonBorderRadius} px-8 py-3 text-base font-medium`}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter (Desktop) */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 overflow-x-auto hide-scrollbar space-x-6">
            <button 
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap px-3 py-1 ${!activeCategory 
                ? `bg-${theme.primaryColor} text-${theme.buttonTextColor}` 
                : `text-${theme.textColor} hover:text-${theme.linkHoverColor}`} ${theme.buttonBorderRadius} font-medium text-sm transition-colors`}
            >
              All Products
            </button>
            
            {siteData.categories.map(category => (
              <button 
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`whitespace-nowrap px-3 py-1 ${activeCategory === category.slug 
                  ? `bg-${theme.primaryColor} text-${theme.buttonTextColor}` 
                  : `text-${theme.textColor} hover:text-${theme.linkHoverColor}`} ${theme.buttonBorderRadius} font-medium text-sm transition-colors`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-${theme.headingColor} text-3xl font-bold mb-8 font-${theme.headingFontFamily} text-center`}>
            {activeCategory 
              ? siteData.categories.find(c => c.slug === activeCategory)?.name || "Products"
              : "Featured Products"}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeCategory ? getFilteredProducts() : getFeaturedProducts()).map((product) => (
              <div key={product.id} className={`border ${theme.cardBorderRadius} shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1`}>
                {/* Product Image Placeholder */}
                <div className="bg-gray-200 h-48 flex items-center justify-center relative">
                  <span className={`text-${theme.textColor} text-sm font-${theme.fontFamily}`}>
                    Product Image
                  </span>
                  
                  {/* Sale Badge */}
                  {product.salePrice && (
                    <div className={`absolute top-2 left-2 bg-${theme.saleColor} text-white text-xs font-bold px-2 py-1 rounded`}>
                      SALE
                    </div>
                  )}
                  
                  {/* Out of Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium px-3 py-1 bg-gray-800 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100">
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className={`text-${theme.headingColor} font-medium font-${theme.headingFontFamily} mb-1`}>
                    {product.name}
                  </h3>
                  
                  <p className={`text-${theme.textColor} text-sm mb-2 font-${theme.fontFamily} line-clamp-2`}>
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    {renderStars(product.rating)}
                    <span className={`ml-1 text-sm text-${theme.textColor}`}>
                      ({product.rating})
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
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
                    
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.inStock}
                      className={`${product.inStock 
                        ? `bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor}` 
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'} ${theme.buttonBorderRadius} px-3 py-1 text-sm`}
                    >
                      {product.inStock ? "Add to Cart" : "Sold Out"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show All Products Button */}
          {!activeCategory && (
            <div className="text-center mt-10">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-6 py-2 text-sm font-medium`}
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-${theme.headingColor} text-3xl font-bold mb-12 font-${theme.headingFontFamily} text-center`}>
            Why Shop With Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`mx-auto bg-${theme.primaryColor} bg-opacity-10 rounded-full p-4 h-16 w-16 flex items-center justify-center mb-4`}>
                <svg className={`h-8 w-8 text-${theme.primaryColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-${theme.headingColor} text-xl font-semibold mb-2 font-${theme.headingFontFamily}`}>Quality Products</h3>
              <p className={`text-${theme.textColor} font-${theme.fontFamily}`}>
                We carefully select every product to ensure the highest quality standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className={`mx-auto bg-${theme.primaryColor} bg-opacity-10 rounded-full p-4 h-16 w-16 flex items-center justify-center mb-4`}>
                <svg className={`h-8 w-8 text-${theme.primaryColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-${theme.headingColor} text-xl font-semibold mb-2 font-${theme.headingFontFamily}`}>Best Prices</h3>
              <p className={`text-${theme.textColor} font-${theme.fontFamily}`}>
                Competitive prices and regular promotions to give you the best value.
              </p>
            </div>
            
            <div className="text-center">
              <div className={`mx-auto bg-${theme.primaryColor} bg-opacity-10 rounded-full p-4 h-16 w-16 flex items-center justify-center mb-4`}>
                <svg className={`h-8 w-8 text-${theme.primaryColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className={`text-${theme.headingColor} text-xl font-semibold mb-2 font-${theme.headingFontFamily}`}>Customer Support</h3>
              <p className={`text-${theme.textColor} font-${theme.fontFamily}`}>
                Our dedicated support team is here to assist you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`bg-${theme.accentColor} py-12 px-4 sm:px-6 lg:px-8`}>
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

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="lg:flex lg:items-center lg:space-x-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <span className="text-gray-500">About Image</span>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <h2 className={`text-${theme.headingColor} text-3xl font-bold mb-6 font-${theme.headingFontFamily}`}>
                About {siteData.name}
              </h2>
              
              <p className={`text-${theme.textColor} mb-6 font-${theme.fontFamily}`}>
                {siteData.description || "Welcome to our store. We provide high-quality products at competitive prices."}
              </p>
              
              <p className={`text-${theme.textColor} mb-6 font-${theme.fontFamily}`}>
                Our mission is to deliver exceptional products and service to our customers. We carefully curate our selection to ensure you receive only the best.
              </p>
              
              <p className={`text-${theme.textColor} mb-8 font-${theme.fontFamily}`}>
                Whether you're looking for the latest tech gadgets or essential accessories, we've got you covered with our diverse range of products.
              </p>
              
              <button className={`bg-${theme.secondaryColor} hover:bg-${theme.secondaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} px-6 py-2 font-medium`}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-${theme.headingColor} text-3xl font-bold mb-12 font-${theme.headingFontFamily} text-center`}>
            Contact Us
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className={`text-${theme.headingColor} text-xl font-semibold mb-4 font-${theme.headingFontFamily}`}>
                Get In Touch
              </h3>
              
              <p className={`text-${theme.textColor} mb-6 font-${theme.fontFamily}`}>
                Have questions or need assistance? Reach out to us and we'll be happy to help.
              </p>
              
              <div className="space-y-4">
                {siteData.address && (
                  <div className="flex items-start">
                    <LocationMarkerIcon className={`h-6 w-6 text-${theme.primaryColor} mt-0.5 mr-3 flex-shrink-0`} />
                    <p className={`text-${theme.textColor} font-${theme.fontFamily}`}>
                      {siteData.address}
                    </p>
                  </div>
                )}
                
                {siteData.contactEmail && (
                  <div className="flex items-center">
                    {/* <MailIcon className={`h-6 w-6 text-${theme.primaryColor} mr-3 flex-shrink-0`} /> */}
                    <a 
                      href={`mailto:${siteData.contactEmail}`} 
                      className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-${theme.fontFamily}`}
                    >
                      {siteData.contactEmail}
                    </a>
                  </div>
                )}
                
                {siteData.contactPhone && (
                  <div className="flex items-center">
                    <PhoneIcon className={`h-6 w-6 text-${theme.primaryColor} mr-3 flex-shrink-0`} />
                    <a 
                      href={`tel:${siteData.contactPhone}`} 
                      className={`text-${theme.linkColor} hover:text-${theme.linkHoverColor} font-${theme.fontFamily}`}
                    >
                      {siteData.contactPhone}
                    </a>
                  </div>
                )}
              </div>
              
              {siteData.socialLinks && (
                <div className="mt-8">
                  <h4 className={`text-${theme.headingColor} font-medium mb-4 font-${theme.headingFontFamily}`}>
                    Follow Us
                  </h4>
                  
                  <div className="flex space-x-4">
                    {siteData.socialLinks.facebook && (
                      <a 
                        href={siteData.socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                    )}
                    
                    {siteData.socialLinks.instagram && (
                      <a 
                        href={siteData.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.669.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.669 0 2.986-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.669-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                        </svg>
                      </a>
                    )}
                    
                    {siteData.socialLinks.twitter && (
                      <a 
                        href={siteData.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    
                    {siteData.socialLinks.youtube && (
                      <a 
                        href={siteData.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-${theme.iconColor} hover:text-${theme.linkHoverColor}`}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className={`text-${theme.headingColor} text-xl font-semibold mb-4 font-${theme.headingFontFamily}`}>
                Send Us a Message
              </h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium text-${theme.labelColor}`}>
                      Name
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      className={`mt-1 block w-full ${theme.buttonBorderRadius} border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor} focus:border-transparent`}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium text-${theme.labelColor}`}>
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      className={`mt-1 block w-full ${theme.buttonBorderRadius} border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor} focus:border-transparent`}
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium text-${theme.labelColor}`}>
                    Subject
                  </label>
                  <input 
                    type="text" 
                    id="subject"
                    className={`mt-1 block w-full ${theme.buttonBorderRadius} border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor} focus:border-transparent`}
                    placeholder="Subject"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium text-${theme.labelColor}`}>
                    Message
                  </label>
                  <textarea 
                    id="message"
                    rows={5}
                    className={`mt-1 block w-full ${theme.buttonBorderRadius} border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor} focus:border-transparent`}
                    placeholder="Your message"
                  />
                </div>
                
                <div>
                  <button 
                    type="submit"
                    className={`w-full bg-${theme.primaryColor} hover:bg-${theme.primaryColorDark} text-${theme.buttonTextColor} ${theme.buttonBorderRadius} py-3 font-medium`}
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-${theme.footerBgColor} text-${theme.footerTextColor} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                {siteData.name}
              </h3>
              <p className={`text-sm mb-4 font-${theme.fontFamily}`}>
                {siteData.description || "Your one-stop shop for premium products."}
              </p>
              
              {siteData.socialLinks && (
                <div className="flex space-x-4">
                  {siteData.socialLinks.facebook && (
                    <a 
                      href={siteData.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gray-300"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                  )}
                  
                  {siteData.socialLinks.instagram && (
                    <a 
                      href={siteData.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gray-300"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.669.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.669 0 2.986-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.669-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                      </svg>
                    </a>
                  )}
                  
                  {siteData.socialLinks.twitter && (
                    <a 
                      href={siteData.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gray-300"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  
                  {siteData.socialLinks.youtube && (
                    <a 
                      href={siteData.socialLinks.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gray-300"
                    >
                      <span className="sr-only">YouTube</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                Shop
              </h3>
              <ul className={`space-y-2 text-sm font-${theme.fontFamily}`}>
                <li><a href="#" className="hover:underline">All Products</a></li>
                {siteData.categories.slice(0, 5).map(category => (
                  <li key={category.id}>
                    <a 
                      href={`#category-${category.slug}`}
                      className="hover:underline"
                      onClick={() => setActiveCategory(category.slug)}
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
                <li><a href="#" className="hover:underline">New Arrivals</a></li>
                <li><a href="#" className="hover:underline">Best Sellers</a></li>
                <li><a href="#" className="hover:underline">Sale Items</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                Support
              </h3>
              <ul className={`space-y-2 text-sm font-${theme.fontFamily}`}>
                <li><a href="#contact" className="hover:underline">Contact Us</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">Shipping Policy</a></li>
                <li><a href="#" className="hover:underline">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Track Order</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 font-${theme.headingFontFamily}`}>
                Account
              </h3>
              <ul className={`space-y-2 text-sm font-${theme.fontFamily}`}>
                <li><a href="#" className="hover:underline">My Account</a></li>
                <li><a href="#" className="hover:underline">Order History</a></li>
                <li><a href="#" className="hover:underline">Wishlist</a></li>
                <li><a href="#" className="hover:underline">Newsletter</a></li>
                <li><a href="#" className="hover:underline">Rewards Program</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className={`text-sm font-${theme.fontFamily}`}>
              &copy; {new Date().getFullYear()} {siteData.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicSite;