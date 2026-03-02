# 🌿 Alfa Omega Detox — Recreation

A high-fidelity static-website recreation of the Alfa Omega Detox landing page originally at `https://l1zyqfsjd2.space.minimax.io`.

---

## ✅ Completed Features

### Design & Layout
- **Sticky glassmorphism navbar** with brand name, language toggle, and CTA button (md+)
- **Full-screen hero section** with animated floating product illustration, ingredient tags, concentric orbit rings, blob background animations, and a 3-stat summary bar
- **Scroll-triggered fade-in animations** using IntersectionObserver with staggered delays
- **Fully responsive** — collapses gracefully from desktop → tablet → mobile (860px, 480px breakpoints)
- **Smooth scroll** for all anchor links with navbar offset compensation
- **Scrolled navbar state** (shadow/opacity change on scroll)

### Sections (top → bottom)
| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero** | Headline, subtitle, CTA buttons, 3 stats, animated product visual |
| 2 | **The Grey Zone** | Reality check copy + medical quote blockquote |
| 3 | **Liver Warning Signs** | 8 symptom cards (icon + title + description) |
| 4 | **Kidney Warning Signs** | 6 symptom cards + italic quote blockquote |
| 5 | **The Solution** | Dark-background section with rich quote (bold/italic highlights) |
| 6 | **9 Ingredients** | Gradient ingredient cards with emoji, name, subtitle, bullet points, quote |
| 7 | **Synergistic Formula** | 4 coloured body-system cards (emerald, blue, violet, rose) |
| 8 | **Protocol** | 3 season cards + 4 cleanse-window tip cards |
| 9 | **Results** | 6 outcome cards with gradient thumbnail + text |
| 10 | **Bigger Picture** | Dark section with 2-column liver/kidney lists + highlighted quote |
| 11 | **CTA** | Emerald gradient section with large CTA button |
| 12 | **Order Form** | Full reservation form with includes list, guarantee badge, live total |
| 13 | **Footer** | Disclaimer + brand |

### Functionality
- **Bilingual (EN / ES)** — full translation of all text, symptom cards, ingredients, seasons, form labels, and success states
- **Live order total** — updates dynamically when quantity changes (qty × $98)
- **Order form** → opens native email client to `CesarJames@mail.com` with a pre-filled order confirmation
- **Success state** — shows order summary (name, qty, destination, total) after submission
- **Form validation** — checks required fields + email format before submission
- **XSS protection** — all dynamic content is HTML-escaped via `escHtml()`

---

## 📁 File Structure

```
index.html          Main page (all sections)
css/
  style.css         Full design system (3,200+ lines)
js/
  data.js           All bilingual content data (TRANSLATIONS, INGREDIENTS,
                    LIVER_SYMPTOMS, KIDNEY_SYMPTOMS, SEASONS, PROTO_TIPS,
                    RESULTS, BIG_LIVER_PTS, BIG_KIDNEY_PTS, SYNERGY)
  main.js           Site logic (rendering, animations, form, nav)
reference/          Source files from the original site (not served)
README.md           This file
```

---

## 🔗 Entry Points

| URL / Path | Description |
|-----------|-------------|
| `index.html` | Main landing page |
| `index.html#grey-zone` | Grey Zone section |
| `index.html#liver-section` | Liver Warning Signs |
| `index.html#kidney-section` | Kidney Warning Signs |
| `index.html#solution-section` | The Solution |
| `index.html#ingredients-section` | 9 Ingredients |
| `index.html#synergy-section` | Synergistic Formula |
| `index.html#protocol-section` | Protocol / Seasons |
| `index.html#results-section` | Results |
| `index.html#bigger-section` | Bigger Picture |
| `index.html#cta-section` | CTA Section |
| `index.html#order` | Order Form |

---

## 📦 Data Models

All content lives in `js/data.js` as plain JS objects:

- **`TRANSLATIONS`** — `{ en: {...}, es: {...} }` — all UI strings
- **`INGREDIENTS`** — `{ en: [...], es: [...] }` — 9 ingredient objects with emoji, name, subtitle, bullet points, quote, and colour class
- **`LIVER_SYMPTOMS`** / **`KIDNEY_SYMPTOMS`** — `{ en: [...], es: [...] }` — symptom objects `{ i, t, d }`
- **`SEASONS`** — `{ en: [...], es: [...] }` — 3 season objects `{ icon, label, months, desc }`
- **`PROTO_TIPS`** — `{ en: [...], es: [...] }` — 4 tips as `[icon, title, desc]` tuples
- **`RESULTS`** — `{ en: [...], es: [...] }` — 6 result objects `{ t, d, emoji }`
- **`BIG_LIVER_PTS`** / **`BIG_KIDNEY_PTS`** — `{ en: [...], es: [...] }` — string arrays
- **`SYNERGY`** — `{ en: [...], es: [...] }` — 4 synergy objects `{ icon, title, color, text }`

---

## 🚀 Deployment

To make this site live, click the **Publish tab** — no backend required.

---

## 🔧 Not Yet Implemented / Future Improvements

- Real payment gateway integration (would require backend)
- Product image photography
- Newsletter / email list collection
- Analytics / conversion tracking
- Additional language support beyond EN/ES
