import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminPartnersAPI } from '../../services/api';

export default function AdminPartners() {
  const { isAuthenticated } = useAuthStore();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await adminPartnersAPI.getAll();
      setPartners(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this partner?')) return;
    setDeleting(id);
    try {
      await adminPartnersAPI.delete(id);
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete partner.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout currentPage="Partners">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 300 }}>Partners</h2>
        <a href="/admin/partners/new" className="btn-primary" style={{ fontSize: '0.7rem' }}>
          + Add Partner
        </a>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9E9E9E' }}>Loading...</div>
      ) : partners.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9E9E9E', border: '1px dashed #E0E0E0', backgroundColor: '#fff' }}>
          <p style={{ marginBottom: '1rem' }}>No partners yet.</p>
          <a href="/admin/partners/new" className="btn-primary" style={{ fontSize: '0.7rem' }}>Add First Partner</a>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #E0E0E0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E0E0E0' }}>
                {['Logo', 'Name', 'Description', 'Status', 'Order', ''].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9E9E', fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #E0E0E0', padding: '4px', background: '#fafafa' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', borderRadius: '4px' }}>◉</div>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.name}</p>
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#9E9E9E', textDecoration: 'none' }}>{p.website_url.replace(/^https?:\/\//, '').slice(0, 30)}</a>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', maxWidth: '260px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#616161', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.description || '—'}
                    </p>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', backgroundColor: p.is_active ? '#E8F5E9' : '#FAFAFA', color: p.is_active ? '#2E7D32' : '#9E9E9E', border: `1px solid ${p.is_active ? '#C8E6C9' : '#E0E0E0'}` }}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#616161' }}>{p.sort_order}</td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <a href={`/admin/partners/${p.id}/edit`} style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#616161', textDecoration: 'none', marginRight: '1rem' }}>Edit</a>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B71C1C', background: 'none', border: 'none', cursor: 'pointer', opacity: deleting === p.id ? 0.5 : 1 }}>
                      {deleting === p.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
