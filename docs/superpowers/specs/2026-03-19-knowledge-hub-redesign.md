# Knowledge Hub Redesign — Cover Grid + Carousel Modal

## Overview

Redesign the Knowledge Hub page from an info-card grid with vertical-scroll modal to a cover-focused bookshelf grid with horizontal carousel modal. Each topic is a comic-style post with 7-8 pages of 3:4 AI-generated images, each with its own generation prompt.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Grid style | Cover Grid (bookshelf) | Elegant, minimal, design-forward — user preference |
| Reading experience | Modal with horizontal carousel | Stays in context, swipe-friendly for comic reading |
| Search | Removed | Unnecessary with small content set |
| Filtering | Tag buttons only | Lightweight, visually clean |
| Data structure | Per-page prompts | Each comic page has its own generation prompt |
| Featured badge | Removed | Clean cover aesthetic, no visual clutter |
| Infinite scroll | Removed | Unnecessary with small content set, render all at once |

## Grid Layout

### Cover Cards
- **Aspect ratio**: 3:4 (portrait, matches comic page format)
- **Grid container**: Replace `.grid-3` with `.cover-grid` using `repeat(auto-fill, minmax(200px, 1fr))` with ~20px gap
- **Card content**: Full-bleed cover image (first page of comic as thumbnail)
- **Cover image source**: `pages[0].image` (new format) or `img-1.jpg` (legacy fallback)
- **Page count derivation**: `pages.length` (new format) or `imageCount` (legacy fallback)
- **Overlay**: Bottom gradient with title + page count (e.g. "8 pages"), always visible
- **Hover state**: Card lifts (`translateY(-6px)`), shadow deepens, tags fade in
- **Tags**: Hidden by default, appear on hover with `opacity` transition

### Tag Filter Bar
- Positioned above the grid, below the page header
- Horizontal row of tag buttons extracted from all topics
- Includes a "Show All" / "全部" button as the first item to clear all filters
- Styled consistently with existing site tag palette (`tag--cobalt`, `tag--viridian`, `tag--violet`, `tag--ochre`)
- Active state: filled background, `aria-pressed="true"`
- AND logic: selecting multiple tags narrows results
- No search input

## Carousel Modal

### Trigger
- Click on any cover card opens modal
- Keyboard: Enter/Space on focused card

### Modal Structure
```
┌─────────────────────────────────┐
│ Title                       [✕] │  ← header
├─────────────────────────────────┤
│                                 │
│  [‹]   ┌──────────────┐   [›]  │  ← carousel viewport
│         │              │        │
│         │   3:4 image  │        │
│         │              │        │
│         └──────────────┘        │
│         ┌──────────────┐        │
│         │ PROMPT       │ [Copy] │  ← prompt box
│         │ prompt text… │        │
│         └──────────────┘        │
│                                 │
│        ● ━━ ● ● ● ● ● ●       │  ← dots + counter
│        deep-learning  fundamentals│  ← tags
│     ← → arrow keys or swipe    │  ← hint
└─────────────────────────────────┘
```

### Navigation
- **Linear (not circular)**: Navigation stops at first and last page; arrow buttons disable at boundaries
- **Left/right arrow buttons**: Circular buttons on either side of image, disabled at first/last
- **Keyboard**: ← → arrow keys
- **Touch**: Swipe left/right; require predominantly horizontal gesture (deltaX > deltaY and deltaX > 50px) to avoid conflicts with vertical scroll of prompt text
- **Dots**: Clickable, active dot is elongated pill shape
- **Counter**: "3 / 8" format, tabular-nums

### Animation
- Slide transition: `fadeSlide` (opacity + translateX), ~300ms ease
- Respect `prefers-reduced-motion`: disable slide animation, use instant switch

### Image Loading
- **On modal open**: Load current image (page 0) + preload adjacent image (page 1)
- **On navigation**: Preload N+1 (or N-1 when going backward)
- **Loading state**: Show skeleton placeholder (pulsing gradient, same 3:4 ratio) while image loads
- **Error handling**: On image load failure, show a fallback placeholder with the filename text (e.g. "img-3.jpg") — same approach as current `onerror` handler but styled as a card

### Prompt Display
- Below the image, inside a subtle card (`rgba` background + border)
- Label: "PROMPT" in uppercase, accent color
- Copy button: top-right of prompt card
- Font: monospace (`JetBrains Mono`)
- Copy fallback: Use `navigator.clipboard.writeText()` with fallback to legacy `document.execCommand('copy')` for insecure contexts

### Modal Scroll Behavior
- Body scroll locked while modal is open
- Modal content does NOT scroll vertically — the image + prompt fit within the viewport
- If prompt text is long, the prompt box gets a `max-height` with `overflow-y: auto`

### Other
- Tags displayed below carousel
- Keyboard hint at bottom
- ESC or click backdrop to close
- Focus trap for accessibility

## Data Structure

### Current `topics.json`
```json
{
  "id": "neural-networks-101",
  "title": "Neural Networks 101",
  "prompt": "single prompt string",
  "tags": ["deep-learning", "fundamentals"],
  "imageCount": 6,
  "date": "2025-11-15",
  "featured": true
}
```

### New `topics.json`
```json
{
  "id": "neural-networks-101",
  "title": "Neural Networks 101",
  "tags": ["deep-learning", "fundamentals", "visualization"],
  "date": "2025-11-15",
  "pages": [
    { "image": "img-1.jpg", "prompt": "A luminous neural network diagram..." },
    { "image": "img-2.jpg", "prompt": "Close-up of a single neuron activating..." },
    { "image": "img-3.jpg", "prompt": "Backpropagation visualized as waves..." }
  ]
}
```

- `prompt` (single string), `imageCount`, and `featured` fields removed
- `pages` array added: each entry has `image` filename and `prompt` string
- Image path resolved as `images/topics/{id}/{image}`
- Cover image = `pages[0].image`

### Backward Compatibility
If `pages` is absent (legacy format), construct a synthetic pages array:
```js
const pages = topic.pages || Array.from({ length: topic.imageCount }, (_, i) => ({
  image: `img-${i + 1}.jpg`,
  prompt: topic.prompt || ''
}));
```
This ensures the carousel modal works identically for both formats. All topics share the same prompt in legacy mode.

## Files to Modify

| File | Changes |
|------|---------|
| `knowledge.html` | Remove search input and `#load-more-sentinel`; simplify filter bar markup (add "Show All" button); rename grid container class from `grid-3` to `cover-grid` |
| `css/style.css` | Remove `.topic-card` styles, `.gallery-grid` styles, `.search-bar` styles; add `.cover-grid`, `.cover-card` styles; add carousel styles (`.carousel`, `.carousel__slide`, `.carousel__arrow`, `.carousel__dot`, etc.); add skeleton loading placeholder; update tag filter bar styles |
| `js/app.js` | Rewrite `Topics.renderCard()` for cover cards; rewrite `Modal.renderContent()` / `Modal.renderGallery()` for carousel with navigation (arrows, keyboard, touch, dots); add image preloading logic; remove `Search` text search module entirely; remove infinite scroll sentinel observer; update `Topics.buildTagList()` to include "Show All" button; add carousel state management; update copy-to-clipboard with legacy fallback |
| `data/topics.json` | Migrate to `pages[]` array format; remove `prompt`, `imageCount`, `featured` fields |

## Files to Remove After Completion

| File | Reason |
|------|--------|
| `preview-options.html` | Design exploration artifact |
| `preview-reader.html` | Design exploration artifact |
| `preview-carousel.html` | Design exploration artifact |

## i18n Keys

### New keys to add

| Key | EN | ZH |
|-----|----|----|
| `knowledge.filter.all` | `All` | `全部` |
| `knowledge.pages` | `pages` | `页` |
| `carousel.prompt.label` | `PROMPT` | `提示词` |
| `carousel.prompt.copy` | `Copy` | `复制` |
| `carousel.prompt.copied` | `Copied!` | `已复制!` |
| `carousel.hint` | `← → arrow keys or swipe` | `← → 方向键或滑动` |

### Keys to remove
- Any search-related keys (none currently exist as dedicated keys)

## Responsive Behavior

- **Desktop (>1024px)**: 4-5 columns, modal max-width 720px
- **Tablet (768-1024px)**: 3 columns, modal fills more width
- **Mobile (<768px)**: 2 columns, modal nearly full-screen, swipe-primary navigation, arrow buttons smaller (32px)

## Accessibility

- Cover cards: `role="button"`, `tabindex="0"`, `aria-label="Open {title}"`
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap
- Carousel: arrow buttons with `aria-label="Previous page"` / `"Next page"`, dots with `aria-label="Go to page N"`
- Tag filters: `role="group"`, individual buttons with `aria-pressed`
- Reduced motion: respect `prefers-reduced-motion` — disable slide animation, use instant switch
