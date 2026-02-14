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

const ALL_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = () => {
    setLoading(true);
    adminOrdersAPI.getAll({ search, status: statusFilter })
      .then(res => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const openDetail = async (order) => {
    // If already selected, close it
    if (selected?.id === order.id) { setSelected(null); return; }
    try {
      const res = await adminOrdersAPI.getById(order.id);
      setSelected(res.data);
    } catch {
      setSelected(order);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminOrdersAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
      setMessage('Status updated successfully');
      setTimeout(() => setMessage(''), 2500);
    } catch {
      setMessage('Failed to update status');
      setTimeout(() => setMessage(''), 2500);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout currentPage="Orders">

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 300 }}>Orders</h1>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search order / customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.5rem 0.875rem',
              border: '1px solid var(--gray-100)',
              fontSize: '0.8rem',
              outline: 'none',
              width: '220px',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
            }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 2rem 0.5rem 0.875rem',
              border: '1px solid var(--gray-100)',
              fontSize: '0.8rem',
              outline: 'none',
              backgroundColor: '#fff',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.6rem center',
            }}
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Success / error message */}
      {message && (
        <div style={{
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          backgroundColor: message.includes('Failed') ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${message.includes('Failed') ? '#fecaca' : '#bbf7d0'}`,
          color: message.includes('Failed') ? '#dc2626' : '#15803d',
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Orders Table ── */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)' }}>

          {/* Count */}
          <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
              {loading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 110px 80px', gap: '1rem', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--gray-100)', backgroundColor: '#FAFAFA' }}>
            {['Order', 'Customer', 'Total', 'Status', ''].map(col => (
              <p key={col} className="eyebrow" style={{ margin: 0 }}>{col}</p>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>No orders found</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gray-500)' }}>
                {statusFilter || search ? 'Try adjusting your filters' : 'Orders will appear here once customers start buying'}
              </p>
              {(statusFilter || search) && (
                <button
                  onClick={() => { setSearch(''); setStatusFilter(''); }}
                  className="btn-secondary"
                  style={{ marginTop: '1.5rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            orders.map((order, i) => {
              const s = statusColors[order.status] || statusColors.pending;
              const isActive = selected?.id === order.id;
              return (
                <div
                  key={order.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 110px 110px 80px',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    alignItems: 'center',
                    borderBottom: i < orders.length - 1 ? '1px solid var(--gray-50)' : 'none',
                    backgroundColor: isActive ? 'var(--cream)' : 'transparent',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '2px', fontFamily: 'var(--font-body)' }}>
                      {order.order_number}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.8rem', marginBottom: '2px' }}>{order.customer_name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{order.customer_phone}</p>
                  </div>

                  <p style={{ fontSize: '0.85rem' }}>
                    KES {parseFloat(order.total).toLocaleString()}
                  </p>

                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    backgroundColor: s.bg,
                    color: s.color,
                    fontSize: '0.62rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    width: 'fit-content',
                  }}>
                    {order.status}
                  </span>

                  <button
                    onClick={() => openDetail(order)}
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'none',
                      border: 'none',
                      borderBottom: `1px solid ${isActive ? 'var(--gray-300)' : 'var(--black)'}`,
                      cursor: 'pointer',
                      padding: '0 0 1px 0',
                      color: isActive ? 'var(--gray-500)' : 'var(--black)',
                    }}
                  >
                    {isActive ? 'Close' : 'View →'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ── Order Detail Panel ── */}
        {selected && (
          <div style={{ border: '1px solid var(--gray-100)', backgroundColor: '#fff', position: 'sticky', top: '80px' }}>

            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)' }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: '2px' }}>Order Detail</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{selected.order_number}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', fontSize: '1.25rem', lineHeight: 1, padding: '4px' }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>

              {/* Customer info */}
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Customer</p>
              {[
                { label: 'Name',    value: selected.customer_name },
                { label: 'Email',   value: selected.customer_email },
                { label: 'Phone',   value: selected.customer_phone },
                { label: 'Address', value: selected.shipping_address },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--gray-50)', gap: '1rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-500)', flexShrink: 0 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', textAlign: 'right', color: 'var(--black)' }}>
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Items */}
              <p className="eyebrow" style={{ margin: '1.5rem 0 0.75rem' }}>Items Ordered</p>
              {selected.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--gray-50)', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.82rem', marginBottom: '2px' }}>{item.painting_title}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                      {item.quantity} × KES {parseFloat(item.price).toLocaleString()}
                    </p>
                  </div>
                  <p style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    KES {parseFloat(item.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* Totals */}
              <div style={{ marginTop: '0.5rem' }}>
                {[
                  { label: 'Subtotal',  value: `KES ${parseFloat(selected.subtotal).toLocaleString()}` },
                  { label: 'Shipping',  value: `KES ${parseFloat(selected.shipping_cost).toLocaleString()}` },
                ].map(line => (
                  <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-50)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{line.label}</span>
                    <span style={{ fontSize: '0.78rem' }}>{line.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 300 }}>
                    KES {parseFloat(selected.total).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Paid at */}
              {selected.paid_at && (
                <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                  Paid on {new Date(selected.paid_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}

              {/* Status updater */}
              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Update Status</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ALL_STATUSES.map(status => {
                    const s = statusColors[status];
                    const isActive = selected.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selected.id, status)}
                        disabled={isActive || updatingId === selected.id}
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.62rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          border: '1px solid',
                          borderColor: isActive ? s.color : 'var(--gray-100)',
                          backgroundColor: isActive ? s.bg : '#fff',
                          color: isActive ? s.color : 'var(--gray-500)',
                          cursor: isActive ? 'default' : 'pointer',
                          opacity: updatingId === selected.id && !isActive ? 0.4 : 1,
                          transition: 'all 0.15s',
                        }}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
                {updatingId === selected.id && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>Updating…</p>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </AdminLayout>
  );
}