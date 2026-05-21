/**
 * api.js — CUSB Frontend ↔ Backend Bridge
 * Place in: frontend/api.js
 * Load in index.html BEFORE main.js:
 *   <script src="config.js"></script>
 *   <script src="api.js"></script>
 *   <script defer src="main.js"></script>
 */

const API_BASE = window.APP_CONFIG?.apiBase || 'http://localhost:5000/api';

// Helper to construct asset URLs (images, PDFs)
function getAssetUrl(path) {
  const uploadBase = window.APP_CONFIG?.uploadBase || 'http://localhost:5000';
  return uploadBase + path;
}

// ─── Generic fetch wrapper ───────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('cusb_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Don't set Content-Type for FormData (multipart)
  if (options.body instanceof FormData) delete headers['Content-Type'];

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  } catch (err) {
    console.error(`[API] ${endpoint}:`, err.message);
    throw err;
  }
}

// ─── ANNOUNCEMENTS (ticker bar) ──────────────────────────────────
const CusbAPI = {

  announcements: {
    getAll: () => apiFetch('/announcements'),
  },

  notices: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/notices?${q}`);
    },
    getById: (id) => apiFetch(`/notices/${id}`),
  },

  events: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/events?${q}`);
    },
  },

  faculty: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/faculty?${q}`);
    },
  },

  gallery: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/gallery?${q}`);
    },
  },

  homepage: {
    getAll: () => apiFetch('/homepage'),
    getSection: (section) => apiFetch(`/homepage/${section}`),
  },

  contact: {
    getAll: () => apiFetch('/contact'),
  },
};

// ─── DYNAMIC TICKER ──────────────────────────────────────────────
async function loadTicker() {
  try {
    const { data } = await CusbAPI.announcements.getAll();
    if (!data || !data.length) return;

    const track = document.querySelector('.ticker-track');
    if (!track) return;

    const items = [...data, ...data]; // duplicate for seamless loop
    track.innerHTML = items.map(a =>
      `<span class="ticker-item">
        <span class="ticker-dot"></span>
        ${a.link ? `<a href="${a.link}" style="color:inherit;text-decoration:none;">${a.text}</a>` : a.text}
      </span>`
    ).join('');
  } catch (e) {
    // fallback: keep static HTML already in index.html
  }
}

// ─── DYNAMIC NOTICES ─────────────────────────────────────────────
async function loadNotices() {
  try {
    const { data } = await CusbAPI.notices.getAll({ limit: 10 });
    if (!data || !data.length) return;

    // Target: the notices list inside the notices modal (#noticesModal)
    const container = document.querySelector('#noticesModal .notices-list, #noticesModal .modal-list, .notices-dynamic-list');
    if (!container) return;

    container.innerHTML = data.map(n => `
      <div class="notice-item${n.isUrgent ? ' urgent' : ''}" data-id="${n._id}">
        <div class="notice-meta">
          <span class="notice-cat">${n.category}</span>
          <span class="notice-date">${new Date(n.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
          ${n.isUrgent ? '<span class="notice-urgent-badge">🔴 Urgent</span>' : ''}
        </div>
        <div class="notice-title">${n.title}</div>
        ${n.content ? `<div class="notice-content">${n.content}</div>` : ''}
        ${n.pdfUrl ? `<a class="notice-pdf-link" href="${getAssetUrl(n.pdfUrl)}" target="_blank">📄 Download PDF</a>` : ''}
      </div>
    `).join('');
  } catch (e) { /* keep static fallback */ }
}

// ─── DYNAMIC EVENTS ──────────────────────────────────────────────
async function loadEvents() {
  try {
    const { data } = await CusbAPI.events.getAll({ upcoming: 'true', limit: 6 });
    if (!data || !data.length) return;

    const container = document.querySelector('.events-dynamic-list, #eventsGrid, .upcoming-events-list');
    if (!container) return;

    container.innerHTML = data.map(ev => `
      <div class="event-card-dynamic">
        ${ev.imageUrl ? `<img src="${getAssetUrl(ev.imageUrl)}" alt="${ev.title}" class="event-img">` : ''}
        <div class="event-body">
          <span class="event-cat">${ev.category}</span>
          <div class="event-title">${ev.title}</div>
          <div class="event-date">📅 ${new Date(ev.date).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</div>
          ${ev.venue ? `<div class="event-venue">📍 ${ev.venue}</div>` : ''}
          ${ev.description ? `<div class="event-desc">${ev.description}</div>` : ''}
          ${ev.registrationLink ? `<a href="${ev.registrationLink}" target="_blank" class="event-reg-btn">Register →</a>` : ''}
        </div>
      </div>
    `).join('');
  } catch (e) { /* keep static */ }
}

// ─── INIT on DOM ready ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadTicker();
  loadNotices();
  loadEvents();
});

window.CusbAPI = CusbAPI;

// ─── PATCH: openInfoModal for 'notices' and 'upcoming-events' ────
// Waits for main.js to define openInfoModal, then wraps it
window.addEventListener('load', () => {
  const _orig = window.openInfoModal;
  if (!_orig) return;

  window.openInfoModal = async function(id) {
    if (id === 'notices') {
      try {
        const { data } = await CusbAPI.notices.getAll({ limit: 15 });
        if (data && data.length) {
          // Inject dynamic list into INFO object before calling original
          if (window.INFO && window.INFO['notices']) {
            window.INFO['notices'].list = data.map(n => {
              const date = new Date(n.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'});
              const urgent = n.isUrgent ? '🔴 ' : '📋 ';
              const pdf = n.pdfUrl ? ` · <a href="${getAssetUrl(n.pdfUrl)}" target="_blank" style="color:#c8960c">PDF</a>` : '';
              return `${urgent}[${date}] ${n.title}${pdf}`;
            });
          }
        }
      } catch(e) { /* fallback to static */ }
    }

    if (id === 'upcoming-events') {
      try {
        const { data } = await CusbAPI.events.getAll({ upcoming: 'true', limit: 10 });
        if (data && data.length) {
          if (window.INFO && window.INFO['upcoming-events']) {
            window.INFO['upcoming-events'].list = data.map(ev => {
              const date = new Date(ev.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'});
              return `📅 ${date} — ${ev.title}${ev.venue ? ' · '+ev.venue : ''}`;
            });
          }
        }
      } catch(e) { /* fallback */ }
    }

    _orig(id);
  };
});
