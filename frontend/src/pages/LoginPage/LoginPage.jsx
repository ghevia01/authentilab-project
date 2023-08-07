import React, { useEffect } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import './LoginPageStyles.css';

const LoginPage = () => {

    useEffect(() => {
        document.title = 'Login | AuthentiLab';
    }, []);

    return (
        <div className='login-page flex-center'>
            <LoginForm />
        </div>
    );
};

export default LoginPage;