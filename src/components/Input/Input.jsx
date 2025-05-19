import React from 'react';

const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  onBlur,
  label,
  error,
  touched,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>{label}</label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={`form-input ${touched && error ? 'invalid' : ''}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {touched && error && (
        <div className="error-text">{error}</div>
      )}
    </div>
  );
};

export default Input;