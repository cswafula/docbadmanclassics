import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminCraftsAPI } from '../../services/api';

export default function CraftForm() {
    const { isAuthenticated } = useAuthStore();
    const isEdit  = window.location.pathname.includes('/edit');
    const craftId = isEdit ? window.location.pathname.split('/')[3] : null;

    const [loading, setLoading]   = useState(false);
    const [saving, setSaving]     = useState(false);
    const [message, setMessage]   = useState({ type: '', text: '' });
    const [image, setImage]       = useState(null);
    const [preview, setPreview]   = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    const [formData, setFormData] = useState({
        title: '', description: '', price: '', quantity: '1',
        is_featured: false, is_available: true,
    });

    useEffect(() => {
        if (!isAuthenticated()) { window.location.href = '/admin'; return; }
        if (isEdit && craftId) fetchCraft();
    }, []);

    const fetchCraft = async () => {
        setLoading(true);
        try {
            const res = await adminCraftsAPI.getById(craftId);
            const c = res.data;
            setFormData({
                title:        c.title || '',
                description:  c.description || '',
                price:        c.price || '',
                quantity:     c.quantity ?? '1',
                is_featured:  c.is_featured || false,
                is_available: c.is_available !== undefined ? c.is_available : true,
            });
            setExistingImage(c.image || null);
        } catch {
            setMessage({ type: 'error', text: 'Failed to load craft.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
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
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('quantity', formData.quantity);
            data.append('is_featured', formData.is_featured ? '1' : '0');
            data.append('is_available', formData.is_available ? '1' : '0');
            if (image) data.append('image', image);

            if (isEdit) {
                await adminCraftsAPI.update(craftId, data);
                setMessage({ type: 'success', text: 'Craft updated successfully!' });
            } else {
                await adminCraftsAPI.create(data);
                setMessage({ type: 'success', text: 'Craft added successfully!' });
            }
            setTimeout(() => { window.location.href = '/admin/crafts'; }, 1500);
        } catch (err) {
            const errors = err.response?.data?.errors;
            const msg    = err.response?.data?.message;
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
        <AdminLayout currentPage="Crafts">
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9E9E9E' }}>Loading...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout currentPage="Crafts">

            <a href="/admin/crafts" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9E9E', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
                ← Back to Crafts
            </a>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '300', marginBottom: '2rem' }}>
                {isEdit ? 'Edit Craft' : 'Add New Craft'}
            </h2>

            {message.text && (
                <div style={{ padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', backgroundColor: message.type === 'success' ? '#F1F8E9' : '#FFF3F3', border: `1px solid ${message.type === 'success' ? '#C5E1A5' : '#FFCDD2'}`, color: message.type === 'success' ? '#33691E' : '#B71C1C' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

                    {/* Left — details + image */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>Craft Details</h3>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Title *</label>
                                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Woven Sisal Basket" />
                            </div>

                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Description *</label>
                                <textarea name="description" required value={formData.description} onChange={handleChange} rows={6} className="input-field" placeholder="Describe the craft, its technique and story..." style={{ resize: 'vertical' }} />
                            </div>
                        </div>

                        {/* Image */}
                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                                Image {!isEdit && '*'}
                            </h3>

                            {/* Show existing image when editing */}
                            {isEdit && existingImage && !preview && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <img src={existingImage} alt="Current" style={{ width: '120px', height: '120px', objectFit: 'cover', display: 'block', marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.72rem', color: '#9E9E9E' }}>Current image — upload a new one to replace it</p>
                                </div>
                            )}

                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
                            <label htmlFor="image-upload" style={{ display: 'block', border: '2px dashed #E0E0E0', padding: '2rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginBottom: '0.5rem' }}>Click to upload image</p>
                                <p style={{ fontSize: '0.75rem', color: '#BDBDBD' }}>JPG, PNG or WebP · Max 10MB</p>
                            </label>

                            {preview && (
                                <img src={preview} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', display: 'block' }} />
                            )}
                        </div>

                    </div>

                    {/* Right — pricing + settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>Pricing & Stock</h3>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Price (KES) *</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="input-field" placeholder="e.g. 5000" min="0" step="50" />
                            </div>

                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity *</label>
                                <input type="number" name="quantity" required value={formData.quantity} onChange={handleChange} className="input-field" placeholder="e.g. 1" min="0" />
                                <p style={{ fontSize: '0.7rem', color: '#BDBDBD', marginTop: '0.5rem' }}>Set to 0 if already sold</p>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>Settings</h3>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}>
                                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                                <div>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Featured</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>Show on homepage carousel</p>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                                <div>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Available for sale</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>Visible in crafts collection</p>
                                </div>
                            </label>
                        </div>

                        <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
                            {saving ? 'Saving...' : isEdit ? 'Update Craft' : 'Add Craft'}
                        </button>

                        <a href="/admin/crafts" style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#9E9E9E', textDecoration: 'none' }}>Cancel</a>

                    </div>
                </div>
            </form>

        </AdminLayout>
    );
}
