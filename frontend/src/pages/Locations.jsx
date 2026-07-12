import { useState, useEffect, useRef } from 'react';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const BRANCHES = [
  {
    id: 'kisumu',
    city: 'Kisumu',
    tagline: 'Lakeside City',
    country: 'Kenya',
    address: 'Tom Mboya Road, Milimani',
    mapsUrl: 'https://maps.google.com/?q=Tom+Mboya+Road+Milimani+Kisumu+Kenya',
    description: 'Our flagship destination on the shores of Lake Victoria — where a transport museum, art gallery and artisan coffee shop come together in one unforgettable experience.',
    longDesc: 'Kisumu is the birthplace of Doc Badman Classics. The lakeside city, framed by the vast expanse of Lake Victoria and the Kisumu Impala Sanctuary, provides a rich backdrop for a space that celebrates engineering heritage, contemporary East African art, and the simple pleasure of a perfect cup of coffee.',
    image: '/img-building.jpg',
    heroImage: '/img-coffee-2.jpg',
    accentColor: '#4a9ebe',
    darkBg: '#0a1e32',
    established: '2025',
    venues: [
      {
        label: 'Transport Museum',
        sub: 'Est. 2025',
        desc: 'Classic cars, motorcycles and East African transport history spanning over a century. Some vehicles have competed in the Africa Concours d\'Élégance since 2015.',
        image: '/img-museum-1.jpg',
        href: '/museum',
        cta: 'Visit Museum',
      },
      {
        label: 'Art Gallery',
        sub: 'Paintings & Crafts',
        desc: 'A bespoke collection of works from local and international artists — celebrating identity, resilience and culture. Original paintings and handcrafted works available to purchase.',
        image: '/img-gallery-3.jpg',
        href: '/gallery',
        cta: 'View Collection',
      },
      {
        label: 'Bad Duka Coffee',
        sub: 'Open 9am – 9pm',
        desc: 'A rustic coffee shop and tranquil garden — the perfect retreat after exploring the museum and gallery. Specialty brews, light bites and an atmosphere steeped in art and history.',
        image: '/img-coffee.jpg',
        href: '/coffee',
        cta: 'Explore Coffee',
      },
    ],
  },
  {
    id: 'kakamega',
    city: 'Kakamega',
    tagline: 'Forest Highlands',
    country: 'Kenya',
    address: 'Mugai, Kabras',
    mapsUrl: 'https://maps.google.com/?q=Mugai+Kabras+Kakamega+Kenya',
    description: 'Nestled in Kenya\'s only tropical rainforest region — a wilderness retreat, art gallery and fine dining experience unlike any other.',
    longDesc: 'Kakamega Forest is one of Africa\'s last remaining fragments of ancient rainforest. Our Kakamega branch brings together the raw beauty of the forest with curated art, adventure camping and exceptional cuisine — a destination that feeds the soul as much as the body.',
    image: '/kakamega-landscape.jpeg',
    heroImage: '/kakamega-landscape.jpeg',
    accentColor: '#7ab860',
    darkBg: '#051606',
    established: 'Coming Soon',
    highlights: [
      {
        id: 'kakamega-1',
        title: 'Kakamega — Coming Soon',
        desc: 'Wilderness nights, forest walks and open skies — a first look at what we\'re building in the heart of Kakamega Forest.',
        src: '/videos/kakamega-1.mp4',
        poster: '/img-gallery-5.jpg',
      },
    ],
    venues: [
      {
        label: 'Kabras Rock Camp',
        sub: 'Wilderness Retreat',
        desc: 'An immersive camping experience at the edge of Kakamega Forest — bonfires, stargazing, guided forest walks and the sounds of nature as your soundtrack.',
        image: '/kakamega-landscape.jpeg',
        href: '/locations#kakamega',
        cta: 'Coming Soon',
        comingSoon: true,
      },
      {
        label: 'Mama Factory Art Gallery',
        sub: 'Local & International Artists',
        desc: 'A gallery rooted in the spirit of the forest — showcasing works by Kenyan artists and international voices that speak to the land, its people and its stories.',
        image: '/img-gallery-4.jpg',
        href: '/locations#kakamega',
        cta: 'Coming Soon',
        comingSoon: true,
      },
      {
        label: 'Fine Dining Restaurant',
        sub: 'Forest Cuisine',
        desc: 'A curated dining experience drawing on the rich agricultural heritage of Western Kenya — seasonal menus, local ingredients and a setting that only the forest can provide.',
        image: '/kabras-landscape.jpeg',
        href: '/locations#kakamega',
        cta: 'Coming Soon',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'narok',
    city: 'Narok',
    tagline: 'Gateway to the Mara',
    country: 'Kenya',
    address: 'Suswa Scapes, Narok',
    mapsUrl: 'https://maps.google.com/?q=Suswa+Scapes+Narok+Kenya',
    description: 'Contemporary art at the edge of the great Rift Valley — where the Maasai Mara\'s endless plains meet the sky, and creativity finds its grandest canvas.',
    longDesc: 'The Rift Valley has shaped civilisations, inspired migrations and carved one of the most dramatic landscapes on earth. Mount Suswa Art Gallery stands at this crossroads — a space where the ancient and contemporary meet, and where Maasai culture informs a new generation of East African art.',
    image: '/img-coffee-2.jpg',
    heroImage: '/suswa-landscape.jpg',
    accentColor: '#c8843e',
    darkBg: '#200a02',
    established: 'Coming Soon',
    venues: [
      {
        label: 'Mount Suswa Art Gallery',
        sub: 'Rift Valley · Kenya',
        desc: 'Art at the edge of the world — a gallery perched on the slopes of Mount Suswa, with views across the Rift Valley and a collection that honours the land and its people.',
        image: '/suswa-landscape.png',
        video: '/videos/suswa_preview.mp4',
        href: '/locations#narok',
        cta: 'Coming Soon',
        brandNew: true,
      },
    ],
  },
];

function VenueCard({ venue, accent, index }) {
  const ref = useReveal();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--gray-100)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '280px',
      }}>
        {/* Image or Video */}
        <div style={{ overflow: 'hidden', position: 'relative', ...(index % 2 === 1 ? { order: 2 } : {}) }}>
          {venue.video ? (
            <>
              <video
                ref={videoRef}
                src={venue.video}
                poster={venue.image}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Play/pause button */}
              <button
                onClick={togglePlay}
                style={{
                  position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', backdropFilter: 'blur(4px)',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.55)'}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? '⏸' : '▶'}
              </button>
              {/* Brand New badge */}
              {venue.brandNew && (
                <div style={{
                  position: 'absolute', top: '0.75rem', left: '0.75rem',
                  backgroundColor: 'var(--accent)',
                  padding: '0.3rem 0.75rem',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
                    letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff',
                  }}>Brand New!</p>
                </div>
              )}
            </>
          ) : (
            <img
              src={venue.image}
              alt={venue.label}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block', transition: 'transform 0.7s ease',
              }}
              onMouseOver={e => !venue.comingSoon && (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          )}
          {venue.comingSoon && !venue.brandNew && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: '#fff', border: '1px solid rgba(255,255,255,0.6)',
                padding: '0.5rem 1.25rem',
              }}>
                Coming Soon
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          ...(index % 2 === 1 ? { order: 1 } : {}),
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: accent, marginBottom: '0.625rem',
          }}>
            {venue.sub}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            fontWeight: 300, lineHeight: 1.2,
            color: 'var(--black)', marginBottom: '1rem',
          }}>
            {venue.label}
          </h3>
          <p style={{
            fontSize: '0.875rem', lineHeight: 1.85,
            color: 'var(--gray-700)', marginBottom: '1.75rem',
          }}>
            {venue.desc}
          </p>
          {venue.comingSoon ? (
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--gray-300)',
            }}>
              {venue.cta}
            </span>
          ) : (
            <a href={venue.href} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--black)', textDecoration: 'none',
              borderBottom: '1px solid var(--black)', paddingBottom: '2px',
              width: 'fit-content', transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--black)'; }}
            >
              {venue.cta}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Coming-soon highlight video player ── */
function HighlightsSection({ branch }) {
  const [active, setActive] = useState(false);
  const { highlights, accentColor, city, darkBg } = branch;
  const video = highlights[0];

  return (
    <section style={{ backgroundColor: darkBg || '#0d1410', borderTop: `1px solid ${accentColor}22`, padding: '3rem 0' }}>
      <div className="container">
        <div className="highlight-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}>

          {/* Video player — left */}
          <div style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            backgroundColor: '#000',
            overflow: 'hidden',
            border: `1px solid ${accentColor}33`,
            flexShrink: 0,
          }}>
            {active ? (
              <video
                controls autoPlay
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                poster={video.poster}
              >
                <source src={video.src} type="video/mp4" />
              </video>
            ) : (
              <div
                onClick={() => setActive(true)}
                style={{ width: '100%', height: '100%', cursor: 'pointer', position: 'relative' }}
              >
                <img
                  src={video.poster} alt={video.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.6 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 100%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: accentColor }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      border: `2px solid ${accentColor}cc`,
                      backgroundColor: `${accentColor}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                      transition: 'transform 0.2s, background-color 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.backgroundColor = `${accentColor}44`; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseOut={e => { e.currentTarget.style.backgroundColor = `${accentColor}22`; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={accentColor}>
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description — right */}
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 700,
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: accentColor, marginBottom: '1rem',
            }}>
              Coming Soon · {city}
            </p>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '0.875rem',
            }}>
              {video.title}
            </h3>
            <p style={{
              fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.85, marginBottom: '1.75rem',
            }}>
              {video.desc}
            </p>
            <button
              onClick={() => setActive(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              <span style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `1px solid ${accentColor}88`,
                backgroundColor: `${accentColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={accentColor}>
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
              }}>
                Watch Preview
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function Locations() {
  const hash   = window.location.hash.replace('#', '') || 'kisumu';
  const initIdx = BRANCHES.findIndex(b => b.id === hash);
  const [activeIdx, setActiveIdx] = useState(initIdx >= 0 ? initIdx : 0);
  const branch = BRANCHES[activeIdx];
  const heroRef = useReveal();

  const switchBranch = (idx) => {
    setActiveIdx(idx);
    window.history.replaceState(null, '', `/locations#${BRANCHES[idx].id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: '52vh', minHeight: '380px', overflow: 'hidden' }}>
        {BRANCHES.map((b, i) => (
          <div
            key={b.id}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${b.heroImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === activeIdx ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '5.5rem' }}>
          <div ref={heroRef} className="reveal">
            <p className="eyebrow-accent" style={{ marginBottom: '0.6rem' }}>
              {branch.tagline} · {branch.established}
            </p>
            <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: '#fff', marginBottom: '0.5rem', lineHeight: 1 }}>
              {branch.city}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', maxWidth: '420px', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              {branch.description}
            </p>

            {/* Address pin badge */}
            <a
              href={branch.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.55rem 1rem 0.55rem 0.75rem',
                backgroundColor: `${branch.accentColor}26`,
                border: `1px solid ${branch.accentColor}88`,
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = `${branch.accentColor}44`; e.currentTarget.style.borderColor = branch.accentColor; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = `${branch.accentColor}26`; e.currentTarget.style.borderColor = `${branch.accentColor}88`; }}
            >
              {/* Pin icon */}
              <svg width="13" height="16" viewBox="0 0 24 24" fill={branch.accentColor} xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500,
                letterSpacing: '0.06em', color: '#fff',
              }}>
                {branch.address}
              </span>
              {/* External link indicator */}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" style={{ marginLeft: '2px', flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Tab switcher overlaid at the bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', zIndex: 10,
        }}>
          {BRANCHES.map((b, i) => (
            <button
              key={b.id}
              onClick={() => switchBranch(i)}
              style={{
                flex: 1, padding: '0.75rem 1rem',
                fontFamily: 'var(--font-body)',
                background: i === activeIdx ? 'rgba(255,255,255,0.96)' : 'rgba(0,0,0,0.58)',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderTop: i === activeIdx ? `3px solid ${b.accentColor}` : '3px solid transparent',
                transition: 'background 0.3s, border-color 0.3s',
                backdropFilter: 'blur(8px)',
              }}
              onMouseOver={e => { if (i !== activeIdx) e.currentTarget.style.background = 'rgba(0,0,0,0.72)'; }}
              onMouseOut={e => { if (i !== activeIdx) e.currentTarget.style.background = 'rgba(0,0,0,0.58)'; }}
            >
              <p style={{
                fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: i === activeIdx ? 'var(--black)' : 'rgba(255,255,255,0.65)',
                marginBottom: '0.2rem',
                transition: 'color 0.2s',
              }}>
                {b.city}
              </p>
              {i === activeIdx && (
                <p style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.62rem', color: b.accentColor,
                  letterSpacing: '0.04em', fontWeight: 500,
                }}>
                  <svg width="9" height="11" viewBox="0 0 24 24" fill={b.accentColor}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {b.address}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Branch intro strip ── */}
      <section style={{ backgroundColor: branch.darkBg || '#0d1410', padding: '3rem 0', transition: 'background-color 0.6s ease' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: branch.accentColor, marginBottom: '1rem',
            }}>
              About {branch.city}
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'rgba(255,255,255,0.6)' }}>
              {branch.longDesc}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { num: branch.venues.length, label: 'Venues' },
              { num: branch.established,   label: 'Established' },
              { num: branch.country,       label: 'Country' },
            ].map((stat, i) => (
              <div key={i} style={{ borderTop: `1px solid ${branch.accentColor}44`, paddingTop: '1rem' }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '0.35rem',
                }}>
                  {stat.num}
                </p>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  {stat.label}
                </p>
              </div>
            ))}

            {/* Address stat — links to Google Maps */}
            <a
              href={branch.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderTop: `1px solid ${branch.accentColor}44`, paddingTop: '1rem',
                textDecoration: 'none', display: 'block',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <svg width="14" height="17" viewBox="0 0 24 24" fill={branch.accentColor} style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                  fontWeight: 300, color: '#fff', lineHeight: 1.2,
                  transition: 'color 0.2s',
                }}
                  onMouseOver={e => e.currentTarget.style.color = branch.accentColor}
                  onMouseOut={e => e.currentTarget.style.color = '#fff'}
                >
                  {branch.address}
                </p>
              </div>
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                View on Maps ↗
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ── Venues ── */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--cream)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>What We Offer</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Venues in {branch.city}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {branch.venues.map((venue, i) => (
              <VenueCard key={venue.label} venue={venue} accent={branch.accentColor} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming-soon highlights ── */}
      {branch.highlights && (
        <HighlightsSection key={branch.id} branch={branch} />
      )}

      {/* ── Other locations strip ── */}
      <section style={{ backgroundColor: 'var(--black)', padding: '4rem 0' }}>
        <div className="container">
          <p className="eyebrow-accent" style={{ marginBottom: '0.5rem' }}>Explore More</p>
          <h3 className="display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#fff', marginBottom: '2.5rem' }}>
            Our Other Locations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {BRANCHES.filter((_, i) => i !== activeIdx).map(b => (
              <button
                key={b.id}
                onClick={() => switchBranch(BRANCHES.indexOf(b))}
                style={{
                  position: 'relative', height: '220px', overflow: 'hidden',
                  border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
                  display: 'block', width: '100%',
                }}
              >
                <img
                  src={b.image}
                  alt={b.city}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.6s ease', filter: 'brightness(0.6) saturate(0.7)',
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(0.8) saturate(1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(0.6) saturate(0.7)'; }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: '1.25rem',
                }}>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: b.accentColor, marginBottom: '0.3rem' }}>
                    {b.tagline}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
                    {b.city}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
