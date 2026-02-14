import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminOrdersAPI } from '../../services/api';

const statusColors = {
  pending:    { bg: '#fff8e1', color: '#f59e0b' },
  paid:       { bg: '#f0fdf4', color: '#16a34a' },
  processing: { bg: '#e0f2fe', color: '#0284c7' },
  shipped:    { bg: '#ede9fe', color: '#7c3aed' },
  delivered:  { bg: '#dcfce7', color: '#15803d' },
  cancelled:  { bg: '#fef2f2', color: '#dc2626' },
};

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
    adminOrdersAPI.getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    {
      label: 'Total Paintings',
      value: stats.total_paintings,
      sub:   `${stats.sold_paintings} sold · ${stats.total_paintings - stats.sold_paintings} available`,
    },
    {
      label: 'Total Orders',
      value: stats.total_orders,
      sub:   `${stats.pending_orders} pending payment`,
    },
    {
      label: 'Revenue',
      value: `KES ${parseFloat(stats.total_revenue || 0).toLocaleString()}`,
      sub:   'From paid orders',
    },
    {
      label: 'Paid Orders',
      value: stats.paid_orders ?? '—',
      sub:   'Successfully completed',
    },
  ] : [];

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
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ backgroundColor: '#F5F5F5', height: '110px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)', padding: '1.5rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{card.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 300, lineHeight: 1, marginBottom: '0.4rem' }}>
                {card.value}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--gray-300)' }}>{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <a href="/admin/paintings/new" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem', backgroundColor: 'var(--black)', color: '#fff', textDecoration: 'none',
        }}>
          <div>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>Add New</p>
            <p style={{ fontSize: '0.95rem' }}>Upload a Painting</p>
          </div>
          <span style={{ fontSize: '1.5rem', opacity: 0.4 }}>+</span>
        </a>
        <a href="/admin/orders" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--gray-100)',
          textDecoration: 'none', color: 'var(--black)',
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Manage</p>
            <p style={{ fontSize: '0.95rem' }}>View All Orders</p>
          </div>
          <span style={{ fontSize: '1.25rem', color: 'var(--gray-300)' }}>→</span>
        </a>
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)' }}>
          <p className="eyebrow">Recent Orders</p>
          <a href="/admin/orders" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--black)', textDecoration: 'none', borderBottom: '1px solid var(--black)' }}>
            View All
          </a>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem' }}>Loading…</div>
        ) : !stats?.recent_orders?.length ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No orders yet.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px 110px', gap: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#FAFAFA', borderBottom: '1px solid var(--gray-100)' }}>
              {['Order', 'Customer', 'Items', 'Total', 'Status'].map(col => (
                <p key={col} className="eyebrow" style={{ margin: 0 }}>{col}</p>
              ))}
            </div>
            {stats.recent_orders.map((order, i) => {
              const s = statusColors[order.status] || statusColors.pending;
              return (
                <div key={order.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px 110px',
                  gap: '1rem', padding: '1rem 1.5rem', alignItems: 'center',
                  borderBottom: i < stats.recent_orders.length - 1 ? '1px solid var(--gray-50)' : 'none',
                }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '2px' }}>{order.order_number}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', marginBottom: '2px' }}>{order.customer_name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{order.customer_email}</p>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>KES {parseFloat(order.total).toLocaleString()}</p>
                  <span style={{ display: 'inline-block', padding: '3px 10px', backgroundColor: s.bg, color: s.color, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {order.status}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>

    </AdminLayout>
  );
}