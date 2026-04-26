import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminCraftsAPI } from '../../services/api';

export default function AdminCrafts() {
  const { isAuthenticated } = useAuthStore();
  const [crafts, setCrafts]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [deleting, setDeleting]       = useState(null);
  const [message, setMessage]         = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [total, setTotal]             = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
    fetchCrafts();
  }, []);

  const fetchCrafts = async (page = 1) => {
    try {
      const res = await adminCraftsAPI.getAll({ page, per_page: 20 });
      setCrafts(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminCraftsAPI.delete(id);
      setCrafts(crafts.filter(c => c.id !== id));
      setMessage(`"${title}" deleted.`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to delete craft.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout currentPage="Crafts">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#9E9E9E' }}>{total} craft{total !== 1 ? 's' : ''} in collection</p>
        <a href="/admin/crafts/new" className="btn-primary">+ Add New Craft</a>
      </div>

      {message && (
        <div style={{ backgroundColor: '#F1F8E9', border: '1px solid #C5E1A5', color: '#33691E', padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', border: '1px solid #E0E0E0' }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px 150px', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F5F5F5' }}>
          {['Image', 'Title', 'Price', 'Qty', 'Actions'].map(col => (
            <p key={col} style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', margin: 0 }}>{col}</p>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9E9E9E', fontSize: '0.875rem' }}>Loading crafts...</div>
        ) : crafts.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: '#9E9E9E', marginBottom: '1.5rem', fontSize: '0.875rem' }}>No crafts yet. Add your first one!</p>
            <a href="/admin/crafts/new" className="btn-primary">+ Add New Craft</a>
          </div>
        ) : (
          crafts.map((craft, index) => (
            <div key={craft.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px 150px', gap: '1rem', padding: '1rem 1.5rem', borderBottom: index < crafts.length - 1 ? '1px solid #F5F5F5' : 'none', alignItems: 'center' }}>

              {/* Image */}
              <div style={{ width: '60px', height: '60px', backgroundColor: '#F5F5F5', overflow: 'hidden' }}>
                {craft.image
                  ? <img src={craft.image} alt={craft.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#BDBDBD' }}>No image</div>
                }
              </div>

              {/* Title */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{craft.title}</p>
                {craft.is_featured && (
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#000', color: '#fff', padding: '2px 6px', display: 'inline-block' }}>Featured</span>
                )}
              </div>

              {/* Price */}
              <p style={{ fontSize: '0.875rem' }}>KES {parseFloat(craft.price).toLocaleString()}</p>

              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.875rem', color: craft.quantity === 0 ? '#EF5350' : craft.quantity <= 2 ? '#FFA726' : '#000' }}>
                  {craft.quantity}
                </span>
                {craft.quantity === 0 && <span style={{ fontSize: '0.6rem', color: '#EF5350' }}>SOLD</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href={`/admin/crafts/${craft.id}/edit`} style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid #000' }}>Edit</a>
                <button onClick={() => handleDelete(craft.id, craft.title)} disabled={deleting === craft.id}
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#EF5350', background: 'none', border: 'none', borderBottom: '1px solid #EF5350', cursor: 'pointer', padding: 0, opacity: deleting === craft.id ? 0.5 : 1 }}>
                  {deleting === craft.id ? '...' : 'Delete'}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {lastPage > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>Page {currentPage} of {lastPage} · {total} total</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => fetchCrafts(currentPage - 1)} disabled={currentPage === 1}
              style={{ padding: '0.4rem 0.875rem', fontSize: '0.72rem', border: '1px solid var(--gray-100)', backgroundColor: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontFamily: 'var(--font-body)' }}>
              ← Prev
            </button>
            <button onClick={() => fetchCrafts(currentPage + 1)} disabled={currentPage === lastPage}
              style={{ padding: '0.4rem 0.875rem', fontSize: '0.72rem', border: '1px solid var(--gray-100)', backgroundColor: '#fff', cursor: currentPage === lastPage ? 'not-allowed' : 'pointer', opacity: currentPage === lastPage ? 0.4 : 1, fontFamily: 'var(--font-body)' }}>
              Next →
            </button>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
