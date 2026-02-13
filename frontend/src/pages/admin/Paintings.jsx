import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminPaintingsAPI } from '../../services/api';

export default function AdminPaintings() {
  const { isAuthenticated } = useAuthStore();
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin';
      return;
    }
    fetchPaintings();
  }, []);

  const fetchPaintings = async () => {
    try {
      const res = await adminPaintingsAPI.getAll();
      setPaintings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleting(id);
    try {
      await adminPaintingsAPI.delete(id);
      setPaintings(paintings.filter(p => p.id !== id));
      setMessage(`"${title}" deleted successfully.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to delete painting.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout currentPage="Paintings">

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#9E9E9E' }}>
          {paintings.length} painting{paintings.length !== 1 ? 's' : ''} in gallery
        </p>
        <a href="/admin/paintings/new" className="btn-primary">
          + Add New Painting
        </a>
      </div>

      {/* Success/Error message */}
      {message && (
        <div style={{ backgroundColor: '#F1F8E9', border: '1px solid #C5E1A5', color: '#33691E', padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E0E0E0' }}>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 100px 100px 80px 150px', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F5F5F5' }}>
          {['Image', 'Title / Artist', 'Medium', 'Size', 'Price', 'Qty', 'Actions'].map(col => (
            <p key={col} style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', margin: 0 }}>
              {col}
            </p>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9E9E9E', fontSize: '0.875rem' }}>
            Loading paintings...
          </div>
        ) : paintings.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: '#9E9E9E', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              No paintings yet. Add your first one!
            </p>
            <a href="/admin/paintings/new" className="btn-primary">
              + Add New Painting
            </a>
          </div>
        ) : (
          paintings.map((painting, index) => (
            <div
              key={painting.id}
              style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 100px 100px 80px 150px', gap: '1rem', padding: '1rem 1.5rem', borderBottom: index < paintings.length - 1 ? '1px solid #F5F5F5' : 'none', alignItems: 'center' }}
            >
              {/* Image */}
              <div style={{ width: '60px', height: '60px', backgroundColor: '#F5F5F5', overflow: 'hidden', flexShrink: 0 }}>
                {painting.primary_image ? (
                  <img src={painting.primary_image} alt={painting.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#BDBDBD', textAlign: 'center', padding: '4px' }}>
                    No image
                  </div>
                )}
              </div>

              {/* Title / Artist */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  {painting.title}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#757575' }}>
                  {painting.artist}
                </p>
                {painting.is_featured && (
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#000', color: '#fff', padding: '2px 6px', marginTop: '4px', display: 'inline-block' }}>
                    Featured
                  </span>
                )}
              </div>

              {/* Medium */}
              <p style={{ fontSize: '0.8rem', color: '#616161' }}>
                {painting.medium || '—'}
              </p>

              {/* Size */}
              <p style={{ fontSize: '0.8rem', color: '#616161' }}>
                {painting.size || '—'}
              </p>

              {/* Price */}
              <p style={{ fontSize: '0.875rem', fontWeight: '400' }}>
                KES {parseFloat(painting.price).toLocaleString()}
              </p>

              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  color: painting.quantity === 0 ? '#EF5350' : painting.quantity <= 2 ? '#FFA726' : '#000'
                }}>
                  {painting.quantity}
                </span>
                {painting.quantity === 0 && (
                  <span style={{ fontSize: '0.6rem', color: '#EF5350', letterSpacing: '0.05em' }}>SOLD</span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={`/admin/paintings/${painting.id}/edit`}
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid #000' }}
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(painting.id, painting.title)}
                  disabled={deleting === painting.id}
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#EF5350', background: 'none', border: 'none', borderBottom: '1px solid #EF5350', cursor: 'pointer', padding: 0, opacity: deleting === painting.id ? 0.5 : 1 }}
                >
                  {deleting === painting.id ? '...' : 'Delete'}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </AdminLayout>
  );
}