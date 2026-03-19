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
    articlesPath: 'data/articles.json',
    pageSize:     12,
    lazyThreshold: 0.1,
  };

  /* -----------------------------------------------------------
     State (knowledge page)
  ----------------------------------------------------------- */
  const state = {
    allTopics:      [],
    filteredTopics: [],
    activeTags:     new Set(),
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
        'nav.articles':  'Articles',
        'nav.projects':  'Projects',
        'nav.knowledge': 'Knowledge',

        // Hero
        'hero.name':      'HoopyAI',
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
        'about.title':   'About',
        'about.lead':    'I build AI systems that actually ship — not just clever demos.',
        'about.body1':   'I came to AI from software engineering: TypeScript-first, focused on <span class="text-hl text-hl--ochre">what actually works in production</span>. Agents that don\'t hallucinate their way into disaster. Pipelines that retrieve the right context. Tools that real people want to use.',
        'about.callout': 'My approach: every hobby becomes a product. Learning French → a language learning app. Loving classical Chinese poetry → an AI poetry companion. Making content → a SKILL for that workflow. <strong>Build in public, iterate in public.</strong>',
        'about.body2':   'This site is both portfolio and notebook. The <span class="text-hl text-hl--cobalt">Knowledge Hub</span> is where I document AI ideas visually — every entry has AI-generated images and the exact prompts behind them.',
        'about.stat1':   'AI Projects',
        'about.stat2':   'Knowledge Topics',
        'about.stat3':   'Prompts explored',
        'skills.title':  'What I Build',
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

        // Articles page
        'page.articles.eyebrow': 'Blog',
        'page.articles.title':   '<span class="grad-text">Articles</span>',
        'page.articles.desc':    "Thoughts on AI engineering, vibe coding, and building in public — written from the trenches of shipping real projects.",
        'articles.filter.all': 'All',
        'articles.readmore': 'Read more',

        // Knowledge page
        'page.knowledge.eyebrow': 'AI Concepts &amp; Prompts',
        'page.knowledge.title':   'Knowledge <span class="grad-text">Hub</span>',
        'page.knowledge.desc':    'Visual explainers for AI topics — each entry has a gallery of AI-generated images and the prompts that created them. Click any card to explore.',
        'knowledge.filter.all': 'All',
        'knowledge.pages': 'pages',
        'carousel.prompt.label': 'PROMPT',
        'carousel.prompt.copy': 'Copy',
        'carousel.prompt.copied': 'Copied!',
        'carousel.hint': '← → arrow keys or swipe',

        // Homepage sections
        'home.articles.title': 'Latest Articles',
        'home.articles.viewAll': 'View all \u2192',
        'home.articles.a1.title': 'Why I chose TypeScript to build AI Agents',
        'home.articles.a1.tags': 'TypeScript, AI Agents',
        'home.articles.a1.excerpt': 'Type safety, rich ecosystem, first-class async \u2014 why TypeScript is my weapon of choice for building production AI agent systems.',
        'home.articles.a2.title': 'From scratch: Building a knowledge base with RAG',
        'home.articles.a2.tags': 'RAG, LLM',
        'home.articles.a2.excerpt': 'A practical guide to building a RAG-based knowledge base from zero \u2014 embedding strategies, chunking, retrieval optimization, and real-world pitfalls.',
        'home.articles.a3.title': 'Vibe Coding practical guide',
        'home.articles.a3.tags': 'Vibe Coding, Productivity',
        'home.articles.a3.excerpt': 'How to develop in flow state with AI assistants \u2014 workflows, prompting strategies, and tips for staying in the zone while shipping fast.',

        'home.projects.title': 'Featured Projects',
        'home.projects.viewAll': 'View all \u2192',
        'home.projects.p1.desc': 'AI-powered French learning app \u2014 conversation practice and smart flashcards.',
        'home.projects.p1.status': 'WIP',
        'home.projects.p2.name': 'Content Creation SKILL',
        'home.projects.p2.desc': 'Claude Code skill for structured Chinese social media content creation.',
        'home.projects.p2.status': 'Active',
        'home.projects.p3.name': 'Chinese Poetry AI Tool',
        'home.projects.p3.desc': 'AI companion for classical Chinese poetry \u2014 appreciation, analysis, and creation.',
        'home.projects.p3.status': 'Planning',

        'home.knowledge.title': 'Knowledge Hub',
        'home.knowledge.viewAll': 'Explore more \u2192',
        'home.knowledge.desc': 'AI concept comics \u2014 visual explainers for AI technology with AI-generated illustrations and the prompts behind them.',
        'home.knowledge.t1': 'Neural Networks',
        'home.knowledge.t2': 'Transformers',
        'home.knowledge.t3': 'Diffusion Models',
        'home.knowledge.t4': 'AI Agents',

        'home.about.title': 'About',
        'home.about.body': 'I\'m an <strong>AI engineer</strong> who came from software engineering \u2014 TypeScript-first, obsessed with what actually works in production. Every hobby becomes a product: learning French spawned a language learning app, loving classical poetry led to an AI poetry tool, and content creation became a Claude Code SKILL. <strong>Build in public, iterate in public.</strong>',

        'about.subtitle': 'Who I am & what I care about',
        'about.philosophy.title': 'Philosophy',
        'about.philosophy.lead': 'I build AI systems that actually ship — not just clever demos.',
        'about.philosophy.body': "I came to AI from software engineering: TypeScript-first, focused on what actually works in production. Agents that don't hallucinate their way into disaster. Pipelines that retrieve the right context. Tools that real people want to use.",
        'about.focus.title': 'Current Focus',
        'about.focus.parlez': 'French Learning App',
        'about.focus.wip': 'WIP',
        'about.focus.content': 'Content Creation SKILL',
        'about.focus.active': 'Active',
        'about.focus.poetry': 'Chinese Poetry AI Tool',
        'about.focus.planning': 'Planning',
        'skills.subtitle': 'My approach to AI engineering',
        'skills.agents.title': 'TypeScript Agents',
        'skills.agents.desc': 'End-to-end AI workflows that integrate seamlessly with existing systems. Built with type safety and production reliability in mind.',
        'skills.llm.title': 'LLM Pipelines',
        'skills.llm.desc': 'RAG systems, prompt optimization, and model orchestration. Focus on accuracy, cost efficiency, and real-world performance.',
        'skills.tools.title': 'AI Tools',
        'skills.tools.desc': 'User-facing applications that solve real problems. From language learning to content creation, built for actual humans.',
      },

      zh: {
        // Nav
        'nav.home':      '主页',
        'nav.articles':  '文章',
        'nav.projects':  '项目',
        'nav.knowledge': '知识库',

        // Hero
        'hero.name':      '潦草虎皮AI说',
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
        'about.title':   '关于',
        'about.lead':    '我构建真正能用的 AI 系统，不只是看起来好看的 demo。',
        'about.body1':   '我从软件工程走入 AI 领域：TypeScript 优先，执着于<span class="text-hl text-hl--ochre">真正在生产环境中有效的东西</span>。不乱幻觉的 Agent，检索到正确上下文的 Pipeline，真实用户愿意用的工具。',
        'about.callout': '我的方式：每个爱好都变成一个产品。学法语 → 法语学习应用。爱古诗词 → AI 古诗词伴侣。做内容 → 内容创作 SKILL。<strong>公开构建，公开迭代。</strong>',
        'about.body2':   '这个网站既是作品集，也是笔记本。<span class="text-hl text-hl--cobalt">知识库</span>是我用视觉方式记录 AI 想法的地方 —— 每个条目都有 AI 生成的图片和背后完整的 Prompt。',
        'about.stat1':   'AI 项目',
        'about.stat2':   '知识主题',
        'about.stat3':   '探索过的 Prompt',
        'skills.title':  '我在做什么',
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

        // Articles page
        'page.articles.eyebrow': '博客',
        'page.articles.title':   '<span class="grad-text">文章</span>',
        'page.articles.desc':    '关于 AI 工程、vibe coding 和公开构建的思考——来自交付真实项目的一线经验。',
        'articles.filter.all': '全部',
        'articles.readmore': '阅读全文',

        // Knowledge page
        'page.knowledge.eyebrow': 'AI 概念 &amp; Prompt',
        'page.knowledge.title':   '知识 <span class="grad-text">库</span>',
        'page.knowledge.desc':    'AI 主题的视觉解读 —— 每个条目有 AI 生成的图片集和创建它们的 Prompt。点击任意卡片探索。',
        'knowledge.filter.all': '全部',
        'knowledge.pages': '页',
        'carousel.prompt.label': '提示词',
        'carousel.prompt.copy': '复制',
        'carousel.prompt.copied': '已复制!',
        'carousel.hint': '← → 方向键或滑动',

        // Homepage sections
        'home.articles.title': '最新文章',
        'home.articles.viewAll': '查看全部 \u2192',
        'home.articles.a1.title': '为什么我选择 TypeScript 来构建 AI Agent',
        'home.articles.a1.tags': 'TypeScript, AI Agent',
        'home.articles.a1.excerpt': '类型安全、丰富生态、原生异步 —— 为什么 TypeScript 是我构建生产级 AI Agent 系统的首选武器。',
        'home.articles.a2.title': '从零开始：用 RAG 构建知识库',
        'home.articles.a2.tags': 'RAG, LLM',
        'home.articles.a2.excerpt': '从零搭建基于 RAG 的知识库实战指南 —— 嵌入策略、分块方案、检索优化，以及真实场景中的坑。',
        'home.articles.a3.title': 'Vibe Coding 实践指南',
        'home.articles.a3.tags': 'Vibe Coding, 效率',
        'home.articles.a3.excerpt': '如何与 AI 助手一起进入心流开发 —— 工作流、Prompt 策略，以及快速交付的同时保持专注的技巧。',

        'home.projects.title': '精选项目',
        'home.projects.viewAll': '查看全部 \u2192',
        'home.projects.p1.desc': 'AI 驱动的法语学习应用 —— 对话练习和智能闪卡。',
        'home.projects.p1.status': '开发中',
        'home.projects.p2.name': '自媒体创作 SKILL',
        'home.projects.p2.desc': '基于 Claude Code 的中文自媒体内容结构化创作工具。',
        'home.projects.p2.status': '已上线',
        'home.projects.p3.name': '中文古诗词 AI 工具',
        'home.projects.p3.desc': '古诗词 AI 伴侣 —— 赏析、解读与创作。',
        'home.projects.p3.status': '规划中',

        'home.knowledge.title': '知识库',
        'home.knowledge.viewAll': '探索更多 \u2192',
        'home.knowledge.desc': 'AI 概念漫画 —— 用视觉方式解读 AI 技术，配有 AI 生成的插画和背后的 Prompt。',
        'home.knowledge.t1': '神经网络',
        'home.knowledge.t2': 'Transformer',
        'home.knowledge.t3': '扩散模型',
        'home.knowledge.t4': 'AI Agent',

        'home.about.title': '关于',
        'home.about.body': '我是一名<strong>AI 工程师</strong>，从软件工程走入 AI 领域 —— TypeScript 优先，执着于真正在生产环境中有效的东西。每个爱好都会变成一个产品：学法语催生了语言学习应用，爱古诗词导向了 AI 诗词工具，做内容变成了 Claude Code SKILL。<strong>公开构建，公开迭代。</strong>',

        'about.title': '关于',
        'about.subtitle': '我是谁，在乎什么',
        'about.philosophy.title': '理念',
        'about.philosophy.lead': '我构建真正能用的 AI 系统，不只是看起来好看的 demo。',
        'about.philosophy.body': '我从软件工程走入 AI 领域：TypeScript 优先，执着于真正在生产环境中有效的东西。不乱幻觉的 Agent，检索到正确上下文的 Pipeline，真实用户愿意用的工具。',
        'about.focus.title': '正在构建',
        'about.focus.parlez': '法语学习应用',
        'about.focus.wip': '开发中',
        'about.focus.content': '自媒体创作 SKILL',
        'about.focus.active': '已上线',
        'about.focus.poetry': '中文古诗词 AI 工具',
        'about.focus.planning': '规划中',
        'skills.title': '我在做什么',
        'skills.subtitle': 'AI 工程方法论',
        'skills.agents.title': 'TypeScript Agent',
        'skills.agents.desc': '端到端 AI 工作流，无缝集成现有系统。注重类型安全和生产可靠性。',
        'skills.llm.title': 'LLM 应用',
        'skills.llm.desc': 'RAG 系统、Prompt 优化、模型编排。聚焦准确性、成本效率和真实场景表现。',
        'skills.tools.title': 'AI 工具',
        'skills.tools.desc': '解决真实问题的用户端应用。从语言学习到内容创作，为真实用户而构建。',
      },
    },

    init() {
      // Priority: URL ?lang= param > localStorage > default 'zh'
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      this.current = (urlLang === 'en' || urlLang === 'zh')
        ? urlLang
        : (localStorage.getItem('hoopyai-lang') || 'zh');
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
      const map  = { home: 'index.html', articles: 'articles.html', projects: 'projects.html', knowledge: 'knowledge.html' };
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
    gridEl: null,

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

    onTagToggle(btn) {
      const tag = btn.dataset.tag;
      const barEl = document.getElementById('filter-bar');

      if (tag === '__all') {
        state.activeTags.clear();
        barEl.querySelectorAll('.filter-bar__btn').forEach(b => {
          const span = b.querySelector('.tag');
          span.classList.remove('tag--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.querySelector('.tag').classList.add('tag--active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
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

      const img = article.querySelector('img[data-src]');
      if (img) {
        img.addEventListener('error', () => {
          img.outerHTML = `<div class="cover-card__skeleton"></div>`;
        });
        LazyLoad.observe(img);
      }

      const openModal = () => Modal.open(topic.id);
      article.addEventListener('click', openModal);
      article.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });

      requestAnimationFrame(() => Animate.init());
      return article;
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

        projects.forEach((project, i) => {
          this.gridEl.appendChild(this.renderCard(project, i));
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

    renderCard(project, index = 0) {
      const isZh = I18n.current === 'zh';
      const title = isZh ? (project.titleZh || project.title) : project.title;
      const desc  = isZh ? (project.descriptionZh || project.description) : project.description;

      const article = document.createElement('article');
      const colorClass = `project-card--c${(index % 5) + 1}`;
      article.className = `card project-card ${colorClass} reveal`;

      // Tag colors for variety
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
        <div class="project-card__preview" aria-hidden="true">
          ${Projects.previewIcon(project)}
        </div>
        <div class="project-card__body">
          <div class="project-card__header">
            <h3 class="project-card__title">${escHtml(title)}</h3>
            ${badgeHtml}
          </div>
          <p class="project-card__desc">${escHtml(desc)}</p>
          <div class="project-card__tags">${tagsHtml}</div>
          <div class="project-card__actions">
            ${githubBtn}
            ${liveBtn}
          </div>
        </div>
      `;

      return article;
    },

    previewIcon(project) {
      const tag = (project.tags || [])[0] || '';
      const icons = {
        typescript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M13 9v6"/></svg>`,
        llm:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>`,
        claude:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,3 22,21 2,21"/><line x1="12" y1="10" x2="12" y2="15"/></svg>`,
        javascript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12v4a2 2 0 004 0M15 12v6"/></svg>`,
        agents:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M17 14l2 2 4-4"/></svg>`,
      };
      return icons[tag] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M8 8h5M8 16h6"/></svg>`;
    },
  };

  /* -----------------------------------------------------------
     Modal — knowledge topic detail overlay
  ----------------------------------------------------------- */
  const Modal = {
    overlayEl: null,
    modalEl:   null,
    prevFocus: null,
    currentSlide: 0,
    totalSlides: 0,
    currentPages: [],
    currentTopicId: null,
    touchStartX: 0,
    touchStartY: 0,

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

    open(topicId) {
      const topic = state.allTopics.find(t => t.id === topicId);
      if (!topic || !this.overlayEl) return;

      this.prevFocus = document.activeElement;
      document.body.style.overflow = 'hidden';

      this.currentPages = getPages(topic);
      this.totalSlides = this.currentPages.length;
      this.currentSlide = 0;
      this.currentTopicId = topic.id;

      this.renderContent(topic);
      this.overlayEl.classList.add('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'false');

      if (this.currentPages.length > 0) this.preloadImage(topic.id, 0);
      if (this.currentPages.length > 1) this.preloadImage(topic.id, 1);

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

    preloadImage(topicId, index) {
      if (index < 0 || index >= this.currentPages.length) return;
      const img = new Image();
      img.src = `images/topics/${topicId}/${this.currentPages[index].image}`;
    },

    renderContent(topic) {
      const titleEl = this.overlayEl.querySelector('.modal__title');
      const bodyEl  = this.overlayEl.querySelector('.modal__body');
      if (titleEl) titleEl.textContent = topic.title;

      const pages = this.currentPages;
      const tagColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];
      const tagsHtml = (topic.tags || [])
        .map((t, i) => `<span class="tag ${tagColors[i % tagColors.length]}">${t}</span>`)
        .join('');

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

      const dotsHtml = pages.map((_, i) =>
        `<button class="carousel__dot${i === 0 ? ' active' : ''}" data-dot="${i}" aria-label="Go to page ${i + 1}"></button>`
      ).join('');

      bodyEl.innerHTML = `
        <div class="carousel">
          <div class="carousel__viewport">
            <button class="carousel__arrow carousel__arrow--left" aria-label="Previous page">&#8249;</button>
            <div class="carousel__track">${slidesHtml}</div>
            <button class="carousel__arrow carousel__arrow--right" aria-label="Next page">&#8250;</button>
          </div>
          <div class="carousel__footer">
            <div class="carousel__dots">${dotsHtml}</div>
            <span class="carousel__counter">1 / ${pages.length}</span>
          </div>
        </div>
        <div class="carousel__tags">${tagsHtml}</div>
        <div class="carousel__hint">
          <kbd>&#8592;</kbd> <kbd>&#8594;</kbd> ${I18n.t('carousel.hint')}
        </div>
      `;

      this.loadSlideImage(0);
      this.wireCarousel(topic.id);
      if (this.modalEl) this.modalEl.scrollTop = 0;
    },

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

    wireCarousel(topicId) {
      const bodyEl = this.overlayEl.querySelector('.modal__body');

      const prevBtn = bodyEl.querySelector('.carousel__arrow--left');
      const nextBtn = bodyEl.querySelector('.carousel__arrow--right');
      prevBtn.addEventListener('click', () => this.goToSlide(this.currentSlide - 1, topicId));
      nextBtn.addEventListener('click', () => this.goToSlide(this.currentSlide + 1, topicId));

      bodyEl.querySelectorAll('.carousel__dot').forEach(dot => {
        dot.addEventListener('click', () => this.goToSlide(Number(dot.dataset.dot), topicId));
      });

      bodyEl.querySelectorAll('.carousel__copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.promptIndex);
          const text = this.currentPages[idx]?.prompt || '';
          this.copyToClipboard(text, btn);
        });
      });

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

      this.loadSlideImage(index);
      this.preloadImage(topicId, index + 1);
      this.preloadImage(topicId, index - 1);

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
     Articles — blog card rendering + reading modal
  ----------------------------------------------------------- */
  const articlesState = {
    allArticles:      [],
    filteredArticles: [],
    activeTags:       new Set(),
  };

  const Articles = {
    gridEl: null,

    async init() {
      this.gridEl = document.getElementById('articles-grid');
      if (!this.gridEl) return;

      this.gridEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

      try {
        const data = await Data.fetch(config.articlesPath);
        articlesState.allArticles      = data.articles || [];
        articlesState.filteredArticles  = [...articlesState.allArticles];

        this.buildTagList();
        this.renderGrid();
      } catch (err) {
        console.error(err);
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">Could not load articles</p>
            <p>${err.message}</p>
          </div>`;
      }
    },

    renderGrid() {
      this.gridEl.innerHTML = '';
      if (articlesState.filteredArticles.length === 0) {
        this.gridEl.innerHTML = `
          <div class="empty-state">
            <p class="empty-state__title">No articles found</p>
            <p>Try adjusting your filters.</p>
          </div>`;
        return;
      }
      articlesState.filteredArticles.forEach(article => {
        this.gridEl.appendChild(this.renderCard(article));
      });
      Animate.init();
    },

    buildTagList() {
      const barEl = document.getElementById('articles-filter-bar');
      if (!barEl) return;
      const tagCounts = {};
      articlesState.allArticles.forEach(a => {
        (a.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
      const filterColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];

      let html = `<button class="filter-bar__btn" data-tag="__all" aria-pressed="true">
        <span class="tag tag--active">${I18n.t('articles.filter.all')}</span>
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

    onTagToggle(btn) {
      const tag = btn.dataset.tag;
      const barEl = document.getElementById('articles-filter-bar');

      if (tag === '__all') {
        articlesState.activeTags.clear();
        barEl.querySelectorAll('.filter-bar__btn').forEach(b => {
          const span = b.querySelector('.tag');
          span.classList.remove('tag--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.querySelector('.tag').classList.add('tag--active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        const allBtn = barEl.querySelector('[data-tag="__all"]');
        if (allBtn) {
          allBtn.querySelector('.tag').classList.remove('tag--active');
          allBtn.setAttribute('aria-pressed', 'false');
        }

        if (articlesState.activeTags.has(tag)) {
          articlesState.activeTags.delete(tag);
          btn.querySelector('.tag').classList.remove('tag--active');
          btn.setAttribute('aria-pressed', 'false');
        } else {
          articlesState.activeTags.add(tag);
          btn.querySelector('.tag').classList.add('tag--active');
          btn.setAttribute('aria-pressed', 'true');
        }

        if (articlesState.activeTags.size === 0 && allBtn) {
          allBtn.querySelector('.tag').classList.add('tag--active');
          allBtn.setAttribute('aria-pressed', 'true');
        }
      }

      this.applyFilters();
    },

    applyFilters() {
      const tags = articlesState.activeTags;
      articlesState.filteredArticles = articlesState.allArticles.filter(article => {
        if (tags.size === 0) return true;
        const articleTags = new Set(article.tags || []);
        for (const t of tags) {
          if (!articleTags.has(t)) return false;
        }
        return true;
      });
      this.renderGrid();
    },

    renderCard(article) {
      const isZh = I18n.current === 'zh';
      const title   = isZh ? (article.titleZh   || article.title)   : article.title;
      const excerpt = isZh ? (article.excerptZh  || article.excerpt) : article.excerpt;
      const readTime = isZh ? (article.readTimeZh || article.readTime) : article.readTime;

      const tagColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];
      const tagsHtml = (article.tags || [])
        .map((t, i) => `<span class="tag ${tagColors[i % tagColors.length]}">${t}</span>`)
        .join('');

      const el = document.createElement('article');
      el.className = 'article-card card reveal';
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', title);

      el.innerHTML = `
        <div class="article-card__tags">${tagsHtml}</div>
        <h3 class="article-card__title">${escHtml(title)}</h3>
        <div class="article-card__meta">
          <time datetime="${article.date}">${formatDate(article.date)}</time>
          <span class="article-card__sep">&middot;</span>
          <span>${escHtml(readTime)}</span>
        </div>
        <p class="article-card__excerpt">${escHtml(excerpt)}</p>
      `;

      const openArticle = () => ArticleModal.open(article);
      el.addEventListener('click', openArticle);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArticle(); }
      });

      return el;
    },
  };

  /* -----------------------------------------------------------
     ArticleModal — reading overlay for articles
  ----------------------------------------------------------- */
  const ArticleModal = {
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

    open(article) {
      if (!this.overlayEl) return;
      const isZh = I18n.current === 'zh';

      this.prevFocus = document.activeElement;
      document.body.style.overflow = 'hidden';

      const title    = isZh ? (article.titleZh    || article.title)    : article.title;
      const content  = isZh ? (article.contentZh   || article.content)  : article.content;
      const readTime = isZh ? (article.readTimeZh  || article.readTime) : article.readTime;

      const tagColors = ['tag--cobalt', 'tag--viridian', 'tag--violet', 'tag--ochre', ''];
      const tagsHtml = (article.tags || [])
        .map((t, i) => `<span class="tag ${tagColors[i % tagColors.length]}">${t}</span>`)
        .join('');

      const titleEl = this.overlayEl.querySelector('.modal__title');
      const bodyEl  = this.overlayEl.querySelector('.modal__body');
      if (titleEl) titleEl.textContent = title;

      bodyEl.innerHTML = `
        <div class="article-content">
          <div class="article-content__meta">
            <time datetime="${article.date}">${formatDate(article.date)}</time>
            <span>&middot;</span>
            <span>${escHtml(readTime)}</span>
          </div>
          <div class="article-content__tags">${tagsHtml}</div>
          <div class="article-content__body">${content}</div>
        </div>
      `;

      this.overlayEl.classList.add('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'false');

      const closeBtn = this.overlayEl.querySelector('.modal__close');
      if (closeBtn) closeBtn.focus();
      if (this.modalEl) this.modalEl.scrollTop = 0;
    },

    close() {
      if (!this.overlayEl) return;
      this.overlayEl.classList.remove('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (this.prevFocus) this.prevFocus.focus();
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
     Helpers
  ----------------------------------------------------------- */
  function getPages(topic) {
    return topic.pages || Array.from({ length: topic.imageCount || 0 }, (_, i) => ({
      image: `img-${i + 1}.jpg`,
      prompt: topic.prompt || ''
    }));
  }

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
    }

    if (page === 'articles') {
      ArticleModal.init();
      Articles.init();
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
