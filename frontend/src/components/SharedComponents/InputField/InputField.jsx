import React from "react";
import PropTypes from "prop-types";
import "./InputFieldStyles.css";


// Reusable input field component for forms. onChange function is optional.
const InputField = ({ className, name, type, placeholder, value, onChange, ariaLabel}) => {

    return (
        <input
            className={`form-input ${className}`}
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label={ariaLabel}
        />
    );
}

// Prop Types
InputField.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onChange: PropTypes.func,
    ariaLabel: PropTypes.string
};

// Default Props
InputField.defaultProps = {
    className: "",
    onChange: () => {},
    placeholder: "",
    ariaLabel: ""
};

export default InputField;