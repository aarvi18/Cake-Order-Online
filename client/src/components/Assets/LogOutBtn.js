import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from "../../context/auth"
import toast from "react-hot-toast";

const LogOutBtn = () => {
  const [auth, setAuth] = useAuth();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };
  return (
    <>
      {/* <Link> <button className='btn1 login-btn'>Log out</button> </Link> */}
      <Link onClick={handleLogout} to='/login' className='login-btn btn1'>Logout</Link>
    </>
  )
}

export default LogOutBtn