import React, { useEffect } from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './RegisterPageStyles.css';

const RegisterPage = () => {

    useEffect(() => {
        document.title = 'Register | Authentilab';
    }, []);

    return (
        <div className='register-page'>
        <RegisterForm />
        </div>
    );
};

export default RegisterPage;