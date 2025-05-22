export const defaultLayout = {
  componentType: 'page-layout',
  props: {
    showHeader: true,
    showFooter: true
  },
  children: [
    // Header
    {
      componentType: 'header-component',
      props: {
        logoSrc: '/images/logo.png',
        logoAlt: 'Store Logo',
        navigationItems: [
          { text: 'Home', link: '/' },
          { text: 'Shop', link: '/shop' },
          { text: 'About', link: '/about' },
          { text: 'Contact', link: '/contact' }
        ],
        showSearch: true,
        showCartIcon: true,
        showLoginLink: true,
        sticky: true
      }
    },

    // Banner (for promotions)
    {
      componentType: 'banner-component',
      props: {
        text: '🎉 Free shipping on orders over $50!',
        backgroundColor: '#f7f0ff',
        textColor: '#4a154b',
        closable: true
      }
    },

    // Hero Section
    {
      componentType: 'hero-section',
      props: {
        backgroundImageUrl: '/images/hero-bg.jpg',
        backgroundColor: '#f8f9fa',
        overlayColor: 'rgba(0, 0, 0, 0.4)',
        headlineText: 'Welcome to Our Store',
        subheadlineText: 'Discover our curated collection of premium products',
        ctaButtonText: 'Shop Now',
        ctaButtonLink: '/shop',
        textAlign: 'center',
        contentAlignment: 'center'
      }
    },

    // Featured Categories
    {
      componentType: 'section-container',
      props: {
        backgroundColor: '#ffffff',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      },
      children: [
        {
          componentType: 'category-list',
          props: {
            layoutStyle: 'grid',
            showImage: true,
            showTitle: true
          }
        }
      ]
    },

    // Featured Products Section
    {
      componentType: 'section-container',
      props: {
        backgroundColor: '#f8f9fa',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      },
      children: [
        {
          componentType: 'featured-products-section',
          props: {
            sectionTitle: 'Featured Products',
            layoutStyle: 'grid',
            productIds: [] // To be populated dynamically
          }
        }
      ]
    },

    // Value Propositions
    {
      componentType: 'section-container',
      props: {
        backgroundColor: '#ffffff',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      },
      children: [
        {
          componentType: 'feature-list-section',
          props: {
            sectionTitle: 'Why Choose Us',
            columns: 3,
            featuresData: [
              {
                iconName: '🚚',
                titleText: 'Free Shipping',
                descriptionText: 'On orders over $50'
              },
              {
                iconName: '⭐',
                titleText: 'Premium Quality',
                descriptionText: 'Handpicked products'
              },
              {
                iconName: '🔄',
                titleText: 'Easy Returns',
                descriptionText: '30-day return policy'
              }
            ]
          }
        }
      ]
    },

    // New Arrivals Carousel
    {
      componentType: 'section-container',
      props: {
        backgroundColor: '#f8f9fa',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      },
      children: [
        {
          componentType: 'product-carousel',
          props: {
            categoryFilter: 'new-arrivals',
            numberOfProducts: 8,
            autoplay: true,
            showArrows: true,
            showDots: true
          }
        }
      ]
    },

    // Testimonials
    {
      componentType: 'section-container',
      props: {
        backgroundColor: '#ffffff',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      },
      children: [
        {
          componentType: 'testimonial-section',
          props: {
            sectionTitle: 'What Our Customers Say',
            layoutStyle: 'grid',
            testimonialsData: [
              {
                quoteText: 'Amazing quality and fast shipping!',
                authorName: 'Sarah Johnson',
                rating: 5
              },
              {
                quoteText: 'Best online shopping experience.',
                authorName: 'Mike Thompson',
                rating: 5
              },
              {
                quoteText: 'Great customer service!',
                authorName: 'Emily Davis',
                rating: 5
              }
            ]
          }
        }
      ]
    },

    // Newsletter Signup
    {
      componentType: 'section-container',
      props: {
        backgroundColor: '#f8f9fa',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      },
      children: [
        {
          componentType: 'newsletter-signup-form',
          props: {
            formActionUrl: '/api/newsletter/subscribe',
            placeholderText: 'Enter your email for exclusive offers',
            submitButtonText: 'Subscribe',
            successMessage: 'Thanks for subscribing!'
          }
        }
      ]
    },

    // Footer
    {
      componentType: 'footer-component',
      props: {
        copyrightText: '© 2024 Your Store. All rights reserved.',
        linksColumns: [
          {
            title: 'Shop',
            items: [
              { text: 'All Products', link: '/shop' },
              { text: 'New Arrivals', link: '/new-arrivals' },
              { text: 'Featured', link: '/featured' },
              { text: 'Sale', link: '/sale' }
            ]
          },
          {
            title: 'About',
            items: [
              { text: 'Our Story', link: '/about' },
              { text: 'Blog', link: '/blog' },
              { text: 'Reviews', link: '/reviews' }
            ]
          },
          {
            title: 'Support',
            items: [
              { text: 'Contact Us', link: '/contact' },
              { text: 'Shipping Info', link: '/shipping' },
              { text: 'Returns', link: '/returns' },
              { text: 'FAQ', link: '/faq' }
            ]
          }
        ],
        socialMediaLinks: [
          { icon: '📱', link: 'https://facebook.com/yourstore' },
          { icon: '📸', link: 'https://instagram.com/yourstore' },
          { icon: '🐦', link: 'https://twitter.com/yourstore' }
        ]
      }
    }
  ]
}; 