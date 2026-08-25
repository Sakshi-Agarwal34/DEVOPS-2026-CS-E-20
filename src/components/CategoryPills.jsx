import React from 'react';
import { Sparkles, Headphones, Shirt, Home, Watch } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';

const iconMap = {
  Sparkles: Sparkles,
  Headphones: Headphones,
  Shirt: Shirt,
  Home: Home,
  Watch: Watch,
};

export const CategoryPills = () => {
  const { selectedCategory, setSelectedCategory } = useShop();

  return (
    <nav className="categories-bar" aria-label="Product Categories">
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon] || Sparkles;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            className={`category-pill ${isActive ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={isActive}
          >
            <Icon size={16} />
            <span>{cat.name}</span>
            <span className="category-pill-count">{cat.count}</span>
          </button>
        );
      })}
    </nav>
  );
};
