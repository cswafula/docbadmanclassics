import { useState, useEffect, useRef } from 'react';
import { paintingsAPI } from '../services/api';

function useReveal(deps = []) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, deps);
    return ref;
}

function PaintingCard({ painting, index }) {
    const ref = useReveal();
    const delay = index % 4;
    return (
        <a
            ref={ref}
            href={`/paintings/${painting.id}`}
            className={`reveal delay-${delay + 1}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
            {/* Image */}
            <div style={{
                aspectRatio: '3/4',
                backgroundColor: 'var(--gray-50)',
                overflow: 'hidden',
                marginBottom: '1rem',
                position: 'relative',
            }}>
                {painting.primary_image ? (
                    <img
                        src={painting.primary_image}
                        alt={painting.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-300)' }}>No Image</span>
                    </div>
                )}
                {/* Badges */}
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {painting.quantity == 0 && (
                        <span style={{ backgroundColor: 'var(--black)', color: '#fff', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.6rem' }}>Sold</span>
                    )}
                    {painting.is_featured == 1 && painting.quantity > 0 && (
                        <span style={{ backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.6rem' }}>Featured</span>
                    )}
                </div>
            </div>

            {/* Info */}
            <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>{painting.medium || 'Original Work'}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1.3, marginBottom: '0.2rem' }}>{painting.title}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>{painting.artist}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.9rem' }}>
                    {painting.quantity == 0 ? (
                        <span style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>Sold</span>
                    ) : (
                        `KES ${parseFloat(painting.price).toLocaleString()}`
                    )}
                </p>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>View →</span>
            </div>
        </a>
    );
}

export default function Gallery() {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [artist, setArtist] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [artists, setArtists] = useState([]);
    const headerRef = useReveal();

    const fetchPaintings = () => {
        setLoading(true);
        paintingsAPI.getAll({ search, artist, sort, page, per_page: 12 })
            .then(res => {
                setPaintings(res.data.data);
                setMeta(res.data.meta);
                // Collect unique artists
                const unique = [...new Set(res.data.data.map(p => p.artist).filter(Boolean))];
                if (unique.length > 0) setArtists(prev => [...new Set([...prev, ...unique])]);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { setPage(1); }, [search, artist, sort]);
    useEffect(() => { fetchPaintings(); }, [search, artist, sort, page]);

    return (
        <div>

            {/* ── Page Header ── */}
            <div style={{ backgroundColor: 'var(--cream)', padding: '3.5rem 0 3rem', borderBottom: '1px solid var(--gray-100)' }}>
                <div className="container">
                    <div ref={headerRef} className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>Doc Badman Classics</p>
                            <h1 className="display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Art Gallery</h1>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', maxWidth: '380px', lineHeight: 1.7, textAlign: 'right' }}>
                            Contemporary East African art from local and international artists. All works are originals, available to purchase.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Filters ── */}
            <div style={{ borderBottom: '1px solid var(--gray-100)', position: 'sticky', top: '68px', zIndex: 100, backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)' }}>
                <div className="container" style={{ padding: '1rem 2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>

                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                            <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }}
                                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search title or artist…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '2.25rem', fontSize: '0.8rem', height: '38px' }}
                            />
                        </div>

                        {/* Artist filter */}
                        {artists.length > 0 && (
                            <select value={artist} onChange={e => setArtist(e.target.value)}
                                style={{
                                    width: 'auto',
                                    minWidth: '160px',
                                    fontSize: '0.8rem',
                                    height: '38px',
                                    padding: '0 2rem 0 0.75rem',
                                    border: '1px solid var(--gray-300)',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 300,
                                    outline: 'none',
                                    backgroundColor: 'var(--white)',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.6rem center',
                                }}>
                                <option value="">All Artists</option>
                                {artists.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        )}

                        {/* Sort */}
                        <select value={sort} onChange={e => setSort(e.target.value)}
                            style={{
                                width: 'auto',
                                minWidth: '160px',
                                fontSize: '0.8rem',
                                height: '38px',
                                padding: '0 2rem 0 0.75rem',
                                border: '1px solid var(--gray-300)',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 300,
                                outline: 'none',
                                backgroundColor: 'var(--white)',
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.6rem center',
                            }}>
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                            <option value="title">A – Z</option>
                        </select>

                        {/* Result count */}
                        {meta && (
                            <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', letterSpacing: '0.08em', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                                {meta.total} work{meta.total !== 1 ? 's' : ''}
                            </p>
                        )}

                    </div>
                </div>
            </div>

            {/* ── Grid ── */}
            <section style={{ padding: '3rem 0 5rem' }}>
                <div className="container">

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i}>
                                    <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--gray-50)', marginBottom: '1rem' }} />
                                    <div style={{ height: '10px', backgroundColor: 'var(--gray-50)', width: '60%', marginBottom: '6px' }} />
                                    <div style={{ height: '14px', backgroundColor: 'var(--gray-50)', width: '80%', marginBottom: '6px' }} />
                                    <div style={{ height: '10px', backgroundColor: 'var(--gray-50)', width: '40%' }} />
                                </div>
                            ))}
                        </div>
                    ) : paintings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>No works found</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Try adjusting your search or filters</p>
                            <button onClick={() => { setSearch(''); setArtist(''); setSort('newest'); }} className="btn-secondary">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem', position: 'relative' }}>
                            {paintings.map((p, i) => <PaintingCard key={p.id} painting={p} index={i} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{ padding: '0.6rem 1.2rem', border: '1px solid var(--gray-100)', backgroundColor: 'transparent', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: '0.75rem', letterSpacing: '0.1em' }}
                            >
                                ← Prev
                            </button>

                            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
                                .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) => p === '...' ? (
                                    <span key={`dot-${i}`} style={{ padding: '0 0.25rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>…</span>
                                ) : (
                                    <button key={p} onClick={() => setPage(p)}
                                        style={{ width: '36px', height: '36px', border: '1px solid', borderColor: p === page ? 'var(--black)' : 'var(--gray-100)', backgroundColor: p === page ? 'var(--black)' : 'transparent', color: p === page ? '#fff' : 'var(--black)', cursor: 'pointer', fontSize: '0.8rem' }}>
                                        {p}
                                    </button>
                                ))
                            }

                            <button
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page === meta.last_page}
                                style={{ padding: '0.6rem 1.2rem', border: '1px solid var(--gray-100)', backgroundColor: 'transparent', cursor: page === meta.last_page ? 'not-allowed' : 'pointer', opacity: page === meta.last_page ? 0.4 : 1, fontSize: '0.75rem', letterSpacing: '0.1em' }}
                            >
                                Next →
                            </button>
                        </div>
                    )}

                </div>
            </section>

        </div>
    );
}