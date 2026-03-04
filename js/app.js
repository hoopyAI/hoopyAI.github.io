/* =============================================================
   HoopyAI — app.js
   Single IIFE namespace. Page routing via body[data-page].
   ============================================================= */
(function HoopyAI() {
  'use strict';

  /* -----------------------------------------------------------
     Config
  ----------------------------------------------------------- */
  const config = {
    topicsPath:   'data/topics.json',
    projectsPath: 'data/projects.json',
    pageSize:     12,
    lazyThreshold: 0.1,
    searchDebounce: 250,
  };

  /* -----------------------------------------------------------
     State (knowledge page)
  ----------------------------------------------------------- */
  const state = {
    allTopics:      [],
    filteredTopics: [],
    activeTags:     new Set(),
    searchQuery:    '',
    renderedCount:  0,
  };

  /* -----------------------------------------------------------
     Data — fetch JSON with error handling
  ----------------------------------------------------------- */
  const Data = {
    async fetch(path) {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      return res.json();
    },
  };

  /* -----------------------------------------------------------
     I18n — bilingual toggle (EN / ZH)
  ----------------------------------------------------------- */
  const I18n = {
    current: 'en',

    translations: {
      en: {
        // Nav
        'nav.home':      'Home',
        'nav.projects':  'Projects',
        'nav.knowledge': 'Knowledge',

        // Hero
        'hero.eyebrow':   'AI Engineer · Personal Builder',
        'hero.titleLine': 'Building AI systems from genuine curiosity',
        'hero.bio':       'I build <span class="text-hl text-hl--cobalt">TypeScript agents</span>, <span class="text-hl text-hl--viridian">LLM pipelines</span>, and <span class="text-hl text-hl--violet">AI-powered tools</span> — and I turn every hobby into a product. Vibe coding with Claude before it was cool.',
        'hero.cta1':      'View Projects',
        'hero.cta2':      'Knowledge Hub',

        // Now Building
        'now.header':       'Now Building',
        'now.item1.name':   'Parlez — French Learning App',
        'now.item1.status': 'WIP',
        'now.item2.name':   'Content Creation SKILL',
        'now.item2.status': 'Active',
        'now.item3.name':   'Chinese Poetry AI Tool',
        'now.item3.status': 'Planning',

        // Dividers
        'divider.about':    'de vita &amp; operibus',
        'divider.featured': 'opera selecta',
        'divider.connect':  'epistola',

        // About
        'about.label':   'About',
        'about.title':   'Who I am &amp;<br><em style="color: var(--i-500); font-style:italic;">what I care about</em>',
        'about.lead':    'I build AI systems that actually ship — not just clever demos.',
        'about.body1':   'I came to AI from software engineering: TypeScript-first, focused on <span class="text-hl text-hl--ochre">what actually works in production</span>. Agents that don\'t hallucinate their way into disaster. Pipelines that retrieve the right context. Tools that real people want to use.',
        'about.callout': 'My approach: every hobby becomes a product. Learning French → a language learning app. Loving classical Chinese poetry → an AI poetry companion. Making content → a SKILL for that workflow. <strong>Build in public, iterate in public.</strong>',
        'about.body2':   'This site is both portfolio and notebook. The <span class="text-hl text-hl--cobalt">Knowledge Hub</span> is where I document AI ideas visually — every entry has AI-generated images and the exact prompts behind them.',
        'about.stat1':   'AI Projects',
        'about.stat2':   'Knowledge Topics',
        'about.stat3':   'Prompts explored',
        'skills.title':  'Technologies & tools',
        'skills.ai':     'AI / LLM',
        'skills.lang':   'Languages',
        'skills.infra':  'Tools',
        'skills.gen':    'Generative',

        // Featured
        'featured.label':     'Featured Work',
        'featured.title':     'Selected projects',
        'featured.desc':      "A few things I've built. Full list on the",
        'featured.desc.link': 'projects page',
        'featured.p1.title':  'Parlez',
        'featured.p1.desc':   'AI-powered French learning — conversation practice, smart flashcards, personalized review. Built from genuine obsession with the language.',
        'featured.p2.title':  'Content Creation SKILL',
        'featured.p2.desc':   'A Claude Code skill that structures narratives, adapts tone, and generates drafts for Chinese social media. Powers my own content workflow.',
        'featured.hub.label': 'Knowledge Hub',
        'featured.hub.title': 'AI Concept Galleries',
        'featured.hub.desc':  'Visual explainers for neural networks, transformers, diffusion models — each with AI-generated image galleries and the exact prompts that created them.',

        // Connect
        'connect.label': 'Get in touch',
        'connect.title': "Let's build something",
        'connect.desc':  'Working on an interesting AI problem? Have a project idea or just want to talk agents, LLMs, and vibe coding?',
        'connect.btn':   'Say hello',

        // Footer
        'footer.copy': '© 2025 HoopyAI — crafted with ink &amp; inference',

        // Projects page
        'page.projects.eyebrow': 'Open Source',
        'page.projects.title':   'Vibe-coded <span class="grad-text">Projects</span>',
        'page.projects.desc':    "AI-assisted tools and experiments — built to solve real problems, learn by doing, and push the limits of what's possible with modern AI tooling.",

        // Knowledge page
        'page.knowledge.eyebrow': 'AI Concepts &amp; Prompts',
        'page.knowledge.title':   'Knowledge <span class="grad-text">Hub</span>',
        'page.knowledge.desc':    'Visual explainers for AI topics — each entry has a gallery of AI-generated images and the prompts that created them. Click any card to explore.',
      },

      zh: {
        // Nav
        'nav.home':      '主页',
        'nav.projects':  '项目',
        'nav.knowledge': '知识库',

        // Hero
        'hero.eyebrow':   'AI 工程师 · 个人建造者',
        'hero.titleLine': '用好奇心驱动构建，用 AI 把每个爱好变成产品',
        'hero.bio':       '我做 <span class="text-hl text-hl--cobalt">TypeScript Agent</span>、<span class="text-hl text-hl--viridian">LLM 应用</span>和<span class="text-hl text-hl--violet">AI 工具</span> —— 每个爱好都会变成一个产品。Claude 重度用户，vibe coding 先行者。',
        'hero.cta1':      '查看项目',
        'hero.cta2':      '知识库',

        // Now Building
        'now.header':       '正在构建',
        'now.item1.name':   'Parlez — 法语学习应用',
        'now.item1.status': '开发中',
        'now.item2.name':   '自媒体创作 SKILL',
        'now.item2.status': '已上线',
        'now.item3.name':   '中文古诗词 AI 工具',
        'now.item3.status': '规划中',

        // Dividers
        'divider.about':    'de vita &amp; operibus',
        'divider.featured': 'opera selecta',
        'divider.connect':  'epistola',

        // About
        'about.label':   '关于',
        'about.title':   '我是谁，<br><em style="color: var(--i-500); font-style:italic;">在乎什么</em>',
        'about.lead':    '我构建真正能用的 AI 系统，不只是看起来好看的 demo。',
        'about.body1':   '我从软件工程走入 AI 领域：TypeScript 优先，执着于<span class="text-hl text-hl--ochre">真正在生产环境中有效的东西</span>。不乱幻觉的 Agent，检索到正确上下文的 Pipeline，真实用户愿意用的工具。',
        'about.callout': '我的方式：每个爱好都变成一个产品。学法语 → 法语学习应用。爱古诗词 → AI 古诗词伴侣。做内容 → 内容创作 SKILL。<strong>公开构建，公开迭代。</strong>',
        'about.body2':   '这个网站既是作品集，也是笔记本。<span class="text-hl text-hl--cobalt">知识库</span>是我用视觉方式记录 AI 想法的地方 —— 每个条目都有 AI 生成的图片和背后完整的 Prompt。',
        'about.stat1':   'AI 项目',
        'about.stat2':   '知识主题',
        'about.stat3':   '探索过的 Prompt',
        'skills.title':  '技术栈 &amp; 工具',
        'skills.ai':     'AI / LLM',
        'skills.lang':   '编程语言',
        'skills.infra':  '工具',
        'skills.gen':    '生成式 AI',

        // Featured
        'featured.label':     '精选作品',
        'featured.title':     '代表项目',
        'featured.desc':      '几个我做的东西。完整列表在',
        'featured.desc.link': '项目页面',
        'featured.p1.title':  'Parlez 法语学习',
        'featured.p1.desc':   'AI 驱动的法语学习 —— 对话练习、智能闪卡、个性化复习。源于对法语真实的热爱。',
        'featured.p2.title':  '自媒体创作 SKILL',
        'featured.p2.desc':   '基于 Claude Code 的内容创作 SKILL，支持结构化叙事、适配中文自媒体风格，为我自己的内容工作流提供支持。',
        'featured.hub.label': '知识库',
        'featured.hub.title': 'AI 概念图集',
        'featured.hub.desc':  '神经网络、Transformer、扩散模型等 AI 概念的视觉化解读 —— 配有 AI 生成图片和完整 Prompt。',

        // Connect
        'connect.label': '联系我',
        'connect.title': '一起构建吧',
        'connect.desc':  '在做有趣的 AI 项目？有想法想聊聊？欢迎聊 Agent、LLM 和 vibe coding。',
        'connect.btn':   '发邮件',

        // Footer
        'footer.copy': '© 2025 HoopyAI — 用墨水与推理构建',

        // Projects page
        'page.projects.eyebrow': '开源项目',
        'page.projects.title':   'Vibe-coded <span class="grad-text">项目</span>',
        'page.projects.desc':    '用 AI 辅助构建的工具和实验 —— 解决真实问题，在实践中学习，探索现代 AI 工具的边界。',

        // Knowledge page
        'page.knowledge.eyebrow': 'AI 概念 &amp; Prompt',
        'page.knowledge.title':   '知识 <span class="grad-text">库</span>',
        'page.knowledge.desc':    'AI 主题的视觉解读 —— 每个条目有 AI 生成的图片集和创建它们的 Prompt。点击任意卡片探索。',
      },
    },

    init() {
      // Priority: URL ?lang= param > localStorage > default 'en'
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      this.current = (urlLang === 'en' || urlLang === 'zh')
        ? urlLang
        : (localStorage.getItem('hoopyai-lang') || 'en');
      this.apply();
      const btn = document.querySelector('.lang-toggle');
      if (btn) btn.addEventListener('click', () => this.toggle());
    },

    toggle() {
      // Navigate to same page with / without ?lang=zh  → shareable URLs
      const next = this.current === 'en' ? 'zh' : 'en';
      const url  = new URL(window.location.href);
      if (next === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', 'zh');
      }
      localStorage.setItem('hoopyai-lang', next);
      window.location.href = url.toString();
    },

    apply() {
      const t = this.translations[this.current];
      const isZh = this.current === 'zh';
      document.documentElement.lang = isZh ? 'zh-CN' : 'en';

      // Update toggle button label + title
      const btn = document.querySelector('.lang-toggle');
      if (btn) {
        btn.textContent = isZh ? 'EN' : '中文';
        btn.title = isZh ? 'Switch to English' : '切换为中文';
      }

      // Text replacements
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) el.textContent = t[key];
      });

      // HTML replacements (for content with nested tags)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        if (t[key] !== undefined) el.innerHTML = t[key];
      });
    },

    t(key) {
      return (this.translations[this.current] || {})[key] || key;
    },
  };

  /* -----------------------------------------------------------
     Nav — mobile hamburger + active link
  ----------------------------------------------------------- */
  const Nav = {
    init() {
      const hamburger = document.querySelector('.nav__hamburger');
      const links     = document.querySelector('.nav__links');

      if (hamburger && links) {
        hamburger.addEventListener('click', () => {
          const open = links.classList.toggle('is-open');
          hamburger.classList.toggle('is-open', open);
          hamburger.setAttribute('aria-expanded', String(open));
        });

        // Close drawer on link click
        links.querySelectorAll('.nav__link').forEach(link => {
          link.addEventListener('click', () => {
            links.classList.remove('is-open');
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
          });
        });
      }

      // Active link highlighting
      const page = document.body.dataset.page;
      const map  = { home: 'index.html', projects: 'projects.html', knowledge: 'knowledge.html' };
      const target = map[page] || '';
      document.querySelectorAll('.nav__link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (
          (page === 'home'     && (href === '/' || href === 'index.html' || href.endsWith('index.html'))) ||
          (page !== 'home'     && href.includes(target))
        ) {
          link.classList.add('nav__link--active');
          link.setAttribute('aria-current', 'page');
        }
      });
    },
  };

  /* -----------------------------------------------------------
     Animate — scroll reveal via IntersectionObserver
  ----------------------------------------------------------- */
  const Animate = {
    init() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal--visible'));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    },
  };

  /* -----------------------------------------------------------
     LazyLoad — IntersectionObserver for image src swap
  ----------------------------------------------------------- */
  const LazyLoad = {
    observer: null,

    init() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('img[data-src]').forEach(img => {
          img.src = img.dataset.src;
        });
        return;
      }
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            this.observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px', threshold: config.lazyThreshold });
    },

    observe(img) {
      if (this.observer) this.observer.observe(img);
    },
  };

  /* -----------------------------------------------------------
     Topics — Knowledge Hub card rendering
  ----------------------------------------------------------- */
  const Topics = {
    gridEl:     null,
    sentinelEl: null,
    ioSentinel: null,
    allTagsEl:  null,

    async init() {
      this.gridEl     = document.getElementById('topics-grid');
      this.sentinelEl = document.getElementById('load-more-sentinel');
      this.allTagsEl  = document.getElementById('all-tags');

      if (!this.gridEl) return;

      this.gridEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

      try {
        const data = await Data.fetch(config.topicsPath);
        state.allTopics      = data.topics || [];
        state.filteredTopics = [...state.allTopics];
        state.renderedCount  = 0;

        this.buildTagList();
        this.renderBatch();
        this.initSentinel();
      } catch (err) {
        console.error(err);
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">Could not load topics</p>
            <p>${err.message}</p>
          </div>`;
      }
    },

    buildTagList() {
      if (!this.allTagsEl) return;
      const tagCounts = {};
      state.allTopics.forEach(t => {
        (t.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
      const filterColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];
      this.allTagsEl.innerHTML = sorted.map(([tag], i) => `
        <button class="filter-tag tag ${filterColors[i % filterColors.length]}" data-tag="${tag}" aria-pressed="false">${tag}</button>
      `).join('');

      this.allTagsEl.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', () => Search.onTagToggle(btn));
      });
    },

    renderGrid() {
      state.renderedCount = 0;
      this.gridEl.innerHTML = '';

      if (state.filteredTopics.length === 0) {
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">No topics found</p>
            <p>Try adjusting your search or filters.</p>
          </div>`;
        return;
      }

      this.renderBatch();
    },

    renderBatch() {
      const slice = state.filteredTopics.slice(
        state.renderedCount,
        state.renderedCount + config.pageSize
      );

      slice.forEach(topic => {
        const card = this.renderCard(topic);
        this.gridEl.appendChild(card);
      });

      state.renderedCount += slice.length;
    },

    renderCard(topic) {
      const article = document.createElement('article');
      article.className = 'card topic-card reveal';
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'button');
      article.setAttribute('aria-label', `Open ${topic.title}`);
      article.dataset.topicId = topic.id;

      const thumbSrc = topic.imageCount > 0
        ? `images/topics/${topic.id}/img-1.jpg`
        : null;

      const thumbHtml = thumbSrc
        ? `<div class="topic-card__thumb">
             <img data-src="${thumbSrc}" src="" alt="${topic.title} preview">
           </div>`
        : `<div class="topic-card__thumb topic-card__thumb--placeholder">${Topics.placeholderSvg()}</div>`;

      const topicTagColors = ['tag--cobalt', '', 'tag--viridian', 'tag--violet'];
      const tagsHtml = (topic.tags || [])
        .map((t, i) => `<span class="tag ${topicTagColors[i % topicTagColors.length]}">${t}</span>`)
        .join('');

      const featuredHtml = topic.featured
        ? `<span class="topic-card__featured">★ Featured</span>`
        : '';

      article.innerHTML = `
        ${thumbHtml}
        <div class="topic-card__meta">
          <span class="topic-card__date">${formatDate(topic.date)}</span>
          ${featuredHtml}
        </div>
        <h3 class="topic-card__title">${escHtml(topic.title)}</h3>
        <div class="topic-card__tags">${tagsHtml}</div>
        <p class="topic-card__count"><span>${topic.imageCount || 0}</span> images</p>
      `;

      // Lazy-load the thumbnail + placeholder fallback
      const img = article.querySelector('img[data-src]');
      if (img) {
        img.addEventListener('error', () => {
          const thumb = img.parentElement;
          if (thumb) {
            thumb.classList.add('topic-card__thumb--placeholder');
            thumb.innerHTML = Topics.placeholderSvg();
          }
        });
        LazyLoad.observe(img);
      }

      // Click / keyboard open modal
      const openModal = () => Modal.open(topic.id);
      article.addEventListener('click', openModal);
      article.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });

      // Trigger scroll reveal
      requestAnimationFrame(() => Animate.init());

      return article;
    },

    placeholderSvg() {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>`;
    },

    initSentinel() {
      if (!this.sentinelEl || !('IntersectionObserver' in window)) return;
      this.ioSentinel = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.renderedCount < state.filteredTopics.length) {
          this.renderBatch();
        }
      }, { rootMargin: '300px' });
      this.ioSentinel.observe(this.sentinelEl);
    },
  };

  /* -----------------------------------------------------------
     Projects — project card rendering
  ----------------------------------------------------------- */
  const Projects = {
    gridEl: null,

    async init() {
      this.gridEl = document.getElementById('projects-grid');
      if (!this.gridEl) return;

      this.gridEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

      try {
        const data = await Data.fetch(config.projectsPath);
        const projects = data.projects || [];

        this.gridEl.innerHTML = '';

        if (projects.length === 0) {
          this.gridEl.innerHTML = `
            <div class="empty-state">
              <p class="empty-state__title">No projects yet</p>
              <p>Check back soon.</p>
            </div>`;
          return;
        }

        projects.forEach(project => {
          this.gridEl.appendChild(this.renderCard(project));
        });

        Animate.init();
      } catch (err) {
        console.error(err);
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">Could not load projects</p>
            <p>${err.message}</p>
          </div>`;
      }
    },

    renderCard(project) {
      const article = document.createElement('article');
      article.className = 'card project-card reveal';

      // Alternate tag colors for visual variety
      const tagColors = ['tag--cobalt', 'tag--viridian', '', 'tag--violet', 'tag--ochre'];
      const tagsHtml = (project.tags || [])
        .map((t, i) => `<span class="tag ${tagColors[i % tagColors.length]}">${t}</span>`)
        .join('');

      const status = project.status || 'active';
      const badgeHtml = `<span class="badge badge--${status}">${status === 'wip' ? 'WIP' : status}</span>`;

      const githubBtn = project.githubUrl
        ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost">
            ${iconGithub()} GitHub
           </a>`
        : '';

      const liveBtn = project.liveUrl
        ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
            ${iconExternal()} Live Demo
           </a>`
        : '';

      article.innerHTML = `
        <div class="project-card__header">
          <h3 class="project-card__title">${escHtml(project.title)}</h3>
          ${badgeHtml}
        </div>
        <p class="project-card__desc">${escHtml(project.description)}</p>
        <div class="project-card__tags">${tagsHtml}</div>
        <div class="project-card__actions">
          ${githubBtn}
          ${liveBtn}
        </div>
      `;

      return article;
    },
  };

  /* -----------------------------------------------------------
     Modal — knowledge topic detail overlay
  ----------------------------------------------------------- */
  const Modal = {
    overlayEl: null,
    modalEl:   null,
    prevFocus: null,

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
      });

      const closeBtn = this.overlayEl.querySelector('.modal__close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    },

    open(topicId) {
      const topic = state.allTopics.find(t => t.id === topicId);
      if (!topic || !this.overlayEl) return;

      this.prevFocus = document.activeElement;
      document.body.style.overflow = 'hidden';

      this.renderContent(topic);

      this.overlayEl.classList.add('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'false');

      // Focus the close button
      const closeBtn = this.overlayEl.querySelector('.modal__close');
      if (closeBtn) closeBtn.focus();
    },

    close() {
      if (!this.overlayEl) return;
      this.overlayEl.classList.remove('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (this.prevFocus) this.prevFocus.focus();
    },

    renderContent(topic) {
      const titleEl = this.overlayEl.querySelector('.modal__title');
      const bodyEl  = this.overlayEl.querySelector('.modal__body');

      if (titleEl) titleEl.textContent = topic.title;

      const galleryHtml = this.renderGallery(topic);
      const modalTagColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];
      const tagsHtml = (topic.tags || [])
        .map((t, i) => `<span class="tag ${modalTagColors[i % modalTagColors.length]}">${t}</span>`)
        .join('');

      bodyEl.innerHTML = `
        ${galleryHtml}
        <div class="prompt-section">
          <div class="prompt-section__label">
            <span class="prompt-section__title">Generation Prompt</span>
            <button class="prompt-copy" id="copy-prompt-btn" aria-label="Copy prompt to clipboard">
              ${iconCopy()} Copy
            </button>
          </div>
          <pre class="prompt-text" id="modal-prompt-text">${escHtml(topic.prompt || '')}</pre>
        </div>
        <div class="modal__tags">${tagsHtml}</div>
      `;

      // Wire copy button
      const copyBtn = bodyEl.querySelector('#copy-prompt-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(topic.prompt || '').then(() => {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `${iconCheck()} Copied!`;
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.innerHTML = `${iconCopy()} Copy`;
            }, 2000);
          }).catch(() => {});
        });
      }

      // Scroll modal to top
      if (this.modalEl) this.modalEl.scrollTop = 0;
    },

    renderGallery(topic) {
      if (!topic.imageCount || topic.imageCount === 0) return '';
      const items = [];
      for (let i = 1; i <= topic.imageCount; i++) {
        const src = `images/topics/${topic.id}/img-${i}.jpg`;
        items.push(`
          <div class="gallery-item">
            <img src="${src}" alt="${escHtml(topic.title)} image ${i}"
              onerror="this.parentElement.classList.add('gallery-item--placeholder'); this.parentElement.innerHTML='<span>img-${i}.jpg</span>';">
          </div>
        `);
      }
      return `<div class="gallery-grid">${items.join('')}</div>`;
    },

    trapFocus(e) {
      const focusable = this.modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
  };

  /* -----------------------------------------------------------
     Search — debounced input + tag filter
  ----------------------------------------------------------- */
  const Search = {
    debounceTimer: null,
    inputEl: null,

    init() {
      this.inputEl = document.getElementById('search-input');
      if (!this.inputEl) return;

      this.inputEl.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          state.searchQuery = this.inputEl.value.trim().toLowerCase();
          this.applyFilters();
        }, config.searchDebounce);
      });
    },

    onTagToggle(btn) {
      const tag = btn.dataset.tag;
      if (state.activeTags.has(tag)) {
        state.activeTags.delete(tag);
        btn.classList.remove('tag--active');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        state.activeTags.add(tag);
        btn.classList.add('tag--active');
        btn.setAttribute('aria-pressed', 'true');
      }
      this.applyFilters();
    },

    applyFilters() {
      const q    = state.searchQuery;
      const tags = state.activeTags;

      state.filteredTopics = state.allTopics.filter(topic => {
        // Tag AND logic
        if (tags.size > 0) {
          const topicTags = new Set(topic.tags || []);
          for (const t of tags) {
            if (!topicTags.has(t)) return false;
          }
        }
        // Text search
        if (q) {
          const haystack = [topic.title, ...(topic.tags || [])].join(' ').toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });

      Topics.renderGrid();
    },
  };

  /* -----------------------------------------------------------
     Helpers
  ----------------------------------------------------------- */
  function escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (_) { return dateStr; }
  }

  /* SVG icon helpers (inline, no external deps) */
  function iconGithub() {
    return `<svg class="btn--icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482
        0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462
        -.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832
        .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683
        -.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004
        1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647
        .64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678
        1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12
        c0-5.523-4.477-10-10-10z"/>
    </svg>`;
  }

  function iconExternal() {
    return `<svg class="btn--icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>`;
  }

  function iconCopy() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>`;
  }

  function iconCheck() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;
  }

  /* -----------------------------------------------------------
     Boot — route by body[data-page]
  ----------------------------------------------------------- */
  function boot() {
    const page = document.body.dataset.page || 'home';

    I18n.init();
    Nav.init();
    LazyLoad.init();
    Animate.init();

    if (page === 'knowledge') {
      Modal.init();
      Topics.init();
      Search.init();
    }

    if (page === 'projects') {
      Projects.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
