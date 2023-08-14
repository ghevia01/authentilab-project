// Importing Dependencies
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import InputField from '../SharedComponents/InputField/InputField';
import FormButton from '../SharedComponents/FormButton/FormButton';
import LoadingAnimation from '../SharedComponents/LoadingAnimation/LoadingAnimation';

import './LoginFormStyles.css';

// ------------------------------------------------------ Variables and Constants --------------------------------------------------------->

// Default login form state data
const defaultLoginData = {
    userName: '',
    password: '',
};

// Default Validation status state data
const defaultValidationStatus = {
    userName: false,
    password: false,
};

// Default validation status state data
const defaultValidationErrors = {
    userName: '',
    password: '',
};

// Error messages for form validation
const errorMessages = {
    userName: 'Enter a valid username or email address.',
    password: 'Enter a valid password.',
};

// const loginValidationSchema = Yup.object({
//     username: Yup.string()
//         .required('Enter a valid username or email address.'),
//     password: Yup.string()
//         .required('Enter a valid password.'),
// });

// ------------------------------------------------------ LoginForm Component --------------------------------------------------------->

// Login form component
const LoginForm = () => {

    //------------------------------------------------------ Form States --------------------------------------------------------->

    // const formik = useFormik({
    //     initialValues: {
    //         username: '',
    //         password: '',
    //     },
    //     validationSchema: loginValidationSchema,
    //     onSubmit: (values) => {
    //         handleFormSubmit(values);     
    //     },
    // });

    // Form state containing the input field values
    const [loginFormData, setLoginFormData] = useState(defaultLoginData);

    // Form state containing the validation status
    const [validationStatus, setValidationStatus] = useState(defaultValidationStatus);

    // Form state containing the validation error messages
    const [validationErrors, setValidationErrors] = useState(defaultValidationErrors);

    // Form state containing the password visibility status
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Form state containing the form validation status
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    // Form state containing the loading status
    const [isLoading, setIsLoading] = useState(false);

    //------------------------------------------------------ Form Effects --------------------------------------------------------->

    // Log the form data to the console for debugging purposes
    useEffect(() => {
        console.log('loginFormData: ', loginFormData);
    }, [loginFormData]);

    //------------------------------------------------------ Form Handlers --------------------------------------------------------->

    // Handle input change when user types in the input field
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData(loginFormData => ({ ...loginFormData, [name]: value }));
    };

    // Handle Form Submit when user clicks on the submit button
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Set the form to submitted
        setIsFormSubmitted(true);

        // Destructure the loginFormData object
        const { isFormValid } = formValidation();

        // If the form is valid, send the login form data to the server
        if (isFormValid) {

            // Reset the validation error messages
            resetValidationErrors();

            // Set the loading state to true
            setIsLoading(true);

            try {

                // Send the login form data to the server
                const { data, response } = await sendUserLoginData();

                if (response.status === 200) {

                    loginFormReset(); // Reset the form input fields

                } else if (response.status === 400) {

                    // Error message for unsuccessful login attempt
                    setValidationErrors(validationErrors => ({ ...validationErrors, userName: data.message }));

                } else {

                    // Show a general error message
                    setValidationErrors(validationErrors => ({ ...validationErrors, userName: response.statusText }));
                }

            } catch (error) {

                // Log and show a general error message
                console.log(error);
                const errorMessage = error.message || 'An error occurred while fetching the data';
                setValidationErrors(validationErrors => ({ ...validationErrors, userName: errorMessage }));

            } finally {

                // Set the loading state back to false
                setIsLoading(false);
            }
        }
    };

    // Send --POST-- request to the server with the login form data
    const sendUserLoginData = async (e) => {

        // Destructure the loginFormData object
        const dataToSend = loginFormData;

        try {

            // Send the login form data to the server
            const response = await fetch(`${process.env.REACT_APP_LOGIN_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            // If the server response is not ok (e.g., status code is not 2xx), throw an error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Get the response from the server and log it
            const data = await response.json();
            console.log(data);

            // Return the data and response
            return { data, response };

        } catch (error) {

            console.error("Error occurred while fetching the data: ", error);

            // Return a default error response
            return {
                data: null,
                response: {
                    status: 500,
                    statusText: "An error occurred while fetching the data",
                }
            };
        }
    };

    //------------------------------------------------------ Validation Functions --------------------------------------------------------->

    // Validate Form
    const formValidation = () => {

        // Create new states for validation errors and validation status
        const newValidationErrors = { ...validationErrors };
        const newValidationStatus = { ...validationStatus };

        // Validate each form input
        for (let field in loginFormData) {

            // Validate each form input field
            const { isValid, errorMessage } = validateField(field, loginFormData[field]);

            // Set the new states
            newValidationStatus[field] = isValid;
            newValidationErrors[field] = errorMessage;
        }

        // Set the new states
        setValidationErrors(newValidationErrors);
        setValidationStatus(newValidationStatus);

        // Check if all the form inputs are valid
        const isFormValid = areAllFieldsValid(newValidationStatus);

        // Return true or false
        return { isFormValid };
    };

    // Validate each form input field
    const validateField = (field, value) => {

        // If the value is empty, set the error message and return false
        if (value === '') {

            // Return false if the value is empty and set the error message
            return {
                isValid: false,
                errorMessage: errorMessages[field]
            }
        }

        // Return true if the value is not empty and set the error message to empty string
        else {

            // Return true if the value is not empty and set the error message to empty string
            return {
                isValid: true,
                errorMessage: '',
            };
        }
    }

    // Check if all the form inputs are valid
    const areAllFieldsValid = (validationStatus) => {

        // Check if all the form inputs are valid and return true or false
        return Object.values(validationStatus).every(Boolean);
    }

    //------------------------------------------------------ Form Reset --------------------------------------------------------->

    // Reset the validation error messages
    const resetValidationErrors = () => {
        setValidationErrors(defaultValidationErrors);
    };

    // Reset the form input fields and set the form to not submitted
    const loginFormReset = () => {
        setLoginFormData(defaultLoginData);
        setIsFormSubmitted(false);
        resetValidationErrors();
    };

    //------------------------------------------------------ Form Toggles --------------------------------------------------------->

    // Toggle the password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    //------------------------------------------------------ Form Rendering --------------------------------------------------------->

    // Render Login Form
    return (

        <form className="login-form-container flex flex-align-center flex-direction-column" onSubmit={handleFormSubmit}>

            <h1 className='login-form-h1'>Authentilab</h1>

            <hr className='login-form-hr' />

            {/* If the form is submitted and there is a validation error for the field, display the error message */}
            {isFormSubmitted && validationErrors.userName && (
                <p className="login-error-msg">{validationErrors.userName}</p>
            )}

            {/* Username input field */}
            <InputField
                className='username-input'
                type="text"
                id="userName"
                name="userName"
                value={loginFormData.userName}
                onChange={handleInputChange}
                placeholder="Username or email"
                aria-label="Username or email"
            />

            {/* If the form is submitted and there is a validation error for the field, display the error message */}
            {isFormSubmitted && validationErrors.password && (
                <p className="login-error-msg">{validationErrors.password}</p>
            )}

            {/* Password input field */}
            <div className="password-input-container flex-between">
                <InputField
                    className='password-input'
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    aria-label="Password"
                />
                <button type="button" className='password-icon-btn' onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon className='password-eye-icon' icon={isPasswordVisible ? faEye : faEyeSlash} />
                </button>
            </div>

            <FormButton type="submit" className='login-form-btn' id="loginBtn" name="loginBtn" text="Sign In"></FormButton>

            <small className="register-text">
                Don't have an account yet? <Link to="/register" className="form-link" >Register</Link>
            </small>

            <small className="access-help-text">
                <Link to="/access-help" className="form-link">Can't access your account? </Link>
            </small>

            {/* If the loading state is true, display the loading spinner */}
            {isLoading &&
                <LoadingAnimation />
            }

        </form>
    );
};

export default LoginForm;
