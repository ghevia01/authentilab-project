import React, { useState } from 'react';
import './LoginStyles.css';
import { handleInputChange, handleFormSubmit } from './LoginFormHandlers.js';

const LoginForm = () => {

    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });

    return (
        <form className="form-container" onSubmit={(e) => handleFormSubmit(e, formData)}>

            <h1>Log in to Account</h1>

            <hr />

            <label className='input-label' htmlFor="userName">Username or email</label>
            <input
                className='form-input'
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={(e) => handleInputChange(e, formData, setFormData)}
            />

            <label className='input-label' htmlFor="password">Password</label>
            <input
                className='form-input'
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange(e, formData, setFormData)}
                placeholder="Enter your password"
            />

            <button
                className='form-button'
                type="submit"
                id='loginBtn'
                name='loginBtn'>
                Login
            </button>

            <small className="register-text">
                Don't have an account yet? <a className="register-link" href="register.php">Register</a>
            </small>

        </form>
    );
};

export default LoginForm;