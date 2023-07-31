import React from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './FormButtonStyles.css';

// Form Button Component - Used in Login and Register Forms. linkTo is optional and is used to navigate to a different page.
const FormButton = ({ className, type, id, name, text, linkTo }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if(linkTo) {
            navigate(linkTo);
        }
    };
    

    return (
        <button className={`form-button ${className}`} type={type} id={id} name={name} onClick={handleClick}>
            {text}
        </button>
    );
}

// Prop Types
FormButton.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    text: PropTypes.string,
    linkTo: PropTypes.string
};

// Default Props
FormButton.defaultProps = {
    linkTo: ""
};

export default FormButton;