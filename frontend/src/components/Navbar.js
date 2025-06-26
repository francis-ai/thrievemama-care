import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import '../assets/css/Navbar.css'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedInName, setLoggedInName] = useState(null);
  const [settings, setSettings] = useState({ site_name: '', logo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const caregiver = JSON.parse(localStorage.getItem('caregiver'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (caregiver) {
      setLoggedInName({ name: caregiver.name, role: 'caregiver' });
    } else if (user) {
      setLoggedInName({ name: user.name, role: 'user' });
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/get-settings');
        const data = res.data;

        setSettings({
          site_name: data.site_name || 'ThriveMama',
          logo: data.logo ? `http://localhost:5000/uploads/website-settings/${data.logo}` : '/ThriveMama.png'
        });
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInName(null);
    navigate('/login');
  };

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <Link to="/" className="logo" onClick={closeNav} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={settings.logo} alt="Logo" height="50" style={{ objectFit: 'contain' }} />
        <span className="site-name" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#333' }}>
          {settings.site_name}
        </span>
      </Link>


      <div className="mobile-toggle" onClick={toggleNav}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link" onClick={closeNav}>Home</Link>
        <Link to="/waiting-list" className="nav-link" onClick={closeNav}>Hire a Caregiver</Link>
        <Link to="/waiting-list" className="nav-link" onClick={closeNav}>Become a Caregiver</Link>

        <div className="nav-buttons">
          {!loggedInName ? (
            <>
              <Link to="/login" onClick={closeNav}>
                <button className="login-btn">Login</button>
              </Link>
              <Link to="/register" onClick={closeNav}>
                <button className="signup-btn">Register</button>
              </Link>
            </>
          ) : (
            <div className="nav-dropdown">
              <button className="nav-user-btn">
                <FaUserCircle style={{ marginRight: 6 }} />
                {loggedInName.name}
                <span style={{ marginLeft: 6 }}>▾</span>
              </button>
              <div className="dropdown-content">
                <Link to={loggedInName.role === 'caregiver' ? "/caregiver/dashboard" : "/dashboard"}>
                  <FaTachometerAlt style={{ marginRight: 6 }} />
                  Dashboard
                </Link>
                <button onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginRight: 6 }} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
