import React from 'react'
import '../styles/PageNotFound.css'

const PageNotFound = () => {
  return (
    <div className="not-found-container">
        <h1 className="not-found-heading">404</h1>
        <p className="not-found-text">Oops! Looks like you're lost.</p>
        <p className="not-found-text">The page you're looking for doesn't exist.</p>
        <a href="/" className="not-found-link">Go back to home</a>
      </div>
  );
}

export default PageNotFound