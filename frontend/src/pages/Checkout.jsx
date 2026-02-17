import { useState, useEffect } from 'react';
import { deliveryRegionsAPI } from '../services/api';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [regions, setRegions] = useState([]);
  const [shipping, setShipping] = useState(0);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    notes: '',
    region_id: '',
    region_name: '',
  });

  useEffect(() => {
    deliveryRegionsAPI.getAll()
      .then(res => setRegions(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    if (stored.length === 0) window.location.href = '/cart';
    setCart(stored);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
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

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://docbadmanclassics.org/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          shipping_address: `${formData.shipping_address}, ${formData.city}`,
          region: formData.region_name,
          items: cart.map(item => ({
            painting_id: item.id,
            painting_title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          shipping_cost: shipping,
          total,
        }),
      });

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server error (${response.status}) — check that the /api/v1/orders route is registered in api.php`);
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          throw new Error(firstError);
        }
        throw new Error(data.message || 'Failed to place order');
      }

      // Order created — now initiate PesaPal payment
      const paymentRes = await fetch('https://docbadmanclassics.org/api/v1/pesapal/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: data.order_id }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.message || 'Payment initiation failed');
      }

      // Clear cart and redirect to PesaPal
      localStorage.removeItem('cart');
      window.location.href = paymentData.payment_url;

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid var(--gray-100)',
    backgroundColor: '#fff',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 300,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--gray-500)',
    marginBottom: '0.5rem',
  };

  return (
    <div>

      {/* ── Page Header ── */}
      <div style={{ backgroundColor: 'var(--cream)', padding: '3rem 0 2.5rem', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>Checkout</p>
          <h1 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {step === 1 ? 'Your Details' : 'Review Order'}
          </h1>
        </div>
      </div>

      {/* ── Step Indicator ── */}
      <div style={{ borderBottom: '1px solid var(--gray-100)', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0 }}>
            {['Your Details', 'Review & Pay'].map((label, i) => (
              <div key={label} style={{
                paddingBottom: '1rem',
                paddingTop: '1rem',
                marginRight: '2.5rem',
                borderBottom: step === i + 1 ? '2px solid var(--black)' : '2px solid transparent',
              }}>
                <span style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: step === i + 1 ? 'var(--black)' : 'var(--gray-300)',
                  fontWeight: step === i + 1 ? 500 : 400,
                }}>
                  {i + 1}. {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container" style={{ padding: '3rem 0 5rem' }}>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', color: '#991b1b', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3.5rem', alignItems: 'start' }}>

            {/* ── Left: Form Steps ── */}
            <div>
              {step === 1 ? (

                /* Step 1 — Details */
                <div style={{ border: '1px solid var(--gray-100)', padding: '2.5rem', backgroundColor: '#fff' }}>

                  <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Contact Information</p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" name="customer_name" required value={formData.customer_name} onChange={handleChange} placeholder="John Kamau" style={inputStyle} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input type="email" name="customer_email" required value={formData.customer_email} onChange={handleChange} placeholder="john@email.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input type="tel" name="customer_phone" required value={formData.customer_phone} onChange={handleChange} placeholder="+254 700 000 000" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '2rem', marginTop: '2rem', marginBottom: '1.25rem' }}>
                    <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Shipping Address</p>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={labelStyle}>Street Address *</label>
                      <input type="text" name="shipping_address" required value={formData.shipping_address} onChange={handleChange} placeholder="123 Oginga Odinga Street" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={labelStyle}>City *</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Kisumu" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={labelStyle}>Delivery Region *</label>
                      <select
                        name="region_id"
                        required
                        value={formData.region_id}
                        onChange={e => {
                          const selected = regions.find(r => r.id == e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            region_id: e.target.value,
                            region_name: selected?.name || '',
                          }));
                          setShipping(selected?.cost || 0);
                        }}
                        style={{
                          ...inputStyle,
                          cursor: 'pointer',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="">Select delivery region…</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.name} — KES {parseFloat(region.cost).toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Order Notes <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 300 }}>(optional)</span></label>
                      <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                        placeholder="Any special instructions…"
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
                    </div>
                  </div>

                </div>

              ) : (

                /* Step 2 — Review */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* Your details summary */}
                  <div style={{ border: '1px solid var(--gray-100)', padding: '2rem', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <p className="eyebrow">Your Details</p>
                      <button type="button" onClick={() => setStep(1)}
                        style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid var(--gray-300)', color: 'var(--gray-500)', cursor: 'pointer', padding: '0 0 2px 0' }}>
                        Edit
                      </button>
                    </div>
                    {[
                      { label: 'Name', value: formData.customer_name },
                      { label: 'Email', value: formData.customer_email },
                      { label: 'Phone', value: formData.customer_phone },
                      { label: 'Address', value: `${formData.shipping_address}, ${formData.city}` },
                      { label: 'Region', value: formData.region_name },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid var(--gray-50)' }}>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontSize: '0.875rem' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Items */}
                  <div style={{ border: '1px solid var(--gray-100)', padding: '2rem', backgroundColor: '#fff' }}>
                    <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>Order Items</p>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--gray-50)' }}>
                        <div style={{ width: '52px', height: '52px', backgroundColor: 'var(--gray-50)', flexShrink: 0, overflow: 'hidden' }}>
                          {item.image && <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.15rem', lineHeight: 1.3 }}>{item.title}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontSize: '0.875rem' }}>KES {(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>

            {/* ── Right: Order Summary ── */}
            <div style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--gray-100)', padding: '2rem', position: 'sticky', top: '88px' }}>

              <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Order Summary</p>

              {/* Cart items */}
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-700)', paddingRight: '1rem' }}>
                    {item.title} × {item.quantity}
                  </span>
                  <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Subtotal + Shipping */}
              {[
                { label: 'Subtotal', value: `KES ${subtotal.toLocaleString()}` },
                { label: 'Shipping', value: `KES ${shipping.toLocaleString()}` },
              ].map(line => (
                <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{line.label}</span>
                  <span style={{ fontSize: '0.85rem' }}>{line.value}</span>
                </div>
              ))}

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300 }}>
                  KES {total.toLocaleString()}
                </span>
              </div>

              {/* CTA button */}
              <button type="submit" disabled={submitting} className="btn-primary"
                style={{ width: '100%', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Processing…' : step === 1 ? 'Continue to Review →' : 'Pay with PesaPal →'}
              </button>

              <p style={{ fontSize: '0.68rem', color: 'var(--gray-500)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.8 }}>
                {step === 2
                  ? 'You will be redirected to PesaPal to complete payment securely.'
                  : 'No payment yet — review your order on the next step.'}
              </p>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}