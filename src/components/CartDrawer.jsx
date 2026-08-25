import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    discountAmount,
    shippingFee,
    estimatedTax,
    cartTotal,
    totalCartCount,
    freeShippingThreshold,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
    formatPrice,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingDifference = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCouponCode(couponInput);
    setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`drawer-panel ${isCartOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} color="var(--primary)" />
            <span>Your Cart ({totalCartCount})</span>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div style={{ padding: '1rem 1.5rem 0' }}>
            <div className="shipping-progress-box">
              <div className="shipping-progress-text">
                <Truck size={16} color="var(--accent-emerald)" />
                {freeShippingDifference === 0 ? (
                  <strong style={{ color: 'var(--accent-emerald)' }}>
                    🎉 You unlocked Free Worldwide Express Shipping!
                  </strong>
                ) : (
                  <span>
                    Add <strong>{formatPrice(freeShippingDifference)}</strong> more for{' '}
                    <strong>Free Shipping</strong>!
                  </span>
                )}
              </div>
              <div className="shipping-progress-bar-wrap">
                <div
                  className="shipping-progress-bar-fill"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
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
                <ShoppingBag size={36} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Discover our new arrivals and curate your personalized collection.
              </p>
              <button
                className="btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.itemKey} className="cart-item">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  <div>
                    <h4 className="cart-item-title">{item.product.name}</h4>
                    <div className="cart-item-meta">
                      {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                      {item.selectedSize && <span>&bull; Size: {item.selectedSize}</span>}
                    </div>
                  </div>

                  <div className="cart-item-controls">
                    <div className="qty-counter">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.itemKey, -1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.itemKey, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>

                    <button
                      className="cart-item-delete"
                      onClick={() => removeFromCart(item.itemKey)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Engine */}
            {appliedCoupon ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--primary-light)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <Tag size={15} color="var(--primary)" />
                  <span>
                    Code: <strong>{appliedCoupon.code}</strong> ({appliedCoupon.description})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'underline' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="promo-box">
                <input
                  type="text"
                  placeholder="Promo code (e.g. SAVE20)"
                  className="promo-input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '0.65rem 1rem' }}>
                  Apply
                </button>
              </form>
            )}

            {/* Calculations breakdown */}
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-row" style={{ color: 'var(--accent-emerald)' }}>
                <span>Coupon Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Estimated Tax (8%)</span>
              <span>{formatPrice(estimatedTax)}</span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.9rem', fontSize: '1rem' }}
              onClick={handleProceedCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
