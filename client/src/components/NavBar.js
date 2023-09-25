import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

// import Searchbar from './Assets/Searchbar';
import Login from './Assets/LoginBtn';
import Logout from './Assets/LogOutBtn';
import '../styles/NavBar.css'
import '../styles/Header.css'

import { useAuth } from '../context/auth';

import Logo from '../images/logo.png'


const Navbar = () => {

    const [cartItems, setCartItems] = useState(0); // Initialize cart items
    const [auth, setAuth] = useAuth();
    
    return (
        <nav className="navbar">
            <div className="navbar-container">

                <div>
                    <Link to="/"> <img className='logo' src={Logo} /></Link>
                </div>

                {/* <div className='search-bar'>
                    < Searchbar />
                </div> */}

                <div className="cart">

                    {
                        !auth.user ? (<Login />) : (<Logout />)
                    }


                    <Link to='/Cart'> <span className="cart-icon"><FontAwesomeIcon icon={faCartShopping} className='fontawesomeicon' /></span> </Link>
                    <span className="cart-count">{cartItems}</span>

                </div>

            </div>
        </nav>
    );
};

export default Navbar





