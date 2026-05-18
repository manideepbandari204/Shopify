import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('default');
  const [gridView, setGridView] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedSubcats, setSelectedSubcats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const badgeParam = searchParams.get('badge') || '';

  const allSubcats = [...new Set((products || [])
    .filter(p => !categoryParam || p.category === categoryParam)
    .map(p => p.subcategory))].sort();

  const filtered = useMemo(() => {
    let list = [...(products || [])];
    if (categoryParam) list = list.filter(p => p.category === categoryParam);
    if (searchParam) list = list.filter(p =>
      p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchParam.toLowerCase())
    );
    if (badgeParam) list = list.filter(p => p.badge === badgeParam);
    if (selectedSubcats.length > 0) list = list.filter(p => selectedSubcats.includes(p.subcategory));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'newest': return list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : 0;
        const dateB = b.createdAt ? new Date(b.createdAt) : 0;
        if (dateA && dateB) return dateB - dateA;
        return (b._id || b.id) > (a._id || a.id) ? 1 : -1;
      });
      default: return list;
    }
  }, [products, categoryParam, searchParam, badgeParam, selectedSubcats, priceRange, sort]);

  const toggleSubcat = (s) => setSelectedSubcats(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const clearFilters = () => {
    setSelectedSubcats([]);
    setPriceRange([0, 300]);
    setSort('default');
    setSearchParams({});
  };

  const activeFilters = selectedSubcats.length + (priceRange[1] < 300 ? 1 : 0) + (categoryParam ? 1 : 0);

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="shop-header-inner">
          <div>
            <h1>{categoryParam || searchParam ? (categoryParam || `"${searchParam}"`) : 'All Products'}</h1>
            <p>{filtered.length} products found</p>
          </div>
          <div className="shop-controls">
            <button className="filter-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg>
              Filters {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="view-toggle">
              <button className={gridView ? 'active' : ''} onClick={() => setGridView(true)} title="Grid View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button className={!gridView ? 'active' : ''} onClick={() => setGridView(false)} title="List View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-body page-container">
        {/* Sidebar */}
        <aside className={`shop-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            {activeFilters > 0 && <button className="clear-btn" onClick={clearFilters}>Clear All</button>}
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4>Category</h4>
            {['Women', 'Men', 'Kids'].map(cat => (
              <label key={cat} className="filter-label">
                <input type="radio" name="category" checked={categoryParam === cat}
                  onChange={() => setSearchParams(cat ? { category: cat } : {})} />
                <span>{cat}</span>
              </label>
            ))}
            <label className="filter-label">
              <input type="radio" name="category" checked={categoryParam === ''}
                onChange={() => setSearchParams({})} />
              <span>All</span>
            </label>
          </div>

          {/* Subcategory Filter */}
          {allSubcats.length > 0 && (
            <div className="filter-group">
              <h4>Type</h4>
              {allSubcats.map(s => (
                <label key={s} className="filter-label">
                  <input type="checkbox" checked={selectedSubcats.includes(s)} onChange={() => toggleSubcat(s)} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}

          {/* Price Range */}
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-display">${priceRange[0]} — ${priceRange[1]}</div>
            <input type="range" min="0" max="300" step="5"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="price-slider"
            />
          </div>

          {/* Ratings */}
          <div className="filter-group">
            <h4>Rating</h4>
            {[4, 3].map(r => (
              <label key={r} className="filter-label">
                <input type="radio" name="rating" />
                <span>{'★'.repeat(r)}{'☆'.repeat(5 - r)} & up</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div className="shop-products">
          {loading ? (
            <div className="loading-spinner" style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-light)' }}>
              Loading products from database...
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-products">
              <p>🔍 No products found.</p>
              <button className="clear-btn-lg" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`products-grid-shop ${gridView ? 'grid' : 'list'}`}>
              {filtered.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
