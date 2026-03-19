# Knowledge Hub Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Knowledge Hub from info-card grid + vertical-scroll modal to cover-focused bookshelf grid + horizontal carousel modal with per-page prompts.

**Architecture:** Static site (plain HTML/CSS/JS). All changes are in 4 files: `knowledge.html` (markup), `css/style.css` (styles), `js/app.js` (logic), `data/topics.json` (data). No build tools, no framework.

**Tech Stack:** Vanilla JS, CSS Grid, CSS custom properties, IntersectionObserver for lazy loading.

**Spec:** `docs/superpowers/specs/2026-03-19-knowledge-hub-redesign.md`

---

## Chunk 1: Data Migration + HTML Markup

### Task 1: Migrate topics.json to pages[] format

**Files:**
- Modify: `data/topics.json`

- [ ] **Step 1: Rewrite topics.json with pages[] arrays**

Replace entire file. Each topic gets a `pages` array instead of single `prompt` + `imageCount`. Remove `featured` field.

```json
{
  "topics": [
    {
      "id": "neural-networks-101",
      "title": "Neural Networks 101",
      "tags": ["deep-learning", "fundamentals", "visualization"],
      "date": "2025-11-15",
      "pages": [
        { "image": "img-1.jpg", "prompt": "A luminous neural network diagram floating in deep space, synaptic connections rendered as glowing purple and cyan threads weaving through translucent spherical nodes, each node pulsing with soft bioluminescent light, information cascading as electric ripples through interconnected layers, macro photography aesthetic, dark background with subtle nebula colors, hyper-detailed, 8k resolution, cinematic lighting" },
        { "image": "img-2.jpg", "prompt": "A luminous neural network diagram floating in deep space — alternate angle" },
        { "image": "img-3.jpg", "prompt": "A luminous neural network diagram floating in deep space — detail view" },
        { "image": "img-4.jpg", "prompt": "A luminous neural network diagram floating in deep space — wide shot" },
        { "image": "img-5.jpg", "prompt": "A luminous neural network diagram floating in deep space — macro detail" },
        { "image": "img-6.jpg", "prompt": "A luminous neural network diagram floating in deep space — final composition" }
      ]
    },
    {
      "id": "transformer-architecture",
      "title": "Transformer Architecture",
      "tags": ["transformers", "attention", "architecture"],
      "date": "2025-12-02",
      "pages": [
        { "image": "img-1.jpg", "prompt": "An architectural blueprint of a transformer model visualized as an impossible building, attention heads rendered as gothic stained-glass windows casting multicolored light, positional encodings as spiraling staircases, feed-forward layers as grand halls with infinite depth, surrealist style blending Escher and Zaha Hadid, deep purple and gold palette, volumetric fog, dramatic shadows, ultra-detailed digital art" },
        { "image": "img-2.jpg", "prompt": "Transformer architecture — attention mechanism detail" },
        { "image": "img-3.jpg", "prompt": "Transformer architecture — encoder-decoder overview" },
        { "image": "img-4.jpg", "prompt": "Transformer architecture — positional encoding visualization" },
        { "image": "img-5.jpg", "prompt": "Transformer architecture — multi-head attention" }
      ]
    },
    {
      "id": "diffusion-models",
      "title": "Diffusion Models Explained",
      "tags": ["generative-ai", "diffusion", "image-synthesis"],
      "date": "2025-12-20",
      "pages": [
        { "image": "img-1.jpg", "prompt": "A visual metaphor for diffusion — an oil painting slowly emerging from pure digital noise, pixels crystallizing from chaotic static into a serene landscape with mountains and aurora borealis, the transition visible across the canvas from left (pure noise) to right (perfect clarity), painterly style with visible brushstrokes, vibrant purples and teals, magical realism aesthetic, museum quality" },
        { "image": "img-2.jpg", "prompt": "Diffusion models — forward process noise addition" },
        { "image": "img-3.jpg", "prompt": "Diffusion models — reverse denoising process" },
        { "image": "img-4.jpg", "prompt": "Diffusion models — latent space representation" },
        { "image": "img-5.jpg", "prompt": "Diffusion models — sampling and generation" },
        { "image": "img-6.jpg", "prompt": "Diffusion models — conditional generation with text" },
        { "image": "img-7.jpg", "prompt": "Diffusion models — final comparison of methods" }
      ]
    },
    {
      "id": "reinforcement-learning",
      "title": "Reinforcement Learning Basics",
      "tags": ["reinforcement-learning", "agents", "fundamentals"],
      "date": "2026-01-08",
      "pages": [
        { "image": "img-1.jpg", "prompt": "An agent navigating a neon-lit maze rendered as a glowing circuit board from a top-down isometric view, reward signals depicted as golden sparks and particles, the optimal path highlighted in bright cyan, suboptimal paths fading into shadow, retro-futuristic aesthetic blending Tron and biopunk, deep black background, electric blue and amber color scheme, hyper-detailed pixel art scaled up to 8k" },
        { "image": "img-2.jpg", "prompt": "Reinforcement learning — reward function landscape" },
        { "image": "img-3.jpg", "prompt": "Reinforcement learning — policy gradient visualization" },
        { "image": "img-4.jpg", "prompt": "Reinforcement learning — exploration vs exploitation" }
      ]
    },
    {
      "id": "prompt-engineering",
      "title": "The Art of Prompt Engineering",
      "tags": ["prompting", "llm", "techniques"],
      "date": "2026-01-25",
      "pages": [
        { "image": "img-1.jpg", "prompt": "A master calligrapher in a futuristic studio, writing luminous prompts in the air with a digital brush, each word materializing as holographic 3D objects and scenes — a dragon here, a galaxy there — the studio walls covered in floating text fragments and glowing output images, cyberpunk meets Renaissance aesthetic, warm amber and cool blue contrast, photorealistic rendering with painterly touches" },
        { "image": "img-2.jpg", "prompt": "Prompt engineering — chain of thought visualization" },
        { "image": "img-3.jpg", "prompt": "Prompt engineering — few-shot examples" },
        { "image": "img-4.jpg", "prompt": "Prompt engineering — system prompt architecture" },
        { "image": "img-5.jpg", "prompt": "Prompt engineering — temperature and sampling" },
        { "image": "img-6.jpg", "prompt": "Prompt engineering — prompt chaining" },
        { "image": "img-7.jpg", "prompt": "Prompt engineering — evaluation and iteration" },
        { "image": "img-8.jpg", "prompt": "Prompt engineering — the art of specificity" }
      ]
    },
    {
      "id": "vector-embeddings",
      "title": "Vector Embeddings & Semantic Space",
      "tags": ["embeddings", "nlp", "rag"],
      "date": "2026-02-10",
      "pages": [
        { "image": "img-1.jpg", "prompt": "A three-dimensional semantic space visualization, thousands of glowing word-spheres clustered by meaning, similar concepts orbiting each other in colorful constellations, 'king' and 'queen' connected by shimmering golden vectors, semantic relationships as luminous threads in a cosmic web, deep space background with mathematical notation etched in starlight, data visualization meets space opera, extremely detailed" },
        { "image": "img-2.jpg", "prompt": "Vector embeddings — word2vec arithmetic visualization" },
        { "image": "img-3.jpg", "prompt": "Vector embeddings — dimensionality reduction" },
        { "image": "img-4.jpg", "prompt": "Vector embeddings — similarity search" },
        { "image": "img-5.jpg", "prompt": "Vector embeddings — RAG pipeline overview" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add data/topics.json
git commit -m "feat: migrate topics.json to pages[] format with per-image prompts"
```

---

### Task 2: Update knowledge.html markup

**Files:**
- Modify: `knowledge.html:64-91` (search bar + grid section)

- [ ] **Step 1: Replace search bar with tag filter bar, replace grid-3 with cover-grid, remove sentinel**

In `knowledge.html`, replace the search bar block (lines 65-83), grid container (line 86), and sentinel (line 91).

New markup for the filter + grid section (inside the existing `<div class="container">`):

```html
        <!-- Tag Filter Bar -->
        <div class="filter-bar reveal" id="filter-bar" role="group" aria-label="Filter by tag">
          <!-- Populated by app.js -->
        </div>

        <!-- Cover Grid -->
        <div class="cover-grid" id="topics-grid" role="list" aria-label="Knowledge topics">
          <!-- Populated by app.js -->
        </div>
```

This removes:
- The entire `.search-bar` div (search input + tag area)
- The `grid-3` class (replaced with `cover-grid`)
- The `#load-more-sentinel` div

- [ ] **Step 2: Verify page loads without JS errors**

Open `http://localhost:8080/knowledge.html` — the page will show an empty grid (JS still references old elements). This is expected; we'll fix it in subsequent tasks.

- [ ] **Step 3: Commit**

```bash
git add knowledge.html
git commit -m "feat: update knowledge.html markup for cover grid layout"
```

---

## Chunk 2: CSS — Cover Grid + Carousel Styles

### Task 3: Replace topic-card styles with cover-card styles

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Remove old topic-card, search-bar, gallery styles**

Remove these CSS blocks (identified by comments/selectors):
- Lines 1084-1170: `.topic-card` and all children (`.topic-card__thumb`, `__meta`, `__date`, `__featured`, `__title`, `__tags`, `__count`)
- Lines 1172-1212: `.search-bar`, `.search-bar input`, `.filter-tags`, `.filter-tag`, `.tag--active`
- Lines 1291-1316: `.gallery-grid`, `.gallery-item img`, `.gallery-item--placeholder`
- Lines 1318-1369: `.prompt-section`, `.prompt-section__label`, `.prompt-section__title`, `.prompt-copy`, `.prompt-text`

- [ ] **Step 2: Add cover-grid and cover-card styles**

Add after the `.grid-2` block (~line 779):

```css
/* ── Cover grid (knowledge page — bookshelf layout) ──────── */
.cover-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* ── Filter bar ──────────────────────────────────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: var(--spacing-lg);
}

.filter-bar__btn {
  cursor: pointer;
  border: none;
  padding: 0;
  font-family: var(--font-primary);
  background: none;
}

.filter-bar__btn .tag {
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-bar__btn .tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
}

.tag--active {
  outline: 2px solid var(--color-purple-dark);
  outline-offset: 1px;
}

/* ── Cover card ──────────────────────────────────────────── */
.cover-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.cover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.cover-card:focus-visible {
  outline: 2px solid var(--color-purple-dark);
  outline-offset: 2px;
}

.cover-card__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
  background: var(--bg-secondary);
}

.cover-card__skeleton {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(110deg, var(--bg-secondary) 30%, var(--bg-accent) 50%, var(--bg-secondary) 70%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.cover-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 14px 14px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
}

.cover-card__title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.35;
}

.cover-card__pages {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 2px;
  font-family: var(--font-mono);
}

.cover-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.cover-card:hover .cover-card__tags {
  opacity: 1;
}

.cover-card__tag {
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  font-family: var(--font-mono);
}
```

- [ ] **Step 3: Add carousel modal styles**

Add after the existing `.modal__body` block, replacing the old `.gallery-grid` and `.prompt-section` blocks:

```css
/* ── Carousel (modal) ────────────────────────────────────── */
.carousel {
  display: flex;
  flex-direction: column;
}

.carousel__viewport {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  z-index: 2;
  backdrop-filter: blur(8px);
}

.carousel__arrow:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: var(--color-purple);
  color: var(--color-purple-dark);
}

.carousel__arrow:disabled {
  opacity: 0.2;
  cursor: default;
  pointer-events: none;
}

.carousel__arrow--left  { left: 4px; }
.carousel__arrow--right { right: 4px; }

.carousel__track {
  width: 100%;
  display: flex;
  justify-content: center;
}

.carousel__slide {
  display: none;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
}

.carousel__slide.active {
  display: flex;
}

/* Slide animation */
.carousel__slide.active {
  animation: carousel-fade 0.3s ease;
}

@keyframes carousel-fade {
  from { opacity: 0; transform: translateX(16px); }
  to   { opacity: 1; transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .carousel__slide.active {
    animation: none;
  }
}

.carousel__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--radius-md);
  display: block;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.carousel__img-skeleton {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-md);
  background: linear-gradient(110deg, var(--bg-secondary) 30%, var(--bg-accent) 50%, var(--bg-secondary) 70%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.carousel__img-error {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

/* Prompt box */
.carousel__prompt {
  width: 100%;
  margin-top: 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  position: relative;
}

.carousel__prompt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.carousel__prompt-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-purple-dark);
  font-weight: 700;
}

.carousel__copy-btn {
  font-size: 0.68rem;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  background: rgba(139, 92, 246, 0.08);
  color: var(--color-purple-dark);
  border: 1px solid var(--border-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-primary);
  font-weight: 600;
}

.carousel__copy-btn:hover {
  background: rgba(139, 92, 246, 0.15);
}

.carousel__prompt-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-family: var(--font-mono);
  max-height: 80px;
  overflow-y: auto;
  word-break: break-word;
}

/* Footer: dots + counter */
.carousel__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
}

.carousel__dots {
  display: flex;
  gap: 6px;
}

.carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-light);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.carousel__dot.active {
  background: var(--color-purple-dark);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
  width: 24px;
  border-radius: 4px;
}

.carousel__counter {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
}

/* Tags row in modal */
.carousel__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0 var(--spacing-lg);
}

/* Keyboard hint */
.carousel__hint {
  text-align: center;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.carousel__hint kbd {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-secondary);
}
```

- [ ] **Step 4: Update responsive styles for cover grid + carousel**

Add to the `@media (max-width: 768px)` block:

```css
  .cover-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .carousel__arrow {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .carousel__slide {
    max-width: 100%;
  }

  .modal {
    max-height: 95vh;
    border-radius: var(--radius-md);
  }
```

- [ ] **Step 5: Verify styles render correctly**

Open `http://localhost:8080/knowledge.html` — verify no CSS errors in console. The grid will still be empty (JS not updated yet).

- [ ] **Step 6: Commit**

```bash
git add css/style.css
git commit -m "feat: replace topic-card/gallery CSS with cover-grid and carousel styles"
```

---

## Chunk 3: JavaScript — Topics Module Rewrite

### Task 4: Rewrite Topics module for cover cards + tag filter

**Files:**
- Modify: `js/app.js` — `Topics` object (~lines 354-517), `Search` object (~lines 753-806)

- [ ] **Step 1: Add new i18n keys**

In `js/app.js`, add these keys to the `en` translations object (inside `I18n.translations.en`, after the existing knowledge page keys around line 121):

```js
        'knowledge.filter.all': 'All',
        'knowledge.pages': 'pages',
        'carousel.prompt.label': 'PROMPT',
        'carousel.prompt.copy': 'Copy',
        'carousel.prompt.copied': 'Copied!',
        'carousel.hint': '← → arrow keys or swipe',
```

And to the `zh` translations (inside `I18n.translations.zh`, after line 197):

```js
        'knowledge.filter.all': '全部',
        'knowledge.pages': '页',
        'carousel.prompt.label': '提示词',
        'carousel.prompt.copy': '复制',
        'carousel.prompt.copied': '已复制!',
        'carousel.hint': '← → 方向键或滑动',
```

- [ ] **Step 2: Add helper to get pages from topic (backward compat)**

Add this helper function in the `Helpers` section (~line 810):

```js
  function getPages(topic) {
    return topic.pages || Array.from({ length: topic.imageCount || 0 }, (_, i) => ({
      image: `img-${i + 1}.jpg`,
      prompt: topic.prompt || ''
    }));
  }
```

- [ ] **Step 3: Rewrite Topics.buildTagList() with "Show All" button**

Replace the existing `buildTagList()` method:

```js
    buildTagList() {
      const barEl = document.getElementById('filter-bar');
      if (!barEl) return;
      const tagCounts = {};
      state.allTopics.forEach(t => {
        (t.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
      const filterColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];

      // "Show All" button
      let html = `<button class="filter-bar__btn" data-tag="__all" aria-pressed="true">
        <span class="tag tag--active">${I18n.t('knowledge.filter.all')}</span>
      </button>`;

      html += sorted.map(([tag], i) => `
        <button class="filter-bar__btn" data-tag="${tag}" aria-pressed="false">
          <span class="tag ${filterColors[i % filterColors.length]}">${tag}</span>
        </button>
      `).join('');

      barEl.innerHTML = html;

      barEl.querySelectorAll('.filter-bar__btn').forEach(btn => {
        btn.addEventListener('click', () => this.onTagToggle(btn));
      });
    },
```

- [ ] **Step 4: Add onTagToggle method to Topics**

Add to the `Topics` object (replaces the old `Search.onTagToggle`):

```js
    onTagToggle(btn) {
      const tag = btn.dataset.tag;
      const barEl = document.getElementById('filter-bar');

      if (tag === '__all') {
        // Clear all filters
        state.activeTags.clear();
        barEl.querySelectorAll('.filter-bar__btn').forEach(b => {
          const span = b.querySelector('.tag');
          span.classList.remove('tag--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.querySelector('.tag').classList.add('tag--active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        // Deactivate "All" button
        const allBtn = barEl.querySelector('[data-tag="__all"]');
        if (allBtn) {
          allBtn.querySelector('.tag').classList.remove('tag--active');
          allBtn.setAttribute('aria-pressed', 'false');
        }

        if (state.activeTags.has(tag)) {
          state.activeTags.delete(tag);
          btn.querySelector('.tag').classList.remove('tag--active');
          btn.setAttribute('aria-pressed', 'false');
        } else {
          state.activeTags.add(tag);
          btn.querySelector('.tag').classList.add('tag--active');
          btn.setAttribute('aria-pressed', 'true');
        }

        // If no tags selected, re-activate "All"
        if (state.activeTags.size === 0 && allBtn) {
          allBtn.querySelector('.tag').classList.add('tag--active');
          allBtn.setAttribute('aria-pressed', 'true');
        }
      }

      this.applyFilters();
    },

    applyFilters() {
      const tags = state.activeTags;
      state.filteredTopics = state.allTopics.filter(topic => {
        if (tags.size === 0) return true;
        const topicTags = new Set(topic.tags || []);
        for (const t of tags) {
          if (!topicTags.has(t)) return false;
        }
        return true;
      });
      this.renderGrid();
    },
```

- [ ] **Step 5: Rewrite Topics.renderCard() for cover cards**

Replace the existing `renderCard(topic)` method:

```js
    renderCard(topic) {
      const article = document.createElement('article');
      article.className = 'cover-card reveal';
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'button');
      article.setAttribute('aria-label', `Open ${topic.title}`);
      article.dataset.topicId = topic.id;

      const pages = getPages(topic);
      const coverSrc = pages.length > 0
        ? `images/topics/${topic.id}/${pages[0].image}`
        : null;
      const pageCount = pages.length;
      const pagesLabel = I18n.t('knowledge.pages');

      const tagsHtml = (topic.tags || [])
        .map(t => `<span class="cover-card__tag">${t}</span>`)
        .join('');

      article.innerHTML = `
        ${coverSrc
          ? `<img class="cover-card__img" data-src="${coverSrc}" src="" alt="${escHtml(topic.title)}">`
          : `<div class="cover-card__skeleton"></div>`}
        <div class="cover-card__overlay">
          <div class="cover-card__title">${escHtml(topic.title)}</div>
          <div class="cover-card__pages">${pageCount} ${pagesLabel}</div>
          <div class="cover-card__tags">${tagsHtml}</div>
        </div>
      `;

      // Lazy-load cover image
      const img = article.querySelector('img[data-src]');
      if (img) {
        img.addEventListener('error', () => {
          img.outerHTML = `<div class="cover-card__skeleton"></div>`;
        });
        LazyLoad.observe(img);
      }

      // Click / keyboard open modal
      const openModal = () => Modal.open(topic.id);
      article.addEventListener('click', openModal);
      article.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });

      requestAnimationFrame(() => Animate.init());
      return article;
    },
```

- [ ] **Step 6: Simplify Topics.init() — remove infinite scroll**

Replace `Topics.init()`:

```js
    async init() {
      this.gridEl = document.getElementById('topics-grid');
      if (!this.gridEl) return;

      this.gridEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

      try {
        const data = await Data.fetch(config.topicsPath);
        state.allTopics      = data.topics || [];
        state.filteredTopics = [...state.allTopics];

        this.buildTagList();
        this.renderGrid();
      } catch (err) {
        console.error(err);
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">Could not load topics</p>
            <p>${err.message}</p>
          </div>`;
      }
    },

    renderGrid() {
      this.gridEl.innerHTML = '';
      if (state.filteredTopics.length === 0) {
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">No topics found</p>
            <p>Try adjusting your filters.</p>
          </div>`;
        return;
      }
      state.filteredTopics.forEach(topic => {
        this.gridEl.appendChild(this.renderCard(topic));
      });
    },
```

- [ ] **Step 7: Remove old Topics properties and methods**

Delete these from the Topics object:
- `sentinelEl` property
- `ioSentinel` property
- `allTagsEl` property
- `renderBatch()` method
- `initSentinel()` method
- `placeholderSvg()` method

- [ ] **Step 8: Remove Search module entirely**

Delete the entire `Search` object (lines ~753-806) and remove `Search.init()` from the `boot()` function.

- [ ] **Step 9: Verify cover grid renders**

Open `http://localhost:8080/knowledge.html` — should see cover cards in grid, tag filter bar, click should still open old modal (we'll rewrite modal next).

- [ ] **Step 10: Commit**

```bash
git add js/app.js
git commit -m "feat: rewrite Topics module for cover grid with tag filter"
```

---

## Chunk 4: JavaScript — Carousel Modal Rewrite

### Task 5: Rewrite Modal module for carousel

**Files:**
- Modify: `js/app.js` — `Modal` object (~lines 624-748)

- [ ] **Step 1: Add carousel state to the Modal object**

Add these properties at the top of the Modal object:

```js
    overlayEl: null,
    modalEl:   null,
    prevFocus: null,
    currentSlide: 0,
    totalSlides: 0,
    currentPages: [],
    currentTopicId: null,
    touchStartX: 0,
    touchStartY: 0,
```

- [ ] **Step 2: Rewrite Modal.open()**

```js
    open(topicId) {
      const topic = state.allTopics.find(t => t.id === topicId);
      if (!topic || !this.overlayEl) return;

      this.prevFocus = document.activeElement;
      document.body.style.overflow = 'hidden';

      this.currentPages = getPages(topic);
      this.totalSlides = this.currentPages.length;
      this.currentSlide = 0;

      this.renderContent(topic);
      this.overlayEl.classList.add('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'false');

      // Preload first two images
      if (this.currentPages.length > 0) this.preloadImage(topic.id, 0);
      if (this.currentPages.length > 1) this.preloadImage(topic.id, 1);

      const closeBtn = this.overlayEl.querySelector('.modal__close');
      if (closeBtn) closeBtn.focus();
    },
```

- [ ] **Step 3: Add preloadImage helper**

```js
    preloadImage(topicId, index) {
      if (index < 0 || index >= this.currentPages.length) return;
      const img = new Image();
      img.src = `images/topics/${topicId}/${this.currentPages[index].image}`;
    },
```

- [ ] **Step 4: Rewrite Modal.renderContent()**

```js
    renderContent(topic) {
      const titleEl = this.overlayEl.querySelector('.modal__title');
      const bodyEl  = this.overlayEl.querySelector('.modal__body');
      if (titleEl) titleEl.textContent = topic.title;

      const pages = this.currentPages;
      const tagColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];
      const tagsHtml = (topic.tags || [])
        .map((t, i) => `<span class="tag ${tagColors[i % tagColors.length]}">${t}</span>`)
        .join('');

      // Build slides
      const slidesHtml = pages.map((page, i) => `
        <div class="carousel__slide${i === 0 ? ' active' : ''}" data-index="${i}">
          <div class="carousel__img-skeleton" id="carousel-skeleton-${i}"></div>
          <img class="carousel__img" src="" data-src="images/topics/${topic.id}/${page.image}"
               alt="${escHtml(topic.title)} page ${i + 1}"
               style="display:none;"
               id="carousel-img-${i}">
          <div class="carousel__prompt">
            <div class="carousel__prompt-header">
              <span class="carousel__prompt-label">${I18n.t('carousel.prompt.label')}</span>
              <button class="carousel__copy-btn" data-prompt-index="${i}">${I18n.t('carousel.prompt.copy')}</button>
            </div>
            <div class="carousel__prompt-text">${escHtml(page.prompt)}</div>
          </div>
        </div>
      `).join('');

      // Build dots
      const dotsHtml = pages.map((_, i) =>
        `<button class="carousel__dot${i === 0 ? ' active' : ''}" data-dot="${i}" aria-label="Go to page ${i + 1}"></button>`
      ).join('');

      bodyEl.innerHTML = `
        <div class="carousel">
          <div class="carousel__viewport">
            <button class="carousel__arrow carousel__arrow--left" aria-label="Previous page">‹</button>
            <div class="carousel__track">${slidesHtml}</div>
            <button class="carousel__arrow carousel__arrow--right" aria-label="Next page">›</button>
          </div>
          <div class="carousel__footer">
            <div class="carousel__dots">${dotsHtml}</div>
            <span class="carousel__counter">1 / ${pages.length}</span>
          </div>
        </div>
        <div class="carousel__tags">${tagsHtml}</div>
        <div class="carousel__hint">
          <kbd>←</kbd> <kbd>→</kbd> ${I18n.t('carousel.hint')}
        </div>
      `;

      // Load first image
      this.loadSlideImage(0);

      // Wire navigation
      this.wireCarousel(topic.id);

      if (this.modalEl) this.modalEl.scrollTop = 0;
    },
```

- [ ] **Step 5: Add loadSlideImage method**

```js
    loadSlideImage(index) {
      const img = document.getElementById(`carousel-img-${index}`);
      const skeleton = document.getElementById(`carousel-skeleton-${index}`);
      if (!img || !img.dataset.src) return;

      img.onload = () => {
        img.style.display = 'block';
        if (skeleton) skeleton.style.display = 'none';
      };
      img.onerror = () => {
        if (skeleton) {
          skeleton.className = 'carousel__img-error';
          skeleton.textContent = this.currentPages[index]?.image || 'image';
        }
        img.style.display = 'none';
      };
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    },
```

- [ ] **Step 6: Add wireCarousel and goToSlide methods**

```js
    wireCarousel(topicId) {
      const bodyEl = this.overlayEl.querySelector('.modal__body');

      // Arrows
      const prevBtn = bodyEl.querySelector('.carousel__arrow--left');
      const nextBtn = bodyEl.querySelector('.carousel__arrow--right');
      prevBtn.addEventListener('click', () => this.goToSlide(this.currentSlide - 1, topicId));
      nextBtn.addEventListener('click', () => this.goToSlide(this.currentSlide + 1, topicId));

      // Dots
      bodyEl.querySelectorAll('.carousel__dot').forEach(dot => {
        dot.addEventListener('click', () => this.goToSlide(Number(dot.dataset.dot), topicId));
      });

      // Copy buttons
      bodyEl.querySelectorAll('.carousel__copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.promptIndex);
          const text = this.currentPages[idx]?.prompt || '';
          this.copyToClipboard(text, btn);
        });
      });

      // Touch swipe
      const viewport = bodyEl.querySelector('.carousel__viewport');
      viewport.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }, { passive: true });
      viewport.addEventListener('touchend', (e) => {
        const dx = this.touchStartX - e.changedTouches[0].clientX;
        const dy = this.touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx > 0) this.goToSlide(this.currentSlide + 1, topicId);
          else        this.goToSlide(this.currentSlide - 1, topicId);
        }
      }, { passive: true });

      // Update arrow states
      this.updateArrows();
    },

    goToSlide(index, topicId) {
      if (index < 0 || index >= this.totalSlides) return;

      const bodyEl = this.overlayEl.querySelector('.modal__body');
      const slides = bodyEl.querySelectorAll('.carousel__slide');
      const dots   = bodyEl.querySelectorAll('.carousel__dot');

      slides[this.currentSlide].classList.remove('active');
      dots[this.currentSlide].classList.remove('active');

      this.currentSlide = index;

      slides[this.currentSlide].classList.add('active');
      dots[this.currentSlide].classList.add('active');

      // Load current + preload adjacent
      this.loadSlideImage(index);
      this.preloadImage(topicId, index + 1);
      this.preloadImage(topicId, index - 1);

      // Update counter
      const counter = bodyEl.querySelector('.carousel__counter');
      if (counter) counter.textContent = `${index + 1} / ${this.totalSlides}`;

      this.updateArrows();
    },

    updateArrows() {
      const bodyEl = this.overlayEl.querySelector('.modal__body');
      if (!bodyEl) return;
      const prev = bodyEl.querySelector('.carousel__arrow--left');
      const next = bodyEl.querySelector('.carousel__arrow--right');
      if (prev) prev.disabled = this.currentSlide === 0;
      if (next) next.disabled = this.currentSlide === this.totalSlides - 1;
    },
```

- [ ] **Step 7: Add copyToClipboard with fallback**

```js
    copyToClipboard(text, btn) {
      const onSuccess = () => {
        const origText = btn.textContent;
        btn.textContent = I18n.t('carousel.prompt.copied');
        setTimeout(() => { btn.textContent = origText; }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
          this.fallbackCopy(text, btn, onSuccess);
        });
      } else {
        this.fallbackCopy(text, btn, onSuccess);
      }
    },

    fallbackCopy(text, btn, onSuccess) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        onSuccess();
      } catch (_) {}
      document.body.removeChild(ta);
    },
```

- [ ] **Step 8: Update Modal.init() to add keyboard handler for carousel**

In the existing `Modal.init()`, update the keydown handler to include arrow keys:

```js
    init() {
      this.overlayEl = document.getElementById('modal-overlay');
      if (!this.overlayEl) return;
      this.modalEl = this.overlayEl.querySelector('.modal');

      this.overlayEl.addEventListener('click', (e) => {
        if (e.target === this.overlayEl) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (!this.overlayEl.classList.contains('is-open')) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'Tab') this.trapFocus(e);
        if (e.key === 'ArrowLeft')  { e.preventDefault(); this.goToSlide(this.currentSlide - 1, this.currentTopicId); }
        if (e.key === 'ArrowRight') { e.preventDefault(); this.goToSlide(this.currentSlide + 1, this.currentTopicId); }
      });

      const closeBtn = this.overlayEl.querySelector('.modal__close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    },
```

Note: also add `currentTopicId` property and set it in `open()`:

In `Modal.open()`, add after `this.currentSlide = 0;`:
```js
      this.currentTopicId = topic.id;
```

- [ ] **Step 9: Remove old renderGallery method**

Delete `Modal.renderGallery(topic)` — it's been replaced by the carousel in `renderContent`.

- [ ] **Step 10: Update boot() function**

In the `boot()` function, remove the `Search.init()` call. The boot block for knowledge page should be:

```js
    if (page === 'knowledge') {
      Modal.init();
      Topics.init();
    }
```

- [ ] **Step 11: Verify full flow works**

Open `http://localhost:8080/knowledge.html`:
1. Cover grid displays with 3:4 cards
2. Tags filter bar with "All" button works
3. Clicking a cover opens carousel modal
4. Left/right arrows navigate slides
5. Keyboard ← → works
6. Dots are clickable
7. Copy button works
8. ESC closes modal
9. Language toggle works

- [ ] **Step 12: Commit**

```bash
git add js/app.js
git commit -m "feat: rewrite Modal for horizontal carousel with per-page prompts"
```

---

## Chunk 5: Cleanup

### Task 6: Remove design preview artifacts

**Files:**
- Remove: `preview-options.html`, `preview-reader.html`, `preview-carousel.html`

- [ ] **Step 1: Delete preview files**

```bash
rm preview-options.html preview-reader.html preview-carousel.html
```

- [ ] **Step 2: Final visual verification**

Open all pages and verify nothing is broken:
- `http://localhost:8080/index.html` — home page unchanged
- `http://localhost:8080/projects.html` — projects page unchanged
- `http://localhost:8080/knowledge.html` — new cover grid + carousel modal
- Test mobile viewport (Chrome DevTools responsive mode)
- Test both EN and ZH languages

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove design preview artifacts"
```
