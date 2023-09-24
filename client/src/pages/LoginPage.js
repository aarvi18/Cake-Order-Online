import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';

import '../styles/LoginPage.css'

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await axios.post("/api/v1/auth/login", {
                email,
                password,

            });

            if (res && res.data.success) {
                navigate('/');
                toast.success(res.data && res.data.message);
                    
            } else {
                toast.error(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error('Oops!! Somthing went wrong', { duration: 8000, })
        }
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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