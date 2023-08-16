// ------------------------------------------------------ Importing Depenencies ------------------------------------------------------ //
import React, { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { sendRegisterFormData } from '../../services/registerService';

import InputField from '../SharedComponents/InputField/InputField';
import FormButton from '../SharedComponents/FormButton/FormButton';
import LoadingAnimation from '../SharedComponents/LoadingAnimation/LoadingAnimation';

import './RegisterFormStyles.css';

// ------------------------------------------------------ Register Form Vars, Consts and Objects --------------------------------------------------------->

// Default register form data
const defaultRegisterFormData = {
    firstName: '',
    lastName: '',
    gender: '',
    country: '',
    userName: '',
    email: '',
    password: '',
    rePassword: '',
};

// Default validation status
const defaultValidationStatus = {
    firstName: false,
    lastName: false,
    gender: false,
    country: false,
    userName: false,
    email: false,
    password: false,
    rePassword: false,
};

// Default validation errors
const defaultValidationErrors = {};

// Create the initial form state for the Reducer
const initialRegisterFormState = {
    registerFormData: defaultRegisterFormData,
    validationStatus: defaultValidationStatus,
    validationErrors: defaultValidationErrors,
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
// Regular expressions for form validation
const regExpressions = {
    firstNameRegex: /^[A-Za-z]{2,}$/,
    lastNameRegex: /^[A-Za-z]{2,}$/,
    userNameRegex: /^[a-zA-Z][a-zA-Z0-9]{2,15}$/,
    emailRegex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
};

//------------------------------------------------------ Register Form Component --------------------------------------------------------->

const RegisterForm = () => {

    //------------------------------------------------------ Form Reducer --------------------------------------------------------->

    // Register form reducer
    const registerFormReducer = (state, action) => {

        // Switch between the action types
        switch (action.type) {

            // Update the register form data
            case 'UPDATE_REGISTER_FORM_DATA':
                return {
                    ...state,
                    registerFormData: { ...state.registerFormData, [action.field]: action.value },
                };

            // Update the validation status
            case 'UPDATE_VALIDATION_STATUS':
                return {
                    ...state,
                    validationStatus: { ...state.validationStatus, [action.field]: action.status },
                };

            // Update the validation errors
            case 'UPDATE_VALIDATION_ERRORS':
                return {
                    ...state,
                    validationErrors: { ...state.validationErrors, [action.field]: action.error },
                };

            // Reset the validation errors
            case 'RESET_VALIDATION_ERRORS':
                return {
                    ...state,
                    validationErrors: defaultValidationErrors,
                }

            // Reset the register form
            case 'RESET_REGISTER_FORM':
                return {
                    ...state,
                    registerFormData: defaultRegisterFormData,
                    validationStatus: defaultValidationStatus,
                    validationErrors: defaultValidationErrors,
                }

            // Return the default state
            default:
                return state;
        }
    };

    // Register form reducer hook
    const [state, dispatch] = useReducer(registerFormReducer, initialRegisterFormState);

    // Form validation functions
    const validator = {
        firstName: value => regExpressions.firstNameRegex.test(value),
        lastName: value => regExpressions.lastNameRegex.test(value),
        gender: value => value !== '',
        country: value => value !== '',
        userName: value => regExpressions.userNameRegex.test(value),
        email: value => regExpressions.emailRegex.test(value),
        password: value => regExpressions.passwordRegex.test(value),
        rePassword: value => value === state.registerFormData.password,
    };

    // Form validation status
    let isFormValid = Object.values(state.validationStatus).every(status => status === true);

    // State containing the gender selection status
    const [isFirstOption, setIsFirstSelection] = useState(true);

    // Form state containing the loading status
    const [isLoading, setIsLoading] = useState(false);

    //------------------------------------------------------ Form Effects --------------------------------------------------------->

    // Log the validation errors
    useEffect(() => {
        console.log(state);
    }, [state]);

    //------------------------------------------------------ Form Handlers --------------------------------------------------------->

    // Handle the form submit event
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // If the form is valid, send the register form data to the server
        if (isFormValid) {

            // Reset the validation error messages
            resetValidationErrors();

            // Set the loading state to true
            setIsLoading(true);

            try {

                // Send the register form data to the server
                const { data, response } = await sendRegisterFormData(state.registerFormData);

                // If the response is ok, redirect to the home page
                if (response.status === 200) {

                    console.log(data);
                    resetRegisterForm();
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

    //------------------------------------------------------ Form Validation and Handlers --------------------------------------------------------->

    // Handle the input change event
    const handleInputChange = (e) => {

        // Destructure the event object
        const { name, value } = e.target;

        // Set the form data
        dispatch({ type: 'UPDATE_REGISTER_FORM_DATA', field: name, value: value })

        // Validate the input
        validateField(name, value);
    };

    // Validate the input
    const validateField = (name, value) => {

        // If the value is empty, set the error message and return false
        if (value === '') {
            dispatch({ type: "UPDATE_VALIDATION_STATUS", field: name, status: false })
            dispatch({ type: "UPDATE_VALIDATION_ERRORS", field: name, error: "Field cannot be empty" })
        }

        // If the value is invalid, set the error message and return false
        else if (!validator[name](value)) {
            dispatch({ type: "UPDATE_VALIDATION_STATUS", field: name, status: false })
            dispatch({ type: "UPDATE_VALIDATION_ERRORS", field: name, error: errorMessages[name] })
        }

        // If the value is valid, set the error message and return true
        else {
            dispatch({ type: "UPDATE_VALIDATION_STATUS", field: name, status: true })
            dispatch({ type: "UPDATE_VALIDATION_ERRORS", field: name, vaerrorlue: "" })
        }
    };

    //------------------------------------------------------ Form Reset --------------------------------------------------------->

    // Reset the validation Errors
    const resetValidationErrors = () => {
        dispatch({ type: 'RESET_VALIDATION_ERRORS' });
    };

    // Reset the form data
    const resetRegisterForm = () => {
        dispatch({ type: 'RESET_REGISTER_FORM' });
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
                            <label className="register-input-label" htmlFor="firstName">First Name<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="firstName" s
                                name="firstName"
                                value={state.registerFormData.firstName}
                                onChange={handleInputChange}
                                placeholder='Enter first name'
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.firstName}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="lastName">Last Name<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={state.registerFormData.lastName}
                                onChange={handleInputChange}
                                placeholder='Enter last name'
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.lastName}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="email">Email<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="email"
                                name="email"
                                value={state.registerFormData.email}
                                onChange={handleInputChange}
                                placeholder='someone@example.com'
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.email}
                            </div>
                        </div>


                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="country">Country<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="country"
                                name="country"
                                value={state.registerFormData.country}
                                onChange={handleInputChange}
                                placeholder='Enter country'
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.country}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="gender">Gender<sup> *</sup></label>
                            <select
                                className={`register-input-field ${isFirstOption ? 'select-gender-placeholder' : ''}`}
                                value={state.registerFormData.gender}
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
                                {state.validationErrors.gender}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="userName">Username<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="text"
                                id="userName"
                                name="userName"
                                value={state.registerFormData.userName}
                                onChange={handleInputChange}
                                placeholder='Create username'
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.userName}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="password">Password<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="password"
                                id="password"
                                name="password"
                                value={state.registerFormData.password}
                                onChange={handleInputChange}
                                placeholder="Create password"
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.password}
                            </div>
                        </div>

                        <div className='register-field-container'>
                            <label className="register-input-label" htmlFor="rePassword">Re-enter Password<sup> *</sup></label>
                            <InputField
                                className='register-input-field'
                                type="password"
                                id="rePassword"
                                name="rePassword"
                                value={state.registerFormData.rePassword}
                                onChange={handleInputChange}
                                placeholder="Re-enter password"
                            />
                            <div className="register-field-error-msg" >
                                {state.validationErrors.rePassword}
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
                    id='signupBtn'
                    name='signupBtn'
                    text='Sign Up'
                    disabled={!isFormValid}
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