import React from 'react'
import '../../styles/Footer.css'

const Footer = () => {
  return (
    <div>
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    {/* <img className='logo' src={Logo} alt="Logo" /> */}
                </div>
            </div>
            <p className="footer-copy"> All Rights Reserved &#169; 2023 Delicious Cakes.</p>
            {/* <img className='payment-logo' src={ Payment } /> */}
            
        </footer>
    </div>
  )
}

export default Footer