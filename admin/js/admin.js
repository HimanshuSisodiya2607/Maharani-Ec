/* ============================================================
   MAHARANI ADMIN — admin.js
   Luxury Indian Fashion E-commerce Admin Panel
   ============================================================ */

'use strict';

/* ── 1. SIDEBAR COLLAPSE / EXPAND ── */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggle');
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
  });
  // Restore saved state
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }
}

/* ── 2. MOBILE SIDEBAR OVERLAY ── */
function initMobileSidebar() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('hidden');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.add('hidden');
    });
  }
}

/* ── 3. ACTIVE NAV ITEM FROM CURRENT URL ── */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && current.includes(href.replace('../', '').split('/').pop())) {
      link.classList.add('active');
    }
  });
}

/* ── 4. NOTIFICATION DROPDOWN ── */
function initNotifDropdown() {
  const btn      = document.getElementById('notifBtn');
  const dropdown = document.getElementById('notifDropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
    const profileDd = document.getElementById('profileDropdown');
    if (profileDd) profileDd.classList.add('hidden');
  });
}

/* ── 5. PROFILE DROPDOWN ── */
function initProfileDropdown() {
  const btn      = document.getElementById('profileBtn');
  const dropdown = document.getElementById('profileDropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
    const notifDd = document.getElementById('notifDropdown');
    if (notifDd) notifDd.classList.add('hidden');
  });
}

/* ── 6. CLOSE DROPDOWNS ON OUTSIDE CLICK ── */
function initOutsideClickClose() {
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(dd => dd.classList.add('hidden'));
  });
}

/* ── 7. SVG LINE CHART — REVENUE ── */
function renderRevenueChart(containerId, data, labels) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const W = 700, H = 200, padL = 50, padR = 20, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data) * 0.85;
  const range  = maxVal - minVal;

  const xs = data.map((_, i) => padL + (i / (data.length - 1)) * chartW);
  const ys = data.map(v => padT + chartH - ((v - minVal) / range) * chartH);

  // Smooth bezier path
  let pathD = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpX = (xs[i - 1] + xs[i]) / 2;
    pathD += ` C ${cpX} ${ys[i-1]}, ${cpX} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }

  // Fill area path
  const areaD = pathD +
    ` L ${xs[xs.length-1]} ${padT + chartH}` +
    ` L ${xs[0]} ${padT + chartH} Z`;

  // Y axis labels
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(frac => ({
    y: padT + chartH - frac * chartH,
    label: '₹' + Math.round((minVal + frac * range) / 100000) + 'L'
  }));

  const gradId = `revGrad_${containerId}`;

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="revenue-svg">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#d4af37" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      ${yLabels.map(yl => `
        <line x1="${padL}" y1="${yl.y}" x2="${W - padR}" y2="${yl.y}"
              stroke="rgba(212,175,55,0.08)" stroke-width="1"/>
        <text x="${padL - 6}" y="${yl.y + 4}" text-anchor="end"
              fill="rgba(237,232,220,0.35)" font-size="10">${yl.label}</text>
      `).join('')}

      <!-- Area fill -->
      <path d="${areaD}" fill="url(#${gradId})"/>

      <!-- Line -->
      <path d="${pathD}" fill="none" stroke="#d4af37" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Data points -->
      ${xs.map((x, i) => `
        <circle cx="${x}" cy="${ys[i]}" r="4" fill="#d4af37" stroke="#0a0806" stroke-width="2"/>
      `).join('')}

      <!-- X labels -->
      ${xs.map((x, i) => `
        <text x="${x}" y="${padT + chartH + 18}" text-anchor="middle"
              fill="rgba(237,232,220,0.45)" font-size="10">${labels[i]}</text>
      `).join('')}
    </svg>`;

  container.innerHTML = svg;
}

/* ── 8. SVG BAR CHART ── */
function renderBarChart(containerId, data, labels, color) {
  const container = document.getElementById(containerId);
  if (!container) return;

  color = color || '#d4af37';
  const W = 600, H = 200, padL = 50, padR = 20, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barGap  = 12;
  const barW    = (chartW / data.length) - barGap;
  const maxVal  = Math.max(...data);

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(frac => ({
    y:     padT + chartH - frac * chartH,
    label: Math.round(frac * maxVal)
  }));

  const gradId = `barGrad_${containerId}`;

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${color}" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.4"/>
        </linearGradient>
      </defs>

      ${yLabels.map(yl => `
        <line x1="${padL}" y1="${yl.y}" x2="${W - padR}" y2="${yl.y}"
              stroke="rgba(212,175,55,0.08)" stroke-width="1"/>
        <text x="${padL - 6}" y="${yl.y + 4}" text-anchor="end"
              fill="rgba(237,232,220,0.35)" font-size="10">${yl.label}</text>
      `).join('')}

      ${data.map((v, i) => {
        const barH = (v / maxVal) * chartH;
        const x    = padL + i * (barW + barGap);
        const y    = padT + chartH - barH;
        return `
          <rect x="${x}" y="${y}" width="${barW}" height="${barH}"
                fill="url(#${gradId})" rx="3"/>
          <text x="${x + barW / 2}" y="${padT + chartH + 18}" text-anchor="middle"
                fill="rgba(237,232,220,0.45)" font-size="10">${labels[i]}</text>
        `;
      }).join('')}
    </svg>`;

  container.innerHTML = svg;
}

/* ── 9. ANIMATED COUNTER — KPI NUMBERS ── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target   = parseFloat(el.dataset.count);
    const prefix   = el.dataset.prefix   || '';
    const suffix   = el.dataset.suffix   || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;
      el.textContent = prefix + formatNumber(current, decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

function formatNumber(n, decimals) {
  if (decimals > 0) return n.toFixed(decimals);
  if (n >= 10000000) return (n / 10000000).toFixed(2) + 'Cr';
  if (n >= 100000)   return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000)     return Math.round(n).toLocaleString('en-IN');
  return Math.round(n).toString();
}

/* ── 10. ROW CHECKBOX SELECTION ── */
function initTableCheckboxes() {
  const selectAll = document.getElementById('selectAll');
  if (!selectAll) return;

  const rowChecks = document.querySelectorAll('.row-check');

  selectAll.addEventListener('change', () => {
    rowChecks.forEach(cb => { cb.checked = selectAll.checked; });
    updateBulkActions();
  });

  rowChecks.forEach(cb => {
    cb.addEventListener('change', () => {
      const allChecked = [...rowChecks].every(c => c.checked);
      const anyChecked = [...rowChecks].some(c => c.checked);
      selectAll.checked       = allChecked;
      selectAll.indeterminate = anyChecked && !allChecked;
      updateBulkActions();
    });
  });
}

function updateBulkActions() {
  const checked = document.querySelectorAll('.row-check:checked').length;
  const bar = document.getElementById('bulkActionBar');
  if (bar) {
    bar.style.display = checked > 0 ? 'flex' : 'none';
    const countEl = bar.querySelector('.bulk-count');
    if (countEl) countEl.textContent = checked + ' selected';
  }
}

/* ── 11. TAB SWITCHING ── */
function initTabs() {
  document.querySelectorAll('.tab-bar').forEach(tabBar => {
    const tabs    = tabBar.querySelectorAll('.tab-item');
    const targets = tabBar.dataset.targets;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (targets) {
          document.querySelectorAll('.' + targets).forEach(panel => {
            panel.classList.add('hidden');
          });
          const target = document.getElementById(tab.dataset.tab);
          if (target) target.classList.remove('hidden');
        }

        tab.dispatchEvent(new CustomEvent('tabSelected', { bubbles: true, detail: { tab: tab.dataset.tab } }));
      });
    });
  });

  // Settings nav tabs
  document.querySelectorAll('.settings-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden'));
      const target = document.getElementById(item.dataset.panel);
      if (target) target.classList.remove('hidden');
    });
  });
}

/* ── 12. MODAL OPEN / CLOSE ── */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(overlay => {
        closeModal(overlay.id);
      });
    }
  });
}

/* ── 13. TOAST NOTIFICATIONS ── */
function showToast(title, message, type, duration) {
  type     = type     || 'success';
  duration = duration || 3500;

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error:   '✕',
    info:    'i',
    warning: '!'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'i'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-dismiss" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── 14. FORM VALIDATION ── */
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;

    field.classList.remove('error');
    if (errorEl) errorEl.textContent = '';

    if (!field.value.trim()) {
      valid = false;
      field.classList.add('error');
      field.style.borderColor = 'var(--red)';
      if (errorEl) errorEl.textContent = 'This field is required.';
    } else {
      field.style.borderColor = '';
    }

    if (field.type === 'email' && field.value && !field.value.includes('@')) {
      valid = false;
      field.style.borderColor = 'var(--red)';
      if (errorEl) errorEl.textContent = 'Please enter a valid email.';
    }
  });
  return valid;
}

/* ── 15. CLIENT-SIDE TABLE SEARCH / FILTER ── */
function initTableSearch() {
  const searchInput = document.getElementById('tableSearch');
  const table       = document.querySelector('.data-table tbody');
  if (!searchInput || !table) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows  = table.querySelectorAll('tr');
    let visible = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const show = !query || text.includes(query);
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const emptyState = document.getElementById('tableEmpty');
    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  });
}

/* ── 16. CONFIRM DELETE DIALOG ── */
function confirmDelete(message, onConfirm) {
  const modal  = document.getElementById('deleteModal');
  const descEl = modal ? modal.querySelector('.confirm-desc') : null;
  if (descEl) descEl.textContent = message || 'This action cannot be undone.';

  const confirmBtn = modal ? modal.querySelector('#deleteConfirmBtn') : null;
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      closeModal('deleteModal');
      if (typeof onConfirm === 'function') onConfirm();
      showToast('Deleted', 'Item has been deleted successfully.', 'success');
    };
  }
  openModal('deleteModal');
}

/* ── 17. UPLOAD ZONE DRAG AND DROP ── */
function initUploadZones() {
  document.querySelectorAll('.upload-zone').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const files = e.dataTransfer ? e.dataTransfer.files : null;
      if (files) handleFilePreview(zone, files);
    });

    const fileInput = zone.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        handleFilePreview(zone, fileInput.files);
      });
    }
  });
}

function handleFilePreview(zone, files) {
  let grid = zone.querySelector('.upload-preview-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'upload-preview-grid';
    zone.appendChild(grid);
  }

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement('div');
      item.className = 'upload-preview-item';
      item.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}"/>
        <button class="remove-preview" onclick="this.parentElement.remove()">×</button>
      `;
      grid.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

/* ── 18. RESPONSIVE RESIZE HANDLER ── */
function initResizeHandler() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      const sidebar  = document.getElementById('sidebar');
      if (isMobile && sidebar) {
        sidebar.classList.remove('open');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.classList.add('hidden');
      }
    }, 150);
  });
}

/* ── PERIOD TAB SWITCHING FOR CHARTS ── */
function initPeriodTabs() {
  const revenueData = {
    '7d': {
      data:   [320000, 480000, 410000, 560000, 490000, 620000, 580000],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    '30d': {
      data:   [1200000, 1450000, 1380000, 1620000, 1580000, 1750000, 1690000],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
    },
    '90d': {
      data:   [3800000, 4200000, 4600000, 4100000, 4825000, 5100000, 4900000],
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
    }
  };

  document.querySelectorAll('.period-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const period = tab.dataset.period;
      const d = revenueData[period] || revenueData['30d'];
      renderRevenueChart('revenueChart', d.data, d.labels);
    });
  });
}

/* ── DONUT / PIE CHART ── */
function renderDonutChart(containerId, data, labels, colors) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const W = 280, H = 280, cx = 140, cy = 130, r = 90, innerR = 55;
  const total = data.reduce((a, b) => a + b, 0);

  let startAngle = -Math.PI / 2;
  const segments = data.map((v, i) => {
    const angle = (v / total) * 2 * Math.PI;
    const seg = { startAngle, angle, color: colors[i], label: labels[i], value: v };
    startAngle += angle;
    return seg;
  });

  function polarToXY(angle, radius) {
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  function arcPath(seg) {
    const start = polarToXY(seg.startAngle, r);
    const end   = polarToXY(seg.startAngle + seg.angle, r);
    const iStart= polarToXY(seg.startAngle + seg.angle, innerR);
    const iEnd  = polarToXY(seg.startAngle, innerR);
    const large = seg.angle > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y}
            A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}
            L ${iStart.x} ${iStart.y}
            A ${innerR} ${innerR} 0 ${large} 0 ${iEnd.x} ${iEnd.y} Z`;
  }

  const legendItems = data.map((v, i) => {
    const pct = Math.round((v / total) * 100);
    return `<div class="legend-item">
      <div class="legend-dot" style="background:${colors[i]}"></div>
      <span>${labels[i]} (${pct}%)</span>
    </div>`;
  }).join('');

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${segments.map(seg => `
        <path d="${arcPath(seg)}" fill="${seg.color}" opacity="0.85"/>
      `).join('')}
      <text x="${cx}" y="${cy - 6}" text-anchor="middle"
            fill="#ede8dc" font-size="22" font-weight="700">${total.toLocaleString()}</text>
      <text x="${cx}" y="${cy + 14}" text-anchor="middle"
            fill="rgba(237,232,220,0.45)" font-size="11">Total</text>
    </svg>
    <div class="chart-legend" style="justify-content:center">${legendItems}</div>
  `;

  container.innerHTML = svg;
}

/* ── LOGIN PAGE ── */
function initLoginPage() {
  const form    = document.getElementById('loginForm');
  const passEl  = document.getElementById('password');
  const toggleEl= document.getElementById('togglePassword');
  const loginBtn= document.getElementById('loginBtn');

  if (toggleEl && passEl) {
    toggleEl.addEventListener('click', () => {
      const isText = passEl.type === 'text';
      passEl.type  = isText ? 'password' : 'text';
      toggleEl.innerHTML = isText
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email');
      const pass  = document.getElementById('password');

      if (!email || !email.value.trim()) {
        showToast('Error', 'Please enter your email.', 'error');
        return;
      }
      if (!pass || !pass.value.trim()) {
        showToast('Error', 'Please enter your password.', 'error');
        return;
      }

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = `<div class="btn-spinner"></div> Signing In...`;
      }

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1400);
    });
  }
}

/* ── DASHBOARD CHARTS INIT ── */
function initDashboard() {
  renderRevenueChart(
    'revenueChart',
    [2800000, 3400000, 3100000, 3800000, 3600000, 4200000, 4825000],
    ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  );
  initPeriodTabs();
  animateCounters();
}

/* ── ANALYTICS CHARTS INIT ── */
function initAnalytics() {
  animateCounters();

  renderBarChart(
    'monthlyRevenueBar',
    [3800000, 4100000, 3900000, 4500000, 4200000, 4825000, 5100000, 4800000, 5300000, 5600000, 5200000, 5900000],
    ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    '#d4af37'
  );

  renderRevenueChart(
    'ordersTrendChart',
    [85, 102, 95, 118, 110, 130, 124, 142, 136, 155, 148, 163],
    ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  );

  renderDonutChart(
    'categoryDonut',
    [420, 318, 246, 178, 122],
    ['Lehenga', 'Saree', 'Ensemble', 'Dupatta', 'Accessories'],
    ['#d4af37', '#c9840a', '#2e8b57', '#3a7bd5', '#9b59b6']
  );
}

/* ── FILTER DROPDOWN SELECTS ── */
function initFilterSelects() {
  document.querySelectorAll('.filter-select').forEach(sel => {
    sel.addEventListener('change', () => {
      applyTableFilters();
    });
  });
}

function applyTableFilters() {
  // Simple pass-through — in production this would filter from an API
  const table = document.querySelector('.data-table tbody');
  if (!table) return;
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => { row.style.display = ''; });
}

/* ── SETTINGS FORM SAVE ── */
function initSettingsForms() {
  document.querySelectorAll('.settings-save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Settings Saved', 'Your changes have been saved successfully.', 'success');
    });
  });
}

/* ── GLOBAL INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initMobileSidebar();
  initActiveNav();
  initNotifDropdown();
  initProfileDropdown();
  initOutsideClickClose();
  initTableCheckboxes();
  initTabs();
  initModals();
  initTableSearch();
  initUploadZones();
  initResizeHandler();
  initFilterSelects();
  initSettingsForms();

  // Page-specific inits
  const page = window.location.pathname.split('/').pop();

  if (page === 'login.html' || page === '') {
    initLoginPage();
  }

  if (page === 'dashboard.html') {
    initDashboard();
  }

  if (page === 'analytics.html') {
    initAnalytics();
  }

  if (page !== 'login.html') {
    animateCounters();
  }
});

// Expose globals for inline handlers
window.openModal   = openModal;
window.closeModal  = closeModal;
window.showToast   = showToast;
window.confirmDelete = confirmDelete;
