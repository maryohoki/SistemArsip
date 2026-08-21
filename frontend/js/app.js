/**
 * app.js — Frontend Application Controller
 * Sistem Pengarsipan Administrasi Desa Tanjungsari
 *
 * Semua data diambil dari Backend API (http://localhost:3001/api)
 * via window.arsipAPI, window.settingsAPI, dll. (didefinisikan di api.js)
 */

document.addEventListener('DOMContentLoaded', async () => {

  // ── State Aplikasi ────────────────────────────────────────────────────────
  let currentSelectedType = 'SKU';
  let currentArchiveFilter = 'ALL';
  let currentSearchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 10;

  // Cache settings & templates agar tidak fetch berulang
  let _cachedSettings = null;
  let _cachedTemplates = null;

  // ── Cek Koneksi Backend ───────────────────────────────────────────────────
  const backendOnline = await window.checkBackendHealth();
  if (!backendOnline) {
    showBanner('⚠️ Backend API tidak terjangkau. Pastikan server backend sudah berjalan di port 3001.', 'error');
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  initSidebarToggle();
  initNavigation();
  await loadAndCacheTemplates();
  await initDashboard();
  await initFormBuilder(currentSelectedType);
  initArchiveTable();
  await initSettingsForm();
  initQuickSearchModal();

  // Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openQuickSearchModal();
    }
  });

  /* ─────────────────────────────────────────────────────────────────────────
     SIDEBAR TOGGLE CONTROLLER
     ───────────────────────────────────────────────────────────────────────── */
  function initSidebarToggle() {
    const sidebar      = document.getElementById('main-sidebar');
    const mainWrapper  = document.getElementById('main-wrapper');
    const desktopBtn   = document.getElementById('btn-sidebar-toggle');
    const mobileBtn    = document.getElementById('btn-header-hamburger');
    const overlay      = document.getElementById('sidebar-overlay');
    const toggleIcon   = document.getElementById('sidebar-toggle-icon');

    if (!sidebar || !mainWrapper) return;

    const STORAGE_KEY = 'tanjungsari_sidebar_collapsed';
    const isMobile = () => window.innerWidth <= 768;

    // ── Restore persisted state (desktop only) ─────────────────────────────
    if (!isMobile() && localStorage.getItem(STORAGE_KEY) === 'true') {
      sidebar.classList.add('collapsed');
      mainWrapper.classList.add('sidebar-collapsed');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-bars-staggered');
        toggleIcon.classList.add('fa-indent');
      }
    }

    // ── Desktop: toggle collapse ───────────────────────────────────────────
    function desktopToggle() {
      const isCollapsed = sidebar.classList.contains('collapsed');
      sidebar.classList.toggle('collapsed');
      mainWrapper.classList.toggle('sidebar-collapsed');

      if (toggleIcon) {
        if (isCollapsed) {
          // Was collapsed → now expanding
          toggleIcon.classList.remove('fa-indent');
          toggleIcon.classList.add('fa-bars-staggered');
        } else {
          // Was expanded → now collapsing
          toggleIcon.classList.remove('fa-bars-staggered');
          toggleIcon.classList.add('fa-indent');
        }
      }
      // Persist preference
      localStorage.setItem(STORAGE_KEY, String(!isCollapsed));
    }

    // ── Mobile: open drawer ────────────────────────────────────────────────
    function openMobileDrawer() {
      sidebar.classList.add('mobile-open');
      if (overlay) {
        overlay.style.display = 'block';
        // force reflow for transition
        overlay.offsetHeight; // eslint-disable-line no-unused-expressions
        overlay.classList.add('active');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
      sidebar.classList.remove('mobile-open');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => { overlay.style.display = 'none'; }, 280);
      }
      document.body.style.overflow = '';
    }

    // ── Desktop toggle button ──────────────────────────────────────────────
    if (desktopBtn) {
      desktopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isMobile()) desktopToggle();
      });
    }

    // ── Mobile hamburger button ────────────────────────────────────────────
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        if (isMobile()) openMobileDrawer();
      });
    }

    // ── Overlay click closes mobile drawer ────────────────────────────────
    if (overlay) {
      overlay.addEventListener('click', () => {
        if (isMobile()) closeMobileDrawer();
      });
    }

    // ── Close mobile drawer on nav item click ─────────────────────────────
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (isMobile() && sidebar.classList.contains('mobile-open')) {
          closeMobileDrawer();
        }
      });
    });

    // ── Handle resize: cleanup state on breakpoint change ─────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isMobile()) {
          // Switched to desktop: remove mobile classes
          sidebar.classList.remove('mobile-open');
          if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
          }
          document.body.style.overflow = '';
          // Re-apply persisted collapsed state
          if (localStorage.getItem(STORAGE_KEY) === 'true') {
            sidebar.classList.add('collapsed');
            mainWrapper.classList.add('sidebar-collapsed');
          }
        } else {
          // Switched to mobile: remove desktop collapsed class
          sidebar.classList.remove('collapsed');
          mainWrapper.classList.remove('sidebar-collapsed');
        }
      }, 150);
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     NAVIGATION CONTROLLER
     ───────────────────────────────────────────────────────────────────────── */
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-view');

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        viewSections.forEach(section => {
          section.classList.remove('active');
          if (section.id === `view-${targetView}`) section.classList.add('active');
        });

        if (targetView === 'dashboard') {
          await initDashboard();
        } else if (targetView === 'riwayat') {
          await renderArchiveTable();
        } else if (targetView === 'template-surat') {
          await initTemplateModule();
        } else if (targetView === 'agenda') {
          document.getElementById('input-agenda-nosurat').focus();
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     HELPER: Load & Cache
     ───────────────────────────────────────────────────────────────────────── */
  async function loadAndCacheTemplates() {
    try {
      const res = await window.jenisAPI.getAll();
      _cachedTemplates = res.data;
      // Sync global LETTER_TYPES agar letter-templates.js tetap berfungsi
      if (window.LETTER_TYPES) {
        Object.assign(window.LETTER_TYPES, _cachedTemplates);
      }
    } catch (err) {
      console.warn('[App] Gagal load templates dari BE, pakai cache lokal:', err.message);
      _cachedTemplates = window.LETTER_TYPES || {};
    }
  }

  async function getSettings() {
    if (_cachedSettings) return _cachedSettings;
    try {
      const res = await window.settingsAPI.get();
      _cachedSettings = res.data;
      return _cachedSettings;
    } catch {
      return window.DEFAULT_VILLAGE_SETTINGS || {};
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     MODULE 1: DASHBOARD
     ───────────────────────────────────────────────────────────────────────── */
  async function initDashboard() {
    try {
      // Fetch stats & activities paralel
      const [statsRes, activitiesRes] = await Promise.all([
        window.arsipAPI.getStats(),
        window.aktivitasAPI.getAll()
      ]);

      const stats = statsRes.data;
      const activities = activitiesRes.data;

      // Update Metric Cards
      document.getElementById('stat-sku-count').textContent = stats.SKU || 0;
      document.getElementById('stat-sktm-count').textContent = stats.SKTM_GROUP || stats.SKTM || 0;
      document.getElementById('stat-kematian-count').textContent = stats.KEMATIAN || 0;
      document.getElementById('stat-nikah-count').textContent = stats.NIKAH || 0;
      document.getElementById('stat-tu-count').textContent = (stats.DOMISILI || 0) + (stats.LAINNYA || 0);

      // Render Activity Feed
      const activityListContainer = document.getElementById('activity-feed-list');
      if (activityListContainer) {
        activityListContainer.innerHTML = activities.map(act => `
          <div class="activity-item">
            <div class="activity-dot-indicator"></div>
            <div>
              <div class="activity-content-text">${escapeHTML(act.text)}</div>
              <div class="activity-sub-text">${escapeHTML(act.time)}</div>
            </div>
          </div>
        `).join('');
      }

      if (window.initTrendChart) window.initTrendChart();
    } catch (err) {
      console.error('[Dashboard] Error:', err.message);
    }
  }



  /* ─────────────────────────────────────────────────────────────────────────
     MODULE 2: FORM BUILDER & CETAK SURAT
     ───────────────────────────────────────────────────────────────────────── */
  async function initFormBuilder(typeKey) {
  // Pastikan templates selalu terdefinisi — cegah ReferenceError
  const templates = _cachedTemplates || window.LETTER_TYPES || {};

  // Define main types vs other types
  const mainTypes = ['SKU', 'SKTM', 'SKTM_UMUM', 'SKTM_PELAJAR'];

  const allKeys = Object.keys(templates);
    const mainKeys = allKeys.filter(k => mainTypes.includes(k));
    const otherKeys = allKeys.filter(k => !mainTypes.includes(k));
    
    // State Elements
    const formEl = document.getElementById('form-cetak-surat');
    const catSelEl = document.getElementById('state-category-selection');
    const subSelEl = document.getElementById('state-subtype-selection');
    
    if (typeKey === 'SURAT_LAINNYA_CATEGORY') {
      currentSelectedType = 'SURAT_LAINNYA_CATEGORY';
      
      // Highlight the correct card on the left
      document.querySelectorAll('.type-card').forEach(card => card.classList.remove('selected'));
      const lainnyaCard = document.querySelector('.type-card[data-type="SURAT_LAINNYA_CATEGORY"]');
      if (lainnyaCard) lainnyaCard.classList.add('selected');

      // Hide form, show categories
      formEl.style.display = 'none';
      subSelEl.style.display = 'none';
      catSelEl.style.display = 'block';

      const catMap = {
        keterangan: { title: 'Surat Keterangan', icon: 'fa-file-lines', color: '#0284C7' },
        pengantar: { title: 'Surat Pengantar', icon: 'fa-share-from-square', color: '#D97706' },
        permohonan: { title: 'Surat Permohonan', icon: 'fa-envelope-open-text', color: '#16A34A' },
        pernyataan: { title: 'Surat Pernyataan', icon: 'fa-pen-to-square', color: '#DC2626' },
        administrasi: { title: 'Surat Administrasi', icon: 'fa-clipboard-list', color: '#9333EA' },
        lainnya: { title: 'Surat Lainnya', icon: 'fa-folder-plus', color: '#475569' }
      };

      const availableCats = new Set();
      otherKeys.forEach(k => {
        const title = (templates[k].title || '').toLowerCase();
        let catId = 'lainnya';
        if (title.includes('keterangan')) catId = 'keterangan';
        else if (title.includes('pengantar')) catId = 'pengantar';
        else if (title.includes('permohonan')) catId = 'permohonan';
        else if (title.includes('pernyataan')) catId = 'pernyataan';
        else if (title.includes('kuasa') || title.includes('tugas') || title.includes('undangan') || title.includes('pemberitahuan')) catId = 'administrasi';
        
        availableCats.add(catId);
      });

      // Define a fixed order for categories
      const order = ['keterangan', 'pengantar', 'permohonan', 'pernyataan', 'administrasi', 'lainnya'];
      const sortedCats = Array.from(availableCats).sort((a, b) => order.indexOf(a) - order.indexOf(b));

      const catContainer = document.getElementById('category-cards-container');
      catContainer.innerHTML = sortedCats.map(catId => {
        const info = catMap[catId] || catMap['lainnya'];
        return `
          <div class="type-card" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; text-align:center; padding: 24px 16px;" onclick="window.app.showSubtypeSelection('${catId}')">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: ${info.color}15; color: ${info.color}; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 12px;">
              <i class="fa-solid ${info.icon}"></i>
            </div>
            <div style="font-weight: 700; color: #1E293B; font-size: 14px;">${info.title}</div>
          </div>
        `;
      }).join('');
      
      return; // Stop here, wait for category selection
    }

    // Normal form execution
    currentSelectedType = typeKey;
    const letterTypeConfig = templates[typeKey];
    if (!letterTypeConfig) return;
    
    // Hide selectors, show form
    catSelEl.style.display = 'none';
    subSelEl.style.display = 'none';
    formEl.style.display = 'block';
    
    const isOtherSelected = otherKeys.includes(typeKey);

    // Function to generate HTML for cards
    const renderCards = (keys) => {
      return keys.map(key => {
        const item = templates[key];
        const isSelected = key === typeKey ? 'selected' : '';
        return `
          <div class="type-card ${isSelected}" data-type="${key}">
            <div class="type-card-icon"><i class="fa-solid ${item.icon}"></i></div>
            <div class="type-card-info">
              <div class="type-card-title">${item.title}</div>
              <div class="type-card-desc">${item.desc}</div>
            </div>
          </div>
        `;
      }).join('');
    };

    // Update Main Selector
    const mainContainer = document.getElementById('letter-type-selector-main');
    if (mainContainer) {
      const mainCardsHtml = renderCards(mainKeys);
      const lainnyaCardHtml = `
        <div class="type-card ${isOtherSelected ? 'selected' : ''}" data-type="SURAT_LAINNYA_CATEGORY">
          <div class="type-card-icon"><i class="fa-solid fa-folder-open"></i></div>
          <div class="type-card-info">
            <div class="type-card-title">Jenis Surat Lainnya</div>
            <div class="type-card-desc">Pilih kategori surat khusus atau buat format kustom.</div>
          </div>
        </div>
      `;
      mainContainer.innerHTML = mainCardsHtml + lainnyaCardHtml;
    }

    // Add event listeners
    document.querySelectorAll('.type-card').forEach(card => {
      card.addEventListener('click', async () => {
        await initFormBuilder(card.getAttribute('data-type'));
      });
    });

    // Update Form Header
    document.getElementById('form-letter-title').textContent = `Formulir Penerbitan ${letterTypeConfig.shortTitle}`;

    // Auto-generate Nomor Surat
    let recordCount = 0;
    try {
      const statsRes = await window.arsipAPI.getStats();
      recordCount = statsRes.data.total || 0;
    } catch { /* pakai 0 */ }

    const autoNoSurat = generateAutoNoSurat(letterTypeConfig.code, recordCount);
    const autoTrxId = `TRX-${Math.floor(1000 + Math.random() * 9000)}-${typeKey}`;

    document.getElementById('form-trx-id').textContent = `ID TRANSAKSI: ${autoTrxId}`;
    document.getElementById('input-no-surat').value = autoNoSurat;

    // Render Dynamic Fields
    const dynamicContainer = document.getElementById('dynamic-specific-fields');
    if (dynamicContainer) {
      let html = '';
      if (letterTypeConfig.fields && letterTypeConfig.fields.length > 0) {
        html += `
          <div class="form-row" style="margin-top: 15px; background: #F8FAFC; padding: 16px; border-radius: 12px; border: 1px solid #E2E8F0;">
            <div style="grid-column: span 2; font-size: 13px; font-weight: 700; color: #14532D; margin-bottom: 4px;">
              <i class="fa-solid fa-file-pen" style="margin-right: 6px;"></i> Detail Keterangan Spesifik (${letterTypeConfig.shortTitle})
            </div>
            ${letterTypeConfig.fields.map(f => `
              <div class="form-group ${f.type === 'textarea' || f.fullWidth ? 'full-width' : ''}">
                <label class="form-label">${f.label} ${f.required ? '<span style="color:#EF4444">*</span>' : ''}</label>
                ${f.type === 'textarea' ? `
                  <textarea class="form-textarea" name="spesifik_${f.name}" placeholder="${f.placeholder || ''}" rows="3" ${f.required ? 'required' : ''}></textarea>
                ` : `
                  <input type="${f.type || 'text'}" class="form-input" name="spesifik_${f.name}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>
                `}
              </div>
            `).join('')}
          </div>
        `;
      }
      dynamicContainer.innerHTML = html;
    }

    // Attach Submit
    const formElement = document.getElementById('form-cetak-surat');
    if (formElement) {
      // Hapus listener lama sebelum menambahkan yang baru
      const freshForm = formElement.cloneNode(true);
      formElement.parentNode.replaceChild(freshForm, formElement);
      
      const cleanForm = document.getElementById('form-cetak-surat');
      cleanForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await processFormSubmission(autoTrxId, typeKey);
      });
    }
  }

  function generateAutoNoSurat(code, count) {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentMonthRoman = romans[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    const padCount = String(count + 1).padStart(3, '0');
    return `${code}/${padCount}/DS-TS/${currentMonthRoman}/${currentYear}`;
  }

  // Auto-Fill Demo Data
  window.fillDemoData = function () {
    const demoCitizens = [
      { nik: '3211041807850002', nama: 'Dadang Hendra', tmp: 'Sumedang', tgl: '1985-07-18', jk: 'Laki-laki', agama: 'Islam', kerja: 'Petani / Pekebun', alamat: 'Dusun Tanjungsari RT 03 RW 01', keperluan: 'Persyaratan Pengajuan Bantuan Pupuk Subsidi & Usaha Tani' },
      { nik: '3211045012920004', nama: 'Dewi Kartika', tmp: 'Bandung', tgl: '1992-12-10', jk: 'Perempuan', agama: 'Islam', kerja: 'Guru Honorer', alamat: 'Dusun Sukamaju RT 01 RW 03', keperluan: 'Persyaratan Beasiswa Pendidikan KIP Kuliah / Sekolah' },
      { nik: '3211040503950001', nama: 'Asep Saepuloh', tmp: 'Sumedang', tgl: '1995-03-05', jk: 'Laki-laki', agama: 'Islam', kerja: 'Wiraswasta', alamat: 'Dusun Margaluyu RT 02 RW 04', keperluan: 'Persyaratan Kredit Usaha Rakyat (KUR) Bank BRI' }
    ];
    const chosen = demoCitizens[Math.floor(Math.random() * demoCitizens.length)];
    document.getElementById('input-nik').value = chosen.nik;
    document.getElementById('input-nama').value = chosen.nama;
    document.getElementById('input-tmp-lahir').value = chosen.tmp;
    document.getElementById('input-tgl-lahir').value = chosen.tgl;
    document.getElementById('select-jk').value = chosen.jk;
    document.getElementById('select-agama').value = chosen.agama;
    document.getElementById('input-pekerjaan').value = chosen.kerja;
    document.getElementById('input-alamat').value = chosen.alamat;
    document.getElementById('input-keperluan').value = chosen.keperluan;

    const templates = _cachedTemplates || window.LETTER_TYPES || {};
    const specFields = (templates[currentSelectedType] || {}).fields || [];
    specFields.forEach(f => {
      const input = document.querySelector(`[name="spesifik_${f.name}"]`);
      if (input) {
        if (f.name.toLowerCase().includes('usaha')) input.value = 'Warung Makan Saung Tanjungsari';
        else if (f.name.toLowerCase().includes('tahun') || f.name.toLowerCase().includes('sejak')) input.value = '2020';
        else if (f.name.toLowerCase().includes('anak') || f.name.toLowerCase().includes('almarhum')) input.value = chosen.nama;
        else if (f.name.toLowerCase().includes('pasangan')) input.value = 'Rina Astuti (Binti H. Kusnadi)';
        else input.value = 'Keterangan Sesuai Berkas';
      }
    });
    showToast('Data demo berhasil diisikan ke dalam formulir!', 'success');
  };

  // Process Form Submit → POST ke backend
  async function processFormSubmission(trxId, typeKey) {
    const templates = _cachedTemplates || window.LETTER_TYPES || {};
    const record = {
      id: trxId,
      noSurat: document.getElementById('input-no-surat').value,
      nik: document.getElementById('input-nik').value,
      nama: document.getElementById('input-nama').value,
      tmpLahir: document.getElementById('input-tmp-lahir').value,
      tglLahir: document.getElementById('input-tgl-lahir').value,
      jk: document.getElementById('select-jk').value,
      agama: document.getElementById('select-agama').value,
      pekerjaan: document.getElementById('input-pekerjaan').value,
      alamat: document.getElementById('input-alamat').value,
      kategori: typeKey,
      keperluan: document.getElementById('input-keperluan').value,
      spesifik: {},
      tglTerbit: new Date().toISOString().split('T')[0],
      petugas: 'Admin Desa'
    };

    const specFields = (templates[typeKey] || {}).fields || [];
    specFields.forEach(f => {
      const el = document.querySelector(`[name="spesifik_${f.name}"]`);
      if (el) record.spesifik[f.name] = el.value;
    });

    try {
      const res = await window.arsipAPI.create(record);
      showToast(`Surat ${res.data.noSurat} berhasil diterbitkan dan diarsipkan!`, 'success');
      const settings = await getSettings();
      openLetterPreviewModal(res.data, settings);
      await initDashboard();
      await initFormBuilder(typeKey);
    } catch (err) {
      showToast('Gagal menyimpan arsip: ' + err.message, 'error');
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     MODULE 3: RIWAYAT PENERBITAN (ARCHIVE TABLE)
     ───────────────────────────────────────────────────────────────────────── */
  function initArchiveTable() {
    const searchInput = document.getElementById('archive-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        currentSearchQuery = e.target.value.trim();
        currentPage = 1;
        await renderArchiveTable();
      });
    }

    document.getElementById('archive-table-body').addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.action === 'view') await viewLetterById(id);
      if (btn.dataset.action === 'delete') await deleteLetterById(id);
    });

    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentArchiveFilter = btn.getAttribute('data-cat');
        currentPage = 1;
        await renderArchiveTable();
      });
    });

    renderArchiveTable();
  }

  async function renderArchiveTable() {
    const tableBody = document.getElementById('archive-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#64748B;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</td></tr>`;

    try {
      const res = await window.arsipAPI.getAll({
        search: currentSearchQuery || '',
        filter: currentArchiveFilter !== 'ALL' ? currentArchiveFilter : '',
        page: currentPage,
        limit: itemsPerPage
      });

      const { data: records, pagination } = res;
      const templates = _cachedTemplates || window.LETTER_TYPES || {};

      if (records.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; padding:40px; color:#64748B;">
              <i class="fa-solid fa-folder-open" style="font-size:32px; margin-bottom:8px; display:block; opacity:0.5;"></i>
              Tidak ada dokumen surat yang cocok dengan kriteria pencarian.
            </td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = records.map(r => {
          const initial = r.nama.charAt(0).toUpperCase();
          const catConfig = templates[r.kategori] || { shortTitle: r.kategori, badgeClass: 'cat-lainnya' };
          return `
            <tr>
              <td><strong style="font-family:monospace; color:#14532D;">${escapeHTML(r.noSurat)}</strong></td>
              <td>
                <div class="applicant-cell">
                  <div class="avatar-circle">${initial}</div>
                  <div>
                    <div class="applicant-name">${escapeHTML(r.nama)}</div>
                    <div class="applicant-nik">NIK: ${escapeHTML(r.nik)}</div>
                  </div>
                </div>
              </td>
              <td><span class="badge-category ${catConfig.badgeClass}">${escapeHTML(catConfig.shortTitle)}</span></td>
              <td>${formatDateIndonesian(r.tglTerbit)}</td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn" title="Lihat / Cetak Surat" data-action="view" data-id="${escapeHTML(r.id)}">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="action-btn delete" title="Hapus Arsip" data-action="delete" data-id="${escapeHTML(r.id)}">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      // Pagination
      const infoContainer = document.getElementById('pagination-info-text');
      if (infoContainer) {
        const startItem = (pagination.page - 1) * pagination.limit + 1;
        const endItem = Math.min(pagination.page * pagination.limit, pagination.totalItems);
        infoContainer.textContent = pagination.totalItems > 0
          ? `Menampilkan ${startItem}–${endItem} dari ${pagination.totalItems} data arsip`
          : 'Menampilkan 0 data';
      }

      const prevBtn = document.getElementById('btn-prev-page');
      const nextBtn = document.getElementById('btn-next-page');
      if (prevBtn && nextBtn) {
        prevBtn.disabled = pagination.page <= 1;
        nextBtn.disabled = pagination.page >= pagination.totalPages;
        prevBtn.onclick = async () => { if (currentPage > 1) { currentPage--; await renderArchiveTable(); } };
        nextBtn.onclick = async () => { if (currentPage < pagination.totalPages) { currentPage++; await renderArchiveTable(); } };
      }
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#EF4444;"><i class="fa-solid fa-circle-exclamation"></i> Gagal memuat data: ${escapeHTML(err.message)}</td></tr>`;
    }
  }

  // View Letter
  window.viewLetterById = async function (id) {
    try {
      const [arsipRes, settingsRes] = await Promise.all([
        window.arsipAPI.getById(id),
        window.settingsAPI.get()
      ]);
      openLetterPreviewModal(arsipRes.data, settingsRes.data);
    } catch (err) {
      showToast('Gagal memuat data surat: ' + err.message, 'error');
    }
  };

  // Delete Letter
  window.deleteLetterById = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus arsip surat ini dari sistem?')) return;
    try {
      await window.arsipAPI.delete(id);
      showToast('Arsip surat berhasil dihapus.', 'success');
      await renderArchiveTable();
      await initDashboard();
    } catch (err) {
      showToast('Gagal menghapus arsip: ' + err.message, 'error');
    }
  };

  // Export CSV
  window.exportArchiveCSV = async function () {
    try {
      const res = await window.arsipAPI.getAll({ limit: 1000 });
      const records = res.data;
      if (records.length === 0) {
        showToast('Tidak ada data arsip untuk diekspor.', 'error');
        return;
      }
      let csv = 'data:text/csv;charset=utf-8,';
      csv += 'ID Transaksi,No Surat,NIK,Nama Pemohon,Kategori,Tanggal Terbit,Keperluan\n';
      records.forEach(r => {
        csv += [`"${r.id}"`, `"${r.noSurat}"`, `"${r.nik}"`, `"${r.nama}"`, `"${r.kategori}"`, `"${r.tglTerbit}"`, `"${r.keperluan || ''}"`].join(',') + '\n';
      });
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csv));
      link.setAttribute('download', `Arsip_Surat_Desa_Tanjungsari_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Berhasil mengunduh file rekapitulasi CSV!', 'success');
    } catch (err) {
      showToast('Gagal ekspor CSV: ' + err.message, 'error');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     LIVE LETTER PREVIEW & PRINT MODAL
     ───────────────────────────────────────────────────────────────────────── */
  function openLetterPreviewModal(record, settings) {
    const letterHTML = window.generateLetterHTML(record, settings);
    const modalBody = document.getElementById('preview-modal-body');
    if (modalBody) modalBody.innerHTML = letterHTML;

    const modalOverlay = document.getElementById('modal-preview-letter');
    if (modalOverlay) modalOverlay.classList.add('active');

    const btnPrint = document.getElementById('btn-modal-print');
  if (btnPrint) {
    // Clone untuk hapus event listener lama
    const freshBtn = btnPrint.cloneNode(true);
    btnPrint.parentNode.replaceChild(freshBtn, btnPrint);
    freshBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.print();
    });
  }
}

  window.closePreviewModal = function () {
    document.getElementById('modal-preview-letter')?.classList.remove('active');
  };

  /* ─────────────────────────────────────────────────────────────────────────
     SETTINGS FORM
     ───────────────────────────────────────────────────────────────────────── */
  async function initSettingsForm() {
    const settings = await getSettings();

    document.getElementById('set-nama-kades').value = settings.namaKades || '';
    document.getElementById('set-nip-kades').value = settings.nipKades || '';
    document.getElementById('set-alamat-desa').value = settings.alamat || '';
    document.getElementById('set-email-desa').value = settings.email || '';
    document.getElementById('set-telp-desa').value = settings.telepon || '';

    const settingsForm = document.getElementById('form-settings-desa');
    if (settingsForm) {
      settingsForm.onsubmit = async (e) => {
        e.preventDefault();
        const updated = {
          ...settings,
          namaKades: document.getElementById('set-nama-kades').value,
          nipKades: document.getElementById('set-nip-kades').value,
          alamat: document.getElementById('set-alamat-desa').value,
          email: document.getElementById('set-email-desa').value,
          telepon: document.getElementById('set-telp-desa').value
        };
        try {
          const res = await window.settingsAPI.update(updated);
          _cachedSettings = res.data;
          showToast('Pengaturan profil Desa Tanjungsari berhasil diperbarui!', 'success');
        } catch (err) {
          showToast('Gagal menyimpan pengaturan: ' + err.message, 'error');
        }
      };
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     QUICK SEARCH MODAL
     ───────────────────────────────────────────────────────────────────────── */
  function initQuickSearchModal() {
    const searchModalInput = document.getElementById('quick-search-input');
    if (!searchModalInput) return;

    document.getElementById('quick-search-results').addEventListener('click', async (e) => {
      const item = e.target.closest('[data-search-id]');
      if (!item) return;
      closeQuickSearchModal();
      await viewLetterById(item.dataset.searchId);
    });

    let searchTimeout = null;
    searchModalInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => doQuickSearch(e.target.value), 300);
    });
  }

  async function doQuickSearch(q) {
    const resultsContainer = document.getElementById('quick-search-results');
    if (!q.trim()) {
      resultsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#94A3B8;">Ketik NIK, Nama Pemohon, atau Nomor Surat...</div>';
      return;
    }
    try {
      const res = await window.arsipAPI.getAll({ search: q, limit: 8 });
      const matches = res.data;
      if (matches.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#94A3B8;">Data tidak ditemukan.</div>';
      } else {
        resultsContainer.innerHTML = matches.map(r => `
          <div style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" data-search-id="${escapeHTML(r.id)}">
            <div>
              <strong style="color: #14532D; font-size: 13px;">${escapeHTML(r.noSurat)}</strong>
              <div style="font-size: 13px; font-weight: 600;">${escapeHTML(r.nama)} <span style="font-size:11px; font-weight:400; color:#64748B;">(NIK: ${r.nik})</span></div>
            </div>
            <span class="badge-category cat-sku">${r.kategori}</span>
          </div>
        `).join('');
      }
    } catch (err) {
      resultsContainer.innerHTML = `<div style="padding:20px; text-align:center; color:#EF4444;">Error: ${escapeHTML(err.message)}</div>`;
    }
  }

  window.openQuickSearchModal = function () {
    document.getElementById('modal-quick-search')?.classList.add('active');
    setTimeout(() => document.getElementById('quick-search-input')?.focus(), 100);
  };
  window.closeQuickSearchModal = function () {
    document.getElementById('modal-quick-search')?.classList.remove('active');
  };

  /* ─────────────────────────────────────────────────────────────────────────
     MODULE 5: TEMPLATE SURAT
     ───────────────────────────────────────────────────────────────────────── */
  let currentTplCategory = 'ALL';
  let currentTplSearch = '';

  async function initTemplateModule() {
    await loadAndCacheTemplates();

    const tplSearchInput = document.getElementById('template-search-input');
    if (tplSearchInput) {
      tplSearchInput.addEventListener('input', (e) => {
        currentTplSearch = e.target.value.toLowerCase().trim();
        renderTemplateCatalog();
      });
    }

    document.querySelectorAll('#template-category-filters .cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#template-category-filters .cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTplCategory = btn.getAttribute('data-tpl-cat');
        renderTemplateCatalog();
      });
    });

    const editorForm = document.getElementById('form-template-editor');
    if (editorForm) {
      editorForm.onsubmit = (e) => { e.preventDefault(); saveCustomTemplateSubmit(); };
    }

    renderTemplateCatalog();
  }

  function renderTemplateCatalog() {
    const gridContainer = document.getElementById('template-catalog-grid');
    if (!gridContainer) return;

    const templates = _cachedTemplates || {};
    let templateKeys = Object.keys(templates);

    if (currentTplCategory !== 'ALL') {
      templateKeys = templateKeys.filter(key => templates[key].categoryGroup === currentTplCategory);
    }
    if (currentTplSearch) {
      templateKeys = templateKeys.filter(key => {
        const item = templates[key];
        return item.title.toLowerCase().includes(currentTplSearch) ||
          (item.shortTitle && item.shortTitle.toLowerCase().includes(currentTplSearch)) ||
          item.code.toLowerCase().includes(currentTplSearch) ||
          (item.desc && item.desc.toLowerCase().includes(currentTplSearch));
      });
    }

    if (templateKeys.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; color: #64748B;">
          <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 12px; opacity: 0.5; color: #14532D;"></i>
          <div style="font-weight: 600; font-size: 15px;">Tidak Ada Template Surat</div>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = templateKeys.map(key => {
      const item = templates[key];
      const syaratList = item.syarat || ['Fotokopi KTP Pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar RT/RW'];
      const previewSyarat = syaratList.slice(0, 2);
      const moreCount = syaratList.length - 2;

      return `
        <div class="template-card">
          <div>
            <div class="template-card-header">
              <div class="template-icon-box"><i class="fa-solid ${item.icon || 'fa-file-lines'}"></i></div>
              <span class="template-code-badge">Kode: ${escapeHTML(item.code)}</span>
            </div>
            <div class="template-card-title">${escapeHTML(item.title)}</div>
            <div class="template-card-desc">${escapeHTML(item.desc || 'Template surat resmi administrasi Desa Tanjungsari.')}</div>
            <div class="template-syarat-preview">
              <div class="template-syarat-title"><i class="fa-solid fa-list-check" style="color: #14532D;"></i> Berkas Persyaratan:</div>
              <ul class="template-syarat-list">
                ${previewSyarat.map(s => `<li class="template-syarat-item"><i class="fa-solid fa-circle-check"></i><span>${escapeHTML(s)}</span></li>`).join('')}
                ${moreCount > 0 ? `<li style="font-size:11px; color:#64748B; font-weight:500; margin-top:3px;">+${moreCount} persyaratan lainnya</li>` : ''}
              </ul>
            </div>
          </div>
          <div class="template-card-actions">
            <button class="btn-use-template" onclick="useTemplateForLetter('${key}')">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Gunakan Template
            </button>
            <button class="btn-preview-template" title="Pratinjau Draf" onclick="openTemplateDetailModal('${key}')">
              <i class="fa-solid fa-eye"></i> Draf
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.useTemplateForLetter = async function (templateKey) {
    const templates = _cachedTemplates || {};
    const tConfig = templates[templateKey];
    if (!tConfig) return;
    document.querySelector('[data-view="cetak"]')?.click();
    await initFormBuilder(templateKey);
    showToast(`Template ${tConfig.shortTitle || tConfig.title} berhasil dipilih!`, 'success');
    document.getElementById('form-letter-title')?.scrollIntoView({ behavior: 'smooth' });
  };

  window.openTemplateDetailModal = async function (templateKey) {
    const templates = _cachedTemplates || {};
    const settings = await getSettings();
    const tConfig = templates[templateKey];
    if (!tConfig) return;

    document.getElementById('template-detail-title').innerHTML = `
      <i class="fa-solid ${tConfig.icon || 'fa-file-lines'}" style="color: #14532D; margin-right: 8px;"></i>
      Detail Template ${escapeHTML(tConfig.title)}
    `;

    const modalBody = document.getElementById('template-detail-modal-body');
    if (modalBody && window.renderTemplateDraftPreview) {
      modalBody.innerHTML = window.renderTemplateDraftPreview(templateKey, settings);
    }

    const btnUseModal = document.getElementById('btn-use-template-modal');
    if (btnUseModal) {
      btnUseModal.onclick = () => { closeTemplateDetailModal(); window.useTemplateForLetter(templateKey); };
    }

    document.getElementById('modal-template-detail')?.classList.add('active');
  };

  window.closeTemplateDetailModal = function () {
    document.getElementById('modal-template-detail')?.classList.remove('active');
  };

  window.openTemplateEditorModal = function (templateKey = null) {
    const modal = document.getElementById('modal-template-editor');
    const form = document.getElementById('form-template-editor');
    if (!modal || !form) return;

    if (templateKey) {
      const templates = _cachedTemplates || {};
      const tConfig = templates[templateKey];
      if (tConfig) {
        document.getElementById('editor-template-id').value = templateKey;
        document.getElementById('editor-code').value = tConfig.code || '';
        document.getElementById('editor-category-group').value = tConfig.categoryGroup || 'rekomendasi';
        document.getElementById('editor-title').value = tConfig.title || '';
        document.getElementById('editor-short-title').value = tConfig.shortTitle || '';
        document.getElementById('editor-desc').value = tConfig.desc || '';
        document.getElementById('editor-syarat').value = (tConfig.syarat || []).join('\n');
      }
    } else {
      form.reset();
      document.getElementById('editor-template-id').value = '';
    }
    modal.classList.add('active');
  };

  window.closeTemplateEditorModal = function () {
    document.getElementById('modal-template-editor')?.classList.remove('active');
  };

  async function saveCustomTemplateSubmit() {
    const idInput = document.getElementById('editor-template-id').value;
    const code = document.getElementById('editor-code').value.trim();
    const categoryGroup = document.getElementById('editor-category-group').value;
    const title = document.getElementById('editor-title').value.trim();
    const shortTitle = document.getElementById('editor-short-title').value.trim();
    const desc = document.getElementById('editor-desc').value.trim();
    const syaratRaw = document.getElementById('editor-syarat').value;
    const syarat = syaratRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    const templateId = idInput || `CUSTOM_${Date.now()}`;
    const newTemplate = {
      id: templateId, code, title, shortTitle,
      badgeClass: 'cat-sku', icon: 'fa-file-signature',
      categoryGroup, desc,
      syarat: syarat.length > 0 ? syarat : ['Fotokopi KTP Pemohon', 'Fotokopi KK', 'Surat Pengantar RT/RW'],
      fields: []
    };

    try {
      if (idInput) {
        await window.jenisAPI.update(idInput, newTemplate);
      } else {
        await window.jenisAPI.create(newTemplate);
      }
      showToast(`Template "${shortTitle}" berhasil disimpan!`, 'success');
      window.closeTemplateEditorModal();
      await loadAndCacheTemplates();
      await initTemplateModule();
    } catch (err) {
      showToast('Gagal menyimpan template: ' + err.message, 'error');
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     IMPORT / EXPORT DATABASE
     ───────────────────────────────────────────────────────────────────────── */
  window.handleImportDatabase = async function (event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!confirm(`Import file "${file.name}" akan menambahkan data ke sistem. Data yang sudah ada tidak akan terhapus. Lanjutkan?`)) {
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.settings) await window.settingsAPI.update(json.settings);
        if (json.records && Array.isArray(json.records)) {
          for (const rec of json.records) {
            try { await window.arsipAPI.create(rec); } catch { /* skip duplikat */ }
          }
        }
        showToast('Database berhasil diimpor! Memuat ulang data...', 'success');
        setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showToast('Gagal mengimpor database: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  /* ─────────────────────────────────────────────────────────────────────────
     UTILITIES
     ───────────────────────────────────────────────────────────────────────── */
  function showBanner(message, type = 'error') {
    let banner = document.getElementById('backend-status-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'backend-status-banner';
      banner.style.cssText = `position:fixed; top:0; left:0; right:0; z-index:9999; padding:10px 20px; text-align:center; font-size:13px; font-weight:600; background:${type === 'error' ? '#FEF2F2' : '#F0FFF4'}; color:${type === 'error' ? '#DC2626' : '#15803D'}; border-bottom:2px solid ${type === 'error' ? '#FCA5A5' : '#86EFAC'};`;
      document.body.prepend(banner);
    }
    banner.textContent = message;
    if (type !== 'error') setTimeout(() => banner.remove(), 4000);
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color: ${type === 'success' ? '#16A34A' : '#EF4444'}; font-size:18px;"></i>
      <span style="font-size: 13px; font-weight: 500; color: #0F172A;">${escapeHTML(message)}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // formatDateIndonesian harus tersedia secara global (dari data.js atau didefinisikan di sini)
  window.formatDateIndonesian = window.formatDateIndonesian || function (dateStr) {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };
  window.app = window.app || {};
  window.app.showCategorySelection = function() {
    // This is essentially selecting the SURAT_LAINNYA_CATEGORY again
    const typeCards = document.querySelectorAll('.type-card');
    typeCards.forEach(c => c.classList.remove('selected'));
    const lainnyaCard = document.querySelector('.type-card[data-type="SURAT_LAINNYA_CATEGORY"]');
    if (lainnyaCard) lainnyaCard.classList.add('selected');
    
    document.getElementById('form-cetak-surat').style.display = 'none';
    document.getElementById('state-subtype-selection').style.display = 'none';
    document.getElementById('state-category-selection').style.display = 'block';
  };
  
  window.app.showSubtypeSelection = function(catId) {
    const templates = _cachedTemplates || window.LETTER_TYPES || {};
    const catMap = {
      keterangan: 'Surat Keterangan',
      pengantar: 'Surat Pengantar',
      permohonan: 'Surat Permohonan',
      pernyataan: 'Surat Pernyataan',
      administrasi: 'Surat Administrasi',
      lainnya: 'Surat Lainnya'
    };
    
    document.getElementById('subtype-selection-title').textContent = catMap[catId] || catId;
    
    // Define main types vs other types
    const mainTypes = ['SKU', 'SKTM', 'SKTM_UMUM', 'SKTM_PELAJAR'];
    const otherKeys = Object.keys(templates).filter(k => !mainTypes.includes(k));

    const matchedKeys = otherKeys.filter(k => {
      const title = (templates[k].title || '').toLowerCase();
      let itemCat = 'lainnya';
      if (title.includes('keterangan')) itemCat = 'keterangan';
      else if (title.includes('pengantar')) itemCat = 'pengantar';
      else if (title.includes('permohonan')) itemCat = 'permohonan';
      else if (title.includes('pernyataan')) itemCat = 'pernyataan';
      else if (title.includes('kuasa') || title.includes('tugas') || title.includes('undangan') || title.includes('pemberitahuan')) itemCat = 'administrasi';
      
      return itemCat === catId;
    });
    
    const subContainer = document.getElementById('subtype-cards-container');
    subContainer.innerHTML = matchedKeys.map(key => {
      const item = templates[key];
      return `
        <div class="type-card" style="cursor:pointer;" onclick="window.app.initFormBuilder('${key}')">
          <div class="type-card-icon"><i class="fa-solid ${item.icon}"></i></div>
          <div class="type-card-info">
            <div class="type-card-title">${item.title}</div>
            <div class="type-card-desc">${item.desc}</div>
          </div>
        </div>
      `;
    }).join('');
    
    document.getElementById('state-category-selection').style.display = 'none';
    document.getElementById('state-subtype-selection').style.display = 'block';
  };
  
  window.app.initFormBuilder = initFormBuilder;

  // --- AGENDA SURAT MODULE ---
  window.app.selectAgenda = function(jenis, element) {
    // Highlight the selected card
    const cards = document.querySelectorAll('#agenda-type-selector .type-card');
    cards.forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');

    // Update form hidden input and title
    document.getElementById('input-agenda-jenis').value = jenis;
    const titles = {
      'masuk': 'Pencatatan Surat Masuk',
      'keluar': 'Pencatatan Surat Keluar',
      'undangan': 'Pencatatan Surat Undangan',
      'tugas': 'Pencatatan Surat Tugas',
      'edaran': 'Pencatatan Surat Edaran',
      'keputusan': 'Pencatatan Surat Keputusan',
      'lainnya': 'Pencatatan Korespondensi Lainnya'
    };
    document.getElementById('agenda-form-title').textContent = titles[jenis] || 'Pencatatan Surat';

    // Change label for Pengirim/Penerima based on jenis
    const labelPihak = document.getElementById('agenda-label-pihak');
    if (jenis === 'masuk') labelPihak.innerHTML = 'Pengirim <span style="color:#EF4444">*</span>';
    else if (jenis === 'keluar') labelPihak.innerHTML = 'Tujuan / Penerima <span style="color:#EF4444">*</span>';
    else labelPihak.innerHTML = 'Pihak Terkait <span style="color:#EF4444">*</span>';
  };

  const formAgenda = document.getElementById('form-agenda-surat');
  if (formAgenda) {
    formAgenda.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const jenisAgenda = document.getElementById('input-agenda-jenis').value;
      if (!jenisAgenda) {
        showToast('Silakan pilih jenis surat agenda terlebih dahulu.', 'error');
        return;
      }
      
      const payload = {
        jenis_agenda: jenisAgenda,
        no_surat: document.getElementById('input-agenda-nosurat').value,
        tanggal_surat: document.getElementById('input-agenda-tgl').value,
        status: document.getElementById('input-agenda-status').value,
        pihak_terkait: document.getElementById('input-agenda-pihak').value,
        perihal: document.getElementById('input-agenda-perihal').value,
        kategori: document.getElementById('input-agenda-kategori').value
      };

      try {
        const btn = document.getElementById('btn-submit-agenda');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        const res = await fetch('http://localhost:3001/api/agenda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        
        if (json.success) {
          showToast('Data Agenda berhasil disimpan!', 'success');
          formAgenda.reset();
        } else {
          showToast(json.message || 'Gagal menyimpan', 'error');
        }
      } catch (err) {
        showToast('Koneksi server gagal', 'error');
      } finally {
        const btn = document.getElementById('btn-submit-agenda');
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Catatan';
        btn.disabled = false;
      }
    });
  }

});
