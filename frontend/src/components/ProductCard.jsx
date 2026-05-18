import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const productId = product._id || product.id;
  const wishlisted = isWishlisted(productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    showToast(`"${product.name}" added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', wishlisted ? 'info' : 'success');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/product/${productId}`} className="product-card">
      <div className="card-image-wrapper">
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
        <div className="card-overlays">
          {product.badge && (
            <span className={`card-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
              {discount ? `-${discount}%` : product.badge}
            </span>
          )}
          <button
            className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#e94560' : 'none'} stroke={wishlisted ? '#e94560' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <div className="card-hover-overlay">
          <button className="quick-add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="card-body">
        <span className="card-subcategory">{product.subcategory}</span>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-meta">
          <StarRating rating={product.rating} />
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="card-price">
          <span className="price-current">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="price-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
