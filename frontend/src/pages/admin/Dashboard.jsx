import { useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';

export default function AdminDashboard() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin';
    }
  }, []);

  return (
    <AdminLayout currentPage="Dashboard">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Stat cards */}
        {[
          { label: 'Total Paintings', value: '—', note: 'in gallery' },
          { label: 'Total Orders',    value: '—', note: 'all time' },
          { label: 'Pending Orders',  value: '—', note: 'awaiting payment' },
          { label: 'Total Revenue',   value: '—', note: 'KES' },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#fff', padding: '1.5rem', border: '1px solid #E0E0E0' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '0.75rem' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '0.25rem' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#BDBDBD' }}>
              {stat.note}
            </p>
          </div>
        ))}

      </div>

      {/* Quick actions */}
      <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
        <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/admin/paintings/new" className="btn-primary">
            + Add New Painting
          </a>
          <a href="/admin/orders" className="btn-secondary">
            View Orders
          </a>
        </div>
      </div>

    </AdminLayout>
  );
}