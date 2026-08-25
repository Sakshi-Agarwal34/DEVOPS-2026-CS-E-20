import React from 'react';
import { Filter, Star, RotateCcw, Check } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';

export const FiltersSidebar = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    resetFilters,
    formatPrice,
  } = useShop();

  return (
    <aside className="filters-sidebar" aria-label="Product Filters">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
          <Filter size={18} color="var(--primary)" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="btn-outline"
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}
          title="Reset all filters"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Categories</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="filter-option">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === cat.id}
                onChange={() => setSelectedCategory(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4 className="filter-group-title">Max Price</h4>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="price-range-slider"
        />
        <div className="price-range-values">
          <span>{formatPrice(0)}</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Up to {formatPrice(priceRange[1])}
          </span>
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Customer Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { val: 0, label: 'All Ratings' },
            { val: 4.8, label: '4.8 ★ & Above' },
            { val: 4.5, label: '4.5 ★ & Above' },
            { val: 4.0, label: '4.0 ★ & Above' },
          ].map((item) => (
            <label key={item.val} className="filter-option">
              <input
                type="radio"
                name="min-rating"
                checked={minRating === item.val}
                onChange={() => setMinRating(item.val)}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Only Checkbox */}
      <div className="filter-group">
        <label className="filter-option" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span>In-Stock Only</span>
        </label>
      </div>
    </aside>
  );
};
