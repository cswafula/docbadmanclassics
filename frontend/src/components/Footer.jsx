import { useState, useEffect } from 'react';
import { paintingsAPI } from '../services/api';

export default function Footer() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    paintingsAPI.getArtists()
      .then(res => setArtists(res.data))
      .catch(console.error);
  }, []);

  return (
    <footer style={{ backgroundColor: 'var(--black)', color: 'var(--cream)', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

          {/* ── Brand ── */}
          <div>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#b8963e', marginBottom: '0.75rem' }}>
              Est. Kisumu · 2025
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Doc Badman<br />Classics
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
              A curated collection of fine art, history, and culture from the heart of Kisumu.
            </p>

            {/* WhatsApp */}
            <a
              href="https://wa.me/254110096130"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.6rem 1rem',
                border: '1px solid rgba(37,211,102,0.4)',
                color: '#25d366',
                textDecoration: 'none',
                fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                marginBottom: '0.75rem',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#25d366'; e.currentTarget.style.backgroundColor = 'rgba(37,211,102,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(37,211,102,0.4)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {/* WhatsApp icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              +254 110 096 130
            </a>

            {/* Phone */}
            <a
              href="tel:+254110096130"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                fontSize: '0.72rem', letterSpacing: '0.08em',
                transition: 'color 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +254 110 096 130
            </a>
          </div>

          {/* ── Navigation ── */}
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8963e', marginBottom: '1.25rem' }}>
              Navigate
            </p>
            {[
              { label: 'Home',             href: '/'        },
              { label: 'About Us',         href: '/about'   },
              { label: 'Transport Museum', href: '/museum'  },
              { label: 'Art Gallery',      href: '/gallery' },
              { label: 'Bad Duka Coffee',  href: '/coffee'  },
              { label: 'To Donate',           href: '/donate'  },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                display: 'block', color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none', fontSize: '0.8rem',
                marginBottom: '0.6rem', letterSpacing: '0.05em',
                transition: 'color 0.15s',
              }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Artists ── */}
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8963e', marginBottom: '1.25rem' }}>
              Our Artists
            </p>
            {artists.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Loading…</p>
            ) : artists.map(artist => (
              <a
                key={artist}
                href={`/gallery?artist=${encodeURIComponent(artist)}`}
                style={{
                  display: 'block', color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none', fontSize: '0.8rem',
                  marginBottom: '0.6rem', letterSpacing: '0.05em',
                  transition: 'color 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#b8963e'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                {artist}
              </a>
            ))}
          </div>

          {/* ── Location ── */}
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8963e', marginBottom: '1.25rem' }}>
              Find Us
            </p>

            {/* Map link */}
            <a
              href="https://share.google/8aGjmOp3TYS8BG9Wy"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
                fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '1.25rem',
                transition: 'color 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#b8963e'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '3px' }}>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>
                Tom Mboya Road,<br />
                Milimani, Kisumu<br />
                <span style={{ fontSize: '0.68rem', color: '#b8963e', letterSpacing: '0.08em' }}>View on Google Maps →</span>
              </span>
            </a>

            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.5rem', lineHeight: 1.7 }}>
              Open Daily<br />9:00 AM – 9:00 PM
            </p>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '1rem', lineHeight: 1.7 }}>
              admin@docbadmanclassics.org
            </p>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
            Transport Museum · Art Gallery · Bad Duka Coffee · Kisumu
          </p>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Doc Badman Classics
          </p>
        </div>
      </div>
    </footer>
  );
}