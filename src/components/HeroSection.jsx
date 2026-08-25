import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { HERO_SLIDES } from '../data/products';
import { useShop } from '../context/ShopContext';

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleCtaClick = (category) => {
    setSelectedCategory(category);
    const element = document.getElementById('product-catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="container hero-wrapper" aria-label="Hero Spotlight Banner">
      {HERO_SLIDES.map((item, index) => (
        <div
          key={item.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img src={item.image} alt={item.title} className="hero-backdrop-img" />
          <div className="hero-overlay-gradient" />

          <div className="hero-content">
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <span className="badge badge-hot">
                <Sparkles size={12} /> {item.badge}
              </span>
              <span className="badge badge-sale">{item.tag}</span>
            </div>

            <h1 className="hero-title">{item.title}</h1>
            <p className="hero-subtitle">{item.subtitle}</p>

            <div className="hero-cta-group">
              <button
                className="btn-primary"
                onClick={() => handleCtaClick(item.ctaCategory)}
                style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
              >
                <span>{item.ctaText}</span>
                <ArrowRight size={18} />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                <span>Starting at</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>
                  {item.highlightPrice}
                </strong>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Dots */}
      <div className="hero-dots">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
