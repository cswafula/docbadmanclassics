export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', color: '#fff', borderTop: '1px solid #1a1a1a' }}>
      <div className="container" style={{ padding: '3.5rem 0 2rem' }}>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <img src="/logo.jpg" alt="Doc Badman Classics"
              style={{ height: '52px', width: 'auto', objectFit: 'contain', marginBottom: '1rem', filter: 'invert(1)' }} />
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
              Museum · Gallery · Coffee<br />Kisumu, Kenya
            </p>
          </div>

          {/* Visit */}
          <div>
            <h4 className="eyebrow" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>Visit Us</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 2 }}>
              Kisumu, Kenya<br />
              9am – 9pm Daily<br />
              Cashless Accepted
            </p>
          </div>

          {/* Artists */}
          <div>
            <h4 className="eyebrow" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>Artists</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Richardson Mudibo', 'David Mito', 'Joseph Okello "Sejo"'].map(a => (
                <a key={a} href="/gallery"
                  style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', lineHeight: 1.5 }}>
                  {a}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="eyebrow" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>Follow Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { name: 'Facebook',  url: 'https://www.facebook.com/share/1Cahu5sjEq/' },
                { name: 'Instagram', url: 'https://www.instagram.com/docbadmanclassics' },
                { name: 'TikTok',    url: 'https://www.tiktok.com/@doc.badman.classi' },
                { name: 'YouTube',   url: 'https://youtube.com/@docbadmanclassics' },
              ].map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                  {s.name}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Doc Badman Classics. All rights reserved.
          </p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
            Museum · Gallery · Coffee · Kisumu
          </p>
        </div>

      </div>
    </footer>
  );
}