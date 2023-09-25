import React from 'react'
import { Link } from 'react-router-dom'



const Login = () => {
  return (
    <>
      <Link to='/login' className='login-btn btn1'>LogIn</Link>
      {/* <Link to="/Login"> <button className='btn1 login-btn'>Login</button> </Link> */}
    </>
  )
}

export default Login