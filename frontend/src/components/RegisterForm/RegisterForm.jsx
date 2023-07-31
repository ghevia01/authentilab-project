import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import InputField from '../SharedComponents/InputField/InputField';
import FormButton from '../SharedComponents/FormButton/FormButton';
import LoadingAnimation from '../SharedComponents/LoadingAnimation/LoadingAnimation';

import './RegisterFormStyles.css';

// Login form component
const RegisterForm = () => {

    // Form data state containing username and password
    const [registerFormData, setRegisterFormData] = useState({

        firstName: '',
        lastName: '',
        gender: '',
        country: '',
        userName: '',
        email: '',
        password: '',
        rePassword: ''
    });

    // Form state containing the form validation status
    const [validationStatus, setValidationStatus] = useState({

        firstName: false,
        lastName: false,
        gender: false,
        country: false,
        userName: false,
        email: false,
        password: false,
    });

    // Form state containing the validation error messages
    const [validationErrors, setValidationErrors] = useState({});

    // State containing the gender selection status
    const [isFirstOption, setIsFirstSelection] = useState(true);

    // Form state containing the loading status
    const [isLoading, setIsLoading] = useState(false);

    // Regular expressions for form validation
    const firstNameRegex = /^[A-Za-z]{2,}$/;
    const lastNameRegex = /^[A-Za-z]{2,}$/;
    const userNameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,15}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/

    // Form validation functions
    const validator = {
        firstName: value => firstNameRegex.test(value),
        lastName: value => lastNameRegex.test(value),
        gender: value => value !== '',
        country: value => value !== '',
        userName: value => userNameRegex.test(value),
        email: value => emailRegex.test(value),
        password: value => passwordRegex.test(value),
        rePassword: value => value === registerFormData.password,
    };

    // Error messages for form validation
    const errorMessages = {
        firstName: 'First name must have at least 2 characters and contain only letters.',
        lastName: 'Last name must have at least 2 characters and contain only letters.',
        gender: 'Field cannot be empty',
        country: 'Field cannot be empty',
        userName: 'Username must contain only letters and numbers and must start with a letter.',
        email: 'Invalid email address.',
        password: 'Password must contain at least 8 characters, one uppercase and lowercase letter, one number and one special character.',
        rePassword: 'Passwords do not match.',
    };

    // Log the validation errors
    useEffect(() => {
        console.log(validationErrors);
    }, [validationErrors]);

    //------------------------------------------------------ Form Handlers --------------------------------------------------------->


    // Handle the form submit event
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Destructure the loginFormData object
        const { formIsValid } = formValidation();

        // If the form is valid, send the register form data to the server
        if (formIsValid) {

            // Reset the validation error messages
            resetValidationErrors();

            // Set the loading state to true
            setIsLoading(true);

            try {

                // Send the register form data to the server
                const { data, response } = await sendRegisterFormData();

                // If the response is ok, redirect to the home page
                if (response.status === 200) {

                    console.log(data);
                    registerFormReset();
                }

                // If the response is not ok, display the error message
                else if (response.status === 400) {

                    console.log(data);
                }

                // If the response is not ok, display the error message
                else {

                    console.log("Something went wrong");
                }

            } catch (error) {

                // Log the error
                console.log(error);

            } finally {

                setIsLoading(false); // Set the loading state back to false
            }
        }
    };

    // Send the register form data to the server
    const sendRegisterFormData = async (e) => {

        // Destructure the loginFormData object
        const {
            firstName,
            lastName,
            gender,
            country,
            userName,
            email,
            password
        } = registerFormData;

        try {

            // Send the login form data to the server
            const response = await fetch(`${process.env.REACT_APP_REGISTER_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    gender,
                    country,
                    userName,
                    email,
                    password
                })
            });

            // Get the response from the server and log it
            const data = await response.json();

            // Return the response and the data
            return { data, response };

        } catch (error) {

            // Log the error
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

    //------------------------------------------------------ Form Validation and Handlers --------------------------------------------------------->

    // Form validation function
    const formValidation = () => {

        // Form validation status
        let formIsValid = false;

        // Validate each form input
        for (let field in registerFormData) {
            validateField(field, registerFormData[field]);
        }

        // Array containing the validation status of each form input
        const validationArray = Object.values(validationStatus);

        // If every form input is valid, set the form validation status to true
        if (validationArray.every(Boolean)) {
            formIsValid = true;
        }

        return { formIsValid };
    }

    // Handle the input change event
    const handleInputChange = (e) => {

        // Destructure the event object
        const { name, value } = e.target;

        // Set the form data
        setRegisterFormData({ ...registerFormData, [name]: value });

        // Validate the input
        validateField(name, value);
    };

    // Validate the input
    const validateField = (name, value) => {

        // If the value is empty, set the error message and return false
        if (value === '') {
            setValidationErrors((validationErrors) => ({ ...validationErrors, [name]: "Field cannot be empty" }));
            setValidationStatus((validationStatus) => ({ ...validationStatus, [name]: false }));
        }

        // If the value is invalid, set the error message and return false
        else if (!validator[name](value)) {
            setValidationErrors((validationErrors) => ({ ...validationErrors, [name]: errorMessages[name] }));
            setValidationStatus((validationStatus) => ({ ...validationStatus, [name]: false }));
        }

        // If the value is valid, set the error message and return true
        else {
            setValidationErrors((validationErrors) => ({ ...validationErrors, [name]: "" }));
            setValidationStatus((validationStatus) => ({ ...validationStatus, [name]: true }));
        }
    };

    //------------------------------------------------------ Form Reset --------------------------------------------------------->

    // Reset the form data
    const resetValidationErrors = () => {
        setValidationErrors({});
    };

    // Reset the form input fields and set the form to not submitted
    const registerFormReset = () => {

        setRegisterFormData({
            firstName: '',
            lastName: '',
            gender: '',
            country: '',
            userName: '',
            email: '',
            password: '',
            rePassword: ''
        });

        resetValidationErrors();
    };

    //------------------------------------------------------ Form Render --------------------------------------------------------->

    // Render Register Form
    return (

        <div className='register-page-content flex-center'>

            <form className="register-form flex flex-align-center flex-direction-column" onSubmit={handleFormSubmit}>

                <h1 className='register-form-h1'>Create Account</h1>

                <hr className='register-form-hr' />

                <fieldset className='register-form-fieldset flex-center'>

                    <legend className='hidden'>Sign up information</legend>

                    <div className='register-fieldset-container flex-center flex-wrap'>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="firstName">First Name</label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="firstName" s
                                name="firstName"
                                value={registerFormData.firstName}
                                onChange={handleInputChange}
                                placeholder='Enter first name'
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.firstName}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="lastName">Last Name</label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={registerFormData.lastName}
                                onChange={handleInputChange}
                                placeholder='Enter last name'
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.lastName}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="email">Email</label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="email"
                                name="email"
                                value={registerFormData.email}
                                onChange={handleInputChange}
                                placeholder='someone@example.com'
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.email}
                            </div>
                        </div>


                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="country">Country</label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="country"
                                name="country"
                                value={registerFormData.country}
                                onChange={handleInputChange}
                                placeholder='Enter country'
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.country}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="gender">Gender</label>
                            <select
                                className={`register-input-field ${isFirstOption ? 'select-gender-placeholder' : ''}`}
                                value={registerFormData.gender}
                                type="text"
                                id="gender"
                                name="gender"
                                onChange={e => {
                                    handleInputChange(e);
                                    setIsFirstSelection(false);
                                }} >
                                <option value="" className='placeholder' disabled>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="ratherNot">Rather not say</option>
                            </select>
                            <div className="register-field-error-msg" >
                                {validationErrors.gender}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="userName">Username</label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="userName"
                                name="userName"
                                value={registerFormData.userName}
                                onChange={handleInputChange}
                                placeholder='Create username'
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.userName}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="password">Password</label>
                            <InputField
                                className='register-input-field'
                                type="password"
                                id="password"
                                name="password"
                                value={registerFormData.password}
                                onChange={handleInputChange}
                                placeholder="Create password"
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.password}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="rePassword">Re-enter Password</label>
                            <InputField
                                className='register-input-field'
                                type="password"
                                id="rePassword"
                                name="rePassword"
                                value={registerFormData.rePassword}
                                onChange={handleInputChange}
                                placeholder="Re-enter password"
                            />
                            <div className="register-field-error-msg" >
                                {validationErrors.rePassword}
                            </div>
                        </div>

                    </div>

                </fieldset>

                {/* <p className="terms-and-cond">
                    By clicking 'Sign Up', you agree to our
                    <Link className="form-link" to="/terms">Terms and Conditions</Link>
                </p> */}

                <FormButton
                    className='signup-btn'
                    type="submit"
                    id='loginBtn'
                    name='loginBtn'
                    text='Sign Up'
                />

                <small className="sign-in-text">
                    Already have an account? <Link className="form-link" to="/">Sign in</Link>
                </small>

                {/* If the loading state is true, display the loading spinner */}
                {isLoading && (
                    <LoadingAnimation />
                )}

            </form >
        </div>
    );
};

export default RegisterForm;