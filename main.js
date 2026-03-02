// ============================================================
// MAIN.JS — Botanical Juice Cleanse
// ============================================================

'use strict';

// ---- State ----
let currentLang = 'en';
let formData    = {};
let formState   = 'idle'; // idle | submitting | success

// ---- Ingredient card colour map ----
const ING_COLORS = {
  'from-emerald-50 to-green-100':  { bg: 'linear-gradient(145deg,#ecfdf5,#d1fae5)',  border: '#a7f3d0', ac: '#047857' },
  'from-lime-50 to-green-100':     { bg: 'linear-gradient(145deg,#f7fee7,#d1fae5)',  border: '#bef264', ac: '#3f6212' },
  'from-yellow-50 to-amber-100':   { bg: 'linear-gradient(145deg,#fefce8,#fef3c7)',  border: '#fde68a', ac: '#92400e' },
  'from-teal-50 to-cyan-100':      { bg: 'linear-gradient(145deg,#f0fdfa,#cffafe)',  border: '#a5f3fc', ac: '#0f766e' },
  'from-green-50 to-emerald-100':  { bg: 'linear-gradient(145deg,#f0fdf4,#d1fae5)',  border: '#6ee7b7', ac: '#065f46' },
  'from-stone-50 to-amber-100':    { bg: 'linear-gradient(145deg,#fafaf9,#fef3c7)',  border: '#d6d3d1', ac: '#78350f' },
  'from-yellow-50 to-orange-100':  { bg: 'linear-gradient(145deg,#fefce8,#ffedd5)',  border: '#fed7aa', ac: '#c2410c' },
  'from-slate-50 to-blue-100':     { bg: 'linear-gradient(145deg,#f8fafc,#dbeafe)',  border: '#bfdbfe', ac: '#1e40af' },
  'from-amber-50 to-yellow-100':   { bg: 'linear-gradient(145deg,#fffbeb,#fefce8)',  border: '#fde68a', ac: '#92400e' },
};

const SYN_COLORS = {
  'bg-emerald-700': '#047857',
  'bg-blue-700':    '#1d4ed8',
  'bg-violet-700':  '#6d28d9',
  'bg-rose-700':    '#be123c',
};

const RESULT_BKGS = [
  'linear-gradient(145deg,#d1fae5,#a7f3d0)',
  'linear-gradient(145deg,#fef3c7,#fde68a)',
  'linear-gradient(145deg,#dbeafe,#bfdbfe)',
  'linear-gradient(145deg,#f0fdf4,#dcfce7)',
  'linear-gradient(145deg,#cffafe,#a5f3fc)',
  'linear-gradient(145deg,#e0e7ff,#c7d2fe)',
];
const RESULT_ACCENTS = [
  '#10b981',
  '#eab308',
  '#3b82f6',
  '#16a34a',
  '#06b6d4',
  '#6366f1',
];
const SEASON_ACCENTS = [
  '#ec4899',
  '#f59e0b',
  '#f97316',
];

// ============================================================
// CORE RENDER
// ============================================================
function renderLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  document.documentElement.lang = lang;

  // Simple [data-key] bindings
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const val = deepGet(t, key);
    if (val !== undefined && !Array.isArray(val)) {
      el.textContent = val;
    }
  });

  // Dynamic sections
  renderSymptoms('liver-symptoms',  LIVER_SYMPTOMS[lang]);
  renderSymptoms('kidney-symptoms', KIDNEY_SYMPTOMS[lang]);
  renderIngredients(INGREDIENTS[lang]);
  renderSynergy(SYNERGY[lang]);
  renderSeasons(SEASONS[lang]);
  renderTips(PROTO_TIPS[lang]);
  renderResults(RESULTS[lang]);
  renderBulletList('big-liver-pts',  BIG_LIVER_PTS[lang]);
  renderBulletList('big-kidney-pts', BIG_KIDNEY_PTS[lang]);
  renderRichQuote('#big-quote',  t.bigQuote,  /<hl>(.*?)<\/hl>/g,  '<em class="big-hl">$1</em>');
  renderRichQuote('#sol-quote',  t.solQuote,
    [/<hl1>(.*?)<\/hl1>/g, /<hl2>(.*?)<\/hl2>/g],
    ['<strong>$1</strong>', '<em>$1</em>']);
  renderIncludesList(t.includesList);
  populateSeasonSelect(t.formSeasonOpts);

  // Active lang button
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );

  // Order total label
  const lbl = document.getElementById('total-label');
  if (lbl) lbl.textContent = t.orderTotalLabel || 'Order Total:';

  // Re-render success if needed
  if (formState === 'success') showSuccess(formData);
}

function deepGet(obj, path) {
  return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

// ============================================================
// SECTION RENDERERS
// ============================================================
function renderSymptoms(id, items) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  const isLiver = id === 'liver-symptoms';

  el.innerHTML = items.map(s => {
    if (isLiver && s.img) {
      return `
        <div class="symptom-card symptom-card-liver">
          <div class="symptom-media">
            <img src="${escAttr(s.img)}" alt="${escAttr(s.alt || s.t)}" loading="lazy" decoding="async" />
            <div class="symptom-media-overlay"></div>
            <span class="symptom-icon-badge" aria-hidden="true">${s.i}</span>
          </div>
          <div class="symptom-liver-body">
            <div class="symptom-title">${escHtml(s.t)}</div>
            <div class="symptom-desc">${escHtml(s.d)}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="symptom-card">
        <span class="symptom-icon" aria-hidden="true">${s.i}</span>
        <div>
          <div class="symptom-title">${escHtml(s.t)}</div>
          <div class="symptom-desc">${escHtml(s.d)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderIngredients(items) {
  const el = document.getElementById('ingredients-list');
  if (!el || !items) return;
  el.innerHTML = items.map(ing => {
    const c = ING_COLORS[ing.bg] || { bg: '#f9fafb', border: '#e5e7eb', ac: '#374151' };
    const pts = ing.pts.map(p =>
      `<li style="--ck:${c.ac};">${escHtml(p)}</li>`
    ).join('');
    return `
      <div class="ingredient-card" style="background:${c.bg};border-color:${c.border};">
        <span class="ingredient-emoji" aria-hidden="true">${ing.e}</span>
        <div class="ingredient-name">${escHtml(ing.name)}</div>
        <div class="ingredient-sub" style="color:${c.ac};">${escHtml(ing.sub)}</div>
        <ul class="ingredient-pts">${pts}</ul>
        <div class="ingredient-quote" style="color:${c.ac};">${escHtml(ing.q)}</div>
      </div>
    `;
  }).join('');
}

function renderSynergy(items) {
  const el = document.getElementById('synergy-list');
  if (!el || !items) return;
  el.innerHTML = items.map(s => {
    const accent = SYN_COLORS[s.color] || '#374151';
    const img = s.img ? `
      <img
        src="${escAttr(s.img)}"
        alt="${escAttr(s.alt || s.title)}"
        loading="lazy"
        decoding="async"
      />` : '';
    return `
      <div class="synergy-card" style="--synergy-accent:${accent};">
        <div class="synergy-media">${img}</div>
        <div class="synergy-content">
          <span class="synergy-icon" aria-hidden="true">${s.icon}</span>
          <div class="synergy-title">${escHtml(s.title)}</div>
          <div class="synergy-text">${escHtml(s.text)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderSeasons(items) {
  const el = document.getElementById('seasons-list');
  if (!el || !items) return;
  el.innerHTML = items.map((s, i) => {
    const accent = SEASON_ACCENTS[i % SEASON_ACCENTS.length];
    const media = s.img
      ? `<img src="${escAttr(s.img)}" alt="${escAttr(s.alt || s.label)}" loading="lazy" decoding="async" />`
      : '<div class="season-media-fallback" aria-hidden="true"></div>';

    return `
      <div class="season-card" style="--season-accent:${accent};">
        <div class="season-media">
          ${media}
          <div class="season-media-overlay"></div>
          <span class="season-icon-badge" aria-hidden="true">${s.icon}</span>
        </div>
        <div class="season-content">
          <div class="season-label">${escHtml(s.label)}</div>
          <div class="season-months">${escHtml(s.months)}</div>
          <div class="season-desc">${escHtml(s.desc)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTips(items) {
  const el = document.getElementById('tips-list');
  if (!el || !items) return;
  el.innerHTML = items.map(([icon, title, desc]) => `
    <div class="tip-card">
      <span class="tip-icon" aria-hidden="true">${icon}</span>
      <div>
        <div class="tip-title">${escHtml(title)}</div>
        <div class="tip-desc">${escHtml(desc)}</div>
      </div>
    </div>
  `).join('');
}

function renderResults(items) {
  const el = document.getElementById('results-list');
  if (!el || !items) return;
  el.innerHTML = items.map((r, i) => {
    const fallbackBg = RESULT_BKGS[i % RESULT_BKGS.length];
    const accent = RESULT_ACCENTS[i % RESULT_ACCENTS.length];
    const media = r.img
      ? `<img src="${escAttr(r.img)}" alt="${escAttr(r.alt || r.t)}" loading="lazy" decoding="async" />`
      : `<div class="result-media-fallback" style="background:${fallbackBg};" aria-hidden="true"></div>`;

    return `
      <div class="result-card" style="--result-accent:${accent};">
        <div class="result-media">
          ${media}
          <div class="result-media-overlay"></div>
          <span class="result-emoji-badge" aria-hidden="true">${r.emoji}</span>
        </div>
        <div class="result-body">
          <div class="result-title">${escHtml(r.t)}</div>
          <div class="result-desc">${escHtml(r.d)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderBulletList(id, items) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map(p => `<li>${escHtml(p)}</li>`).join('');
}

function renderRichQuote(selector, text, patterns, replacements) {
  const el = document.querySelector(selector);
  if (!el || !text) return;
  // Apply regex patterns BEFORE escaping to preserve markup intent,
  // then escape the remaining literal text
  let html = String(text);
  // First, replace the custom tags with placeholders
  const tempTag = '%%RICHQUOTE_PLACEHOLDER_';
  const held = [];
  if (Array.isArray(patterns)) {
    patterns.forEach((pat, i) => {
      html = html.replace(pat, (_, inner) => {
        held.push(replacements[i].replace('$1', escHtml(inner)));
        return tempTag + (held.length - 1) + '%%';
      });
    });
  } else {
    html = html.replace(patterns, (_, inner) => {
      held.push(replacements.replace('$1', escHtml(inner)));
      return tempTag + (held.length - 1) + '%%';
    });
  }
  // Escape the literal parts
  html = escHtml(html);
  // Re-inject the held HTML
  held.forEach((h, i) => {
    html = html.replace(escHtml(tempTag + i + '%%'), h);
  });
  el.innerHTML = html;
}

function renderIncludesList(items) {
  const el = document.getElementById('includes-list');
  if (!el || !items) return;
  el.innerHTML = items.map(item => `<li>${escHtml(item)}</li>`).join('');
}

function populateSeasonSelect(opts) {
  const sel = document.getElementById('season-select');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = `<option value="">— Select —</option>` +
    opts.map(o => `<option value="${escAttr(o)}"${current === o ? ' selected' : ''}>${escHtml(o)}</option>`).join('');
}

// ============================================================
// ORDER TOTAL
// ============================================================
function updateTotal() {
  const qty = parseInt(document.querySelector('[name="qty"]')?.value || '1') || 1;
  const display = document.getElementById('order-total-display');
  if (display) display.textContent = `$${(qty * 98).toFixed(2)}`;
}

// ============================================================
// FORM SUBMISSION
// ============================================================
function submitOrder(e) {
  e.preventDefault();
  if (formState === 'submitting') return;

  const form = e.target;

  // Basic validation
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const address = form.address.value.trim();
  const city    = form.city.value.trim();
  const state   = form.state.value.trim();
  const zip     = form.zip.value.trim();
  const country = form.country.value.trim();

  if (!name || !email || !address || !city || !state || !zip || !country) {
    alert(currentLang === 'es' ? 'Por favor completa todos los campos requeridos.' : 'Please fill in all required fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert(currentLang === 'es' ? 'Por favor ingresa un correo electrónico válido.' : 'Please enter a valid email address.');
    return;
  }

  const data = {};
  new FormData(form).forEach((v, k) => { data[k] = v; });
  formData = data;

  const t = TRANSLATIONS[currentLang];
  const submitBtn  = document.getElementById('submit-btn');
  const submitSpan = submitBtn?.querySelector('span');

  formState = 'submitting';
  if (submitSpan) submitSpan.textContent = t.formSubmitting;
  if (submitBtn)  submitBtn.disabled = true;

  const total = `$${(parseInt(data.qty) * 98).toFixed(2)}`;
  const subject = encodeURIComponent(
    `🌿 New Cleanse Reservation — ${total} — ${data.name}`
  );
  const emailBody = `NEW JUICE CLEANSE ORDER RESERVATION
=====================================
Order Total: ${total}
Quantity: ${data.qty} kit(s) × $98

CUSTOMER DETAILS
-----------------
Name:    ${data.name}
Email:   ${data.email}
Phone:   ${data.phone || 'Not provided'}

SHIPPING ADDRESS
-----------------
${data.address}
${data.city}, ${data.state} ${data.zip}
${data.country}

PREFERENCES
-----------------
Preferred Season: ${data.season || 'Not specified'}
Special Notes:    ${data.notes || 'None'}
Language:         ${currentLang === 'en' ? 'English' : 'Spanish'}
=====================================`;

  window.location.href = `mailto:CesarJames@mail.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`;

  setTimeout(() => {
    formState = 'success';
    showSuccess(data);
  }, 900);
}

function showSuccess(data) {
  const t = TRANSLATIONS[currentLang];
  const formEl    = document.getElementById('order-form-container');
  const successEl = document.getElementById('order-success');
  const total     = `$${(parseInt(data.qty) * 98).toFixed(2)}`;

  if (formEl)    formEl.style.display = 'none';
  if (successEl) {
    successEl.style.display = 'block';
    successEl.innerHTML = `
      <div class="success-card">
        <div class="success-emoji" aria-hidden="true">🎉</div>
        <h3 class="success-title">${escHtml(t.formSuccess)}</h3>
        <p class="success-msg">${escHtml(t.formSuccessMsg)}</p>
        <div class="success-table">
          <div class="success-row">
            <span class="success-row-label">${escHtml(t.customer)}</span>
            <span class="success-row-value">${escHtml(data.name)}</span>
          </div>
          <div class="success-row">
            <span class="success-row-label">${escHtml(t.quantity)}</span>
            <span class="success-row-value">${escHtml(data.qty)} kit${parseInt(data.qty) > 1 ? 's' : ''}</span>
          </div>
          <div class="success-row">
            <span class="success-row-label">${escHtml(t.shippingTo)}</span>
            <span class="success-row-value">${escHtml(data.city)}, ${escHtml(data.country)}</span>
          </div>
          <div class="success-row">
            <span class="success-row-label">${escHtml(t.total)}</span>
            <span class="success-row-value">${total}</span>
          </div>
        </div>
        <p class="success-email-note">${escHtml(t.emailNote)}</p>
      </div>
    `;
  }
}

// ============================================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================================
function initAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: make everything visible
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  // Observe non-hero fade-ins
  document.querySelectorAll('.fade-in:not(#hero .fade-in)').forEach(el => observer.observe(el));
}

// ============================================================
// STICKY NAVBAR
// ============================================================
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const threshold = 80;
  const check = () => nav.classList.toggle('scrolled', window.scrollY > threshold);
  window.addEventListener('scroll', check, { passive: true });
  check();
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// HELPERS
// ============================================================
function escHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escAttr(str) { return escHtml(str); }

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // Language toggle
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => renderLang(btn.dataset.lang));
  });

  // Quantity → total
  const qtySelect = document.getElementById('qty-select');
  if (qtySelect) qtySelect.addEventListener('change', updateTotal);

  // Form submit
  const form = document.getElementById('order-form');
  if (form) form.addEventListener('submit', submitOrder);

  // Initial render
  renderLang('en');
  initAnimations();
  initNavbar();
  initSmoothScroll();
});
