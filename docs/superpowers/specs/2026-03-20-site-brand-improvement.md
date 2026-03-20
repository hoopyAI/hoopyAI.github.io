# Site Brand & Content Improvement — 潦草虎皮AI说

## Overview

Improve the website's identity, content depth, and action guidance. Shift from generic "AI engineer portfolio" to a branded creator site with real content, clear CTAs, and the cyber cat as a recurring brand element.

## Target Audience

- Primary (Chinese): content consumers — people interested in AI knowledge, coming from 小红书 or search
- Secondary (future English): technical peers — developers interested in tools and workflows

## Brand Identity

- Name: 潦草虎皮AI说
- Slogan: 「先潦草再认真，探索和试错是专注的前提」
- Positioning: AI engineer by day, AI explorer by night — comics, music, languages, and every hobby becomes a project
- Mascot: Cyber cat (images/avatar/avatar.jpg)
- Social: 小红书 "潦草虎皮AI说" + GitHub hoopyAI
- 小红书 URL: `https://www.xiaohongshu.com/user/profile/67b0243d000000000303040b` (to be confirmed by user before implementation — if unknown, use `#` placeholder and flag for user to fill in)

## Design Changes

### 1. Hero Area Redesign

**Current:** Avatar + "AI 工程师 · 个人建造者" + `hero__title-line` + long bio paragraph + GitHub/LinkedIn/Email

**New:**
```
[Cyber cat avatar]

潦草虎皮AI说

AI 工程师 · AI 玩家

「先潦草再认真，探索和试错是专注的前提」

白天做 AI Agent 方案，业余用 AI 探索一切有趣的事——
画科普漫画、用 Suno 写歌，还喜欢法语和法国文化。
每个爱好最终都会变成一个开源项目。

[小红书]  [GitHub]
```

Changes:
- Eyebrow: "AI 工程师 · AI 玩家" (replaces "AI 工程师 · 个人建造者")
- **Remove** `hero__title-line` element and its i18n key `hero.titleLine` — replaced by slogan
- Add slogan as `hero__slogan` — styled as a subtle quote (italic, slightly muted color, `font-size: 1rem`)
- Bio: concise 3-line description using `hero__bio` with `data-i18n-html` (replaces long paragraph)
- Social links: 小红书 (first, primary) + GitHub only. **Remove** LinkedIn and Email buttons
- 小红书 button: use class `social-link social-link--xhs`. Text label "小红书". No SVG icon needed — text-only is fine since 小红书 has no standard open-source icon
- `social-link--xhs` hover style: `border-color: #fe2c55; color: #fe2c55; box-shadow: 0 8px 24px rgba(254, 44, 85, 0.2)` (小红书 brand red)
- i18n: add English equivalents for all new text
- Note: all Hero styles are inline in `index.html` `<style>` block, not in `css/style.css`

### 2. Homepage Section Reorder

**Current order:** Hero → Articles (fake) → Projects → Knowledge → About

**New order:**
1. **Hero** (redesigned above)
2. **Knowledge Hub Preview** — replace emoji placeholder thumbnails with real cover images from the 4 imported topics. Use `<img>` elements with `src="images/topics/{id}/img-1.webp"`. Update `.knowledge-thumb` CSS in the inline `<style>` block: remove flex centering, add `img { width:100%; height:100%; object-fit:cover; }`. Update labels and i18n keys to match real topic titles. CTA: "浏览全部漫画 →" → knowledge.html
3. **Projects** — keep as-is with featured projects. CTA: "查看全部项目 →" → projects.html
4. **Articles** — replace 3 fake articles with 1 real article: "创作工作流". CTA: "阅读全文 →" → articles.html (the list page — single article is fine as it will be the only item)
5. **About** — simplified. Slogan + one sentence + CTA: "来小红书查看更多内容 →" linking to 小红书 profile

### 3. Real Article: "创作工作流"

Create a real article about the AI knowledge comic creation workflow. The implementer should read source material from these directories to write authentic content:
- `C:\Users\racwang\hoopy\BananaPostCreator\` — guides, prompts
- `C:\Users\racwang\hoopy\PostCreatorSkills\` — prompts, docs, output examples

Article structure:
- Title (ZH): "从想法到漫画：我的 AI 知识图文创作工作流"
- Title (EN): "From Idea to Comic: My AI Knowledge Post Creation Workflow"
- Content: How the workflow works — topic research → prompt design → image generation (Nano Banana models) → layout → copywriting → publish to 小红书
- Include code snippets or prompt examples from the actual projects
- Tags: workflow, ai-art, claude-code, content-creation
- Remove the 3 existing fake articles from articles.json, replace with this 1 real article

### 4. Cyber Cat Brand Element

- **Homepage:** Large avatar in Hero (already exists)
- **Footer (all pages):** Add a small cyber cat image (32x32 `<img>` element using `images/avatar/avatar.jpg` with `border-radius: 50%`) next to the copyright text. Style class: `.footer__cat` with `width: 32px; height: 32px; border-radius: 50%; object-fit: cover;`. Add to `css/style.css` for knowledge/projects/articles pages, and to inline `<style>` for index.html.

### 5. CTA Pattern

Every homepage section ends with a "view all" style link:

| Section | CTA Text (ZH) | CTA Text (EN) | Link |
|---------|---------------|---------------|------|
| Knowledge | 浏览全部漫画 → | Browse all comics → | knowledge.html |
| Projects | 查看全部项目 → | View all projects → | projects.html |
| Articles | 阅读全文 → | Read more → | articles.html |
| About | 来小红书查看更多内容 → | Follow on Xiaohongshu → | (小红书 profile URL) |

### 6. Social Links Update

Remove LinkedIn and Email from:
- `index.html` Hero social links
- Footer links across all pages (if present)

Add 小红书 link to:
- `index.html` Hero area (primary position, before GitHub)
- Footer across all pages (text link "小红书")

### 7. Knowledge Hub Preview — Updated Labels & i18n

Replace current placeholder labels with real topic data:

| Key | Current (wrong) | New ZH | New EN |
|-----|-----------------|--------|--------|
| `home.knowledge.t1` | Neural Networks | 大模型的「幻觉」是怎么回事？ | AI Hallucination |
| `home.knowledge.t2` | Transformers | 什么是 MCP | What is MCP |
| `home.knowledge.t3` | Diffusion Models | RAG 全解析 | RAG Explained |
| `home.knowledge.t4` | AI Agents | 什么是 Token | What is Token |

### 8. Meta Description Update

Update `<meta name="description">` in `index.html` to:
- ZH: "潦草虎皮AI说 — AI 工程师，用漫画讲 AI 知识，用代码把爱好变成产品"
- EN (fallback): "潦草虎皮AI说 — AI engineer sharing knowledge through comics and turning hobbies into open-source projects"

### 9. Footer Copyright Update

Update `footer.copy` i18n key from "2025 HoopyAI" to "2026 潦草虎皮AI说".

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Hero rewrite (inline styles + HTML), section reorder, real knowledge covers, remove fake articles section (replace with single article preview), update social links, add footer cat icon, update meta description. Note: homepage CSS is inline in `<style>` block |
| `js/app.js` | Update i18n keys (hero.eyebrow, hero.slogan, hero.bio, hero.titleLine removal, knowledge labels, about CTA, footer.copy year/name), add social-link--xhs i18n |
| `data/articles.json` | Replace 3 fake articles with 1 real "创作工作流" article |
| `knowledge.html` | Add cat icon to footer, update footer copyright |
| `projects.html` | Add cat icon to footer, update footer copyright |
| `articles.html` | Add cat icon to footer, update footer copyright |
| `css/style.css` | Add `.footer__cat` styles, add `.social-link--xhs` hover styles (for non-index pages if needed) |

## i18n Keys to Add/Update

| Key | ZH | EN |
|-----|----|----|
| `hero.eyebrow` | AI 工程师 · AI 玩家 | AI Engineer · AI Explorer |
| `hero.slogan` | 先潦草再认真，探索和试错是专注的前提 | Start rough, then refine — exploration and trial-and-error are prerequisites for focus |
| `hero.name` | 潦草虎皮AI说 | HoopyAI |
| `hero.bio` | (see section 1 for full ZH text) | (see section 1 for full EN text) |
| `home.knowledge.t1` | 大模型的「幻觉」是怎么回事？ | AI Hallucination |
| `home.knowledge.t2` | 什么是 MCP | What is MCP |
| `home.knowledge.t3` | RAG 全解析 | RAG Explained |
| `home.knowledge.t4` | 什么是 Token | What is Token |
| `home.knowledge.viewAll` | 浏览全部漫画 → | Browse all comics → |
| `home.about.cta` | 来小红书查看更多内容 → | Follow on Xiaohongshu → |
| `footer.copy` | © 2026 潦草虎皮AI说 — 用墨水与推理构建 | © 2026 潦草虎皮AI说 — crafted with ink & inference |
| `footer.xhs` | 小红书 | Xiaohongshu |

### Keys to Remove
- `hero.titleLine` — replaced by `hero.slogan`

## Out of Scope

- Data highlights (follower counts etc.) — explicitly removed per user request
- English version toggle — stays hidden for now
- Additional articles beyond the workflow one
- 公众号 — not created yet
- Heavy cyber cat decoration (option C) — deferred to future
- SEO optimization beyond meta description
