/**
 * componentRegistry.js
 * Registry of available components for the editor
 */
import React from 'react';

// Import all component types
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';
import Image from '../components/atoms/Image';
import Input from '../components/atoms/Input';
import Checkbox from '../components/atoms/Checkbox';
import Select from '../components/atoms/Select';
import Badge from '../components/atoms/Badge';
import Icon from '../components/atoms/Icon';

import SearchBar from '../components/molecules/SearchBar';
import ProductPrice from '../components/molecules/ProductPrice';
import RatingDisplay from '../components/molecules/RatingDisplay';
import Breadcrumb from '../components/molecules/Breadcrumb';
import FormField from '../components/molecules/FormField';

import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import ProductCard from '../components/organisms/ProductCard';
import ProductCardGrid from '../components/organisms/ProductCardGrid';
import HeroBanner from '../components/organisms/HeroBanner';

// Component registry with metadata and props definitions
const componentRegistry = {
  // Atoms
  Button: {
    component: Button,
    displayName: 'Button',
    category: 'Atoms',
    description: 'A clickable button element',
    defaultProps: {
      text: 'Button',
      variant: 'primary',
      size: 'medium',
    },
    propDefinitions: {
      text: {
        type: 'string',
        label: 'Text',
        category: 'Content',
        description: 'Button text label',
      },
      variant: {
        type: 'select',
        label: 'Variant',
        category: 'Appearance',
        options: [
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
          { value: 'text', label: 'Text' },
        ],
        description: 'Button style variant',
      },
      size: {
        type: 'select',
        label: 'Size',
        category: 'Appearance',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      disabled: {
        type: 'boolean',
        label: 'Disabled',
        category: 'State',
      },
      fullWidth: {
        type: 'boolean',
        label: 'Full Width',
        category: 'Layout',
      },
    },
    defaultLayout: {
      w: 3,
      h: 1,
      minW: 2,
      minH: 1,
    },
  },
  
  Text: {
    component: Text,
    displayName: 'Text',
    category: 'Atoms',
    description: 'A text element (headings, paragraphs, etc.)',
    defaultProps: {
      text: 'Text',
      type: 'p',
    },
    propDefinitions: {
      text: {
        type: 'textarea',
        label: 'Text Content',
        category: 'Content',
      },
      type: {
        type: 'select',
        label: 'Element Type',
        category: 'Element',
        options: [
          { value: 'h1', label: 'Heading 1' },
          { value: 'h2', label: 'Heading 2' },
          { value: 'h3', label: 'Heading 3' },
          { value: 'h4', label: 'Heading 4' },
          { value: 'h5', label: 'Heading 5' },
          { value: 'h6', label: 'Heading 6' },
          { value: 'p', label: 'Paragraph' },
          { value: 'span', label: 'Span' },
        ],
      },
      weight: {
        type: 'select',
        label: 'Font Weight',
        category: 'Typography',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'normal', label: 'Normal' },
          { value: 'medium', label: 'Medium' },
          { value: 'semibold', label: 'Semibold' },
          { value: 'bold', label: 'Bold' },
        ],
      },
      align: {
        type: 'select',
        label: 'Text Alignment',
        category: 'Typography',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
          { value: 'justify', label: 'Justify' },
        ],
      },
    },
    defaultLayout: {
      w: 12,
      h: 1,
      minW: 2,
      minH: 1,
    },
  },
  
  Image: {
    component: Image,
    displayName: 'Image',
    category: 'Atoms',
    description: 'An image element',
    defaultProps: {
      src: 'https://via.placeholder.com/400x300',
      alt: 'Image',
    },
    propDefinitions: {
      src: {
        type: 'image',
        label: 'Image Source',
        category: 'Content',
        description: 'URL of the image',
      },
      alt: {
        type: 'string',
        label: 'Alt Text',
        category: 'Accessibility',
        description: 'Alternative text for the image',
      },
      objectFit: {
        type: 'select',
        label: 'Object Fit',
        category: 'Appearance',
        options: [
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
          { value: 'fill', label: 'Fill' },
          { value: 'none', label: 'None' },
          { value: 'scale-down', label: 'Scale Down' },
        ],
      },
      rounded: {
        type: 'boolean',
        label: 'Rounded',
        category: 'Appearance',
      },
    },
    defaultLayout: {
      w: 6,
      h: 4,
      minW: 2,
      minH: 2,
    },
  },
  
  // Molecules
  SearchBar: {
    component: SearchBar,
    displayName: 'Search Bar',
    category: 'Molecules',
    description: 'A search input with button',
    defaultProps: {
      placeholder: 'Search...',
      withButton: true,
      onSearch: () => console.log('Search'),
    },
    propDefinitions: {
      placeholder: {
        type: 'string',
        label: 'Placeholder',
        category: 'Content',
      },
      withButton: {
        type: 'boolean',
        label: 'Show Button',
        category: 'Appearance',
      },
    },
    defaultLayout: {
      w: 6,
      h: 1,
      minW: 3,
      minH: 1,
    },
  },
  
  // Organisms
  Header: {
    component: Header,
    displayName: 'Header',
    category: 'Organisms',
    description: 'Main navigation header',
    defaultProps: {
      logo: 'https://via.placeholder.com/150x50',
      menuItems: [
        { label: 'Home', url: '/' },
        { label: 'Products', url: '/products' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ],
      showSearch: true,
      showCartIcon: true,
    },
    propDefinitions: {
      logo: {
        type: 'image',
        label: 'Logo',
        category: 'Content',
      },
      menuItems: {
        type: 'array',
        label: 'Menu Items',
        category: 'Content',
        description: 'Comma-separated list of menu items',
      },
      showSearch: {
        type: 'boolean',
        label: 'Show Search',
        category: 'Features',
      },
      showCartIcon: {
        type: 'boolean',
        label: 'Show Cart Icon',
        category: 'Features',
      },
      sticky: {
        type: 'boolean',
        label: 'Sticky Header',
        category: 'Behavior',
      },
    },
    defaultLayout: {
      w: 12,
      h: 2,
      minW: 12,
      minH: 2,
    },
  },
  
  Footer: {
    component: Footer,
    displayName: 'Footer',
    category: 'Organisms',
    description: 'Site footer with links and newsletter',
    defaultProps: {
      sections: [
        {
          heading: 'Company',
          links: [
            { text: 'About Us', url: '/about' },
            { text: 'Careers', url: '/careers' },
            { text: 'Contact Us', url: '/contact' },
          ],
        },
        {
          heading: 'Customer Service',
          links: [
            { text: 'FAQ', url: '/faq' },
            { text: 'Returns', url: '/returns' },
            { text: 'Shipping', url: '/shipping' },
          ],
        },
      ],
      showNewsletter: true,
      socialLinks: [
        { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
        { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
        { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
      ],
    },
    propDefinitions: {
      showNewsletter: {
        type: 'boolean',
        label: 'Show Newsletter',
        category: 'Features',
      },
    },
    defaultLayout: {
      w: 12,
      h: 4,
      minW: 12,
      minH: 3,
    },
  },
  
  HeroBanner: {
    component: HeroBanner,
    displayName: 'Hero Banner',
    category: 'Organisms',
    description: 'A large promotional banner',
    defaultProps: {
      title: 'Welcome to Our Store',
      subtitle: 'Discover our latest products and promotions',
      backgroundImage: 'https://via.placeholder.com/1600x600',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      textAlign: 'left',
    },
    propDefinitions: {
      title: {
        type: 'string',
        label: 'Title',
        category: 'Content',
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        category: 'Content',
      },
      backgroundImage: {
        type: 'image',
        label: 'Background Image',
        category: 'Content',
      },
      ctaText: {
        type: 'string',
        label: 'Button Text',
        category: 'Content',
      },
      ctaLink: {
        type: 'string',
        label: 'Button Link',
        category: 'Content',
      },
      textAlign: {
        type: 'select',
        label: 'Text Alignment',
        category: 'Layout',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      overlayColor: {
        type: 'color',
        label: 'Overlay Color',
        category: 'Appearance',
      },
    },
    defaultLayout: {
      w: 12,
      h: 6,
      minW: 6,
      minH: 4,
    },
  },
  
  ProductCardGrid: {
    component: ProductCardGrid,
    displayName: 'Product Grid',
    category: 'Organisms',
    description: 'Grid of product cards',
    defaultProps: {
      title: 'Featured Products',
      products: [
        {
          id: '1',
          name: 'Product 1',
          price: 99.99,
          image: 'https://via.placeholder.com/300',
          rating: 4.5,
          ratingCount: 10,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 149.99,
          originalPrice: 199.99,
          image: 'https://via.placeholder.com/300',
          rating: 4.0,
          ratingCount: 8,
          isOnSale: true,
        },
        {
          id: '3',
          name: 'Product 3',
          price: 79.99,
          image: 'https://via.placeholder.com/300',
          rating: 4.2,
          ratingCount: 15,
          isNew: true,
        },
        {
          id: '4',
          name: 'Product 4',
          price: 129.99,
          image: 'https://via.placeholder.com/300',
          rating: 3.5,
          ratingCount: 6,
        },
      ],
      showViewMore: true,
      viewMoreLink: '/products',
    },
    propDefinitions: {
      title: {
        type: 'string',
        label: 'Section Title',
        category: 'Content',
      },
      showViewMore: {
        type: 'boolean',
        label: 'Show View More',
        category: 'Features',
      },
      viewMoreLink: {
        type: 'string',
        label: 'View More Link',
        category: 'Content',
      },
      viewMoreText: {
        type: 'string',
        label: 'View More Text',
        category: 'Content',
      },
    },
    defaultLayout: {
      w: 12,
      h: 8,
      minW: 6,
      minH: 6,
    },
  },
};

export default componentRegistry;