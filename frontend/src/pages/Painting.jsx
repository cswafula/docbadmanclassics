import { useState, useEffect, useRef } from 'react';
import { paintingsAPI } from '../services/api';

/* ── Zoom Image Component ── */
function ZoomImage({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (!src) return (
    <div style={{ aspectRatio: '1', backgroundColor: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
      <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-300)' }}>No Image Available</span>
    </div>
  );

  return (
    <div ref={ref}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
      style={{ backgroundColor: 'var(--gray-50)', marginBottom: '1rem', overflow: 'hidden', cursor: zoomed ? 'crosshair' : 'zoom-in', position: 'relative' }}
    >
      <img src={src} alt={alt} style={{
        width: '100%', display: 'block', maxHeight: '580px', objectFit: 'contain',
        transition: 'transform 0.15s ease',
        transform: zoomed ? 'scale(2.2)' : 'scale(1)',
        transformOrigin: `${pos.x}% ${pos.y}%`,
      }} />
      {!zoomed && (
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', pointerEvents: 'none' }}>
          Hover to zoom
        </div>
      )}
    </div>
  );
}

export default function Painting() {
  const id = window.location.pathname.split('/')[2];
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    paintingsAPI.getById(id)
      .then(res => {
        setPainting(res.data);
        setSelectedImage(res.data.primary_image);
        // Check if already in cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.find(i => i.id == res.data.id)) setAdded(true);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.find(i => i.id === painting.id)) { setAdded(true); return; }
    cart.push({
      id: painting.id,
      title: painting.title,
      artist: painting.artist,
      price: painting.price,
      quantity: 1,
      stock: painting.quantity,
      image: painting.primary_image,
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
  };

  if (loading) return (
    <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
      <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Loading…</p>
    </div>
  );

  if (!painting) return (
    <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
      <p className="eyebrow" style={{ marginBottom: '1rem' }}>Not Found</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '2rem' }}>Painting not found</p>
      <a href="/gallery" className="btn-primary">Back to Gallery</a>
    </div>
  );

  return (
    <div>

      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: '1px solid var(--gray-100)', padding: '0.875rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--gray-500)' }}>
            <a href="/" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>Home</a>
            <span>/</span>
            <a href="/gallery" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>Gallery</a>
            <span>/</span>
            <span style={{ color: 'var(--black)' }}>{painting.title}</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="painting-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'start' }}>

          {/* Left — Images */}
          <div>
            <ZoomImage src={selectedImage} alt={painting.title} />

            {/* Thumbnails */}
            {painting.all_images && painting.all_images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {painting.all_images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(img.url)}
                    style={{ width: '68px', height: '68px', padding: 0, border: '2px solid', borderColor: selectedImage === img.url ? 'var(--black)' : 'transparent', cursor: 'pointer', overflow: 'hidden', backgroundColor: 'var(--gray-50)' }}>
                    <img src={img.url} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div style={{ position: 'sticky', top: '88px' }}>

            {/* Artist eyebrow */}
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{painting.artist}</p>

            {/* Title */}
            <h1 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              {painting.title}
            </h1>

            {/* Price / Sold */}
            <div style={{ marginBottom: '2rem' }}>
              {painting.quantity == 0 ? (
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gray-500)', fontStyle: 'italic' }}>This work has been sold</p>
              ) : (
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>
                  KES {parseFloat(painting.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Add to cart */}
            {painting.quantity > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                {added ? (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
                    <div style={{ flex: 1, padding: '0.875rem 1rem', backgroundColor: 'var(--cream)', border: '1px solid var(--gray-100)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--gray-700)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      Added to Cart
                    </div>
                    <a href="/cart" className="btn-primary" style={{ textDecoration: 'none' }}>View Cart</a>
                  </div>
                ) : (
                  <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%' }}>
                    Add to Cart
                  </button>
                )}
              </div>
            )}

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1.75rem', marginBottom: '1.75rem' }}>

              {/* Description */}
              {painting.description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.9, marginBottom: '1.75rem', fontStyle: 'italic' }}>
                  {painting.description}
                </p>
              )}

              {/* Specs */}
              {[
                { label: 'Medium', value: painting.medium },
                { label: 'Size',   value: painting.size },
                { label: 'Year',   value: painting.year },
                { label: 'Artist', value: painting.artist },
              ].filter(item => item.value).map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--black)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Back link */}
            <a href="/gallery" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              ← Back to Gallery
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}