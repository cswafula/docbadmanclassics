import { useState, useEffect } from 'react';
import { paintingsAPI } from '../services/api';

export default function Gallery() {
  const params = new URLSearchParams(window.location.search);

  const [paintings, setPaintings]       = useState([]);
  const [artists, setArtists]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [artistFilter, setArtistFilter] = useState(params.get('artist') || '');
  const [sortBy, setSortBy]             = useState('latest');
  const [currentPage, setCurrentPage]   = useState(1);
  const [lastPage, setLastPage]         = useState(1);
  const [total, setTotal]               = useState(0);

  useEffect(() => {
    paintingsAPI.getArtists()
      .then(res => setArtists(res.data))
      .catch(console.error);
  }, []);

  const fetchPaintings = (page = 1, searchVal = search, artist = artistFilter, sort = sortBy) => {
    setLoading(true);
    paintingsAPI.getAll({
      page, per_page: 20,
      ...(searchVal && { search: searchVal }),
      ...(artist    && { artist }),
      ...(sort      && { sort }),
    })
      .then(res => {
        setPaintings(res.data.data || res.data);
        setCurrentPage(res.data.current_page || 1);
        setLastPage(res.data.last_page || 1);
        setTotal(res.data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPaintings(1, search, artistFilter, sortBy); }, [artistFilter, sortBy]);
  useEffect(() => {
    const t = setTimeout(() => fetchPaintings(1, search, artistFilter, sortBy), 400);
    return () => clearTimeout(t);
  }, [search]);

  const clearFilter = () => {
    setArtistFilter('');
    window.history.pushState({}, '', '/gallery');
    fetchPaintings(1, search, '', sortBy);
  };

  const clearAll = () => {
    setSearch(''); setArtistFilter(''); setSortBy('latest');
    window.history.pushState({}, '', '/gallery');
    fetchPaintings(1, '', '', 'latest');
  };

  const goToPage = (page) => {
    fetchPaintings(page, search, artistFilter, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = search || artistFilter || sortBy !== 'latest';

  const selectStyle = {
    padding: '0.75rem 2rem 0.75rem 1rem',
    border: '1px solid var(--gray-100)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem', fontWeight: 300,
    outline: 'none', backgroundColor: '#fff', cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center',
  };

  const characteristics = [
    {
      title: 'Narrative Storytelling & Symbolism',
      desc: 'Works that encapsulate legends, social commentaries, and philosophical concepts.',
    },
    {
      title: 'Traditional Art Forms',
      desc: 'Masks, textiles and sculptures that once acted as spiritual intermediaries or indicators of social status.',
    },
    {
      title: 'Innovation of Form',
      desc: 'Art characterised by deliberate abstraction rather than realism.',
    },
    {
      title: 'Contemporary Fusion',
      desc: 'An electric blend of traditional techniques with new mediums, where the ancient and the modern do not compete but complete each other.',
    },
    {
      title: 'Community & Identity',
      desc: 'A vibrant community hub that pulses with music and dialogue, aiming to reclaim narratives and challenge colonial legacies.',
    },
  ];

  const interests = [
    { icon: '◈', label: 'Cultural & Educational Value', desc: 'Unique collections and exhibitions that educate and inspire.' },
    { icon: '◎', label: 'Support for Artists',          desc: 'A platform that elevates and economically empowers local talent.' },
    { icon: '◯', label: 'Community Engagement',         desc: 'Events, dialogues and activations that bring people together.' },
    { icon: '◇', label: 'Economic & Tourism Impact',    desc: 'Positioning Kisumu as a destination for cultural tourism in East Africa.' },
    { icon: '◻', label: 'Inspiration & Well-being',     desc: 'Art as medicine — for the mind, the spirit, and the community.' },
  ];

  return (
    <div>

      {/* ── Hero ── */}
      <div style={{ backgroundColor: '#1e2d1f', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #f2f0e6 0px, #f2f0e6 1px, transparent 1px, transparent 60px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ color: '#b8963e', marginBottom: '0.75rem' }}>Est. 2015 · Kisumu, Kenya</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, color: '#f2f0e6', marginBottom: '1.5rem', lineHeight: 1.15, maxWidth: '720px' }}>
            Art Gallery.
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: '580px', marginBottom: '2.5rem' }}>
            Established in 2025, Our Art Gallery features a bespoke inventory of works from local and international artists.
          </p>
          {/* Jump to collection */}
          <a
            href="#collection"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 2rem',
              backgroundColor: '#b8963e', color: '#fff',
              textDecoration: 'none',
              fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#a07835'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#b8963e'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            Jump to Collection
          </a>
        </div>
      </div>

      {/* ── Philosophy ── */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

            <div>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Our Philosophy</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, marginBottom: '1.5rem', lineHeight: 1.3 }}>
                Collecting With<br />Intention
              </h2>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#b8963e', marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 2, marginBottom: '1.25rem' }}>
                We do not collect art for its market value alone. We collect stories — stories told in pigment and clay, in thread and bronze, by hands that understood something about the world that the rest of us are still catching up to.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 2 }}>
                Every work in this gallery was chosen because it demands something of the viewer: attention, reflection, or the quiet discomfort of being seen back.
              </p>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Core Characteristics</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {characteristics.map((item, i) => (
                  <div key={i} style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#b8963e', marginTop: '0.45rem', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '0.35rem', color: 'var(--black)' }}>{item.title}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.8 }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Points of Interest ── */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Why It Matters</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, maxWidth: '500px', lineHeight: 1.3 }}>
              Our Points of Interest
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0', border: '1px solid var(--gray-100)' }}>
            {interests.map((item, i) => (
              <div key={i} style={{
                padding: '2rem 1.75rem',
                borderRight: i < interests.length - 1 ? '1px solid var(--gray-100)' : 'none',
                transition: 'background 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--cream)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <p style={{ fontSize: '1.25rem', color: '#b8963e', marginBottom: '1rem' }}>{item.icon}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, marginBottom: '0.6rem', lineHeight: 1.3 }}>{item.label}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection ── */}
      <section id="collection" style={{ padding: '5rem 0 6rem' }}>
        <div className="container">

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>The Collection</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300 }}>
                Browse & Acquire
              </h2>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              {loading ? 'Loading…' : `${total} work${total !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search artworks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: '200px', padding: '0.75rem 1rem',
                border: '1px solid var(--gray-100)', fontFamily: 'var(--font-body)',
                fontSize: '0.875rem', fontWeight: 300, outline: 'none', backgroundColor: '#fff',
              }}
            />
            <select value={artistFilter}
              onChange={e => {
                setArtistFilter(e.target.value);
                window.history.pushState({}, '', e.target.value ? `/gallery?artist=${encodeURIComponent(e.target.value)}` : '/gallery');
              }}
              style={selectStyle}
            >
              <option value="">All Artists</option>
              {artists.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Title: A–Z</option>
              <option value="title_desc">Title: Z–A</option>
            </select>
            {hasActiveFilters && (
              <button onClick={clearAll} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: 'transparent', border: '1px solid var(--gray-100)', cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                ✕ Clear All
              </button>
            )}
          </div>

          {/* Artist filter banner */}
          {artistFilter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--cream)', border: '1px solid var(--gray-100)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', flex: 1 }}>
                Showing works by <strong style={{ color: 'var(--black)', fontWeight: 500 }}>{artistFilter}</strong>
              </p>
              <button onClick={clearFilter} style={{ padding: '0.3rem 0.875rem', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: 'var(--black)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                ✕ Clear
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--cream)', marginBottom: '1rem' }} />
                  <div style={{ height: '1rem', backgroundColor: 'var(--cream)', marginBottom: '0.5rem', width: '70%' }} />
                  <div style={{ height: '0.75rem', backgroundColor: 'var(--cream)', width: '40%' }} />
                </div>
              ))}
            </div>
          ) : paintings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.75rem' }}>No works found</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {hasActiveFilters ? 'Try adjusting your filters.' : 'No paintings in the collection yet.'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAll} className="btn-secondary" style={{ cursor: 'pointer' }}>Clear All Filters</button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {paintings.map(painting => {
                const isSold = painting.quantity <= 0;
                return (
                  <div
                    key={painting.id}
                    style={{ cursor: isSold ? 'default' : 'pointer', position: 'relative' }}
                    onClick={() => !isSold && window.location.assign(`/paintings/${painting.id}`)}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', backgroundColor: 'var(--cream)', marginBottom: '1rem' }}>
                      <img
                        src={painting.primary_image} alt={painting.title} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isSold ? 'grayscale(50%) brightness(0.9)' : 'none', transition: 'transform 0.4s ease' }}
                        onMouseOver={e => { if (!isSold) e.currentTarget.style.transform = 'scale(1.03)'; }}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      {isSold && (
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#dc2626', color: '#fff', padding: '0.35rem 0.875rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, boxShadow: '0 2px 8px rgba(220,38,38,0.4)' }}>
                          Sold
                        </div>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, marginBottom: '0.25rem', color: isSold ? 'var(--gray-300)' : 'var(--black)' }}>
                      {painting.title}
                    </p>
                    <p
                      onClick={e => { e.stopPropagation(); setArtistFilter(painting.artist); window.history.pushState({}, '', `/gallery?artist=${encodeURIComponent(painting.artist)}`); }}
                      style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.35rem', cursor: 'pointer', display: 'inline-block', transition: 'color 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--black)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--gray-400)'}
                    >
                      {painting.artist}
                    </p>
                    <p style={{ fontSize: isSold ? '0.65rem' : '0.85rem', color: isSold ? '#dc2626' : 'var(--black)', letterSpacing: isSold ? '0.1em' : '0', textTransform: isSold ? 'uppercase' : 'none', fontWeight: isSold ? 600 : 400 }}>
                      {isSold ? 'Sold' : `KES ${parseFloat(painting.price).toLocaleString()}`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-100)' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>Page {currentPage} of {lastPage}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                  style={{ padding: '0.4rem 0.875rem', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--gray-100)', backgroundColor: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontFamily: 'var(--font-body)' }}>
                  ← Prev
                </button>
                {Array.from({ length: lastPage }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...'); acc.push(p); return acc; }, [])
                  .map((p, idx) => p === '...' ? (
                    <span key={`e-${idx}`} style={{ padding: '0.4rem 0.5rem', fontSize: '0.72rem', color: 'var(--gray-300)' }}>…</span>
                  ) : (
                    <button key={p} onClick={() => goToPage(p)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.72rem', border: '1px solid', borderColor: p === currentPage ? 'var(--black)' : 'var(--gray-100)', backgroundColor: p === currentPage ? 'var(--black)' : '#fff', color: p === currentPage ? '#fff' : 'var(--black)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {p}
                    </button>
                  ))
                }
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === lastPage}
                  style={{ padding: '0.4rem 0.875rem', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--gray-100)', backgroundColor: '#fff', cursor: currentPage === lastPage ? 'not-allowed' : 'pointer', opacity: currentPage === lastPage ? 0.4 : 1, fontFamily: 'var(--font-body)' }}>
                  Next →
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}