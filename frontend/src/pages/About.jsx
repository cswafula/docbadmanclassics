import { useEffect, useRef, useState } from 'react';

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

export default function About() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal();
  const [activeVideo, setActiveVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: 'Walking Through History',
      description: "Join us on a guided tour through the Doc Badman Transport Museum — home to one of East Africa's most remarkable collections of vintage vehicles, railway artifacts, and maritime history.",
      src: '/videos/tour1.mp4',
      poster: '/img-museum-1.jpg',
    },
    {
      id: 2,
      title: 'The Art Gallery Experience',
      description: 'Step inside our curated gallery and discover works by celebrated Kenyan artists. Each piece tells a story of culture, identity, and the beauty of the Lake Victoria region.',
      src: '/videos/tour2.mp4',
      poster: '/img-gallery-4.jpg',
    },
    {
      id: 3,
      title: 'Bad Duka Coffee',
      description: 'After exploring the museum and gallery, unwind at Bad Duka Coffee — our artisan café serving specialty brews in an atmosphere steeped in art and history.',
      src: '/videos/tour3.mp4',
      poster: '/img-coffee-2.jpg',
    },
  ];

  return (
    <div>

      {/* ── Mobile order fix ── */}
      <style>{`
        @media (max-width: 640px) {
          .video-block  { order: 0 !important; }
          .video-text   { order: 1 !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ backgroundColor: 'var(--cream)', padding: '4rem 0 3rem', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Our Story</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', maxWidth: '600px' }}>
            About Doc Badman Classics
          </h1>
        </div>
      </div>

      {/* ── Founder story ── */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div ref={r1} className="reveal grid-2-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img src="/img-building.jpg" alt="Doc Badman Classics" style={{ width: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-1.25rem', right: '-1.25rem', backgroundColor: 'var(--black)', color: '#fff', padding: '1.25rem 1.75rem', maxWidth: '240px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "Ambition is a dream with a V8 engine."
                </p>
                <p className="eyebrow-accent" style={{ marginTop: '0.6rem' }}>— Elvis Presley</p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "To preserve memories of the mind-blowing and inspirational invention that is the engine; in an East African context."
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                This was the early thought that inspired our founder, <strong style={{ fontWeight: 500, color: 'var(--black)' }}>Dr. Kevin Rombosia</strong> — popularly known as "Doc Badman" in motorcycling circles — to establish this transport museum, art gallery and coffee shop in the lakeside city of Kisumu.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)' }}>
                His ambition was further fueled during his travels to the Ireland Transport Museum in Howth, Dublin and the National Transport Museum in Bratislava, Slovakia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video Tours ── */}
      <section style={{ padding: '6rem 0', backgroundColor: '#1e2d1f' }}>
        <div className="container">

          <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
            <p className="eyebrow" style={{ color: '#b8963e', marginBottom: '0.75rem' }}>Experience</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#f2f0e6', marginBottom: '1.25rem', lineHeight: 1.3 }}>
              See It For Yourself
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>
              Words can only say so much. Take a virtual tour through our spaces and get a feel for what awaits you in Kisumu.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {videos.map((video, index) => {
              const isEven  = index % 2 === 0;
              const isActive = activeVideo === video.id;

              return (
                <div
                  key={video.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Video — always first on mobile via className */}
                  <div
                    className="video-block"
                    style={{ order: isEven ? 0 : 1 }}
                  >
                    <div style={{
                      position: 'relative', backgroundColor: '#000',
                      aspectRatio: '16/9', overflow: 'hidden',
                      border: '1px solid rgba(184,150,62,0.3)',
                    }}>
                      {isActive ? (
                        <video
                          controls autoPlay
                          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                          poster={video.poster}
                        >
                          <source src={video.src} type="video/mp4" />
                          Your browser does not support video playback.
                        </video>
                      ) : (
                        <div
                          onClick={() => setActiveVideo(video.id)}
                          style={{ cursor: 'pointer', width: '100%', height: '100%', position: 'relative' }}
                        >
                          {video.poster && (
                            <img src={video.poster} alt={video.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.75 }} />
                          )}
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,45,31,0.6), rgba(0,0,0,0.4))' }} />
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: '#b8963e' }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                              <div
                                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(184,150,62,0.8)', backgroundColor: 'rgba(184,150,62,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
                                onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(184,150,62,0.35)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(184,150,62,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
                              >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="#b8963e">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              </div>
                              <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                                Play Video
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8963e', marginTop: '1rem' }}>
                      {String(index + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
                    </p>
                  </div>

                  {/* Text — always second on mobile via className */}
                  <div
                    className="video-text"
                    style={{ order: isEven ? 1 : 0, padding: '1rem 0' }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 300, color: '#f2f0e6', marginBottom: '1.25rem', lineHeight: 1.3 }}>
                      {video.title}
                    </h3>
                    <div style={{ width: '40px', height: '1px', backgroundColor: '#b8963e', marginBottom: '1.5rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 2, marginBottom: '2rem' }}>
                      {video.description}
                    </p>

                    {!isActive ? (
                      <button
                        onClick={() => setActiveVideo(video.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.75rem', backgroundColor: 'transparent', border: '1px solid rgba(184,150,62,0.6)', color: '#b8963e', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(184,150,62,0.1)'; e.currentTarget.style.borderColor = '#b8963e'; }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(184,150,62,0.6)'; }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#b8963e">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Watch Tour
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveVideo(null)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                      >
                        ✕ Close
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Facts ── */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div ref={r2} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0', border: '1px solid var(--gray-100)' }}>
            {[
              { label: 'Location', value: 'Kisumu, Kenya'       },
              { label: 'Founded',  value: '2015'                },
              { label: 'Founder',  value: 'Dr. Kevin Rombosia'  },
              { label: 'Open',     value: '9am – 9pm Daily'     },
              { label: 'Payments', value: 'Cashless Accepted'   },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '2rem 1.75rem', borderRight: i < 4 ? '1px solid var(--gray-100)' : 'none' }}>
                <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{item.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={r3} className="reveal" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Experience It</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '2rem' }}>
            Plan Your Visit
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/gallery" className="btn-primary">Browse Gallery</a>
            <a href="/museum" className="btn-secondary">Transport Museum</a>
            <a href="/coffee" className="btn-secondary">Bad Duka Coffee</a>
          </div>
        </div>
      </section>

    </div>
  );
}