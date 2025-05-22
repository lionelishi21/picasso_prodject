/**
 * Footer.js
 * Component for the site footer
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { useTheme } from '../../context/ThemeContext';

const Footer = ({
  sections = [],
  showNewsletter = true,
  newsletterProps = {},
  socialLinks = [],
  backgroundColor,
  textColor,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Default newsletter props
  const defaultNewsletterProps = {
    title: 'Subscribe to our newsletter',
    description: 'Stay updated with our latest news and offers',
    placeholder: 'Your email address',
    buttonText: 'Subscribe',
    onSubmit: (email) => console.log('Newsletter subscription:', email),
    ...newsletterProps
  };
  
  // Determine background color and text color
  const bgColor = backgroundColor || theme.footerBgColor || 'gray-900';
  const txtColor = textColor || theme.footerTextColor || 'white';
  
  const [email, setEmail] = React.useState('');
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email && defaultNewsletterProps.onSubmit) {
      defaultNewsletterProps.onSubmit(email);
      setEmail('');
    }
  };
  
  return (
    <footer 
      className={`bg-${bgColor} text-${txtColor} pt-12 pb-6 ${className}`}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Footer Sections (Links) */}
          {sections.map((section, index) => (
            <div key={index}>
              <Text 
                text={section.heading} 
                type="h3" 
                className="font-bold mb-4 text-xl"
              />
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.url} 
                      className={`hover:text-${theme.primaryColor} transition-colors duration-200`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Newsletter Section */}
          {showNewsletter && (
            <div className="md:col-span-2 lg:col-span-1">
              <Text 
                text={defaultNewsletterProps.title} 
                type="h3" 
                className="font-bold mb-4 text-xl"
              />
              <Text 
                text={defaultNewsletterProps.description} 
                type="p" 
                className="mb-4"
              />
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={defaultNewsletterProps.placeholder}
                  required
                  className="mb-0 flex-grow"
                />
                <Button
                  text={defaultNewsletterProps.buttonText}
                  variant="primary"
                  type="submit"
                />
              </form>
            </div>
          )}
        </div>
        
        {/* Bottom Bar with Social Links and Copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Links */}
          {socialLinks.length > 0 && (
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${txtColor} hover:text-${theme.primaryColor} transition-colors duration-200`}
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size="medium" />
                </a>
              ))}
            </div>
          )}
          
          {/* Copyright */}
          <Text 
            text={`© ${new Date().getFullYear()} Your Store. All rights reserved.`}
            type="p"
            className="text-sm text-gray-400"
          />
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
  showNewsletter: PropTypes.bool,
  newsletterProps: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    placeholder: PropTypes.string,
    buttonText: PropTypes.string,
    onSubmit: PropTypes.func,
  }),
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  className: PropTypes.string,
};

export default Footer;