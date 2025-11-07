import React, { useEffect, useState } from 'react';
import { Navbar as BSNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaUser, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../assets/dexter-removebg-preview.png';
import '../styles/Header.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || []; // ✅ localStorage used here
      const totalQty = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(totalQty);
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount); // For cross-tab updates

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111111',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, Logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
        Swal.fire('Logged Out', 'You have been logged out.', 'success');
      }
    });
  };

  return (
    <BSNavbar expand="lg" className="sticky-navbar py-2 shadow-sm" bg="white">
      <Container>
        <BSNavbar.Brand onClick={() => navigate('/')} className="d-flex align-items-center brand__logo">
          <img src={logo} alt="Dexter Logo" className="brand__icon" />
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="main-navbar" />
        <BSNavbar.Collapse id="main-navbar">
          <Nav className="mx-auto nav-links">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/catalogue" className="nav-link">Catalog</NavLink>
            <NavLink to="/contact" className="nav-link">Contact</NavLink>
            {isLoggedIn && <NavLink to="/orders" className="nav-link">Orders</NavLink>}
          </Nav>
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {!isLoggedIn ? (
              <FaUser
                size={20}
                className="clickable-icon"
                title="Login"
                onClick={() => navigate('/login')}
              />
            ) : (
              <FaSignOutAlt
                size={20}
                className="clickable-icon text-danger"
                title="Logout"
                onClick={handleLogout}
              />
            )}
            <div className="position-relative">
              <FaShoppingBag
                size={20}
                className="clickable-icon"
                title="Cart"
                onClick={() => navigate('/cart')}
              />
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.65rem' }}
                >
                  {cartCount}
                </Badge>
              )}
            </div>
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
