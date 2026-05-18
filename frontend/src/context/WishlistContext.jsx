import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

const getInitialWishlist = () => {
  try {
    const stored = localStorage.getItem('shopify_wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getInitialWishlist);

  useEffect(() => {
    localStorage.setItem('shopify_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const prodId = product._id || product.id;
    setWishlist(prev =>
      prev.find(p => (p._id || p.id) === prodId)
        ? prev.filter(p => (p._id || p.id) !== prodId)
        : [...prev, product]
    );
  };

  const isWishlisted = (id) => wishlist.some(p => (p._id || p.id) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
