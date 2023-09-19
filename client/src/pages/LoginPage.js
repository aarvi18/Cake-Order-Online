import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layouts/Layout'

import '../styles/LoginPage.css'

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement login logic here
        console.log('Login data:', formData);
    };
    return (
        <Layout>
             <div className="login-container">
                <div className="login-card">
                    <h2>Welcome Back!</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete='off'
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className='btn1'>Login</button>
                    </form>
                    <div className="login-footer">
                        Don't have an account? <Link to='/SignupPage'>Sign Up</Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default LoginPage