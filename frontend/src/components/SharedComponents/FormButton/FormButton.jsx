import React from "react";
import PropTypes from 'prop-types';
import './FormButtonStyles.css';

// Form Button Component - Used in Login and Register Forms. linkTo is optional and is used to navigate to a different page.
const FormButton = ({ className, type, id, name, text, disabled }) => {

    return (
        <button
            className={`form-button ${className}`}
            type={type}
            id={id}
            name={name}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

// Prop Types
FormButton.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool
};

// Default Props
FormButton.defaultProps = {
    disabled: false
};

export default FormButton;