import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">S</span>
              <span className="logo-text">StyleHub</span>
            </div>
            <p>Your one-stop destination for the latest trends in women's, men's, and kids' fashion.</p>
            <div className="social-links">
              {['Facebook', 'Instagram', 'Twitter', 'Pinterest'].map(s => (
                <a key={s} href="#" className="social-link" aria-label={s}>{s[0]}</a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop?category=Women">Women</Link></li>
              <li><Link to="/shop?category=Men">Men</Link></li>
              <li><Link to="/shop?category=Kids">Kids</Link></li>
              <li><Link to="/shop">All Products</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Track Order</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p className="newsletter-desc">Subscribe to get exclusive offers and updates.</p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 StyleHub. All rights reserved.</p>
        <div className="payment-icons">
          {['VISA', 'MC', 'PayPal', 'Apple Pay'].map(p => (
            <span key={p} className="payment-badge">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
