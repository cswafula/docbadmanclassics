import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminPartnersAPI } from '../../services/api';

export default function PartnerForm() {
  const { isAuthenticated } = useAuthStore();
  const isEdit = window.location.pathname.includes('/edit');
  const partnerId = isEdit ? window.location.pathname.split('/')[3] : null;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    map_url: '',
    sort_order: '0',
    is_active: true,
  });

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
    if (isEdit && partnerId) fetchPartner();
  }, []);

  const fetchPartner = async () => {
    setLoading(true);
    try {
      const res = await adminPartnersAPI.getById(partnerId);
      const p = res.data;
      setFormData({
        name:        p.name || '',
        description: p.description || '',
        website_url: p.website_url || '',
        map_url:     p.map_url || '',
        sort_order:  p.sort_order ?? '0',
        is_active:   p.is_active !== undefined ? p.is_active : true,
      });
      setExistingLogo(p.logo || null);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load partner.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('name',        formData.name);
      data.append('description', formData.description);
      data.append('website_url', formData.website_url);
      data.append('map_url',     formData.map_url);
      data.append('sort_order',  formData.sort_order);
      data.append('is_active',   formData.is_active ? '1' : '0');
      if (logo) data.append('logo', logo);

      if (isEdit) {
        await adminPartnersAPI.update(partnerId, data);
        setMessage({ type: 'success', text: 'Partner updated successfully!' });
      } else {
        await adminPartnersAPI.create(data);
        setMessage({ type: 'success', text: 'Partner added successfully!' });
      }
      setTimeout(() => { window.location.href = '/admin/partners'; }, 1500);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = err.response?.data?.message;
      if (errors) {
        setMessage({ type: 'error', text: Object.values(errors)[0][0] });
      } else {
        setMessage({ type: 'error', text: msg || 'Something went wrong.' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout currentPage="Partners">
      <div style={{ textAlign: 'center', padding: '3rem', color: '#9E9E9E' }}>Loading...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout currentPage="Partners">

      <a href="/admin/partners" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9E9E', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to Partners
      </a>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '2rem' }}>
        {isEdit ? 'Edit Partner' : 'Add New Partner'}
      </h2>

      {message.text && (
        <div style={{ padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', backgroundColor: message.type === 'success' ? '#F1F8E9' : '#FFF3F3', border: `1px solid ${message.type === 'success' ? '#C5E1A5' : '#FFCDD2'}`, color: message.type === 'success' ? '#33691E' : '#B71C1C' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
              <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>Partner Details</h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Partner Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g. Tribe Hotel Nairobi" />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input-field" placeholder="Brief description shown in the partner modal..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Website URL</label>
                <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} className="input-field" placeholder="https://www.example.com" />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Google Maps URL</label>
                <input type="text" name="map_url" value={formData.map_url} onChange={handleChange} className="input-field" placeholder="https://maps.google.com/?q=..." />
                <p style={{ fontSize: '0.7rem', color: '#BDBDBD', marginTop: '0.4rem' }}>Paste a Google Maps link — opens in a map modal when visitors click the logo</p>
              </div>
            </div>

            {/* Logo */}
            <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
              <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>Logo</h3>

              {isEdit && existingLogo && !preview && (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={existingLogo} alt="Current logo" style={{ height: '60px', objectFit: 'contain', display: 'block', marginBottom: '0.5rem', border: '1px solid #E0E0E0', padding: '8px', background: '#fafafa' }} />
                  <p style={{ fontSize: '0.72rem', color: '#9E9E9E' }}>Current logo — upload a new one to replace it</p>
                </div>
              )}

              <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleLogoChange} style={{ display: 'none' }} id="logo-upload" />
              <label htmlFor="logo-upload" style={{ display: 'block', border: '2px dashed #E0E0E0', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginBottom: '0.25rem' }}>Click to upload logo</p>
                <p style={{ fontSize: '0.75rem', color: '#BDBDBD' }}>JPG, PNG, WebP or SVG · Max 5MB</p>
              </label>

              {preview && (
                <img src={preview} alt="Preview" style={{ height: '60px', objectFit: 'contain', display: 'block', border: '1px solid #E0E0E0', padding: '8px', background: '#fafafa' }} />
              )}
            </div>

          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
              <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>Display Settings</h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Sort Order</label>
                <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="input-field" min="0" placeholder="0" />
                <p style={{ fontSize: '0.7rem', color: '#BDBDBD', marginTop: '0.4rem' }}>Lower number = appears first in slider</p>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Active</p>
                  <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>Show in homepage partners slider</p>
                </div>
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : isEdit ? 'Update Partner' : 'Add Partner'}
            </button>

            <a href="/admin/partners" style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#9E9E9E', textDecoration: 'none' }}>Cancel</a>
          </div>

        </div>
      </form>
    </AdminLayout>
  );
}
