/**
 * Input.js
 * Form input component with various types
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  id,
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  const inputClasses = `
    w-full
    px-4
    py-2
    border
    rounded
    focus:outline-none
    focus:ring-2
    focus:ring-${theme.primaryColor}
    focus:border-transparent
    ${error ? `border-red-500` : `border-gray-300`}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;
  
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id || name} 
          className={`block mb-2 text-sm font-medium ${error ? 'text-red-500' : `text-${theme.labelColor}`}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id || name}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf([
    'text',
    'password',
    'email',
    'number',
    'tel',
    'url',
    'search',
    'date',
    'time',
    'datetime-local',
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;