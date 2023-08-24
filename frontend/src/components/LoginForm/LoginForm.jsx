// ------------------------------------------------------ Importing Depenencies ------------------------------------------------------ //
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { sendUserLoginData } from '../../services/authService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import InputField from '../SharedComponents/InputField/InputField';
import FormButton from '../SharedComponents/FormButton/FormButton';
import LoadingAnimation from '../SharedComponents/LoadingAnimation/LoadingAnimation';

import './LoginFormStyles.css';

// ------------------------------------------------------ Variables and Constants --------------------------------------------------------->

// Default login form state data
const defaultLoginData = {
    username: '',
    password: '',
};

// Default validation status state data
const defaultServerErrors = {
    username: '',
    password: '',
};

// Validation schema for formik
const loginValidationSchema = Yup.object({
    username: Yup.string()
        .required('Enter a valid username or email address.'),
    password: Yup.string()
        .required('Enter a valid password.'),
});

// ------------------------------------------------------ LoginForm Component --------------------------------------------------------->

// Login form component
const LoginForm = () => {

    //------------------------------------------------------ Form States --------------------------------------------------------->

    // Formik hook for handling the form state. Contains the form data (initialValues),
    // validation schema (Yup object) and the submit function (onSubmit)
    const formik = useFormik({
        initialValues: defaultLoginData,
        validationSchema: loginValidationSchema,
        onSubmit: (values) => {
            handleFormSubmit(values);
        },
    });

    // Form state containing the server error messages
    const [serverErrors, setServerErrors] = useState(defaultServerErrors);

    // Form state containing the password visibility status
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Form state containing the loading status
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(formik.submitCount);
        console.log(formik.values);
        console.log(formik.errors);
    }, [formik.submitCount, formik.values, formik.errors]);

    //------------------------------------------------------ Form Handlers --------------------------------------------------------->

    // Handle Form Submit when user clicks on the submit button
    const handleFormSubmit = async (values) => {

        // Reset the server error messages
        resetServerErrors();

        // Set the loading state to true
        setIsLoading(true);

        try {

            // Send the user login data to the server through the authService api
            const { data, response } = await sendUserLoginData(values);

            if (response.status === 200) {

                // Reset the form
                loginFormReset();

            } else if (response.status === 400) {

                // Error message for unsuccessful login attempt
                setServerErrors(serverErrors => ({
                    ...serverErrors,
                    username: data.message,
                }));

            } else if (response.status === 500) {

                // Log and show the server error message
                setServerErrors(serverErrors => ({
                    ...serverErrors,
                    username: (data && data.message ? data.message : response.statusText),
                }));
            }
        } catch (err) {

            // Show a general error message
            setServerErrors(serverErrors => ({
                ...serverErrors,
                username: err.toString(),
            }));

        } finally {

            // Set the loading state back to false
            setIsLoading(false);
        }
    };

    //------------------------------------------------------ Form Reset --------------------------------------------------------->

    // Reset the validation error messages
    const resetServerErrors = () => {
        setServerErrors(defaultServerErrors);
    };

    // Reset the form input fields and set the form to not submitted
    const loginFormReset = () => {
        formik.resetForm();
        resetServerErrors();
    };

    //------------------------------------------------------ Form Toggles --------------------------------------------------------->

    // Toggle the password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    //------------------------------------------------------ Form Rendering --------------------------------------------------------->

    return (

        <form className="login-form-container flex flex-align-center flex-direction-column" onSubmit={formik.handleSubmit}>

            <h1 className='login-form-h1'>Authentilab</h1>

            <hr className='login-form-hr' />

            {/* If the form is submitted and there is a validation error for the field or a server error, display the error message */}
            {(formik.submitCount > 0) && (formik.errors.username || serverErrors.username) && (
                <p className="login-error-msg">
                    {formik.errors.username || serverErrors.username}
                </p>
            )}

            {/* Username input field */}
            <InputField
                className='username-input'
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                placeholder="Username or email"
                aria-label="Username or email"
            />

            {/* If the form is submitted and there is a validation error for the field or a server error, display the error message */}
            {(formik.submitCount > 0) && (formik.errors.password || serverErrors.password) && (
                <p className="login-error-msg">
                    {formik.errors.password || serverErrors.password}
                </p>
            )}

            {/* Password input field */}
            <div className="password-input-container flex-between">
                <InputField
                    className='password-input'
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="current-password"
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
