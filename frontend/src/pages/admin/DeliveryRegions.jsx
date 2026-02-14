import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminDeliveryRegionsAPI } from '../../services/api';

export default function AdminDeliveryRegions() {
  const { isAuthenticated } = useAuthStore();
  const [regions, setRegions]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage]   = useState({ type: '', text: '' });

  const emptyForm = { name: '', cost: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
    fetchRegions();
  }, []);

  const fetchRegions = () => {
    setLoading(true);
    adminDeliveryRegionsAPI.getAll()
      .then(res => setRegions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.cost === '') return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await adminDeliveryRegionsAPI.update(editingId, form);
        setRegions(prev => prev.map(r => r.id === editingId ? res.data : r));
        showMessage('success', 'Region updated');
      } else {
        const res = await adminDeliveryRegionsAPI.create(form);
        setRegions(prev => [...prev, res.data]);
        showMessage('success', 'Region added');
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      const msg = err.response?.data?.errors?.name?.[0]
               || err.response?.data?.message
               || 'Failed to save region';
      showMessage('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (region) => {
    setEditingId(region.id);
    setForm({ name: region.name, cost: region.cost });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await adminDeliveryRegionsAPI.delete(id);
      setRegions(prev => prev.filter(r => r.id !== id));
      showMessage('success', `"${name}" deleted`);
    } catch {
      showMessage('error', 'Failed to delete region');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (region) => {
    try {
      const res = await adminDeliveryRegionsAPI.update(region.id, {
        name:      region.name,
        cost:      region.cost,
        is_active: !region.is_active,
      });
      setRegions(prev => prev.map(r => r.id === region.id ? res.data : r));
    } catch {
      showMessage('error', 'Failed to update region');
    }
  };

  return (
    <AdminLayout currentPage="Delivery Regions">

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Settings</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 300 }}>
          Delivery Regions
        </h1>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: message.type === 'success' ? '#15803d' : '#dc2626',
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* ── Regions Table ── */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)' }}>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 120px', gap: '1rem', padding: '0.875rem 1.5rem', backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gray-100)' }}>
            {['Region', 'Shipping Cost', 'Status', 'Actions'].map(col => (
              <p key={col} className="eyebrow" style={{ margin: 0 }}>{col}</p>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
              Loading regions…
            </div>
          ) : regions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                No regions yet. Add your first one →
              </p>
            </div>
          ) : regions.map((region, i) => (
            <div key={region.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px 120px',
              gap: '1rem',
              padding: '1rem 1.5rem',
              alignItems: 'center',
              borderBottom: i < regions.length - 1 ? '1px solid var(--gray-50)' : 'none',
              backgroundColor: editingId === region.id ? 'var(--cream)' : 'transparent',
            }}>

              <p style={{ fontSize: '0.875rem', fontWeight: editingId === region.id ? 500 : 400 }}>
                {region.name}
              </p>

              <p style={{ fontSize: '0.875rem' }}>
                KES {parseFloat(region.cost).toLocaleString()}
              </p>

              {/* Active toggle */}
              <button
                onClick={() => handleToggleActive(region)}
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: region.is_active ? '#f0fdf4' : '#f5f5f5',
                  color: region.is_active ? '#15803d' : '#9e9e9e',
                  width: 'fit-content',
                }}
              >
                {region.is_active ? 'Active' : 'Hidden'}
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleEdit(region)}
                  style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid var(--black)', cursor: 'pointer', padding: '0 0 1px 0' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(region.id, region.name)}
                  disabled={deleting === region.id}
                  style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid #dc2626', cursor: 'pointer', padding: '0 0 1px 0', color: '#dc2626', opacity: deleting === region.id ? 0.5 : 1 }}
                >
                  {deleting === region.id ? '…' : 'Delete'}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ── Add / Edit Form ── */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)', padding: '2rem', position: 'sticky', top: '80px' }}>

          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            {editingId ? 'Edit Region' : 'Add New Region'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Region Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Kisumu, Nairobi"
                required
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--gray-100)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Shipping Cost (KES) *
              </label>
              <input
                type="number"
                value={form.cost}
                onChange={e => setForm(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="e.g. 500"
                required
                min="0"
                step="10"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--gray-100)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ width: '100%', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving…' : editingId ? 'Update Region' : 'Add Region'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(emptyForm); }}
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', background: 'none', border: '1px solid var(--gray-100)', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-500)', fontFamily: 'var(--font-body)' }}
              >
                Cancel
              </button>
            )}
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--cream)', fontSize: '0.75rem', color: 'var(--gray-500)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--black)' }}>Tip:</strong> Click the Active/Hidden badge on any region to quickly show or hide it from checkout without deleting it.
          </div>

        </div>
      </div>

    </AdminLayout>
  );
}