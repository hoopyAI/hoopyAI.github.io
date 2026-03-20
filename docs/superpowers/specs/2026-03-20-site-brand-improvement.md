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
- Social: 小红书 "潦草虎皮AI说" (3800+ followers) + GitHub hoopyAI

## Design Changes

### 1. Hero Area Redesign

**Current:** Avatar + "AI 工程师 · 个人建造者" + long bio paragraph + GitHub/LinkedIn/Email

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
- Add slogan as a styled quote between eyebrow and bio
- Bio: concise 3-line description (replaces long paragraph)
- Social links: 小红书 (first, primary) + GitHub only. Remove LinkedIn and Email
- i18n: add English equivalents for all new text

### 2. Homepage Section Reorder

**Current order:** Hero → Articles (fake) → Projects → Knowledge → About

**New order:**
1. **Hero** (redesigned above)
2. **Knowledge Hub Preview** — use real comic cover images from the 4 imported topics (hallucination, mcp, rag, token). Replace the emoji placeholder thumbnails with actual `img-1.webp` covers. CTA: "浏览全部漫画 →" → knowledge.html
3. **Projects** — keep as-is with featured projects. CTA: "查看全部项目 →" → projects.html
4. **Articles** — replace 3 fake articles with 1 real article: "创作工作流". CTA: "阅读全文 →" → articles.html
5. **About** — simplified. Slogan + one sentence + CTA: "来小红书查看更多内容 →" linking to 小红书 profile

### 3. Real Article: "创作工作流"

Create a real article about the AI knowledge comic creation workflow. Source material from:
- `C:\Users\racwang\hoopy\BananaPostCreator\` — guides, prompts
- `C:\Users\racwang\hoopy\PostCreatorSkills\` — prompts, docs

Article structure:
- Title (ZH): "从想法到漫画：我的 AI 知识图文创作工作流"
- Title (EN): "From Idea to Comic: My AI Knowledge Post Creation Workflow"
- Content: How the workflow works — topic research → prompt design → image generation (Nano Banana models) → layout → copywriting → publish to 小红书
- Include code snippets or prompt examples from the actual projects
- Tags: workflow, ai-art, claude-code, content-creation
- Remove the 3 existing fake articles from articles.json, replace with this 1 real article

### 4. Cyber Cat Brand Element

- **Homepage:** Large avatar in Hero (already exists)
- **Footer (all pages):** Add a small cyber cat icon (32x32 or similar) next to the copyright text. Use a cropped/resized version of the avatar image or an inline SVG silhouette

### 5. CTA Pattern

Every homepage section ends with a "view all" style link:

| Section | CTA Text (ZH) | CTA Text (EN) | Link |
|---------|---------------|---------------|------|
| Knowledge | 浏览全部漫画 → | Browse all comics → | knowledge.html |
| Projects | 查看全部项目 → | View all projects → | projects.html |
| Articles | 阅读全文 → | Read more → | articles.html |
| About | 来小红书查看更多内容 → | Follow on Xiaohongshu → | https://www.xiaohongshu.com/user/profile/潦草虎皮AI说 (actual URL TBD) |

### 6. Social Links Update

Remove LinkedIn and Email from:
- `index.html` Hero area
- All footer links across pages

Add 小红书 link to:
- `index.html` Hero area (primary position, before GitHub)
- Footer across all pages

小红书 icon: use a simple SVG or the text "小红书" as fallback

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Hero rewrite, section reorder, real covers, remove fake articles, update social links, add footer cat icon |
| `js/app.js` | Update i18n keys (hero, about, CTA texts), add 小红书 link handling |
| `data/articles.json` | Replace 3 fake articles with 1 real "创作工作流" article |
| `knowledge.html` | Add cat icon to footer |
| `projects.html` | Add cat icon to footer |
| `articles.html` | Add cat icon to footer |
| `css/style.css` | Footer cat icon styles |

## i18n Keys to Add/Update

| Key | ZH | EN |
|-----|----|----|
| `hero.eyebrow` | AI 工程师 · AI 玩家 | AI Engineer · AI Explorer |
| `hero.slogan` | 先潦草再认真，探索和试错是专注的前提 | Start rough, then refine — exploration and trial-and-error are prerequisites for focus |
| `hero.bio` | 白天做 AI Agent 方案，业余用 AI 探索一切有趣的事——画科普漫画、用 Suno 写歌，还喜欢法语和法国文化。每个爱好最终都会变成一个开源项目。 | AI Agent solutions by day, exploring everything interesting with AI by night — knowledge comics, Suno music, and a love for French language and culture. Every hobby eventually becomes an open-source project. |
| `home.knowledge.viewAll` | 浏览全部漫画 → | Browse all comics → |
| `home.about.cta` | 来小红书查看更多内容 → | Follow on Xiaohongshu → |
| `footer.xhs` | 小红书 | Xiaohongshu |

## Out of Scope

- Data highlights (follower counts etc.) — explicitly removed per user request
- English version toggle — stays hidden for now
- Additional articles beyond the workflow one
- 公众号 — not created yet
- Heavy cyber cat decoration (option C) — deferred to future
