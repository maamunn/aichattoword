/**
 * Article Reader Renderer — AI Chat to Word
 * Reads ?slug= from the URL, finds the article in BLOG_ARTICLES,
 * renders the content, updates SEO meta tags, and builds a Table of Contents.
 */
(function () {
    'use strict';

    if (typeof BLOG_ARTICLES === 'undefined') return;

    function getSlug() {
        var params = new URLSearchParams(window.location.search);
        return params.get('slug') || window.BLOG_TEST_SLUG || '';
    }

    function findArticle(slug) {
        for (var i = 0; i < BLOG_ARTICLES.length; i++) {
            if (BLOG_ARTICLES[i].slug === slug) return BLOG_ARTICLES[i];
        }
        return null;
    }

    function setMeta(id, attr, value) {
        var el = document.getElementById(id);
        if (el) el.setAttribute(attr, value);
    }

    function slugify(text, index) {
        var base = text.toLowerCase()
            .replace(/<[^>]*>/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        return base ? base + '-' + index : 'section-' + index;
    }

    function showNotFound() {
        var body = document.getElementById('article-body');
        var notFound = document.getElementById('article-not-found');
        var tocWrapper = document.getElementById('article-toc-wrapper');
        var footerBar = document.getElementById('article-footer-bar');
        if (body) body.classList.add('hidden');
        if (tocWrapper) tocWrapper.classList.add('hidden');
        if (footerBar) footerBar.classList.add('hidden');
        if (notFound) notFound.classList.remove('hidden');
        document.title = 'Article Not Found — AI Chat to Word Blog';
    }

    var slug = getSlug();
    var article = findArticle(slug);

    if (!article) {
        showNotFound();
        return;
    }

    /* ---------- SEO meta tags ---------- */
    document.title = article.title + ' — AI Chat to Word Blog';
    setMeta('meta-description', 'content', article.excerpt);
    setMeta('og-title', 'content', article.title);
    setMeta('og-description', 'content', article.excerpt);
    setMeta('twitter-title', 'content', article.title);
    setMeta('twitter-description', 'content', article.excerpt);
    setMeta('canonical-link', 'href', 'https://aichattoword.github.io/article.html?slug=' + encodeURIComponent(article.slug));

    /* ---------- JSON-LD Article schema ---------- */
    var schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title,
        'description': article.excerpt,
        'author': {
            '@type': 'Person',
            'name': 'Md. Mamunur Rashid',
            'email': 'maamun.work@gmail.com'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'AI Chat to Word',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://aichattoword.github.io/images/logo.png'
            }
        },
        'datePublished': article.isoDate || '',
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': 'https://aichattoword.github.io/article.html?slug=' + encodeURIComponent(article.slug)
        }
    };
    var schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(schema);
    document.head.appendChild(schemaScript);

    /* ---------- Header fields ---------- */
    var titleEl = document.getElementById('article-title');
    var categoryEl = document.getElementById('article-category');
    var dateEl = document.getElementById('article-date');
    var readTimeEl = document.getElementById('article-reading-time');
    var breadcrumbEl = document.getElementById('breadcrumb-title');

    if (titleEl) titleEl.textContent = article.title;
    if (categoryEl) categoryEl.textContent = article.category;
    if (dateEl) dateEl.textContent = article.date;
    if (readTimeEl) readTimeEl.innerHTML = '<i class="far fa-clock mr-1"></i>' + article.readingTime;
    if (breadcrumbEl) breadcrumbEl.textContent = article.title;

    /* ---------- Body content ---------- */
    var body = document.getElementById('article-body');
    if (body) body.innerHTML = article.content;

    /* ---------- Table of Contents (from h2 headings) ---------- */
    var tocWrapper = document.getElementById('article-toc-wrapper');
    var tocList = document.getElementById('article-toc');

    if (body && tocWrapper && tocList) {
        var headings = body.querySelectorAll('h2');
        if (headings.length >= 2) {
            var items = [];
            headings.forEach(function (h, i) {
                var id = slugify(h.textContent, i);
                h.id = id;
                items.push(
                    '<li>' +
                    '<a href="#' + id + '" class="text-slate-600 hover:text-primary-600 transition-colors inline-flex items-start">' +
                    '<i class="fas fa-angle-right text-primary-400 mt-0.5 mr-2 text-xs"></i>' +
                    '<span>' + h.textContent + '</span>' +
                    '</a>' +
                    '</li>'
                );
            });
            tocList.innerHTML = items.join('');
            tocWrapper.classList.remove('hidden');
        }
    }

    /* ---------- Related Articles (internal linking) ---------- */
    if (article.related && article.related.length) {
        var related = article.related
            .map(function (s) { return findArticle(s); })
            .filter(Boolean);

        if (related.length && body) {
            var cards = related.map(function (r) {
                return '' +
                '<a href="article.html?slug=' + encodeURIComponent(r.slug) + '" class="group block bg-white rounded-xl border border-slate-200 hover:border-primary-300 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-0.5">' +
                    '<span class="inline-block text-[11px] font-semibold uppercase tracking-wider text-primary-600 mb-1.5">' + r.category + '</span>' +
                    '<span class="block text-sm font-bold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">' + r.title + '</span>' +
                    '<span class="block text-xs text-slate-400 mt-2"><i class="far fa-clock mr-1"></i>' + r.readingTime + '</span>' +
                '</a>';
            }).join('');

            var relatedSection = document.createElement('section');
            relatedSection.className = 'mt-14 pt-10 border-t border-slate-200';
            relatedSection.innerHTML =
                '<h2 class="text-xl font-extrabold text-slate-900 mb-6">' +
                '<i class="fas fa-link text-primary-500 mr-2"></i>Related Articles</h2>' +
                '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">' + cards + '</div>';

            var footerBar = document.getElementById('article-footer-bar');
            if (footerBar && footerBar.parentNode) {
                footerBar.parentNode.insertBefore(relatedSection, footerBar);
            } else {
                body.appendChild(relatedSection);
            }
        }
    }
})();
