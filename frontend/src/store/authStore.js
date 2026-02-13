import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('admin_token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('admin_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  }
}));

export default useAuthStore;