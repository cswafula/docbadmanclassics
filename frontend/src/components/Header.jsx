import { useState, useEffect } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    return () => { clearInterval(interval); window.removeEventListener('scroll', onScroll); };
  }, []);

  const navLinks = [
    { label: 'Home',             href: '/'        },
    { label: 'About Us',         href: '/about'   },
    { label: 'Transport Museum', href: '/museum'  },
    { label: 'Art Gallery',      href: '/gallery' },
    { label: 'Bad Duka Coffee',  href: '/coffee'  },
  ];

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
          {navLinks.map(link => (
            <a key={link.href} href={link.href} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem', fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: path === link.href ? 'var(--black)' : 'var(--gray-500)',
              borderBottom: path === link.href ? '1px solid var(--black)' : '1px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
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

          {/* Cart icon */}
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

          {/* Hamburger */}
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

          {/* Nav links */}
          {navLinks.map(link => (
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

          {/* Donate — gold button, full width */}
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