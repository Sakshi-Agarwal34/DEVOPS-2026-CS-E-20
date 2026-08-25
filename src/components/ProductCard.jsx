import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    formatPrice,
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1200);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const badgeClass = {
    hot: 'badge-hot',
    new: 'badge-new',
    trending: 'badge-trending',
    sale: 'badge-sale',
  }[product.badgeType] || 'badge-hot';

  const displayImage =
    isHovered && product.images && product.images.length > 1
      ? product.images[1]
      : product.images[0];

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media & Action Overlays */}
      <div
        className="product-card-media"
        onClick={() => setQuickViewProduct(product)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />

        {/* Badge Tag */}
        {product.badge && (
          <div className="product-badge-overlay">
            <span className={`badge ${badgeClass}`}>{product.badge}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn-overlay ${isSaved ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="quick-view-overlay">
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content Info */}
      <div className="product-card-content">
        <div className="product-category-tag">{product.categoryName}</div>

        <h3
          className="product-card-title"
          onClick={() => setQuickViewProduct(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span style={{ fontWeight: 700 }}>{product.rating}</span>
          <span className="rating-count">({product.reviewCount})</span>
        </div>

        {/* Color Swatch Dots preview */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {product.colors.map((c, i) => (
              <span
                key={i}
                title={c.name}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        )}

        {/* Card Footer with Price & Quick Add */}
        <div className="product-card-footer">
          <div className="product-prices">
            <span className="product-price-current">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="product-price-original">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            className="btn-add-cart"
            onClick={handleQuickAdd}
            title="Quick Add to Cart"
            aria-label="Add to cart"
          >
            {isAddedAnimation ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
};
