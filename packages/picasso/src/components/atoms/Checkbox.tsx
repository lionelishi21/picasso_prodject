/**
 * Checkbox.js
 * Checkbox form component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const Checkbox = ({
  label,
  checked,
  onChange,
  name,
  id,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        id={id || name}
        disabled={disabled}
        className={`
          h-5
          w-5
          border
          rounded
          focus:ring-2
          focus:ring-${theme.primaryColor}
          text-${theme.primaryColor}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />
      {label && (
        <label
          htmlFor={id || name}
          className={`ml-2 text-sm ${disabled ? 'opacity-50' : ''} ${error ? 'text-red-500' : `text-${theme.labelColor}`}`}
        >
          {label}
        </label>
      )}
      {error && <p className="mt-1 ml-7 text-sm text-red-500">{error}</p>}
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;