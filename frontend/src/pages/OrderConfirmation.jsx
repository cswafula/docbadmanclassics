import { useState, useEffect } from 'react';

export default function OrderConfirmation() {
  const params         = new URLSearchParams(window.location.search);
  const orderNumber    = params.get('order') || '—';
  const trackingId     = params.get('OrderTrackingId');

  const [status, setStatus]   = useState('verifying'); // verifying | paid | pending | error
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!trackingId || !orderNumber || orderNumber === '—') {
      setStatus('pending');
      return;
    }

    // Verify payment with backend
    fetch(`http://127.0.0.1:8000/api/v1/pesapal/verify?OrderTrackingId=${trackingId}&order=${orderNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'Completed') {
          setStatus('paid');
        } else {
          setStatus('pending');
        }
      })
      .catch(() => setStatus('error'))
      .finally(() => setChecked(true));
  }, []);

  const states = {
    verifying: {
      eyebrow: 'Please wait',
      title:   'Verifying Payment…',
      message: 'We are confirming your payment with PesaPal. This will only take a moment.',
      color:   '#f59e0b',
    },
    paid: {
      eyebrow: 'Thank You',
      title:   'Order Confirmed',
      message: 'Your payment was successful and your order has been confirmed. A confirmation email is on its way to you.',
      color:   '#15803d',
    },
    pending: {
      eyebrow: 'Order Received',
      title:   'Payment Pending',
      message: 'Your order has been received but payment is still being processed. We will send you a confirmation email once payment clears.',
      color:   '#f59e0b',
    },
    error: {
      eyebrow: 'Something went wrong',
      title:   'Could Not Verify',
      message: 'We could not verify your payment status right now. Your order has been saved — please contact us with your order number.',
      color:   '#dc2626',
    },
  };

  const current = states[status];

  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>

      {/* Status indicator */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: current.color,
        margin: '0 auto 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
      }}>
        {status === 'verifying' ? (
          <span style={{ color: '#fff', fontSize: '0.75rem', letterSpacing: '0.05em' }}>...</span>
        ) : status === 'paid' ? (
          <span style={{ color: '#fff' }}>✓</span>
        ) : (
          <span style={{ color: '#fff' }}>!</span>
        )}
      </div>

      <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{current.eyebrow}</p>

      <h1 className="display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.25rem' }}>
        {current.title}
      </h1>

      {/* Order number */}
      <div style={{
        display: 'inline-block',
        backgroundColor: 'var(--cream)',
        border: '1px solid var(--gray-100)',
        padding: '0.6rem 1.5rem',
        marginBottom: '1.5rem',
      }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '0.2rem' }}>Order Number</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{orderNumber}</p>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.9, marginBottom: '3rem' }}>
        {current.message}
      </p>

      {status !== 'verifying' && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/gallery" className="btn-primary" style={{ textDecoration: 'none' }}>
            Continue Browsing
          </a>
          <a href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Back to Home
          </a>
        </div>
      )}

    </div>
  );
}