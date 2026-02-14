import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import { adminUsersAPI } from '../../services/api';

export default function AdminUsers() {
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [mode, setMode]         = useState('create'); // create | password
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage]   = useState({ type: '', text: '' });

  const emptyForm = { name: '', email: '', password: '', password_confirmation: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isAuthenticated()) { window.location.href = '/admin'; return; }
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminUsersAPI.getAll()
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      showMessage('error', 'Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      if (mode === 'password' && editingId) {
        await adminUsersAPI.updatePassword(editingId, {
          password:              form.password,
          password_confirmation: form.password_confirmation,
        });
        showMessage('success', 'Password updated successfully');
      } else {
        const res = await adminUsersAPI.create(form);
        setUsers(prev => [res.data, ...prev]);
        showMessage('success', `${form.name} added as admin`);
      }
      setForm(emptyForm);
      setMode('create');
      setEditingId(null);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to save';
      showMessage('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (user) => {
    setMode('password');
    setEditingId(user.id);
    setForm({ ...emptyForm });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from admin access?`)) return;
    setDeleting(id);
    try {
      await adminUsersAPI.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showMessage('success', `${name} removed`);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const cancelEdit = () => {
    setMode('create');
    setEditingId(null);
    setForm(emptyForm);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid var(--gray-100)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 300,
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--gray-500)',
    marginBottom: '0.5rem',
    fontWeight: 500,
  };

  return (
    <AdminLayout currentPage="Users">

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Settings</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 300 }}>
          Admin Users
        </h1>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem',
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: message.type === 'success' ? '#15803d' : '#dc2626',
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* ── Users Table ── */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 140px', gap: '1rem', padding: '0.875rem 1.5rem', backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gray-100)' }}>
            {['Name', 'Email', 'Added', 'Actions'].map(col => (
              <p key={col} className="eyebrow" style={{ margin: 0 }}>{col}</p>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
              Loading users…
            </div>
          ) : users.map((u, i) => (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 120px 140px',
              gap: '1rem', padding: '1rem 1.5rem', alignItems: 'center',
              borderBottom: i < users.length - 1 ? '1px solid var(--gray-50)' : 'none',
              backgroundColor: editingId === u.id ? 'var(--cream)' : 'transparent',
            }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Avatar initial */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: '#1e2d1f', color: '#f2f0e6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 500, flexShrink: 0,
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{u.name}</p>
                  {u.id === currentUser?.id && (
                    <p style={{ fontSize: '0.62rem', color: '#b8963e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>You</p>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{u.email}</p>

              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                {new Date(u.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleChangePassword(u)}
                  style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid var(--black)', cursor: 'pointer', padding: '0 0 1px 0', whiteSpace: 'nowrap' }}
                >
                  Password
                </button>
                {u.id !== currentUser?.id && (
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
                    disabled={deleting === u.id}
                    style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid #dc2626', cursor: 'pointer', padding: '0 0 1px 0', color: '#dc2626', opacity: deleting === u.id ? 0.5 : 1 }}
                  >
                    {deleting === u.id ? '…' : 'Remove'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* ── Form ── */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--gray-100)', padding: '2rem', position: 'sticky', top: '80px' }}>

          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            {mode === 'password' ? 'Change Password' : 'Add Admin User'}
          </p>

          <form onSubmit={handleSubmit}>

            {mode === 'create' && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Jane Wanjiru" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="jane@docbadmanclassics.org" style={inputStyle} />
                </div>
              </>
            )}

            {mode === 'password' && (
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--cream)', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                Changing password for: <strong style={{ color: 'var(--black)' }}>
                  {users.find(u => u.id === editingId)?.name}
                </strong>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>
                {mode === 'password' ? 'New Password *' : 'Password *'}
              </label>
              <input type="password" required minLength={8} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min. 8 characters" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Confirm Password *</label>
              <input type="password" required minLength={8} value={form.password_confirmation}
                onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))}
                placeholder="Repeat password" style={inputStyle} />
            </div>

            <button type="submit" disabled={saving} className="btn-primary"
              style={{ width: '100%', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : mode === 'password' ? 'Update Password' : 'Add User'}
            </button>

            {mode === 'password' && (
              <button type="button" onClick={cancelEdit}
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', background: 'none', border: '1px solid var(--gray-100)', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-500)', fontFamily: 'var(--font-body)' }}>
                Cancel
              </button>
            )}

          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--cream)', fontSize: '0.75rem', color: 'var(--gray-500)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--black)' }}>Note:</strong> All users added here have full admin access. You cannot delete your own account.
          </div>

        </div>
      </div>

    </AdminLayout>
  );
}