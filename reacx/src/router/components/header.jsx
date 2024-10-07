import React, { useState } from 'react';  
import "../css/header.css"
import { Link, NavLink } from 'react-router-dom'; 

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <nav>
                <div className="container">
                    <Link to="/" className="logo">
                        <img 
                            src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png" 
                            alt="Logo" 
                        />
                    </Link>
                    <div className="auth-links">
                        <Link to="#" className="login">Log in</Link>
                        <Link to="#" className="get-started">Get started</Link>
                    </div>
                    <button 
                        className="menu-toggle" 
                        onClick={toggleMenu}
                    >
                        Menu
                    </button>
                    <div 
                        className={`menu ${isMenuOpen ? 'open' : ''}`}
                        id="mobile-menu-2"
                    >
                        <ul>
                            <li>
                                <NavLink
                                    to="#"
                                    className={({ isActive }) => 
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0 ${isActive ? 'active' : ''}`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li> 
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
