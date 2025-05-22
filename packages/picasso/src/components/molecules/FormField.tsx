/**
 * FormField.js
 * Component that combines a label with an input
 */
import React from 'react';
import PropTypes from 'prop-types';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Checkbox from '../atoms/Checkbox';
import { useTheme } from '../../context/ThemeContext';

const FormField = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  
  // Render different input types based on the type prop
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            options={options || []}
            value={value}
            onChange={onChange}
            name={name}
            id={name}
            label={label}
            placeholder={placeholder}
            error={error}
            required={required}
            disabled={disabled}
            {...props}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            label={label}
            checked={value}
            onChange={onChange}
            name={name}
            id={name}
            error={error}
            disabled={disabled}
            {...props}
          />
        );
      default:
        return (
          <Input
            type={type}
            label={label}
            value={value}
            onChange={onChange}
            name={name}
            id={name}
            placeholder={placeholder}
            error={error}
            required={required}
            disabled={disabled}
            {...props}
          />
        );
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      {renderInput()}
    </div>
  );
};

FormField.propTypes = {
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
    'textarea',
    'select',
    'checkbox',
    'radio',
  ]),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FormField;