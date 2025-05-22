/**
 * SearchBar.js
 * Search input with button
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

const SearchBar = ({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  withButton = true,
  suggestions = [],
  style = {},
  className = '',
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      // Don't clear the input so the user can see what they searched for
      setShowSuggestions(false);
    }
  };
  
  const handleChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };
  
  return (
    <div className={`relative ${className}`} style={style}>
      <form onSubmit={handleSubmit} className="flex">
        <Input
          type="search"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="mb-0 mr-0 rounded-r-none"
          {...props}
        />
        {withButton && (
          <Button
            text=""
            icon={<Icon name="search" color="white" />}
            onClick={handleSubmit}
            className="rounded-l-none"
            aria-label="Search"
          />
        )}
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  withButton: PropTypes.bool,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default SearchBar;