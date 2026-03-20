# Site Brand & Content Improvement Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the site as "潦草虎皮AI说" with real content, clear CTAs, cyber cat brand element, and a real article about the creation workflow.

**Architecture:** Static HTML/CSS/JS site. index.html uses inline CSS. Other pages use external css/style.css + js/app.js. i18n via data-i18n attributes.

**Tech Stack:** Vanilla HTML/CSS/JS, JSON data files, i18n system in app.js.

**Spec:** `docs/superpowers/specs/2026-03-20-site-brand-improvement.md`

---

## Chunk 1: Hero Redesign + Social Links

### Task 1: Rewrite Hero area in index.html

**Files:**
- Modify: `index.html` (inline CSS + HTML)
- Modify: `js/app.js` (i18n keys)

- [ ] **Step 1: Update i18n keys in app.js**

In `I18n.translations.en`, update/add:
```js
        'hero.eyebrow':   'AI Engineer · AI Explorer',
        'hero.name':      'HoopyAI',
        'hero.slogan':    'Start rough, then refine — exploration and trial-and-error are prerequisites for focus',
        'hero.bio':       'AI Agent solutions by day, exploring everything interesting with AI by night — knowledge comics, Suno music, and a love for French language and culture. Every hobby eventually becomes an open-source project.',
```

Remove `'hero.titleLine'` key from EN.

In `I18n.translations.zh`, update/add:
```js
        'hero.eyebrow':   'AI 工程师 · AI 玩家',
        'hero.name':      '潦草虎皮AI说',
        'hero.slogan':    '先潦草再认真，探索和试错是专注的前提',
        'hero.bio':       '白天做 AI Agent 方案，业余用 AI 探索一切有趣的事——画科普漫画、用 Suno 写歌，还喜欢法语和法国文化。每个爱好最终都会变成一个开源项目。',
```

Remove `'hero.titleLine'` key from ZH.

- [ ] **Step 2: Add hero__slogan and social-link--xhs CSS in index.html inline styles**

Add after `.hero__eyebrow` block:
```css
    .hero__slogan {
      font-size: 1rem;
      font-style: italic;
      color: var(--text-muted);
      margin-bottom: var(--spacing-md);
    }
```

Add after `.social-link--email:hover` block:
```css
    .social-link--xhs {
      font-size: 0.85rem;
    }
    .social-link--xhs:hover {
      border-color: #fe2c55;
      box-shadow: 0 8px 24px rgba(254, 44, 85, 0.2);
      color: #fe2c55;
    }
```

- [ ] **Step 3: Rewrite Hero HTML**

Replace the entire `<div class="hero__content">` block with:

```html
          <div class="hero__content">
            <p class="hero__eyebrow" data-i18n="hero.eyebrow">AI Engineer · AI Explorer</p>

            <h1 class="hero__name" data-i18n="hero.name">潦草虎皮AI说</h1>

            <p class="hero__slogan" data-i18n="hero.slogan">
              先潦草再认真，探索和试错是专注的前提
            </p>

            <p class="hero__bio" data-i18n="hero.bio">
              白天做 AI Agent 方案，业余用 AI 探索一切有趣的事——画科普漫画、用 Suno 写歌，还喜欢法语和法国文化。每个爱好最终都会变成一个开源项目。
            </p>

            <div class="hero__links" role="list">
              <span class="social-link social-link--xhs" role="listitem">
                小红书：潦草虎皮AI说
              </span>
              <a href="https://github.com/hoopyAI" target="_blank" rel="noopener noreferrer"
                 class="social-link social-link--github" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
```

Note: 小红书 is a `<span>` not `<a>` (no link, just text display). Remove the LinkedIn and Email `<a>` elements entirely. Also remove the `.social-link--linkedin` and `.social-link--email` CSS rules from inline styles.

- [ ] **Step 4: Remove hero__title-line CSS**

Delete the `.hero__title-line` block from inline styles.

- [ ] **Step 5: Commit**

```bash
git add index.html js/app.js
git commit -m "feat: rebrand Hero with slogan, new bio, 小红书 social link"
```

---

## Chunk 2: Homepage Section Reorder + Real Covers

### Task 2: Reorder sections and update knowledge preview with real covers

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Reorder HTML sections**

Move sections so the order is: Hero → Knowledge → Projects → Articles → About. Currently: Hero → Articles → Projects → Knowledge → About.

Cut the Knowledge section (section 4) and paste it after the first `<hr class="section-divider">` (right after Hero). Then move Articles section after Projects.

- [ ] **Step 2: Replace knowledge preview emoji placeholders with real cover images**

Replace the 4 `<a class="knowledge-thumb">` blocks. Each currently has emoji + label. Replace with real cover images:

```html
        <div class="knowledge-preview-grid">
          <a href="knowledge.html" class="knowledge-thumb">
            <img src="images/topics/hallucination/img-1.webp" alt="AI 幻觉" style="width:100%;height:100%;object-fit:cover;">
          </a>
          <a href="knowledge.html" class="knowledge-thumb">
            <img src="images/topics/mcp/img-1.webp" alt="什么是 MCP" style="width:100%;height:100%;object-fit:cover;">
          </a>
          <a href="knowledge.html" class="knowledge-thumb">
            <img src="images/topics/rag/img-1.webp" alt="RAG 全解析" style="width:100%;height:100%;object-fit:cover;">
          </a>
          <a href="knowledge.html" class="knowledge-thumb">
            <img src="images/topics/token/img-1.webp" alt="什么是 Token" style="width:100%;height:100%;object-fit:cover;">
          </a>
        </div>
```

Remove the `.knowledge-thumb__placeholder`, `.knowledge-thumb__icon`, `.knowledge-thumb__label` CSS rules (no longer needed). Remove `display:flex; align-items:center; justify-content:center;` from `.knowledge-thumb` since it now holds an `<img>`.

- [ ] **Step 3: Update knowledge preview i18n labels**

In `js/app.js`, update EN translations:
```js
        'home.knowledge.t1': 'AI Hallucination',
        'home.knowledge.t2': 'What is MCP',
        'home.knowledge.t3': 'RAG Explained',
        'home.knowledge.t4': 'What is Token',
```

In ZH translations:
```js
        'home.knowledge.t1': '大模型的「幻觉」是怎么回事？',
        'home.knowledge.t2': '什么是 MCP',
        'home.knowledge.t3': 'RAG 全解析',
        'home.knowledge.t4': '什么是 Token',
```

(Note: these labels are no longer shown in HTML since we replaced text with images, but keep them for accessibility alt text if needed later.)

- [ ] **Step 4: Update Articles section to single article preview**

Replace the 3 fake article preview cards with 1 real one:

```html
        <div class="article-preview-grid">
          <a href="articles.html" class="card article-preview-card">
            <div class="article-preview__tags">
              <span class="tag">workflow</span>
              <span class="tag tag--blue">claude-code</span>
              <span class="tag tag--yellow">ai-art</span>
            </div>
            <h3 class="article-preview__title" data-i18n="home.articles.a1.title">From Idea to Comic: My AI Knowledge Post Creation Workflow</h3>
            <div class="article-preview__meta">
              <time datetime="2026-03-20">2026-03-20</time>
              <span>&middot;</span>
              <span>10 min</span>
            </div>
            <p class="article-preview__excerpt" data-i18n="home.articles.a1.excerpt">How I use Claude Code + Gemini to turn AI topics into hand-drawn style knowledge comics — from topic research to publishing on Xiaohongshu.</p>
          </a>
        </div>
```

Update i18n keys:
- EN: `'home.articles.a1.title': 'From Idea to Comic: My AI Knowledge Post Creation Workflow'`
- ZH: `'home.articles.a1.title': '从想法到漫画：我的 AI 知识图文创作工作流'`
- EN: `'home.articles.a1.excerpt': 'How I use Claude Code + Gemini to turn AI topics into hand-drawn style knowledge comics — from topic research to publishing on Xiaohongshu.'`
- ZH: `'home.articles.a1.excerpt': '我如何用 Claude Code + Gemini 把 AI 话题变成达芬奇手绘风知识漫画——从选题研究到发布小红书的完整流程。'`

Remove old `home.articles.a2.*` and `home.articles.a3.*` i18n keys.

- [ ] **Step 5: Update About section with CTA**

Replace the About section content:

```html
    <!-- 5. About (simplified) -->
    <section class="section section--alt">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title" data-i18n="home.about.title">About</h2>
        </div>

        <p class="about-brief" data-i18n="home.about.body">
          「先潦草再认真，探索和试错是专注的前提」—— 在小红书搜索「潦草虎皮AI说」查看更多内容。
        </p>
      </div>
    </section>
```

Update i18n:
- ZH: `'home.about.body': '「先潦草再认真，探索和试错是专注的前提」—— 在小红书搜索「潦草虎皮AI说」查看更多内容。'`
- EN: `'home.about.body': '"Start rough, then refine — exploration and trial-and-error are prerequisites for focus." — Search "潦草虎皮AI说" on Xiaohongshu for more content.'`

- [ ] **Step 6: Update meta description**

Change `<meta name="description">` to:
```html
<meta name="description" content="潦草虎皮AI说 — AI 工程师，用漫画讲 AI 知识，用代码把爱好变成产品">
```

- [ ] **Step 7: Commit**

```bash
git add index.html js/app.js
git commit -m "feat: reorder homepage sections, real knowledge covers, single real article preview"
```

---

## Chunk 3: Footer Brand Element + Copyright

### Task 3: Add cyber cat to footer across all pages

**Files:**
- Modify: `index.html` (inline footer)
- Modify: `knowledge.html`, `projects.html`, `articles.html` (footer HTML)
- Modify: `css/style.css` (footer cat styles)
- Modify: `js/app.js` (footer.copy i18n)

- [ ] **Step 1: Add .footer__cat CSS to style.css**

Add in the footer section:
```css
.footer__cat {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
```

- [ ] **Step 2: Also add .footer__cat to index.html inline styles**

Same CSS as above, add to the inline `<style>` block.

- [ ] **Step 3: Update footer HTML in index.html**

```html
  <footer class="footer">
    <div class="container footer__inner">
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="images/avatar/avatar.jpg" alt="" class="footer__cat">
        <p class="footer__copy" data-i18n="footer.copy">© 2026 潦草虎皮AI说 — crafted with ink & inference</p>
      </div>
      <nav class="footer__links" aria-label="Footer links">
        <a href="https://github.com/hoopyAI" target="_blank" rel="noopener noreferrer" class="footer__link">GitHub</a>
        <a href="articles.html" class="footer__link" data-i18n="nav.articles">Articles</a>
        <a href="projects.html" class="footer__link" data-i18n="nav.projects">Projects</a>
        <a href="knowledge.html" class="footer__link" data-i18n="nav.knowledge">Knowledge</a>
      </nav>
    </div>
  </footer>
```

- [ ] **Step 4: Update footer HTML in knowledge.html, projects.html, articles.html**

Same pattern — add `<img src="images/avatar/avatar.jpg" alt="" class="footer__cat">` before the copyright text in each page's footer. Wrap in a flex container.

- [ ] **Step 5: Update footer.copy i18n**

EN: `'footer.copy': '© 2026 潦草虎皮AI说 — crafted with ink & inference'`
ZH: `'footer.copy': '© 2026 潦草虎皮AI说 — 用墨水与推理构建'`

- [ ] **Step 6: Commit**

```bash
git add index.html knowledge.html projects.html articles.html css/style.css js/app.js
git commit -m "feat: add cyber cat to footer, update copyright to 2026 潦草虎皮AI说"
```

---

## Chunk 4: Real Article Content

### Task 4: Write the "创作工作流" article and update articles.json

**Files:**
- Modify: `data/articles.json`

- [ ] **Step 1: Replace articles.json with real article**

The implementer should read source material from:
- `C:\Users\racwang\hoopy\BananaPostCreator\guides\prompt-guide-zh.md`
- `C:\Users\racwang\hoopy\PostCreatorSkills\docs\knowledge-base\` (all .md files)

Write a real article about the creation workflow. Key points to cover:

**Title:** "从想法到漫画：我的 AI 知识图文创作工作流"

**Content structure (ZH):**
1. 开头：我为什么做 AI 知识漫画（小红书科普，达芬奇手绘风）
2. 工具链：Claude Code Skill（sketch-post）+ Google Gemini 3.1 Flash Image（Nano Banana 2 模型）
3. 五阶段工作流：选题 → 深度研究 → 内容结构 → Prompt 设计 → 图片生成
4. Prompt 设计的三层结构：风格前缀（固定）→ 页面内容 → 排版指令
5. 展示一个真实 prompt 片段作为示例
6. 整个流程零成本（Google AI Studio 免费额度）

Replace the entire `articles.json` with 1 real article containing full HTML content in both `content` and `contentZh` fields. Tags: `["workflow", "ai-art", "claude-code", "content-creation"]`. Date: `2026-03-20`. Read time: `10 min` / `10 分钟`.

- [ ] **Step 2: Commit**

```bash
git add data/articles.json
git commit -m "feat: replace fake articles with real '创作工作流' article"
```

---

## Chunk 5: Cleanup

### Task 5: Remove unused code and verify

- [ ] **Step 1: Remove unused i18n keys**

Remove from both EN and ZH in app.js:
- `hero.titleLine`
- `hero.cta1`, `hero.cta2`
- `now.header`, `now.item1.*`, `now.item2.*`, `now.item3.*`
- `home.articles.a2.*`, `home.articles.a3.*`
- Old `about.philosophy.*`, `about.focus.*` keys that are no longer used in index.html
- `skills.agents.*`, `skills.llm.*`, `skills.tools.*`, `skills.subtitle` (old skills section removed)

- [ ] **Step 2: Remove unused CSS from index.html inline styles**

Remove: `.social-link--linkedin`, `.social-link--email`, `.hero__title-line`, `.knowledge-thumb__placeholder`, `.knowledge-thumb__icon`, `.knowledge-thumb__label`

- [ ] **Step 3: Verify all pages load correctly**

Open each page at localhost:8080 and check for JS console errors:
- index.html — Hero, knowledge covers, single article, about, footer cat
- articles.html — single real article, click to read
- projects.html — 5 projects in Chinese
- knowledge.html — 4 real topics with covers

- [ ] **Step 4: Commit**

```bash
git add index.html js/app.js
git commit -m "chore: remove unused i18n keys and CSS from brand update"
```
