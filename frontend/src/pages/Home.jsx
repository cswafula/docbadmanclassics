import { useState, useEffect, useRef } from 'react';
import { paintingsAPI } from '../services/api';

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Hero Slider ── */
const SLIDES = [
  { image: '/img-museum-2.jpg', eyebrow: 'Kisumu, Kenya', title: 'Where Engines\nMeet Art', sub: 'A transport museum, art gallery and coffee shop for a memorable experience in the lakeside city of Kisumu.', cta: 'Explore Gallery', ctaHref: '/gallery', ctaAlt: 'Our Story', ctaAltHref: '/#about' },
  { image: '/img-gallery-1.jpg', eyebrow: 'Art Gallery · Est. 2025', title: 'Contemporary\nEast African Art', sub: 'A bespoke collection of works from local and international artists celebrating identity, resilience and culture.', cta: 'View Artworks', ctaHref: '/gallery', ctaAlt: null },
  { image: '/img-museum-1.jpg', eyebrow: 'Transport Museum', title: 'Classics Built\nto Last', sub: "Classic cars & motorcycles — some competing in the Africa Concours d'Élégance since 2015.", cta: 'Discover More', ctaHref: '/museum', ctaAlt: null },
];

function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCur(c => (c + 1) % SLIDES.length); setFading(false); }, 400);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[cur];
  return (
    <section style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden' }}>
      {SLIDES.map((sl, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${sl.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === cur ? 1 : 0, transition: 'opacity 0.9s ease' }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)' }} />
      <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '580px', opacity: fading ? 0 : 1, transform: fading ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
          <p className="eyebrow-accent fade-up" style={{ marginBottom: '1rem' }}>{s.eyebrow}</p>
          <h1 className="display fade-up delay-1 hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>{s.title}</h1>
          <p className="fade-up delay-2" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '440px' }}>{s.sub}</p>
          <div className="fade-up delay-3 mobile-stack" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={s.ctaHref} className="btn-white">{s.cta}</a>
            {s.ctaAlt && (
              <a href={s.ctaAltHref} style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.35)', paddingBottom: '2px', display: 'flex', alignItems: 'center' }}>
                {s.ctaAlt}
              </a>
            )}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? '28px' : '7px', height: '3px', backgroundColor: i === cur ? 'var(--accent)' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.4s, background 0.3s' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '1.75rem', right: '2rem', zIndex: 10, color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
        {String(cur + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
}

/* ── Painting Card ── */
function PaintingCard({ painting }) {
  const isSold = painting.quantity <= 0;

  const inner = (
    <>
      <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--gray-50)', overflow: 'hidden', marginBottom: '1rem', position: 'relative', flexShrink: 0 }}>
        {painting.primary_image
          ? <img
              src={painting.primary_image}
              alt={painting.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.6s ease',
                filter: isSold ? 'grayscale(50%) brightness(0.9)' : 'none',
              }}
              onMouseOver={e => { if (!isSold) e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              No Image
            </div>
        }
        {isSold && (
          <div style={{
            position: 'absolute', top: '1rem', left: '1rem',
            backgroundColor: '#dc2626', color: '#fff',
            padding: '0.35rem 0.875rem', fontSize: '0.65rem',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            fontWeight: 600, boxShadow: '0 2px 8px rgba(220,38,38,0.4)',
          }}>
            Sold
          </div>
        )}
      </div>
      <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>{painting.medium || 'Original Work'}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.2rem', lineHeight: 1.3, color: isSold ? 'var(--gray-300)' : 'var(--black)' }}>
        {painting.title}
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: '0.4rem' }}>
        {painting.artist}
      </p>
      <p style={{
        fontSize: isSold ? '0.65rem' : '0.9rem',
        color: isSold ? '#dc2626' : 'var(--black)',
        letterSpacing: isSold ? '0.2em' : '0',
        textTransform: isSold ? 'uppercase' : 'none',
        fontWeight: isSold ? 600 : 400,
      }}>
        {isSold ? 'Sold' : `KES ${parseFloat(painting.price).toLocaleString()}`}
      </p>
    </>
  );

  return isSold ? (
    <div style={{ width: '260px', flexShrink: 0, cursor: 'default' }}>{inner}</div>
  ) : (
    <a href={`/paintings/${painting.id}`} style={{ width: '260px', flexShrink: 0, textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {inner}
    </a>
  );
}

/* ── Atmosphere Card ── */
function AtmosphereCard({ src }) {
  return (
    <a href="/gallery" style={{ width: '260px', flexShrink: 0, textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
        <img src={src} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.6s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
      </div>
      <p className="eyebrow" style={{ marginTop: '0.75rem' }}>View Collection →</p>
    </a>
  );
}

/* ── Collection Carousel ── */
function CollectionCarousel({ paintings, loading }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [paintings]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 580, behavior: 'smooth' });
  };

  const btnStyle = (active) => ({
    width: '44px', height: '44px',
    borderRadius: '50%',
    border: '1px solid var(--gray-100)',
    backgroundColor: active ? 'var(--black)' : '#fff',
    color: active ? '#fff' : 'var(--gray-300)',
    cursor: active ? 'pointer' : 'not-allowed',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  });

  return (
    <div>
      {/* Scroll track */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',        /* Firefox */
          msOverflowStyle: 'none',       /* IE */
          paddingBottom: '1rem',
          cursor: 'grab',
        }}
        /* hide webkit scrollbar */
        onMouseDown={e => {
          const el = scrollRef.current;
          el.isDragging = true;
          el.startX = e.pageX - el.offsetLeft;
          el.scrollStart = el.scrollLeft;
          el.style.cursor = 'grabbing';
        }}
        onMouseMove={e => {
          const el = scrollRef.current;
          if (!el.isDragging) return;
          const x = e.pageX - el.offsetLeft;
          el.scrollLeft = el.scrollStart - (x - el.startX);
        }}
        onMouseUp={e => { scrollRef.current.isDragging = false; scrollRef.current.style.cursor = 'grab'; }}
        onMouseLeave={e => { if (scrollRef.current.isDragging) { scrollRef.current.isDragging = false; scrollRef.current.style.cursor = 'grab'; } }}
      >
        <style>{`.carousel-track::-webkit-scrollbar { display: none; }`}</style>

        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} style={{ width: '260px', flexShrink: 0 }}>
              <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--gray-50)', marginBottom: '1rem' }} />
              <div style={{ height: '0.9rem', backgroundColor: 'var(--gray-50)', marginBottom: '0.5rem', width: '70%' }} />
              <div style={{ height: '0.75rem', backgroundColor: 'var(--gray-50)', width: '40%' }} />
            </div>
          ))
        ) : paintings.length > 0 ? (
          paintings.map(p => <PaintingCard key={p.id} painting={p} />)
        ) : (
          ['/img-gallery-3.jpg', '/img-gallery-4.jpg', '/img-gallery-5.jpg'].map((src, i) => (
            <AtmosphereCard key={i} src={src} />
          ))
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>

        {/* Arrow buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            style={btnStyle(canScrollLeft)}
            onMouseOver={e => { if (canScrollLeft) e.currentTarget.style.backgroundColor = '#2d3f2e'; }}
            onMouseOut={e => { if (canScrollLeft) e.currentTarget.style.backgroundColor = 'var(--black)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            style={btnStyle(canScrollRight)}
            onMouseOver={e => { if (canScrollRight) e.currentTarget.style.backgroundColor = '#2d3f2e'; }}
            onMouseOut={e => { if (canScrollRight) e.currentTarget.style.backgroundColor = 'var(--black)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* View all */}
        <a href="/gallery" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--black)', textDecoration: 'none', borderBottom: '1px solid var(--black)', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
          View All →
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const [paintings, setPaintings]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const galleryRef = useReveal();
  const pillarsRef = useReveal();

  useEffect(() => {
    paintingsAPI.getAll({ per_page: 20 })
      .then(res => setPaintings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>

      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── 3 PILLARS ── */}
      <section style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div ref={pillarsRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { num: '01', label: 'Transport Museum', desc: 'Classic cars & motorcycles celebrating a century of East African transport history.', href: '/museum', dark: false },
              { num: '02', label: 'Art Gallery',      desc: 'Contemporary works from local & international artists. Originals available to purchase.', href: '/gallery', dark: true },
              { num: '03', label: 'Bad Duka Coffee',  desc: 'A rustic coffee shop and tranquil garden. Open 9am – 9pm daily.', href: '/coffee', dark: false },
            ].map((p, i) => (
              <a key={i} href={p.href} style={{
                display: 'block',
                padding: 'clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 2.5vw, 2rem)',
                textDecoration: 'none',
                color: p.dark ? '#fff' : 'inherit',
                borderRight: i < 2 ? '1px solid var(--gray-100)' : 'none',
                backgroundColor: p.dark ? 'var(--black)' : 'transparent',
              }}>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: p.dark ? 'var(--accent)' : 'var(--gray-500)', marginBottom: '0.6rem' }}>{p.num}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '0.6rem' }}>{p.label}</h3>
                <p className="pillar-desc" style={{ fontSize: '0.82rem', lineHeight: 1.8, color: p.dark ? 'rgba(255,255,255,0.6)' : 'var(--gray-700)' }}>{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY CAROUSEL ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div ref={galleryRef} className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>Art Gallery</p>
              <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Our Collection</h2>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
              {!loading && `${paintings.length} works · Scroll to explore`}
            </p>
          </div>

          <CollectionCarousel paintings={paintings} loading={loading} />
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section style={{ backgroundColor: 'var(--black)', padding: '3.5rem 0' }}>
        <div className="container mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <p className="eyebrow-accent" style={{ marginBottom: '0.4rem' }}>Connect With Us</p>
            <h3 className="display" style={{ fontSize: '1.75rem', color: '#fff' }}>Follow Our Journey</h3>
          </div>
          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { name: 'Facebook',  url: 'https://www.facebook.com/share/1Cahu5sjEq/' },
              { name: 'Instagram', url: 'https://www.instagram.com/docbadmanclassics' },
              { name: 'TikTok',    url: 'https://www.tiktok.com/@doc.badman.classi' },
              { name: 'YouTube',   url: 'https://youtube.com/@docbadmanclassics' },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}