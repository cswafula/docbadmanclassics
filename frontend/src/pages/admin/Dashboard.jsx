import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminPaintingsAPI } from '../../services/api';

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const [paintingCount, setPaintingCount] = useState(null);
  const [soldCount, setSoldCount] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }

    // Fetch painting stats — the only thing we have so far
    adminPaintingsAPI.getAll({ per_page: 100 })
      .then(res => {
        const paintings = res.data.data || [];
        setPaintingCount(res.data.meta?.total ?? paintings.length);
        setSoldCount(paintings.filter(p => p.quantity == 0).length);
      })
      .catch(() => {
        setPaintingCount('—');
        setSoldCount('—');
      });
  }, []);

  const stats = [
    { label: 'Total Paintings', value: paintingCount ?? '…', note: 'in gallery' },
    { label: 'Sold Works',      value: soldCount ?? '…',     note: 'quantity 0' },
    { label: 'Total Orders',    value: '—',                  note: 'coming soon' },
    { label: 'Total Revenue',   value: '—',                  note: 'coming soon' },
  ];

  return (
    <AdminLayout currentPage="Dashboard">

      {/* Welcome */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="eyebrow" style={{ marginBottom: '0.4rem' }}>Welcome back</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>
          {user?.name || 'Admin'}
        </h1>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={stat.label} style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            border: '1px solid var(--gray-100)',
            opacity: stat.value === '—' ? 0.5 : 1,
          }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{stat.label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 300, lineHeight: 1, marginBottom: '0.4rem' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray-300)' }}>{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <a href="/admin/paintings/new" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem', backgroundColor: 'var(--black)', color: '#fff',
          textDecoration: 'none',
        }}>
          <div>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>Add New</p>
            <p style={{ fontSize: '0.95rem' }}>Upload a Painting</p>
          </div>
          <span style={{ fontSize: '1.5rem', opacity: 0.4 }}>+</span>
        </a>
        <a href="/admin/paintings" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--gray-100)',
          textDecoration: 'none', color: 'var(--black)',
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Manage</p>
            <p style={{ fontSize: '0.95rem' }}>All Paintings</p>
          </div>
          <span style={{ fontSize: '1.25rem', color: 'var(--gray-300)' }}>→</span>
        </a>
      </div>

      {/* Coming Soon — Orders */}
      <div style={{ border: '1px solid var(--gray-100)', padding: '2.5rem', textAlign: 'center', backgroundColor: '#fff' }}>
        <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Coming Soon</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
          Orders & Revenue Dashboard
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--gray-300)' }}>
          Order management, payment tracking, and revenue stats will appear here once the orders system is built.
        </p>
      </div>

    </AdminLayout>
  );
}