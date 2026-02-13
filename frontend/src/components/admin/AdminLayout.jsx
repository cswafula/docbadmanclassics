import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { adminAuthAPI } from '../../services/api';

export default function AdminLayout({ children, currentPage }) {
  const { user, logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await adminAuthAPI.logout();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      window.location.href = '/admin';
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '◼' },
    { label: 'Paintings',  href: '/admin/paintings',  icon: '◈' },
    { label: 'Orders',     href: '/admin/orders',     icon: '◉' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#F5F5F5' }}>

      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#000', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #222' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#757575', marginBottom: '0.25rem' }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: '0.9rem', fontWeight: '300', letterSpacing: '0.05em', lineHeight: '1.4' }}>
            Doc Badman<br />Classics
          </h1>
        </div>

        {/* Nav */}
        <nav style={{ padding: '1.5rem 0', flex: 1 }}>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1.5rem',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: currentPage === item.label ? '#fff' : '#757575',
                backgroundColor: currentPage === item.label ? '#1a1a1a' : 'transparent',
                borderLeft: currentPage === item.label ? '2px solid #fff' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '0.7rem' }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #222' }}>
          <p style={{ fontSize: '0.75rem', color: '#757575', marginBottom: '0.25rem' }}>
            Signed in as
          </p>
          <p style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '1rem' }}>
            {user?.name || 'Admin'}
          </p>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#757575', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {loggingOut ? 'Signing out...' : '→ Sign Out'}
          </button>
        </div>

      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E0E0E0', padding: '1.25rem 2rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em' }}>
            {currentPage}
          </h2>
        </div>

        {/* Page content */}
        <div style={{ padding: '2rem' }}>
          {children}
        </div>

      </div>

    </div>
  );
}