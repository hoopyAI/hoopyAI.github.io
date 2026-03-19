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

## Grid Layout

### Cover Cards
- **Aspect ratio**: 3:4 (portrait, matches comic page format)
- **Grid**: `repeat(auto-fill, minmax(200px, 1fr))` with ~20px gap
- **Card content**: Full-bleed cover image (first page of comic as thumbnail)
- **Overlay**: Bottom gradient with title + page count, always visible
- **Hover state**: Card lifts (`translateY(-6px)`), shadow deepens, tags fade in
- **Tags**: Hidden by default, appear on hover with `opacity` transition

### Tag Filter Bar
- Positioned above the grid, below the page header
- Horizontal row of tag buttons extracted from all topics
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
- **Left/right arrow buttons**: Circular buttons on either side of image
- **Keyboard**: ← → arrow keys
- **Touch**: Swipe left/right (50px threshold)
- **Dots**: Clickable, active dot is elongated pill shape
- **Counter**: "3 / 8" format, tabular-nums

### Animation
- Slide transition: `fadeSlide` (opacity + translateX), ~300ms ease
- Arrow buttons disabled at first/last page

### Prompt Display
- Below the image, inside a subtle card (`rgba` background + border)
- Label: "PROMPT" in uppercase, accent color
- Copy button: top-right of prompt card
- Font: monospace (`JetBrains Mono`)

### Other
- Tags displayed below carousel
- Keyboard hint at bottom
- ESC or click backdrop to close
- Body scroll locked while open
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
  "featured": true,
  "pages": [
    { "image": "img-1.jpg", "prompt": "A luminous neural network diagram..." },
    { "image": "img-2.jpg", "prompt": "Close-up of a single neuron activating..." },
    { "image": "img-3.jpg", "prompt": "Backpropagation visualized as waves..." }
  ]
}
```

- `prompt` (single string) and `imageCount` removed
- `pages` array added: each entry has `image` filename and `prompt` string
- Image path resolved as `images/topics/{id}/{image}`
- Cover image = `pages[0].image`
- Backward compat: if `pages` is absent, fall back to old `imageCount` + single `prompt` behavior

## Files to Modify

| File | Changes |
|------|---------|
| `knowledge.html` | Remove search input, simplify filter bar markup |
| `css/style.css` | Replace `.topic-card` styles with `.cover-card` styles; replace `.modal__body` / `.gallery-grid` with carousel styles; add tag filter bar styles |
| `js/app.js` | Rewrite `Topics.renderCard()` for cover cards; rewrite `Modal.renderContent()` / `Modal.renderGallery()` for carousel; add carousel navigation (arrows, keyboard, touch, dots); remove `Search.init()` text search; update filter logic |
| `data/topics.json` | Migrate to `pages[]` array format |

## Files to Remove After Completion

| File | Reason |
|------|--------|
| `preview-options.html` | Design exploration artifact |
| `preview-reader.html` | Design exploration artifact |
| `preview-carousel.html` | Design exploration artifact |

## i18n Considerations

- Remove search-related translation keys
- Add carousel-related keys if any UI text needs translation (e.g., "pages", copy button text)
- Tag filter label may need translation

## Responsive Behavior

- **Desktop (>1024px)**: 4-5 columns, modal max-width 720px
- **Tablet (768-1024px)**: 3 columns, modal fills more width
- **Mobile (<768px)**: 2 columns, modal nearly full-screen, swipe-primary navigation, arrow buttons smaller or hidden

## Accessibility

- Cover cards: `role="button"`, `tabindex="0"`, `aria-label`
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap
- Carousel: arrow buttons with `aria-label`, dots with `aria-label`
- Tag filters: `role="group"`, `aria-pressed` on buttons
- Reduced motion: respect `prefers-reduced-motion` for slide animations
