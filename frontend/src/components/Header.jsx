import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
  const galleryRef = useRef(null);
  const path = window.location.pathname;

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    updateCount();
    const interval = setInterval(updateCount, 500);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    const handleClickOutside = (e) => {
      if (galleryRef.current && !galleryRef.current.contains(e.target)) {
        setGalleryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isGalleryActive = path === '/gallery' || path === '/crafts';

  const simpleLinks = [
    { label: 'Home',             href: '/'       },
    { label: 'About Us',         href: '/about'  },
    { label: 'Transport Museum', href: '/museum' },
    { label: 'Bad Duka Coffee',  href: '/coffee' },
  ];

  const gallerySubLinks = [
    { label: 'Paintings Collection', href: '/gallery' },
    { label: 'Crafts Collection',    href: '/crafts'  },
  ];

  const linkStyle = (active) => ({
    fontFamily: 'var(--font-body)',
    fontSize: '0.72rem', fontWeight: 500,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    textDecoration: 'none',
    color: active ? 'var(--black)' : 'var(--gray-500)',
    borderBottom: active ? '1px solid var(--black)' : '1px solid transparent',
    paddingBottom: '2px',
    transition: 'color 0.2s, border-color 0.2s',
    whiteSpace: 'nowrap',
  });

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid var(--gray-100)',
      backdropFilter: 'blur(8px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
      transition: 'box-shadow 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.jpg" alt="Doc Badman Classics" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hide-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>

          {/* Home + About + Museum */}
          {simpleLinks.slice(0, 3).map(link => (
            <a key={link.href} href={link.href} style={linkStyle(path === link.href)}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--black)'; }}
              onMouseOut={e => { if (path !== link.href) e.currentTarget.style.color = 'var(--gray-500)'; }}
            >
              {link.label}
            </a>
          ))}

          {/* Art Gallery — dropdown */}
          <div ref={galleryRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setGalleryOpen(o => !o)}
              style={{
                ...linkStyle(isGalleryActive),
                background: 'none',
                border: 'none',
                borderBottom: isGalleryActive ? '1px solid var(--black)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '0 0 2px 0',
              }}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--black)'; }}
              onMouseOut={e => { if (!isGalleryActive) e.currentTarget.style.color = 'var(--gray-500)'; }}
            >
              Art Gallery
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: galleryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {galleryOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#fff', border: '1px solid var(--gray-100)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                minWidth: '200px', zIndex: 300,
              }}>
                {gallerySubLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setGalleryOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.875rem 1.25rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.72rem', fontWeight: 500,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: path === link.href ? 'var(--black)' : 'var(--gray-500)',
                      borderLeft: path === link.href ? '2px solid var(--black)' : '2px solid transparent',
                      borderBottom: '1px solid var(--gray-50)',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--cream)'; e.currentTarget.style.color = 'var(--black)'; }}
                    onMouseOut={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = path === link.href ? 'var(--black)' : 'var(--gray-500)'; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Bad Duka Coffee */}
          {simpleLinks.slice(3).map(link => (
            <a key={link.href} href={link.href} style={linkStyle(path === link.href)}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--black)'; }}
              onMouseOut={e => { if (path !== link.href) e.currentTarget.style.color = 'var(--gray-500)'; }}
            >
              {link.label}
            </a>
          ))}

          {/* Cart */}
          <a href="/cart" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            textDecoration: 'none', color: 'var(--black)',
            fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            My Cart
            {cartCount > 0 && (
              <span style={{
                backgroundColor: 'var(--black)', color: '#fff',
                borderRadius: '50%', width: '16px', height: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem',
              }}>
                {cartCount}
              </span>
            )}
          </a>

          {/* Donate */}
          <a href="/donate" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '0.4rem 1rem',
            backgroundColor: '#b8963e', color: '#fff',
            textDecoration: 'none',
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', transition: 'background 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#a07835'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#b8963e'}
          >
            To Donate
          </a>
        </nav>

        {/* ── Mobile: Cart icon + Hamburger ── */}
        <div className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
          <a href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'var(--black)', position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: 'var(--accent)', color: '#fff',
                borderRadius: '50%', width: '16px', height: '16px',
                fontSize: '0.58rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: 'var(--black)', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: 'var(--black)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: 'var(--black)', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
          </button>
        </div>

      </div>

      {/* ── Mobile menu drawer ── */}
      {menuOpen && (
        <div style={{ backgroundColor: '#fff', borderTop: '1px solid var(--gray-100)', padding: '0.5rem 1.25rem 1.5rem' }}>

          {simpleLinks.slice(0, 3).map(link => (
            <a key={link.href} href={link.href} style={{
              display: 'block', padding: '0.875rem 0',
              borderBottom: '1px solid var(--gray-50)',
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: path === link.href ? 'var(--black)' : 'var(--gray-500)',
            }}>
              {link.label}
            </a>
          ))}

          {/* Art Gallery accordion */}
          <div>
            <button
              onClick={() => setMobileGalleryOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '0.875rem 0',
                borderBottom: '1px solid var(--gray-50)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                background: 'none', border: 'none', borderBottom: '1px solid var(--gray-50)',
                cursor: 'pointer', textAlign: 'left',
                color: isGalleryActive ? 'var(--black)' : 'var(--gray-500)',
              }}
            >
              Art Gallery
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: mobileGalleryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {mobileGalleryOpen && (
              <div style={{ paddingLeft: '1rem', borderBottom: '1px solid var(--gray-50)' }}>
                {gallerySubLinks.map(link => (
                  <a key={link.href} href={link.href} style={{
                    display: 'block', padding: '0.7rem 0',
                    borderBottom: '1px solid var(--gray-50)',
                    fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                    fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: path === link.href ? 'var(--black)' : 'var(--gray-500)',
                  }}>
                    — {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {simpleLinks.slice(3).map(link => (
            <a key={link.href} href={link.href} style={{
              display: 'block', padding: '0.875rem 0',
              borderBottom: '1px solid var(--gray-50)',
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: path === link.href ? 'var(--black)' : 'var(--gray-500)',
            }}>
              {link.label}
            </a>
          ))}

          {/* My Cart */}
          <a href="/cart" style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.875rem 0',
            borderBottom: '1px solid var(--gray-50)',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
            textDecoration: 'none', color: 'var(--gray-500)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            My Cart
            {cartCount > 0 && (
              <span style={{
                backgroundColor: 'var(--black)', color: '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem',
              }}>
                {cartCount}
              </span>
            )}
          </a>

          {/* Donate */}
          <a href="/donate" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '1rem',
            padding: '0.875rem',
            backgroundColor: '#b8963e', color: '#fff',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            ♥ To Donate
          </a>

        </div>
      )}

    </header>
  );
}
