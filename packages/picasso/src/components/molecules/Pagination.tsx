/**
 * Pagination.js
 * Pagination controls for product listings
 */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { useTheme } from '../../context/ThemeContext';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Handle invalid inputs
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  // Calculate the range of page numbers to display
  const getVisiblePageNumbers = () => {
    const pages = [];
    
    let startPage = Math.max(1, validCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we hit the upper boundary
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const visiblePages = getVisiblePageNumbers();
  
  // Page change handler
  const handlePageChange = (page) => {
    if (page !== validCurrentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  // If only one page, don't render pagination
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav
      className={`flex items-center justify-center mt-6 ${className}`}
      aria-label="Pagination"
      {...props}
    >
      <ul className="flex items-center -space-x-px">
        {/* First page button */}
        {showFirstLast && (
          <li>
            <Button
              onClick={() => handlePageChange(1)}
              disabled={validCurrentPage === 1}
              text=""
              icon={<Icon name="chevrons-left" size="small" />}
              variant={validCurrentPage === 1 ? 'text' : 'outline'}
              className="px-2 py-2 border border-gray-300 rounded-l-md"
              aria-label="First page"
            />
          </li>
        )}
        
        {/* Previous page button */}
        <li>
          <Button
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            text=""
            icon={<Icon name="chevron-left" size="small" />}
            variant={validCurrentPage === 1 ? 'text' : 'outline'}
            className={`px-2 py-2 border border-gray-300 ${!showFirstLast ? 'rounded-l-md' : ''}`}
            aria-label="Previous page"
          />
        </li>
        
        {/* Page numbers */}
        {visiblePages.map((page) => (
          <li key={page}>
            <Button
              onClick={() => handlePageChange(page)}
              text={page.toString()}
              variant={page === validCurrentPage ? 'primary' : 'outline'}
              className={`px-4 py-2 border ${
                page === validCurrentPage 
                  ? `bg-${theme.primaryColor} border-${theme.primaryColor} text-white` 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-current={page === validCurrentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
            />
          </li>
        ))}
        
        {/* Next page button */}
        <li>
          <Button
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages}
            text=""
            icon={<Icon name="chevron-right" size="small" />}
            variant={validCurrentPage === totalPages ? 'text' : 'outline'}
            className={`px-2 py-2 border border-gray-300 ${!showFirstLast ? 'rounded-r-md' : ''}`}
            aria-label="Next page"
          />
        </li>
        
        {/* Last page button */}
        {showFirstLast && (
          <li>
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={validCurrentPage === totalPages}
              text=""
              icon={<Icon name="chevrons-right" size="small" />}
              variant={validCurrentPage === totalPages ? 'text' : 'outline'}
              className="px-2 py-2 border border-gray-300 rounded-r-md"
              aria-label="Last page"
            />
          </li>
        )}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLast: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  className: PropTypes.string,
};

export default Pagination;