import { useEffect, useRef } from 'react';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Museum() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal();

  return (
    <div>

      {/* Hero */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '380px', overflow: 'hidden' }}>
        <img src="/img-museum-1.jpg" alt="Transport Museum" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }}>
          <div className="container" style={{ paddingBottom: '3rem' }}>
            <p className="eyebrow-accent" style={{ marginBottom: '0.75rem' }}>Est. 2025</p>
            <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fff' }}>
              Transport Museum<br />&amp; Auto Restoration
            </h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div ref={r1} className="reveal grid-2-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>Our Mission</p>
              <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1.75rem' }}>
                A Century of East African Journeys
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                This museum celebrates the societal advancements that have been made possible by the engine — in farms, industries, countless journeys that have united families, started and ended wars, rescued lives, inspired art and the meeting of hearts and minds.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                Dr. Rombosia fervently hopes and prays that this museum will keep revving, piston by piston, for countless years to come — reminding future generations about the magic of the engine in an East African perspective.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)' }}>
                These collections provide a valuable repository for, and insight into, the development of transportation in East Africa, covering over a century of history.
              </p>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <img src="/img-museum-2.jpg" alt="Museum Collection" style={{ width: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--black)', color: '#fff' }}>
        <div className="container">
          <div ref={r2} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Classic Cars', desc: 'Vintage and classic automobiles, some of which have competed in the Africa Concours d\'Élégance since 2015.' },
              { title: 'Motorcycles', desc: 'A curated collection of classic motorcycles representing decades of engineering excellence in East Africa.' },
              { title: 'Auto Restoration', desc: 'Witness the art of restoring classic vehicles to their former glory, preserving history for future generations.' },
              { title: 'Educational Focus', desc: 'The museum serves as an educational center, teaching visitors about technological advancements and social significance of transport in Africa.' },
            ].map((item, i) => (
              <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <p className="eyebrow-accent" style={{ marginBottom: '0.75rem' }}>0{i + 1}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: '#fff', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.55)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concours */}
      <section ref={r3} className="reveal" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Africa Concours d'Élégance</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1.5rem' }}>
            On the Concours Circuit Since 2015
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '2.5rem' }}>
            The Africa Concours d'Élégance, organized by the Alfa Romeo Owners Club Kenya, is the classiest event on the Kenya Motor Sports Federation calendar — attended by over 10,000 people, judging 70 classic and vintage cars and 40 motorcycles.
          </p>
          <a href="/about" className="btn-primary">Learn More About Us</a>
        </div>
      </section>

    </div>
  );
}