import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout'
import { toast } from 'react-toastify';
import axios from 'axios';

import '../styles/SignupPage.css'

const SignupPage = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();


    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({ ...prevData, [name]: value }));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await axios.post('/api/v1/auth/register',
                { name, email, password, phone, address }
            );

            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login');
            } else {
                toast.error(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error('Somthing went wrong')
        }
    };
    // console.log(process.env.REACT_APP_API);
    return (
        <Layout>

            <div className="signup-container">
                <div className="signup-card">
                    <h2>Join Us Today</h2>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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
                        {/* <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        /> */}
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <button className='btn1' type="submit">Sign Up</button>
                    </form>
                    <div className="signup-footer">
                        Already have an account? <Link to='/Login'> Log in </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SignupPage