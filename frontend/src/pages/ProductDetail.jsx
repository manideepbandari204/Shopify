import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { products } = useProducts();
  const { id } = useParams();
  const product = products.find(p => (p._id || p.id || '').toString() === id || p.id === parseInt(id));
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  if (!product) return (
    <div className="not-found page-container">
      <h2>Product not found</h2>
      <Link to="/shop" className="back-btn">Back to Shop</Link>
    </div>
  );

  const productId = product._id || product.id;
  const wishlisted = isWishlisted(productId);
  const related = products.filter(p => p.category === product.category && (p._id || p.id) !== productId).slice(0, 4);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    showToast(`${qty}x "${product.name}" added to cart!`);
  };

  return (
    <div className="product-detail-page">
      <div className="breadcrumb page-container">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/shop">Shop</Link><span>/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link><span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="detail-main page-container">
        <div className="detail-image-wrap">
          <img src={product.image} alt={product.name} className="detail-image" />
          {product.badge && (
            <span className={`detail-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
              {discount ? `-${discount}%` : product.badge}
            </span>
          )}
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category} / {product.subcategory}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <StarRating rating={product.rating} />
            <span className="rating-count">({product.reviews} reviews)</span>
          </div>
          <div className="detail-price">
            <span className="price-main">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="price-old">${product.originalPrice.toFixed(2)}</span>
                <span className="price-save">Save {discount}%</span>
              </>
            )}
          </div>
          <p className="detail-description">{product.description}</p>

          <div className="detail-section">
            <h4>Size: <span>{selectedSize}</span></h4>
            <div className="size-grid">
              {sizes.map(s => (
                <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className={`wishlist-icon-btn ${wishlisted ? 'active' : ''}`}
              onClick={() => { toggleWishlist(product); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={wishlisted ? '#e94560' : 'none'} stroke={wishlisted ? '#e94560' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <Link to="/cart" className="buy-now-btn" onClick={handleAddToCart}>Buy Now</Link>

          <div className="guarantees">
            {['Free Shipping on orders $50+', '30-day easy returns', 'Secure checkout'].map(g => (
              <span key={g} className="guarantee-tag">{g}</span>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section page-container">
          <div className="section-header">
            <h2>You May Also Like</h2>
            <div className="section-line"></div>
          </div>
          <div className="products-grid" style={{gridTemplateColumns:'repeat(4,1fr)',display:'grid',gap:'1.5rem'}}>
            {related.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
