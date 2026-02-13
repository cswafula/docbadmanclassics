import { useEffect, useRef } from 'react';

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

  return (
    <div>

      {/* Header */}
      <div style={{ backgroundColor: 'var(--cream)', padding: '4rem 0 3rem', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Our Story</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', maxWidth: '600px' }}>
            About Doc Badman Classics
          </h1>
        </div>
      </div>

      {/* Founder story */}
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

      {/* Facts */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div ref={r2} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0', border: '1px solid var(--gray-100)' }}>
            {[
              { label: 'Location',  value: 'Kisumu, Kenya' },
              { label: 'Founded',   value: '2025' },
              { label: 'Founder',   value: 'Dr. Kevin Rombosia' },
              { label: 'Open',      value: '9am – 9pm Daily' },
              { label: 'Payments',  value: 'Cashless Accepted' },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '2rem 1.75rem', borderRight: i < 4 ? '1px solid var(--gray-100)' : 'none' }}>
                <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{item.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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