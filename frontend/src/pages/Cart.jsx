import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { placeOrder } from '../services/api';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { showToast } = useToast();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  if (placedOrder) return (
    <div className="cart-empty page-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div className="empty-icon" style={{ fontSize: '4rem', color: '#4caf50', marginBottom: '1.5rem' }}>🎉</div>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-color)' }}>Thank You for Your Order!</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', maxWidth: '500px', marginInline: 'auto' }}>
        Your order has been placed successfully. Order Reference: <strong style={{ color: 'var(--primary-color)' }}>{placedOrder._id}</strong>. We've sent a confirmation email to {placedOrder.customerEmail}.
      </p>
      <Link to="/shop" className="continue-btn" style={{ padding: '0.8rem 2rem', display: 'inline-block' }}>Continue Shopping</Link>
    </div>
  );

  if (cart.length === 0) return (
    <div className="cart-empty page-container">
      <div className="empty-icon">🛍️</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="continue-btn">Continue Shopping</Link>
    </div>
  );

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    try {
      setLoading(true);
      const items = cart.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const newOrder = await placeOrder({
        items,
        totalAmount: grandTotal,
        customerName,
        customerEmail,
      });

      setPlacedOrder(newOrder);
      clearCart();
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page page-container">
      <div className="cart-header">
        <h1>{isCheckingOut ? 'Checkout Details' : 'Shopping Cart'}</h1>
        <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-layout">
        {/* Left pane: Cart Items or Checkout Form */}
        <div className="cart-items">
          {!isCheckingOut ? (
            <>
              {cart.map(item => {
                const itemId = item._id || item.id;
                return (
                  <div key={itemId} className="cart-item">
                    <Link to={`/product/${itemId}`}>
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    </Link>
                    <div className="cart-item-info">
                      <span className="item-category">{item.category}</span>
                      <Link to={`/product/${itemId}`}><h3>{item.name}</h3></Link>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(itemId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemId, item.quantity + 1)}>+</button>
                      </div>
                      <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                      <button className="remove-btn" onClick={() => { removeFromCart(itemId); showToast('Item removed', 'error'); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="cart-footer-actions">
                <Link to="/shop" className="continue-shop-link">← Continue Shopping</Link>
                <button className="clear-cart-btn" onClick={() => { clearCart(); showToast('Cart cleared', 'info'); }}>Clear Cart</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="checkout-form" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Shipping & Customer Info</h3>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', fontSize: '1rem' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', fontSize: '1rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="clear-cart-btn" onClick={() => setIsCheckingOut(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px' }}>← Back to Cart</button>
                <button type="submit" className="checkout-btn" disabled={loading} style={{ flex: 2, padding: '0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? 'Processing Order...' : `Pay & Place Order ($${grandTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right pane: Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `$${shipping.toFixed(2)}`}</span></div>
          {shipping > 0 && <p className="shipping-notice">Add ${(50 - totalPrice).toFixed(2)} more for free shipping!</p>}
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-divider"></div>
          <div className="summary-row total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>

          {!isCheckingOut && (
            <>
              <div className="coupon-row">
                <input type="text" placeholder="Coupon code" className="coupon-input" />
                <button className="coupon-btn">Apply</button>
              </div>

              <button className="checkout-btn" onClick={() => setIsCheckingOut(true)}>Proceed to Checkout →</button>
            </>
          )}

          <div className="payment-methods">
            {['VISA', 'MC', 'PayPal', 'Apple Pay'].map(p => (
              <span key={p} className="pay-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
