import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = () => {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000);
        count === 0 &&
            navigate('/login', {
                state: location.pathname,
            });
        return () => clearInterval(interval);
    }, [count, navigate, location]);
    return (
        <>
            <h1>redirecting to you in {count} second </h1>
        </>
    );
};

export default Spinner;