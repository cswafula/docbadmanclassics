export default function Donate() {
  const ways = [
    {
      icon: '◈',
      title: 'Monetary Donations',
      desc: 'Your financial contribution directly funds artist commissions, exhibition production, educational programmes, and the preservation of cultural artefacts. Every shilling stays in the community.',
    },
    {
      icon: '◻',
      title: 'Artwork & Prints',
      desc: 'Original paintings, sketches, photographs — if it speaks, we want it! Donated works enter our permanent collection and rotating exhibitions, credited to the donor.',
    },
    {
      icon: '◎',
      title: 'Transport Museum Pieces',
      desc: 'Vintage automobiles, machinery, classic cars, documents or any artefact that tells the story of East African transport, industry or daily life. These objects are history made tangible.',
    },
    {
      icon: '◇',
      title: 'In-Kind Support',
      desc: 'Materials, equipment, professional services, event sponsorships, hospitality, logistics — if you have a skill or resource that can move the mission forward, we want to hear from you.',
    },
  ];

  const impacts = [
    { number: 'Artists', label: 'Supported & platformed from across the region' },
    { number: 'Community', label: 'Events, dialogues and activations for all ages' },
    { number: 'Heritage', label: 'Preserved for generations that have not yet arrived' },
    { number: 'Tourism', label: 'Kisumu as a destination for culture in East Africa' },
  ];

  return (
    <div>

      {/* ── Hero ── */}
      <div style={{ backgroundColor: '#1e2d1f', padding: '6rem 0 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #f2f0e6 0px, #f2f0e6 1px, transparent 1px, transparent 60px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          <p className="eyebrow" style={{ color: '#b8963e', marginBottom: '0.75rem' }}>Support the Mission</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, color: '#f2f0e6', marginBottom: '1.5rem', lineHeight: 1.15 }}>
            Art Lives Because<br />People Care.
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, marginBottom: '2rem' }}>
            Doc Badman Classics is more than a gallery or a museum. It is an act of collective memory — a community-powered effort to ensure that the stories, objects and art of East Africa are not lost to time, neglect, or indifference.
          </p>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9 }}>
            We are built on the belief that culture is not a luxury. It is infrastructure. And like all infrastructure, it requires investment — of money, of time, of objects, and of care.
          </p>
        </div>
      </div>

      {/* ── Impact strip ── */}
      <section style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0', border: '1px solid var(--gray-100)', marginTop: '-1px' }}>
            {impacts.map((item, i) => (
              <div key={i} style={{ padding: '2.5rem 2rem', borderRight: i < impacts.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: '#b8963e', marginBottom: '0.4rem' }}>{item.number}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why donate ── */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

            <div>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Why It Matters</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, marginBottom: '1.5rem', lineHeight: 1.3 }}>
                We Are About the Community
              </h2>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#b8963e', marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 2, marginBottom: '1.25rem' }}>
                Every donation — of any form — is a vote for a version of Kisumu, and of Kenya, where artists are valued, where history is preserved, and where culture is accessible to everyone regardless of means.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 2, marginBottom: '1.25rem' }}>
                We are committed to promoting local works, elevating emerging talent, and creating a space where the community does not just consume culture but actively shapes it.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 2 }}>
                Your generosity makes exhibitions possible. It funds residencies. It keeps the doors open for the child who has never seen a painting up close, or the elder whose photograph of a 1940s locomotive belongs in a frame on our wall.
              </p>
            </div>

            {/* Contact card */}
            <div>
              <div style={{ backgroundColor: '#1e2d1f', padding: '2.5rem' }}>
                <p className="eyebrow" style={{ color: '#b8963e', marginBottom: '1rem' }}>Get in Touch</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: '#f2f0e6', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  All Donations Are Welcome
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, marginBottom: '2rem' }}>
                  Whether you would like to make a monetary contribution, donate a piece of art, bring in a museum artefact, or simply have a conversation about how you can help — reach out to us directly. We respond to every message.
                </p>
                
                <a                
                  href="mailto:donations@docbadmanclassics.org"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    backgroundColor: '#b8963e',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'lowercase',
                    fontFamily: 'var(--font-body)',
                    marginBottom: '1rem',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#a07835'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#b8963e'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  donations@docbadmanclassics.org
                </a>
              </div>

              {/* Quote */}
              <div style={{ backgroundColor: 'var(--cream)', padding: '2rem 2.5rem', borderLeft: '3px solid #b8963e', marginTop: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--black)' }}>
                  "A people without the knowledge of their past history, origin and culture is like a tree without roots."
                </p>
                <p className="eyebrow" style={{ color: '#b8963e' }}>— Marcus Garvey</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Ways to donate ── */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>How to Help</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, lineHeight: 1.3 }}>
              Ways to Contribute
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', backgroundColor: 'var(--gray-100)' }}>
            {ways.map((item, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '2.5rem 2rem', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#fafaf8'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <p style={{ fontSize: '1.5rem', color: '#b8963e', marginBottom: '1.25rem' }}>{item.icon}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, marginBottom: '0.75rem', lineHeight: 1.3 }}>{item.title}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.9 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Take the First Step</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 300, marginBottom: '1.25rem', lineHeight: 1.3 }}>
            Let's Build This Together
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.9, marginBottom: '2.5rem' }}>
            No contribution is too small. No idea is too big. If you feel the pull to be part of something that matters — write to us. We are listening.
          </p>
          <a
            href="mailto:donations@docbadmanclassics.org"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Contact Us to Donate
          </a>
        </div>
      </section>

    </div>
  );
}