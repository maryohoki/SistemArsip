/**
 * api.js — Frontend API Client
 * Centralized HTTP client untuk berkomunikasi dengan Backend REST API
 *
 * Backend base URL: http://localhost:3001/api
 * Semua fungsi mengembalikan Promise. Tangkap error dengan try/catch atau .catch()
 */

const API_BASE = 'http://localhost:3001/api';

// ─── Helper ───────────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  
  const headers = { 'Content-Type': 'application/json' };
  // Inject JWT Token
  if (window.Auth && window.Auth.getToken()) {
    headers['Authorization'] = `Bearer ${window.Auth.getToken()}`;
  }
  
  const defaultOptions = {
    headers: { ...headers, ...(options.headers || {}) },
    ...options
  };

  try {
    const res = await fetch(url, defaultOptions);
    const data = await res.json();

    if (res.status === 401 || res.status === 403) {
      if (window.Auth) window.Auth.logout();
      throw new Error(data.message || 'Sesi habis, silakan login kembali.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || `HTTP ${res.status} pada ${path}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

// ─── Arsip Surat API ──────────────────────────────────────────────────────────
const arsipAPI = {
  /**
   * Ambil semua arsip dengan filter opsional
   * @param {Object} params - { search, filter, page, limit }
   */
  getAll(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/arsip${qs ? '?' + qs : ''}`);
  },

  /** Ambil statistik per kategori untuk dashboard */
  getStats() {
    return apiFetch('/arsip/stats');
  },

  /** Ambil detail satu arsip berdasarkan ID */
  getById(id) {
    return apiFetch(`/arsip/${encodeURIComponent(id)}`);
  },

  /** Tambah arsip baru */
  create(record) {
    return apiFetch('/arsip', {
      method: 'POST',
      body: JSON.stringify(record)
    });
  },

  /** Update arsip */
  update(id, record) {
    return apiFetch(`/arsip/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    });
  },

  /** Hapus arsip */
  delete(id) {
    return apiFetch(`/arsip/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};

// ─── Settings API ─────────────────────────────────────────────────────────────
const settingsAPI = {
  /** Ambil pengaturan profil desa */
  get() {
    return apiFetch('/settings');
  },

  /** Update pengaturan profil desa */
  update(settings) {
    return apiFetch('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }
};

// ─── Aktivitas API ────────────────────────────────────────────────────────────
const aktivitasAPI = {
  /** Ambil log aktivitas terakhir */
  getAll() {
    return apiFetch('/aktivitas');
  },

  /** Tambah log aktivitas baru */
  add(text, time = 'Baru saja') {
    return apiFetch('/aktivitas', {
      method: 'POST',
      body: JSON.stringify({ text, time })
    });
  }
};

// ─── Jenis Surat API ──────────────────────────────────────────────────────────
const jenisAPI = {
  /** Ambil semua jenis surat (default + custom templates) */
  getAll() {
    return apiFetch('/jenis-surat');
  },

  /** Simpan custom template baru */
  create(template) {
    return apiFetch('/jenis-surat', {
      method: 'POST',
      body: JSON.stringify(template)
    });
  },

  /** Update custom template */
  update(id, template) {
    return apiFetch(`/jenis-surat/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(template)
    });
  },

  /** Hapus custom template */
  delete(id) {
    return apiFetch(`/jenis-surat/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};

// ─── Health Check ─────────────────────────────────────────────────────────────
async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data.status === 'OK';
  } catch {
    return false;
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
const authAPI = {
  login(username, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  register(data) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// Export ke global scope (karena FE masih pakai plain HTML/JS, bukan ES modules)
window.arsipAPI      = arsipAPI;
window.settingsAPI   = settingsAPI;
window.aktivitasAPI  = aktivitasAPI;
window.jenisAPI      = jenisAPI;
window.authAPI       = authAPI;
window.checkBackendHealth = checkBackendHealth;
