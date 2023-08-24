import React from "react";
import PropTypes from "prop-types";
import "./InputFieldStyles.css";


// Reusable input field component for forms. onChange function is optional.
const InputField = ({ className, name, type, placeholder, value, onChange, ariaLabel, autoComplete}) => {

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
            autoComplete={autoComplete}
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
    ariaLabel: PropTypes.string.isRequired,
    autoComplete: PropTypes.string,
};

// Default Props
InputField.defaultProps = {
    className: "",
    onChange: () => {},
    placeholder: "",
    ariaLabel: "",
    autoComplete: "off",
};

export default InputField;