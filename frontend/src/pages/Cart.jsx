import { useState, useEffect } from 'react';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map(item => {
      if (item.id === id) {
        const max = item.stock || 1;
        return { ...item, quantity: Math.min(newQty, max) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shipping = cart.length > 0 ? 500 : 0;
  const total    = subtotal + shipping;

  return (
    <div>

      {/* ── Page header ── */}
      <div style={{ backgroundColor: 'var(--cream)', padding: '3rem 0 2.5rem', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>Shopping</p>
          <h1 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Your Cart</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 0 5rem' }}>

        {cart.length === 0 ? (

          /* ── Empty state ── */
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Nothing here yet</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '2rem' }}>Your cart is empty</p>
            <a href="/gallery" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Gallery</a>
          </div>

        ) : (

          <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3.5rem', alignItems: 'start' }}>

            {/* ── Items ── */}
            <div>

              {/* Header row */}
              <div className="cart-header-row" style={{ display: 'grid', gridTemplateColumns: '72px 1fr 130px 110px 32px', gap: '1rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--gray-100)', marginBottom: '0' }}>
                {['', 'Artwork', 'Quantity', 'Price', ''].map((col, i) => (
                  <p key={i} className="eyebrow" style={{ margin: 0 }}>{col}</p>
                ))}
              </div>

              {/* Item rows */}
              {cart.map(item => (
                <div key={item.id} className="cart-item-row" style={{ display: 'grid', gridTemplateColumns: '72px 1fr 130px 110px 32px', gap: '1rem', padding: '1.5rem 0', borderBottom: '1px solid var(--gray-50)', alignItems: 'center' }}>

                  {/* Image */}
                  <a href={`/paintings/${item.id}`} style={{ display: 'block', width: '72px', height: '72px', backgroundColor: 'var(--gray-50)', overflow: 'hidden', flexShrink: 0 }}>
                    {item.image
                      ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--gray-100)' }} />
                    }
                  </a>

                  {/* Info */}
                  <div>
                    <a href={`/paintings/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '0.2rem', lineHeight: 1.3 }}>{item.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.artist}</p>
                    </a>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-100)', width: 'fit-content' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ width: '30px', height: '30px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1rem', color: 'var(--black)' }}>−</button>
                    <span style={{ width: '36px', textAlign: 'center', fontSize: '0.85rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 1)}
                      style={{ width: '30px', height: '30px', border: 'none', backgroundColor: 'transparent', fontSize: '1rem', cursor: item.quantity >= (item.stock || 1) ? 'not-allowed' : 'pointer', color: item.quantity >= (item.stock || 1) ? 'var(--gray-300)' : 'var(--black)' }}>+</button>
                  </div>

                  {/* Price */}
                  <p style={{ fontSize: '0.95rem', fontWeight: 400 }}>
                    KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </p>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-300)', fontSize: '1.25rem', padding: 0, lineHeight: 1, transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--black)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--gray-300)'}
                  >×</button>

                </div>
              ))}

              {/* Continue shopping */}
              <div style={{ marginTop: '1.5rem' }}>
                <a href="/gallery" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-500)', textDecoration: 'none' }}>
                  ← Continue Shopping
                </a>
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div style={{ backgroundColor: 'var(--cream)', padding: '2rem', position: 'sticky', top: '88px', border: '1px solid var(--gray-100)' }}>
              <p className="eyebrow" style={{ marginBottom: '1.75rem' }}>Order Summary</p>

              {/* Lines */}
              {[
                { label: `Subtotal (${cart.length} item${cart.length > 1 ? 's' : ''})`, value: `KES ${subtotal.toLocaleString()}` },
                { label: 'Shipping',                                                      value: `KES ${shipping.toLocaleString()}` },
              ].map(line => (
                <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{line.label}</span>
                  <span style={{ fontSize: '0.85rem' }}>{line.value}</span>
                </div>
              ))}

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem 0', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300 }}>KES {total.toLocaleString()}</span>
              </div>

              <a href="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Proceed to Checkout
              </a>

              <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.7 }}>
                Secure checkout · Cashless payments accepted
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}