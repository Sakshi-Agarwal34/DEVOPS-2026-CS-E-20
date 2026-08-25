import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { VALUE_PROPOSITIONS } from '../data/products';

const iconMap = {
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  RotateCcw: RotateCcw,
  Headphones: Headphones,
};

export const ValueProps = () => {
  return (
    <section className="container value-props-grid" aria-label="Store Guarantees">
      {VALUE_PROPOSITIONS.map((prop, idx) => {
        const IconComponent = iconMap[prop.icon] || ShieldCheck;
        return (
          <div key={idx} className="value-prop-card">
            <div className="value-prop-icon">
              <IconComponent size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                {prop.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {prop.desc}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};
