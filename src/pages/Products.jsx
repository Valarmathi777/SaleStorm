import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingBag, Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS, CATEGORIES_MAP, CATEGORY_EMOJIS } from '../data/products';
import { useCart } from '../hooks/useCart';
import StarRating from '../components/StarRating';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'discount', label: 'Best Discount' },
];

export default function Products() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');

  const categories = Object.keys(CATEGORIES_MAP);

  let filtered = CATEGORIES_MAP[activeCategory] || PRODUCTS;

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === 'discount') filtered = [...filtered].sort((a, b) => b.discount - a.discount);

  return (
    <div className="page products-page">
      <div className="container">
        {/* Top bar */}
        <div className="products-topbar">
          <div className="products-search-wrap">
            <Search size={16} className="products-search-icon" />
            <input
              className="products-search"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="products-sort-wrap">
            <SlidersHorizontal size={15} />
            <select value={sort} onChange={e => setSort(e.target.value)} className="products-sort">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className="products-sidebar">
            <h3 className="products-sidebar-title">Categories</h3>
            {categories.map(cat => (
              <button
                key={cat}
                className={`products-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{CATEGORY_EMOJIS[cat]}</span>
                <span>{cat}</span>
                <span className="products-cat-count">{CATEGORIES_MAP[cat].length}</span>
              </button>
            ))}
          </aside>

          {/* Grid */}
          <div className="products-main">
            <div className="products-results-bar">
              <span><b>{filtered.length}</b> results for <b>"{activeCategory}"</b></span>
            </div>
            {filtered.length === 0 ? (
              <div className="products-empty">
                <p>No products found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => (
                  <div key={p.id} className="product-card card">
                    {p.isFlashSale && (
                      <div className="product-card-flash-tag">
                        <Zap size={10} /> FLASH SALE
                      </div>
                    )}
                    <Link to={`/product/${p.id}`}>
                      <div className="product-card-img" style={{ background: p.gradient }}>
                        <span className="product-card-emoji">{p.emoji}</span>
                      </div>
                    </Link>
                    <div className="product-card-body">
                      <span className="product-card-category">{p.category}</span>
                      <StarRating rating={p.rating} reviews={p.reviews} />
                      <Link to={`/product/${p.id}`}>
                        <h3 className="product-card-name">{p.name}</h3>
                      </Link>
                      <p className="product-card-tagline">{p.tagline}</p>
                      <div className="product-card-price">
                        <span className="price-main">₹{p.price.toLocaleString()}</span>
                        <span className="price-original">₹{p.originalPrice.toLocaleString()}</span>
                        <span className="badge badge-orange">{p.discount}% OFF</span>
                      </div>
                      <div className="product-card-stock">
                        <span className="status-dot green" /> {p.stock} in stock
                      </div>
                      <div className="product-card-actions">
                        <Link to={`/product/${p.id}`} className="btn btn-primary" style={{ flex: 1 }}>
                          View Details
                        </Link>
                        <button className="btn btn-ghost" onClick={() => addToCart(p)} title="Add to cart">
                          <ShoppingBag size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
