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

export default function Coffee() {
    const r1 = useReveal(), r2 = useReveal();

    return (
        <div>

            {/* Hero */}
            <div style={{ position: 'relative', height: '50vh', minHeight: '360px', overflow: 'hidden' }}>
                <img src="/img-coffee-2.jpg" alt="Bad Duka Coffee" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end' }}>
                    <div className="container" style={{ paddingBottom: '3rem' }}>
                        <p className="eyebrow-accent" style={{ marginBottom: '0.75rem' }}>Rest & Relaxation</p>
                        <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fff' }}>
                            Bad Duka Coffee Shop
                        </h1>
                    </div>
                </div>
            </div>

            {/* ── SPLIT SECTION ── */}
            <section style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <div className="coffee-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

                    {/* Left — Text */}
                    <div ref={r1} className="reveal" style={{
                        padding: 'clamp(2rem, 5vw, 4rem)',
                        backgroundColor: 'var(--cream)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        gridColumn: 'span 1',
                    }}>
                        <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Experience</p>
                        <h2 className="display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', marginBottom: '1.5rem' }}>
                            A Rustic Coffee Shop &amp; Tranquil Garden
                        </h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '1.25rem' }}>
                            For your rest and relaxation, there is a rustic coffee shop and tranquil garden — the perfect place to unwind after exploring the museum and gallery.
                        </p>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-700)', marginBottom: '1.75rem' }}>
                            Cashless purchases are accepted on site.
                        </p>

                        {/* Info rows */}
                        <div style={{ borderTop: '1px solid var(--gray-100)' }}>
                            {[
                                { label: 'Opening Hours', value: '9am – 9pm Daily' },
                                { label: 'Location', value: 'Kisumu, Kenya' },
                                { label: 'Payments', value: 'Cashless Accepted' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1rem 0',
                                    borderBottom: '1px solid var(--gray-100)',
                                }}>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>
                                        {item.label}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400 }}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Photo (hidden on mobile) */}
                    <div className="coffee-photo" style={{ overflow: 'hidden', minHeight: '480px' }}>
                        <img
                            src="/img-coffee.jpg"
                            alt="Bad Duka Coffee"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section ref={r2} className="reveal" style={{ padding: '4rem 0', backgroundColor: 'var(--cream)', textAlign: 'center' }}>
                <div className="container">
                    <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>While You're Here</p>
                    <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '2rem' }}>
                        Explore the Full Experience
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href="/gallery" className="btn-primary">Art Gallery</a>
                        <a href="/museum" className="btn-secondary">Transport Museum</a>
                    </div>
                </div>
            </section>

        </div>
    );
}