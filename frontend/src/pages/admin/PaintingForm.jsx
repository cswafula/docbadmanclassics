import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminPaintingsAPI } from '../../services/api';

export default function PaintingForm() {
    const { isAuthenticated } = useAuthStore();
    const isEdit = window.location.pathname.includes('/edit');
    const paintingId = isEdit ? window.location.pathname.split('/')[3] : null;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        description: '',
        price: '',
        quantity: '1',
        medium: '',
        size: '',
        year: '',
        is_featured: false,
        is_available: true,
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }
        if (isEdit && paintingId) {
            fetchPainting();
        }
    }, []);

    const fetchPainting = async () => {
        setLoading(true);
        try {
            const res = await adminPaintingsAPI.getById(paintingId);
            const p = res.data;
            setFormData({
                title: p.title || '',
                artist: p.artist || '',
                description: p.description || '',
                price: p.price || '',
                quantity: p.quantity || '1',
                medium: p.medium || '',
                size: p.size || '',
                year: p.year || '',
                is_featured: p.is_featured || false,
                is_available: p.is_available !== undefined ? p.is_available : true,
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load painting.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Generate previews
        const newPreviews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                newPreviews.push(ev.target.result);
                if (newPreviews.length === files.length) {
                    setPreviews([...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();

            // Append all text fields
            data.append('title', formData.title);
            data.append('artist', formData.artist);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('quantity', formData.quantity);
            data.append('medium', formData.medium || '');
            data.append('size', formData.size || '');
            data.append('year', formData.year || '');

            // Convert booleans to 1 or 0 explicitly
            data.append('is_featured', formData.is_featured ? '1' : '0');
            data.append('is_available', formData.is_available ? '1' : '0');

            // Append images
            images.forEach((image) => {
                data.append('images[]', image);
            });

            if (isEdit) {
                await adminPaintingsAPI.update(paintingId, data);
                setMessage({ type: 'success', text: 'Painting updated successfully!' });
                setTimeout(() => {
                    window.location.href = '/admin/paintings';
                }, 1500);
            } else {
                await adminPaintingsAPI.create(data);
                setMessage({ type: 'success', text: 'Painting added successfully!' });
                setTimeout(() => {
                    window.location.href = '/admin/paintings';
                }, 1500);
            }
        } catch (err) {
            console.log('Full error:', err.response);
            const errors = err.response?.data?.errors;
            const message = err.response?.data?.message;
            if (errors) {
                const firstError = Object.values(errors)[0][0];
                setMessage({ type: 'error', text: firstError });
            } else if (message) {
                setMessage({ type: 'error', text: message });
            } else {
                setMessage({ type: 'error', text: `Error ${err.response?.status}: ${JSON.stringify(err.response?.data)}` });
            }
        }
        finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout currentPage="Paintings">
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9E9E9E' }}>Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout currentPage="Paintings">

            {/* Back link */}
            <a href="/admin/paintings" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9E9E', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
                ← Back to Paintings
            </a>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '300', marginBottom: '2rem' }}>
                {isEdit ? 'Edit Painting' : 'Add New Painting'}
            </h2>

            {/* Message */}
            {message.text && (
                <div style={{
                    padding: '0.875rem 1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: message.type === 'success' ? '#F1F8E9' : '#FFF3F3',
                    border: `1px solid ${message.type === 'success' ? '#C5E1A5' : '#FFCDD2'}`,
                    color: message.type === 'success' ? '#33691E' : '#B71C1C',
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

                    {/* Left column - main details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                                Painting Details
                            </h3>

                            {/* Title */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Bearer of Tomorrow"
                                />
                            </div>

                            {/* Artist */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Artist *
                                </label>
                                <input
                                    type="text"
                                    name="artist"
                                    required
                                    value={formData.artist}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Richardson Mudibo"
                                />
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="input-field"
                                    placeholder="Describe the painting, its theme and story..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Medium + Size */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Medium
                                    </label>
                                    <input
                                        type="text"
                                        name="medium"
                                        value={formData.medium}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. Acrylic on Canvas"
                                    />
                                </div>
                                <div>
                                    <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Size
                                    </label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. 80cm x 60cm"
                                    />
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Year
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. 2024"
                                    min="1800"
                                    max="2030"
                                />
                            </div>

                        </div>

                        {/* Image Upload */}
                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                                Images {!isEdit && '*'}
                            </h3>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />

                            <label
                                htmlFor="image-upload"
                                style={{ display: 'block', border: '2px dashed #E0E0E0', padding: '2rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}
                            >
                                <p style={{ fontSize: '0.875rem', color: '#9E9E9E', marginBottom: '0.5rem' }}>
                                    Click to upload images
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#BDBDBD' }}>
                                    JPG, PNG or WebP · Max 10MB each · First image = primary
                                </p>
                            </label>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                                    {previews.map((src, i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <img
                                                src={src}
                                                alt={`Preview ${i + 1}`}
                                                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                                            />
                                            {i === 0 && (
                                                <span style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: '#000', color: '#fff', fontSize: '0.55rem', padding: '2px 4px', letterSpacing: '0.05em' }}>
                                                    PRIMARY
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {images.length > 0 && (
                                <p style={{ fontSize: '0.75rem', color: '#757575', marginTop: '0.75rem' }}>
                                    {images.length} image{images.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Right column - pricing + settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Pricing */}
                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                                Pricing & Stock
                            </h3>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Price (KES) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. 40000"
                                    min="0"
                                    step="50"
                                />
                            </div>

                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    required
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. 1"
                                    min="0"
                                />
                                <p style={{ fontSize: '0.7rem', color: '#BDBDBD', marginTop: '0.5rem' }}>
                                    Set to 0 if already sold
                                </p>
                            </div>
                        </div>

                        {/* Settings */}
                        <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '1.5rem' }}>
                                Settings
                            </h3>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}>
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <div>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Featured</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>Show on homepage</p>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="is_available"
                                    checked={formData.is_available}
                                    onChange={handleChange}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <div>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Available for sale</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>Visible in gallery</p>
                                </div>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary"
                            style={{ width: '100%', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                        >
                            {saving ? 'Saving...' : isEdit ? 'Update Painting' : 'Add Painting'}
                        </button>

                        <a
                            href="/admin/paintings"
                            style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#9E9E9E', textDecoration: 'none', letterSpacing: '0.05em' }}
                        >
                            Cancel
                        </a>

                    </div>
                </div>
            </form>

        </AdminLayout>
    );
}