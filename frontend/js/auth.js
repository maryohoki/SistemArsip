/**
 * auth.js — Modul Autentikasi Frontend
 */

const Auth = {
  getToken() {
    return localStorage.getItem('tanjungsari_auth_token');
  },
  
  getUser() {
    const userStr = localStorage.getItem('tanjungsari_auth_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setAuth(token, user) {
    localStorage.setItem('tanjungsari_auth_token', token);
    localStorage.setItem('tanjungsari_auth_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('tanjungsari_auth_token');
    localStorage.removeItem('tanjungsari_auth_user');
  },

  checkAuthAndRedirect() {
    const token = this.getToken();
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');
    
    if (!token && !isAuthPage) {
      window.location.href = 'login.html';
    } else if (token && isAuthPage) {
      window.location.href = 'index.html';
    }
  },

  logout() {
    this.clearAuth();
    window.location.href = 'login.html';
  }
};

// Jalankan cek auth segera saat script di-load
Auth.checkAuthAndRedirect();

// Expose to window
window.Auth = Auth;
