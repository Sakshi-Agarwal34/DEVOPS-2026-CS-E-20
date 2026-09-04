import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ANNOUNCEMENTS = [
  { text: '✨ Flash Sale: Get 20% OFF your entire order with code', coupon: 'SAVE20' },
  { text: '📦 Enjoy Free Express Shipping on orders over $100', coupon: 'FREESHIP50' },
  { text: '🎉 New Seasonal Drop: Explore the 2026 Urban Streetwear & Tech collection', coupon: null },
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { applyCouponCode, setIsCartOpen } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[currentIndex];

  const handleApply = (coupon) => {
    if (coupon) {
      applyCouponCode(coupon);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="announcement-bar" role="region" aria-label="Store Announcement">
      <Sparkles size={14} className="animate-pulse" />
      <span>{current.text}</span>
      {current.coupon && (
        <button
          onClick={() => handleApply(current.coupon)}
          className="coupon-badge"
          title="Click to copy & apply code"
          style={{ cursor: 'pointer', border: 'none', color: '#ffffff' }}
        >
          {current.coupon}
        </button>
      )}
    </div>
  );
};
