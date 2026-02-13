import { useState } from 'react';
import { adminAuthAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

export default function AdminLogin() {
  const setAuth = useAuthStore(state => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAuthAPI.login(formData);
      setAuth(response.data.user, response.data.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '3rem', width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9E9E9E', marginBottom: '0.5rem' }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '300', letterSpacing: '-0.01em' }}>
            Doc Badman Classics
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#FFF3F3', border: '1px solid #FFCDD2', color: '#B71C1C', padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="admin@docbadmanclassics.com"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: '#9E9E9E' }}>
          <a href="/" style={{ color: '#9E9E9E', textDecoration: 'none' }}>
            ← Back to website
          </a>
        </p>

      </div>
    </div>
  );
}