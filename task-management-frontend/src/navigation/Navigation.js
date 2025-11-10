import React, { useState, useEffect } from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import logo01 from '../assets/logo01.png';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);

  useEffect(() => {
    // Debounced resize listener for optimization
    const handleResize = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className='navibar' role="navigation" aria-label="Main Navigation">
      <div className='navibar-container'>
        <div className='branding'>
          <Link to='/' className='navibar-logo' onClick={closeMenu} aria-label="Homepage">
            <img src={logo} alt="App Logo" className="logo-img" />
          </Link>
          <img src={logo01} alt="Side Icon" className="logo-side" />
        </div>
        <button
          className='menu-icon'
          onClick={handleMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} aria-hidden="true" />
        </button>
        <ul className={`navi-menu${menuOpen ? ' active' : ''}`}>
          <li className='navi-item'>
            <Link to='/' className='navi-links' onClick={closeMenu}>NEW</Link>
          </li>
          <li className='navi-item'>
            <Link to='/overview' className='navi-links' onClick={closeMenu}>OVERVIEW</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
