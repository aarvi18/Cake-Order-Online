import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';


import '../styles/LoginPage.css'


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await axios.post("/api/v1/auth/forgot-password", {
                email,
                newPassword,
                answer,

            });

            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate('/login');

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
                            type="text"
                            name="answer"
                            placeholder="Enter your secret Answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className='btn1'>Reset Password</button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default ForgotPassword