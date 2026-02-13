import { useState, useEffect } from 'react';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1 = details, 2 = review
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    if (stored.length === 0) {
      window.location.href = '/cart';
    }
    setCart(stored);
  }, []);

  const subtotal = cart.reduce((sum, item) =>
    sum + (parseFloat(item.price) * item.quantity), 0
  );
  const shipping = 500;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 2 - place order
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shipping_address: `${formData.shipping_address}, ${formData.city}`,
          items: cart.map(item => ({
            painting_id:    item.id,
            painting_title: item.title,
            price:          item.price,
            quantity:       item.quantity,
          })),
          subtotal,
          shipping_cost: shipping,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Redirect to PesaPal payment
      if (data.payment_url) {
        localStorage.removeItem('cart');
        window.location.href = data.payment_url;
      } else {
        throw new Error('Payment URL not received');
      }

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '3rem 0' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="label" style={{ marginBottom: '0.5rem' }}>Checkout</p>
        <h1 style={{ fontSize: '2rem', fontWeight: '300', letterSpacing: '-0.01em' }}>
          {step === 1 ? 'Your Details' : 'Review Order'}
        </h1>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '3rem', borderBottom: '1px solid #E0E0E0' }}>
        {['Your Details', 'Review & Pay'].map((label, i) => (
          <div key={label} style={{ paddingBottom: '1rem', marginRight: '2rem', borderBottom: step === i + 1 ? '2px solid #000' : '2px solid transparent', marginBottom: '-1px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: step === i + 1 ? '#000' : '#9E9E9E' }}>
              {i + 1}. {label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ backgroundColor: '#FFF3F3', border: '1px solid #FFCDD2', color: '#B71C1C', padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>

          {/* Left - Form steps */}
          <div>
            {step === 1 ? (

              /* ── Step 1: Customer Details ── */
              <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                  Contact Information
                </h2>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name *</label>
                  <input type="text" name="customer_name" required value={formData.customer_name} onChange={handleChange} className="input-field" placeholder="John Kamau" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email *</label>
                    <input type="email" name="customer_email" required value={formData.customer_email} onChange={handleChange} className="input-field" placeholder="john@email.com" />
                  </div>
                  <div>
                    <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone *</label>
                    <input type="tel" name="customer_phone" required value={formData.customer_phone} onChange={handleChange} className="input-field" placeholder="+254 700 000000" />
                  </div>
                </div>

                <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', margin: '2rem 0 1.5rem' }}>
                  Shipping Address
                </h2>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Street Address *</label>
                  <input type="text" name="shipping_address" required value={formData.shipping_address} onChange={handleChange} className="input-field" placeholder="123 Oginga Odinga Street" />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="input-field" placeholder="Kisumu" />
                </div>

                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Order Notes (optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input-field" placeholder="Any special instructions..." style={{ resize: 'vertical' }} />
                </div>

              </div>

            ) : (

              /* ── Step 2: Review ── */
              <div>
                <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                    Your Details
                  </h2>
                  {[
                    { label: 'Name',    value: formData.customer_name },
                    { label: 'Email',   value: formData.customer_email },
                    { label: 'Phone',   value: formData.customer_phone },
                    { label: 'Address', value: `${formData.shipping_address}, ${formData.city}` },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F5F5F5' }}>
                      <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9E9E' }}>{item.label}</span>
                      <span style={{ fontSize: '0.875rem', color: '#212121' }}>{item.value}</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ marginTop: '1rem', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid #9E9E9E', color: '#9E9E9E', cursor: 'pointer', padding: '0 0 2px 0' }}
                  >
                    Edit Details
                  </button>
                </div>

                {/* Items review */}
                <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                  <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                    Order Items
                  </h2>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F5F5F5' }}>
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#F5F5F5', flexShrink: 0, overflow: 'hidden' }}>
                        {item.image && <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '2px' }}>{item.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: '0.875rem' }}>
                        KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Order summary */}
          <div style={{ backgroundColor: '#F5F5F5', padding: '2rem', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '2rem' }}>
              Order Summary
            </h2>

            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E0E0E0' }}>
                <span style={{ fontSize: '0.8rem', color: '#616161' }}>
                  {item.title} × {item.quantity}
                </span>
                <span style={{ fontSize: '0.8rem' }}>
                  KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E0E0E0' }}>
              <span style={{ fontSize: '0.875rem', color: '#616161' }}>Shipping</span>
              <span style={{ fontSize: '0.875rem' }}>KES {shipping.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '400' }}>KES {total.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Processing...' : step === 1 ? 'Continue to Review →' : 'Pay with PesaPal →'}
            </button>

            <p style={{ fontSize: '0.7rem', color: '#9E9E9E', textAlign: 'center', marginTop: '1rem', lineHeight: '1.6' }}>
              {step === 2 ? 'You will be redirected to PesaPal to complete payment securely.' : 'No payment yet — review your order first.'}
            </p>
          </div>

        </div>
      </form>
    </div>
  );
}