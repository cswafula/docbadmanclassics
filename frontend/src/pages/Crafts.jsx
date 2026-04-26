import { useState, useEffect } from 'react';
import { craftsAPI } from '../services/api';

export default function Crafts() {
  const [crafts, setCrafts]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [total, setTotal]             = useState(0);

  const fetchCrafts = (page = 1, searchVal = search, sort = sortBy) => {
    setLoading(true);
    craftsAPI.getAll({
      page, per_page: 20,
      ...(searchVal && { search: searchVal }),
      ...(sort      && { sort }),
    })
      .then(res => {
        setCrafts(res.data.data || res.data);
        setCurrentPage(res.data.current_page || 1);
        setLastPage(res.data.last_page || 1);
        setTotal(res.data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCrafts(1, search, sortBy); }, [sortBy]);
  useEffect(() => {
    const t = setTimeout(() => fetchCrafts(1, search, sortBy), 400);
    return () => clearTimeout(t);
  }, [search]);

  const clearAll = () => {
    setSearch(''); setSortBy('latest');
    fetchCrafts(1, '', 'latest');
  };

  const goToPage = (page) => {
    fetchCrafts(page, search, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = search || sortBy !== 'latest';

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

  return (
    <div>

      {/* ── Hero ── */}
      <div style={{ backgroundColor: '#1e2d1f', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #f2f0e6 0px, #f2f0e6 1px, transparent 1px, transparent 60px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ color: '#b8963e', marginBottom: '0.75rem' }}>Est. 2015 · Kisumu, Kenya</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, color: '#f2f0e6', marginBottom: '1.5rem', lineHeight: 1.15, maxWidth: '720px' }}>
            Crafts Collection.
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: '580px', marginBottom: '2.5rem' }}>
            A curated selection of handcrafted works celebrating East African craft traditions. Each piece is unique and available to purchase.
          </p>
          <a href="#collection" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 2rem', backgroundColor: '#b8963e', color: '#fff', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#a07835'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#b8963e'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            Browse Crafts
          </a>
        </div>
      </div>

      {/* ── Collection ── */}
      <section id="collection" style={{ padding: '5rem 0 6rem' }}>
        <div className="container">

          {/* Header with tab to switch to Paintings */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>The Collection</p>
              <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--gray-100)' }}>
                <a href="/gallery" style={{ padding: '0.5rem 0', paddingRight: '2rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', fontWeight: 300, borderBottom: '2px solid transparent', marginBottom: '-1px', color: 'var(--gray-300)', whiteSpace: 'nowrap', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gray-500)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--gray-300)'}
                >
                  Our Paintings Collection
                </a>
                <span style={{ padding: '0.5rem 0', paddingLeft: '2rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', fontWeight: 300, borderBottom: '2px solid var(--black)', marginBottom: '-1px', color: 'var(--black)', whiteSpace: 'nowrap' }}>
                  Our Crafts Collection
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              {loading ? 'Loading…' : `${total} piece${total !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search crafts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '0.75rem 1rem', border: '1px solid var(--gray-100)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, outline: 'none', backgroundColor: '#fff' }}
            />
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
          ) : crafts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.75rem' }}>No crafts found</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {hasActiveFilters ? 'Try adjusting your filters.' : 'No crafts in the collection yet.'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAll} className="btn-secondary" style={{ cursor: 'pointer' }}>Clear All Filters</button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {crafts.map(craft => {
                const isSold = craft.quantity <= 0;
                return (
                  <div key={craft.id} style={{ cursor: isSold ? 'default' : 'pointer', position: 'relative' }}
                    onClick={() => !isSold && window.location.assign(`/crafts/${craft.id}`)}>
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', backgroundColor: 'var(--cream)', marginBottom: '1rem' }}>
                      {craft.image
                        ? <img src={craft.image} alt={craft.title} loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isSold ? 'grayscale(50%) brightness(0.9)' : 'none', transition: 'transform 0.4s ease' }}
                            onMouseOver={e => { if (!isSold) e.currentTarget.style.transform = 'scale(1.03)'; }}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No Image</div>
                      }
                      {isSold && (
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#dc2626', color: '#fff', padding: '0.35rem 0.875rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
                          Sold
                        </div>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, marginBottom: '0.35rem', color: isSold ? 'var(--gray-300)' : 'var(--black)' }}>
                      {craft.title}
                    </p>
                    <p style={{ fontSize: isSold ? '0.65rem' : '0.85rem', color: isSold ? '#dc2626' : 'var(--black)', letterSpacing: isSold ? '0.1em' : '0', textTransform: isSold ? 'uppercase' : 'none', fontWeight: isSold ? 600 : 400 }}>
                      {isSold ? 'Sold' : `KES ${parseFloat(craft.price).toLocaleString()}`}
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
                  style={{ padding: '0.4rem 0.875rem', fontSize: '0.72rem', border: '1px solid var(--gray-100)', backgroundColor: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontFamily: 'var(--font-body)' }}>
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
                  ))}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === lastPage}
                  style={{ padding: '0.4rem 0.875rem', fontSize: '0.72rem', border: '1px solid var(--gray-100)', backgroundColor: '#fff', cursor: currentPage === lastPage ? 'not-allowed' : 'pointer', opacity: currentPage === lastPage ? 0.4 : 1, fontFamily: 'var(--font-body)' }}>
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
