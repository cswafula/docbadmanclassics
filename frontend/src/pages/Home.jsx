import { useState, useEffect, useRef, useCallback } from 'react';
import { paintingsAPI, craftsAPI } from '../services/api';

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

/* ── Craft Card ── */
function CraftCard({ craft }) {
  const isSold = craft.quantity <= 0;

  const inner = (
    <>
      <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--gray-50)', overflow: 'hidden', marginBottom: '1rem', position: 'relative', flexShrink: 0 }}>
        {craft.image
          ? <img
              src={craft.image}
              alt={craft.title}
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
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#dc2626', color: '#fff', padding: '0.35rem 0.875rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, boxShadow: '0 2px 8px rgba(220,38,38,0.4)' }}>
            Sold
          </div>
        )}
      </div>
      <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Handcrafted</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.3, color: isSold ? 'var(--gray-300)' : 'var(--black)' }}>
        {craft.title}
      </p>
      <p style={{
        fontSize: isSold ? '0.65rem' : '0.9rem',
        color: isSold ? '#dc2626' : 'var(--black)',
        letterSpacing: isSold ? '0.2em' : '0',
        textTransform: isSold ? 'uppercase' : 'none',
        fontWeight: isSold ? 600 : 400,
      }}>
        {isSold ? 'Sold' : `KES ${parseFloat(craft.price).toLocaleString()}`}
      </p>
    </>
  );

  return isSold ? (
    <div style={{ width: '260px', flexShrink: 0, cursor: 'default' }}>{inner}</div>
  ) : (
    <a href={`/crafts/${craft.id}`} style={{ width: '260px', flexShrink: 0, textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {inner}
    </a>
  );
}

/* ── Collection Carousel ── */
function CollectionCarousel({ paintings, loading, viewAllHref = '/gallery', itemType = 'painting' }) {
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
          itemType === 'craft'
            ? paintings.map(c => <CraftCard key={c.id} craft={c} />)
            : paintings.map(p => <PaintingCard key={p.id} painting={p} />)
        ) : itemType === 'painting' ? (
          ['/img-gallery-3.jpg', '/img-gallery-4.jpg', '/img-gallery-5.jpg'].map((src, i) => (
            <AtmosphereCard key={i} src={src} />
          ))
        ) : (
          /* Crafts empty state — no atmosphere images, just a prompt */
          <div style={{ width: '100%', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 300, color: 'var(--gray-300)' }}>Crafts coming soon</p>
            <a href="/crafts" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--black)', textDecoration: 'none', borderBottom: '1px solid var(--black)', paddingBottom: '2px' }}>
              View Collection →
            </a>
          </div>
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
        <a href={viewAllHref} style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--black)', textDecoration: 'none', borderBottom: '1px solid var(--black)', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
          View All →
        </a>
      </div>
    </div>
  );
}

/* ── Branch data ── */
const BRANCHES = [
  {
    id: 'kisumu',
    city: 'Kisumu',
    tagline: 'Lakeside City · Kenya',
    description: 'A transport museum, art gallery and coffee shop for a memorable experience by the shores of Lake Victoria.',
    image: '/img-coffee-2.jpg',
    accentColor: '#4a9ebe',
    gradientFrom: 'rgba(8, 24, 42, 0.92)',
    gradientMid:  'rgba(8, 24, 42, 0.60)',
    venues: [
      { label: 'Transport Museum',  sub: 'Classic cars & motorcycles', href: '/museum'  },
      { label: 'Art Gallery',       sub: 'Contemporary East African art', href: '/gallery' },
      { label: 'Bad Duka Coffee',   sub: 'Coffee & garden · 9am – 9pm', href: '/coffee'  },
    ],
  },
  {
    id: 'kakamega',
    city: 'Kakamega',
    tagline: 'Forest Highlands · Kenya',
    description: "Art, adventure and fine dining in Kenya's only tropical rainforest region, where culture runs as deep as the ancient trees.",
    image: '/kakamega-landscape.jpeg',
    accentColor: '#7ab860',
    gradientFrom: 'rgba(4, 18, 6, 0.92)',
    gradientMid:  'rgba(4, 18, 6, 0.60)',
    venues: [
      { label: 'Kabras Rock Camp',         sub: 'Wilderness retreat & camping', href: '/locations#kakamega' },
      { label: 'Mama Factory Art Gallery', sub: 'Local & international artists', href: '/locations#kakamega' },
      { label: 'Fine Dining Restaurant',   sub: 'Curated cuisine in the forest',  href: '/locations#kakamega' },
    ],
  },
  {
    id: 'narok',
    city: 'Narok',
    tagline: 'Gateway to the Mara · Kenya',
    description: 'Contemporary art at the edge of the great Rift Valley, where the vast plains of the Maasai Mara meet the sky.',
    image: '/suswa-landscape.jpg',
    accentColor: '#c8843e',
    gradientFrom: 'rgba(36, 13, 3, 0.92)',
    gradientMid:  'rgba(36, 13, 3, 0.60)',
    venues: [
      { label: 'Mount Suswa Art Gallery', sub: 'Art at the edge of the Rift Valley', href: '/locations#narok' },
    ],
  },
];

/* ── Branch Book Slider ── */
function BranchBook() {
  const [active, setActive] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const timerRef = useRef(null);
  const activeRef = useRef(0);
  activeRef.current = active;
  const sectionRef = useReveal();

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const advance = useCallback(() => {
    const next = (activeRef.current + 1) % BRANCHES.length;
    setActive(next);
    setFlipKey(k => k + 1);
  }, []);

  const goTo = useCallback((idx) => {
    if (idx === activeRef.current) return;
    setActive(idx);
    setFlipKey(k => k + 1);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 6500);
  }, [advance]);

  useEffect(() => {
    timerRef.current = setInterval(advance, 6500);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  const b = BRANCHES[active];

  const branch = BRANCHES[active];

  /* ── Mobile panel ── */
  const MobilePanel = () => (
    <div>
      {/* Mobile tab row */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {BRANCHES.map((b, i) => (
          <button
            key={b.id}
            onClick={() => goTo(i)}
            style={{
              flex: 1, padding: '0.875rem 0.5rem',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: i === active ? `3px solid ${b.accentColor}` : '3px solid transparent',
              marginBottom: '-1px',
              transition: 'border-color 0.3s',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: i === active ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'color 0.3s',
            }}>
              {b.city}
            </p>
          </button>
        ))}
      </div>

      {/* Mobile active panel */}
      <div key={flipKey} style={{
        position: 'relative', height: '420px', overflow: 'hidden',
        animation: 'branchContentReveal 0.55s ease forwards',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${branch.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.75)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${branch.gradientFrom} 0%, ${branch.gradientMid} 50%, transparent 100%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0, padding: '2rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: branch.accentColor, marginBottom: '0.5rem',
          }}>
            {branch.tagline}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 10vw, 3.5rem)',
            fontWeight: 300, color: '#fff', lineHeight: 0.95,
            letterSpacing: '-0.02em', marginBottom: '0.875rem',
          }}>
            {branch.city}
          </h3>
          <p style={{
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8, marginBottom: '1.5rem',
          }}>
            {branch.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
            {branch.venues.map((v, vi) => (
              <a key={v.label} href={v.href} onClick={e => e.stopPropagation()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  textDecoration: 'none',
                  animation: `venueSlideIn 0.45s ease ${vi * 0.1}s both`,
                }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: branch.accentColor, flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
                }}>
                  {v.label}
                </span>
              </a>
            ))}
          </div>
          <a href={`/locations#${branch.id}`} onClick={e => e.stopPropagation()} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: branch.accentColor, textDecoration: 'none',
            borderBottom: `1px solid ${branch.accentColor}66`, paddingBottom: '2px',
            width: 'fit-content',
          }}>
            Explore {branch.city} →
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section style={{ backgroundColor: '#0d1410', padding: isMobile ? '3rem 0 0' : '5rem 0 0' }}>

      {/* Section header */}
      <div className="container" style={{ marginBottom: isMobile ? '1.5rem' : '2.5rem' }} ref={sectionRef}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
              letterSpacing: '0.35em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem',
            }}>
              Three Cities · One Vision
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 300, color: '#fff',
              letterSpacing: '-0.02em', lineHeight: 0.95,
            }}>
              Our Locations
            </h2>
          </div>
          <a href="/locations" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px',
            transition: 'color 0.2s, border-color 0.2s', whiteSpace: 'nowrap',
          }}
            onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          >
            View All Locations →
          </a>
        </div>
      </div>

      {/* Mobile layout */}
      {isMobile && <MobilePanel />}

      {/* Desktop book panels */}
      {!isMobile && (
      <div
        className="branch-book-panels"
        style={{
          display: 'flex',
          height: '560px',
          overflow: 'hidden',
          paddingLeft: 'max(2rem, calc((100vw - 1280px) / 2 + 2rem))',
        }}
      >
        {BRANCHES.map((branch, i) => {
          const isActive = i === active;
          return (
            <div
              key={branch.id}
              onClick={() => goTo(i)}
              className={isActive ? 'branch-panel-active' : 'branch-panel-inactive'}
              style={{
                flex: isActive ? '1 1 0' : '0 0 80px',
                transition: 'flex 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: isActive ? 'default' : 'pointer',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              {/* Background image */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${branch.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: isActive ? 'scale(1)' : 'scale(1.06)',
                transition: 'transform 0.8s ease, filter 0.6s ease',
                filter: isActive ? 'brightness(0.85)' : 'brightness(0.4) saturate(0.5)',
                willChange: 'transform',
              }} />

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: isActive
                  ? `linear-gradient(105deg, ${branch.gradientFrom} 0%, ${branch.gradientMid} 45%, transparent 100%)`
                  : 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
                transition: 'background 0.6s ease',
              }} />

              {/* Inactive: spine label */}
              {!isActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  animation: 'spineReveal 0.4s ease forwards',
                }}>
                  {/* Accent colour bar */}
                  <span style={{
                    display: 'block', width: '2px', height: '28px',
                    backgroundColor: branch.accentColor, flexShrink: 0,
                  }} />
                  <p
                    className="spine-label"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.32em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      transform: 'rotate(-90deg)',
                      whiteSpace: 'nowrap',
                      textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                    }}
                  >
                    {branch.city}
                  </p>
                </div>
              )}

              {/* Active: full content */}
              {isActive && (
                <div
                  key={flipKey}
                  style={{
                    position: 'absolute', inset: 0,
                    padding: 'clamp(2rem, 3vw, 3rem)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    animation: 'branchContentReveal 0.65s cubic-bezier(0.4,0,0.2,1) forwards',
                  }}
                >
                  {/* Branch number badge */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                    color: branch.accentColor,
                    marginBottom: '0.5rem',
                    opacity: 0.9,
                  }}>
                    {String(BRANCHES.indexOf(branch) + 1).padStart(2, '0')} · {branch.tagline}
                  </p>

                  {/* City name */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
                    fontWeight: 300,
                    color: '#fff',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    marginBottom: '1rem',
                  }}>
                    {branch.city}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.85,
                    maxWidth: '380px',
                    marginBottom: '2rem',
                  }}>
                    {branch.description}
                  </p>

                  {/* Venue list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {branch.venues.map((v, vi) => (
                      <a
                        key={v.label}
                        href={v.href}
                        onClick={e => e.stopPropagation()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.875rem',
                          textDecoration: 'none',
                          animation: `venueSlideIn 0.5s ease ${0.25 + vi * 0.12}s both`,
                        }}
                      >
                        <span style={{
                          width: '28px', height: '1px',
                          backgroundColor: branch.accentColor,
                          display: 'block', flexShrink: 0,
                          transition: 'width 0.3s ease',
                        }} id={`line-${branch.id}-${vi}`} />
                        <span>
                          <span
                            style={{
                              display: 'block',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.78rem', fontWeight: 500,
                              letterSpacing: '0.12em', textTransform: 'uppercase',
                              color: 'rgba(255,255,255,0.82)',
                              transition: 'color 0.2s',
                              lineHeight: 1.2,
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.color = '#fff';
                              const line = document.getElementById(`line-${branch.id}-${vi}`);
                              if (line) line.style.width = '44px';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.color = 'rgba(255,255,255,0.82)';
                              const line = document.getElementById(`line-${branch.id}-${vi}`);
                              if (line) line.style.width = '28px';
                            }}
                          >
                            {v.label}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', marginTop: '1px' }}>
                            {v.sub}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={`/locations#${branch.id}`}
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: branch.accentColor,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${branch.accentColor}55`,
                      paddingBottom: '2px',
                      width: 'fit-content',
                      animation: 'venueSlideIn 0.5s ease 0.55s both',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = branch.accentColor}
                    onMouseOut={e => e.currentTarget.style.borderColor = `${branch.accentColor}55`}
                  >
                    Explore {branch.city}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              )}

              {/* Hover glow on inactive */}
              {!isActive && (
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: 'rgba(255,255,255,0)',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0)'}
                />
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Progress dots + branch nav — desktop only */}
      {!isMobile && (
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.75rem 2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {BRANCHES.map((branch, i) => (
            <button
              key={branch.id}
              onClick={() => goTo(i)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0',
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                opacity: i === active ? 1 : 0.38,
                transition: 'opacity 0.35s',
              }}
            >
              <span style={{
                display: 'block',
                width: i === active ? '32px' : '14px',
                height: '2px',
                backgroundColor: i === active ? BRANCHES[i].accentColor : 'rgba(255,255,255,0.5)',
                transition: 'width 0.45s ease, background-color 0.35s',
                ...(i === active ? { animation: 'progressSweep 6.5s linear forwards', transformOrigin: 'left' } : {}),
              }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: i === active ? '#fff' : 'rgba(255,255,255,0.45)',
                transition: 'color 0.35s',
              }}>
                {branch.city}
              </span>
            </button>
          ))}
        </div>

        {/* Divider + locations link */}
        <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)', display: 'block', minWidth: '20px' }} />
        <a href="/locations" style={{
          fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
          transition: 'color 0.2s', whiteSpace: 'nowrap',
        }}
          onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          All Locations →
        </a>
      </div>
      )}

      {/* Mobile: bottom link */}
      {isMobile && (
        <div style={{ padding: '1.25rem 1.25rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a href="/locations" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
          }}>
            All Locations →
          </a>
        </div>
      )}

    </section>
  );
}

export default function Home() {
  const [activeTab, setActiveTab]   = useState('paintings');
  const [paintings, setPaintings]   = useState([]);
  const [crafts, setCrafts]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const galleryRef = useReveal();
  const pillarsRef = useReveal();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      paintingsAPI.getAll({ per_page: 20 }),
      craftsAPI.getAll({ per_page: 20 }),
    ])
      .then(([pRes, cRes]) => {
        setPaintings(pRes.data.data);
        setCrafts(cRes.data.data);
      })
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

      {/* ── BRANCH BOOK ── */}
      <BranchBook />

      {/* ── GALLERY CAROUSEL ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div ref={galleryRef} className="reveal" style={{ marginBottom: '2.5rem' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>Art Gallery</p>
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--gray-100)' }}>
                  {[
                    { key: 'paintings', label: 'Our Paintings Collection', href: '/gallery' },
                    { key: 'crafts',    label: 'Our Crafts Collection',    href: '/crafts'  },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontWeight: 300,
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab.key ? '2px solid var(--black)' : '2px solid transparent',
                        marginBottom: '-1px',
                        cursor: 'pointer',
                        color: activeTab === tab.key ? 'var(--black)' : 'var(--gray-300)',
                        transition: 'color 0.2s, border-color 0.2s',
                        whiteSpace: 'nowrap',
                        paddingLeft: tab.key === 'paintings' ? 0 : '1.25rem',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                {!loading && `${activeTab === 'paintings' ? paintings.length : crafts.length} works · Scroll to explore`}
              </p>
            </div>
          </div>

          <CollectionCarousel
            paintings={activeTab === 'paintings' ? paintings : crafts}
            loading={loading}
            viewAllHref={activeTab === 'paintings' ? '/gallery' : '/crafts'}
            itemType={activeTab === 'paintings' ? 'painting' : 'craft'}
          />
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