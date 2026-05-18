import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

function Home() {
  const { products, loading } = useProducts();
  const [activeSlide, setActiveSlide] = useState(0);

  const featured = products.filter(p => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 8);
  const sale     = products.filter(p => p.badge === 'Sale').slice(0, 4);

  const slides = [
    { title: "Dress for the Moment", sub: "Explore our new collection of premium women's fashion", cta: "Shop Women", link: "/shop?category=Women", bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80" },
    { title: "Style Meets Comfort", sub: "The finest men's fashion curated just for you", cta: "Shop Men", link: "/shop?category=Men", bg: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1400&q=80" },
    { title: "Fun Styles for Kids", sub: "Colorful, durable, and adorable outfits for little ones", cta: "Shop Kids", link: "/shop?category=Kids", bg: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=1400&q=80" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero Slider */}
      <section className="hero-slider">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === activeSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.bg})` }}>
            <div className="hero-overlay">
              <div className="hero-text">
                <span className="hero-eyebrow">New Collection 2025</span>
                <h1>{slide.title}</h1>
                <p>{slide.sub}</p>
                <Link to={slide.link} className="hero-cta">{slide.cta} →</Link>
              </div>
            </div>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(i)} />
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section className="categories-section page-container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find the perfect style for everyone</p>
          <div className="section-line"></div>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link to={`/shop?category=${cat.name}`} key={cat.name} className="category-card">
              <img src={cat.image} alt={cat.name} />
              <div className="category-overlay">
                <h3>{cat.name}</h3>
                <span>{cat.count} Items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-bar">
        <div className="features-inner">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders above $50' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: '⭐', title: 'Premium Quality', desc: 'Curated collections' },
          ].map(f => (
            <div key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-showcase page-container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Hand-picked bestsellers and new arrivals</p>
          <div className="section-line"></div>
        </div>
        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        <div className="view-all-wrapper">
          <Link to="/shop" className="view-all-btn">View All Products →</Link>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="sale-banner">
        <div className="sale-content">
          <span className="sale-tag">Limited Time Offer</span>
          <h2>Up to 40% Off on Selected Items</h2>
          <p>Don't miss out on our biggest sale of the season</p>
          <Link to="/shop?badge=Sale" className="sale-cta">Shop Sale</Link>
        </div>
      </section>

      {/* Sale Products */}
      <section className="products-showcase page-container">
        <div className="section-header">
          <h2>On Sale Now</h2>
          <p>Grab the best deals before they're gone</p>
          <div className="section-line"></div>
        </div>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="products-grid four-col">
            {sale.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
