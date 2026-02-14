import { useState } from 'react';
import useAuthStore from '../../store/authStore';

// ── Admin colour tokens ───────────────────────────────────
const theme = {
  sidebarBg: '#1e2d1f',   // deep forest green
  sidebarBorder: '#2d3f2e',   // slightly lighter green
  sidebarText: '#a8b9a9',   // muted sage
  sidebarActive: '#f2f0e6',   // warm cream (active text)
  sidebarActiveBg: '#2d3f2e', // active item bg
  sidebarHover: 'rgba(255,255,255,0.05)',
  accent: '#b8963e',   // antique gold
  mainBg: '#f5f3ea',   // warm sage cream
  headerBg: '#fff',
  headerBorder: '#e8e4d9',
};

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '▤' },
  { label: 'Paintings', href: '/admin/paintings', icon: '◻' },
  { label: 'Orders', href: '/admin/orders', icon: '◈' },
  { label: 'Regions', href: '/admin/delivery-regions', icon: '◎' },
  { label: 'Users', href: '/admin/users', icon: '◯' },
];

export default function AdminLayout({ children, currentPage }) {
  const { user, logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const path = window.location.pathname;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    window.location.href = '/admin';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        backgroundColor: theme.sidebarBg,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
      }}>

        {/* Logo */}
        <div style={{ padding: '2rem 1.5rem 1.5rem', borderBottom: `1px solid ${theme.sidebarBorder}` }}>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: '0.4rem' }}>
            Admin Panel
          </p>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.sidebarActive, fontWeight: 400, lineHeight: 1.4 }}>
            Doc Badman<br />Classics
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1.25rem 0' }}>
          {navItems.map(item => {
            const isActive = path === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? theme.sidebarActive : theme.sidebarText,
                  backgroundColor: isActive ? theme.sidebarActiveBg : 'transparent',
                  borderLeft: isActive ? `2px solid ${theme.accent}` : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.backgroundColor = theme.sidebarHover; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: `1px solid ${theme.sidebarBorder}` }}>
          <p style={{ fontSize: '0.7rem', color: theme.sidebarText, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'Admin'}
          </p>
          <p style={{ fontSize: '0.62rem', color: '#5a7a5c', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email || ''}
          </p>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.sidebarBorder}`,
              color: theme.sidebarText,
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-body)',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = theme.sidebarBorder; e.currentTarget.style.color = theme.sidebarText; }}
          >
            {loggingOut ? 'Signing out…' : 'Sign Out'}
          </button>

          {/* View site link */}
          <a href="/" target="_blank" style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '0.75rem',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#5a7a5c',
            textDecoration: 'none',
          }}>
            ↗ View Live Site
          </a>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.mainBg }}>

        {/* Top bar */}
        <header style={{
          backgroundColor: theme.headerBg,
          borderBottom: `1px solid ${theme.headerBorder}`,
          padding: '1rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E' }}>
              Admin
            </span>
            <span style={{ color: '#D0D0D0' }}>/</span>
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1e2d1f', fontWeight: 500 }}>
              {currentPage}
            </span>
          </div>

          {/* Gold accent dot */}
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.accent }} />
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2.5rem' }}>
          {children}
        </main>

      </div>
    </div>
  );
}