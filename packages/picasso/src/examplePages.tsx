   /* **
 * examplePages.js
 * Example page definitions for the storefront
 */

// Example Home Page
const homePage = {
  id: 'home-page',
  name: 'Home Page',
  path: '/',
  type: 'home',
  components: [
    {
      id: 'header-component',
      type: 'Header',
      props: {
        logo: 'https://via.placeholder.com/150x50?text=LOGO',
        menuItems: [
          { label: 'Home', url: '/' },
          { label: 'Products', url: '/products' },
          { label: 'Categories', url: '/categories' },
          { label: 'About', url: '/about' },
          { label: 'Contact', url: '/contact' },
        ],
        showSearch: true,
        showCartIcon: true,
        sticky: true,
      },
      layout: {
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        order: 0,
      },
    },
    {
      id: 'hero-banner-component',
      type: 'HeroBanner',
      props: {
        title: 'Summer Collection 2025',
        subtitle: 'Discover our latest products for the summer season with up to 30% off.',
        backgroundImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Shop Now',
        ctaLink: '/products',
        textAlign: 'left',
        overlayColor: 'rgba(0, 0, 0, 0.4)',
      },
      layout: {
        x: 0,
        y: 2,
        w: 12,
        h: 6,
        order: 1,
      },
    },
    {
      id: 'featured-products-component',
      type: 'ProductCardGrid',
      props: {
        title: 'Featured Products',
        products: [
          {
            id: '1',
            name: 'Modern Denim Jacket',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.5,
            ratingCount: 23,
            category: 'Jackets',
          },
          {
            id: '2',
            name: 'Leather Crossbody Bag',
            price: 129.99,
            originalPrice: 159.99,
            image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.8,
            ratingCount: 42,
            isOnSale: true,
            category: 'Bags',
          },
          {
            id: '3',
            name: 'Classic White Sneakers',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.2,
            ratingCount: 36,
            isNew: true,
            category: 'Shoes',
          },
          {
            id: '4',
            name: 'Slim Fit Cotton T-Shirt',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.0,
            ratingCount: 18,
            category: 'T-shirts',
          },
        ],
        showViewMore: true,
        viewMoreLink: '/products/featured',
        viewMoreText: 'View All Featured',
      },
      layout: {
        x: 0,
        y: 8,
        w: 12,
        h: 8,
        order: 2,
      },
    },
    {
      id: 'new-arrivals-component',
      type: 'ProductCardGrid',
      props: {
        title: 'New Arrivals',
        products: [
          {
            id: '5',
            name: 'Oversized Wool Coat',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.7,
            ratingCount: 12,
            isNew: true,
            category: 'Coats',
          },
          {
            id: '6',
            name: 'High-Waisted Jeans',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.3,
            ratingCount: 28,
            isNew: true,
            category: 'Jeans',
          },
          {
            id: '7',
            name: 'Polarized Sunglasses',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.5,
            ratingCount: 19,
            isNew: true,
            category: 'Accessories',
          },
          {
            id: '8',
            name: 'Cashmere Scarf',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1584736286279-738d036dad44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            rating: 4.6,
            ratingCount: 14,
            isNew: true,
            category: 'Accessories',
          },
        ],
        showViewMore: true,
        viewMoreLink: '/products/new',
        viewMoreText: 'View All New Arrivals',
      },
      layout: {
        x: 0,
        y: 16,
        w: 12,
        h: 8,
        order: 3,
      },
    },
    {
      id: 'footer-component',
      type: 'Footer',
      props: {
        sections: [
          {
            heading: 'Shop',
            links: [
              { text: 'Women', url: '/products/women' },
              { text: 'Men', url: '/products/men' },
              { text: 'Accessories', url: '/products/accessories' },
              { text: 'Sale', url: '/products/sale' },
            ],
          },
          {
            heading: 'Customer Service',
            links: [
              { text: 'Contact Us', url: '/contact' },
              { text: 'Shipping & Returns', url: '/shipping' },
              { text: 'FAQ', url: '/faq' },
              { text: 'Size Guide', url: '/size-guide' },
            ],
          },
          {
            heading: 'About',
            links: [
              { text: 'Our Story', url: '/about' },
              { text: 'Careers', url: '/careers' },
              { text: 'Press', url: '/press' },
              { text: 'Sustainability', url: '/sustainability' },
            ],
          },
        ],
        showNewsletter: true,
        newsletterProps: {
          title: 'Join Our Newsletter',
          description: 'Sign up for our newsletter to receive updates and exclusive offers',
        },
        socialLinks: [
          { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
          { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
          { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
          { name: 'Pinterest', icon: 'pinterest', url: 'https://pinterest.com' },
        ],
      },
      layout: {
        x: 0,
        y: 24,
        w: 12,
        h: 6,
        order: 4,
      },
    },
  ],
};

// Example Product Listing Page
const productListingPage = {
  id: 'product-listing-page',
  name: 'Product Listing Page',
  path: '/products',
  type: 'product-listing',
  components: [
    // Similar structure to homePage components
    // with Header, ProductCardGrid, FiltersSidebar, Footer, etc.
  ],
};

// Example Product Detail Page
const productDetailPage = {
  id: 'product-detail-page',
  name: 'Product Detail Page',
  path: '/product/:id',
  type: 'product-detail',
  components: [
    // Similar structure to homePage components
    // with Header, ProductDetail, RelatedProducts, Footer, etc.
  ],
};

export {
  homePage,
  productListingPage,
  productDetailPage,
};

