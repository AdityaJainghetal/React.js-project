
import React from 'react';

const Header = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
      
          <span style={{fontSize:"30px", fontFamily:"inherit", fontWeight:"600", marginLeft:"-20px"}} >⭐ Review&RATE</span>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <button className="search-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

    
        <div className="auth-links">
          <a href="/signup" className="signup-link">Sign Up</a>
          <a href="/login" className="login-link">Login</a>
        </div>
      </div>
    </nav>
  );
};

export default Header;