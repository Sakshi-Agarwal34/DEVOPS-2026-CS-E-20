import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRODUCTS, CURRENCIES, COUPONS } from '../data/products';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lumen_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lumen_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Currency state
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('lumen_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('lumen_currency', currency);
  }, [currency]);

  const formatPrice = (amountInUSD) => {
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = amountInUSD * curr.rate;
    return `${curr.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('lumen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumen_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('lumen_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Order history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('lumen_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumen_orders', JSON.stringify(orders));
  }, [orders]);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, quantity = 1, color = null, size = null) => {
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0].name : null);
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
    const itemKey = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            itemKey,
            product,
            quantity,
            selectedColor,
            selectedSize,
          },
        ];
      }
    });

    addToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (itemKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.itemKey !== itemKey));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (itemKey, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.itemKey === itemKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        addToast(`Saved "${product.name}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Coupon handling
  const applyCouponCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (COUPONS[cleanCode]) {
      setAppliedCoupon({ code: cleanCode, ...COUPONS[cleanCode] });
      addToast(`Promo code "${cleanCode}" applied successfully!`, 'success');
      return { success: true };
    } else {
      addToast(`Invalid promo code: "${code}"`, 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Promo code removed', 'info');
  };

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return (cartSubtotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.discountAmount) {
      return Math.min(appliedCoupon.discountAmount, cartSubtotal);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const freeShippingThreshold = 100;
  const rawShippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 15;
  const shippingFee = appliedCoupon?.code === 'FREESHIP50' ? 0 : rawShippingFee;
  const estimatedTax = cartSubtotal > 0 ? (cartSubtotal - discountAmount) * 0.08 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + estimatedTax);
  const totalCartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Order Placement
  const placeOrder = (customerDetails, paymentDetails) => {
    const newOrder = {
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      tax: estimatedTax,
      total: cartTotal,
      currency,
      customer: customerDetails,
      paymentMethod: paymentDetails.method || 'Credit Card',
      status: 'Processing',
      estimatedDelivery: '3 - 5 Business Days',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 500]);
    setMinRating(0);
    setSortBy('featured');
    setInStockOnly(false);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating < minRating) {
        return false;
      }

      // In Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.badge === 'New Drop' || b.badge === 'New' ? 1 : 0) - (a.badge === 'New Drop' || a.badge === 'New' ? 1 : 0);
      return 0; // 'featured'
    });
  }, [searchQuery, selectedCategory, priceRange, minRating, sortBy, inStockOnly]);

  return (
    <ShopContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        discountAmount,
        shippingFee,
        estimatedTax,
        cartTotal,
        totalCartCount,
        freeShippingThreshold,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,
        filteredProducts,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        placeOrder,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
