import React, { useState, useEffect } from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';
import "react-pro-sidebar/dist/css/styles.css";

// Import your logo (place logo.png inside src/assets or public folder)
import logo from '../assets/Logo.jpg';

function Navigation() {
    const [button, setButton] = useState(true);
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
        window.addEventListener('resize', showButton);

        // cleanup listener on unmount
        return () => window.removeEventListener('resize', showButton);
    }, []);

    return (
        <>
            <nav className='navibar'>
                <div className='navibar-container'>
                    
                    {/* 🔥 Logo on top left */}
                    <Link to='/' className='navibar-logo' onClick={closeMobileMenu}>
                        <img src={logo} alt="App Logo" className="logo-img" />
                    </Link>

                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>

                    <ul className={click ? 'navi-menu active' : 'navi-menu'}>
                        <li className='navi-item'>
                            <Link to='/' className='navi-links' onClick={closeMobileMenu}>
                                NEW
                            </Link>
                        </li>
                        <li className='navi-item'>
                            <Link to='/overview' className='navi-links' onClick={closeMobileMenu}>
                                OVERVIEW
                            </Link>
                        </li>
                    </ul>

                </div>
            </nav>
        </>
    );
}

export default Navigation;
