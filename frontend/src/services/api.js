const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const normalizeProduct = (product) => {
  if (!product) return product;

  // Normalize Category
  let category = product.category || '';
  const lowerCat = category.toLowerCase();
  if (lowerCat === 'womens' || lowerCat === 'women') {
    category = 'Women';
  } else if (lowerCat === 'mens' || lowerCat === 'men') {
    category = 'Men';
  } else if (lowerCat === 'kids' || lowerCat === 'kid') {
    category = 'Kids';
  } else if (category) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  // Normalize Subcategory
  const subRaw = product.subcategory || product.subCategory || '';
  const subcategory = subRaw
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Normalize Image
  let image = product.image;
  if (!image && Array.isArray(product.images) && product.images.length > 0) {
    image = product.images[0];
  }
  if (!image) {
    image = 'https://images.unsplash.com/photo-1515886300427-2952912a0a80?w=600'; // elegant fallback
  }

  // Normalize Reviews
  const reviews = product.numReviews !== undefined ? product.numReviews : (product.reviews || 0);

  return {
    ...product,
    category,
    subcategory,
    image,
    reviews
  };
};

// ── Products ──────────────────────────────────────────────
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) {
    const lower = filters.category.toLowerCase();
    const queryCategory = lower === 'women' ? 'womens' : lower === 'men' ? 'mens' : lower === 'kids' ? 'kids' : lower;
    params.append('category', queryCategory);
  }
  
  if (filters.subcategory) {
    params.append('subcategory', filters.subcategory.toLowerCase());
  }
  
  if (filters.badge)       params.append('badge',       filters.badge);
  if (filters.search)      params.append('search',      filters.search);
  if (filters.minPrice)    params.append('minPrice',    filters.minPrice);
  if (filters.maxPrice)    params.append('maxPrice',    filters.maxPrice);

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const json = await res.json();
  return (json.data || []).map(normalizeProduct);
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  const json = await res.json();
  return normalizeProduct(json.data);
};

// ── Orders ────────────────────────────────────────────────
export const placeOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to place order');
  const json = await res.json();
  return json.data;
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const json = await res.json();
  return json.data;
};
