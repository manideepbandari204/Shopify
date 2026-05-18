import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Wishlist.css';

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (wishlist.length === 0) return (
    <div className="wishlist-empty page-container">
      <div className="empty-icon">♡</div>
      <h2>Your wishlist is empty</h2>
      <p>Save items you love for later.</p>
      <Link to="/shop" className="continue-btn">Explore Products</Link>
    </div>
  );

  return (
    <div className="wishlist-page page-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <span>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(item => {
          const itemId = item._id || item.id;
          return (
            <div key={itemId} className="wishlist-card">
              <Link to={`/product/${itemId}`}>
                <img src={item.image} alt={item.name} className="wishlist-img" />
              </Link>
              <div className="wishlist-info">
                <span className="wish-cat">{item.category}</span>
                <Link to={`/product/${itemId}`}><h3>{item.name}</h3></Link>
                <p>${item.price.toFixed(2)}</p>
              <div className="wishlist-actions">
                <button className="move-to-cart-btn" onClick={() => {
                  addToCart(item);
                  showToast(`"${item.name}" added to cart!`);
                }}>Add to Cart</button>
                <button className="remove-wish-btn" onClick={() => {
                  toggleWishlist(item);
                  showToast('Removed from wishlist', 'info');
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
