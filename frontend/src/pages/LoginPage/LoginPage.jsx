import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import './LoginPageStyles.css';

const LoginPage = () => {

    return (
        <div className='login-page flex-center'>
            <LoginForm />
        </div>
    );
};

export default LoginPage;