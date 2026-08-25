import React from 'react';
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setQuickViewProduct,
  } = useShop();

  if (!isWishlistOpen) return null;

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    setIsWishlistOpen(false);
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isWishlistOpen ? 'open' : ''}`}
        onClick={() => setIsWishlistOpen(false)}
      />

      <div
        className={`drawer-panel ${isWishlistOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <Heart size={22} color="var(--accent-rose)" fill="var(--accent-rose)" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'var(--text-muted)',
                }}
              >
                <Heart size={36} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Saved Items Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Tap the heart icon on any product to save items you love for later.
              </p>
              <button
                className="btn-primary"
                onClick={() => setIsWishlistOpen(false)}
              >
                Explore Collection
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="cart-item-img"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setQuickViewProduct(item);
                    setIsWishlistOpen(false);
                  }}
                />

                <div className="cart-item-info">
                  <div>
                    <h4
                      className="cart-item-title"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setQuickViewProduct(item);
                        setIsWishlistOpen(false);
                      }}
                    >
                      {item.name}
                    </h4>
                    <div className="cart-item-meta">{item.categoryName}</div>
                  </div>

                  <div className="cart-item-controls">
                    <div className="cart-item-price">{formatPrice(item.price)}</div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => {
                          addToCart(item, 1);
                        }}
                      >
                        <ShoppingBag size={14} /> Add
                      </button>

                      <button
                        className="cart-item-delete"
                        onClick={() => toggleWishlist(item)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="drawer-footer">
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              onClick={handleMoveAllToCart}
            >
              <span>Move All to Cart</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
