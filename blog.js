/**
 * Blog Index Renderer — AI Chat to Word
 * Renders article cards from BLOG_ARTICLES (js/blog-data.js) into #blog-grid.
 */
(function () {
    'use strict';

    var grid = document.getElementById('blog-grid');
    var emptyState = document.getElementById('blog-empty');

    if (!grid || typeof BLOG_ARTICLES === 'undefined') return;

    if (!BLOG_ARTICLES.length) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function cardImage(article) {
        if (article.image) {
            return '<img src="' + escapeHtml(article.image) + '" alt="' + escapeHtml(article.title) + '" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">';
        }
        return '<div class="w-full h-48 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 flex items-center justify-center text-white text-5xl group-hover:scale-105 transition-transform duration-500">' +
            '<i class="fas fa-file-word"></i>' +
            '</div>';
    }

    function cardHtml(article) {
        var url = 'article.html?slug=' + encodeURIComponent(article.slug);
        return '' +
        '<article class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 border border-slate-100 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">' +
            '<a href="' + url + '" class="block overflow-hidden">' +
                cardImage(article) +
            '</a>' +
            '<div class="p-6 flex flex-col flex-1">' +
                '<div class="flex items-center gap-3 mb-3">' +
                    '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">' + escapeHtml(article.category) + '</span>' +
                    '<span class="text-xs text-slate-400">' + escapeHtml(article.readingTime) + '</span>' +
                '</div>' +
                '<h2 class="text-lg font-bold text-slate-900 mb-2 leading-snug">' +
                    '<a href="' + url + '" class="hover:text-primary-600 transition-colors">' + escapeHtml(article.title) + '</a>' +
                '</h2>' +
                '<p class="text-sm text-slate-600 leading-relaxed mb-4 flex-1">' + escapeHtml(article.excerpt) + '</p>' +
                '<div class="flex items-center justify-between pt-4 border-t border-slate-100">' +
                    '<span class="text-xs text-slate-400"><i class="far fa-calendar-alt mr-1"></i>' + escapeHtml(article.date) + '</span>' +
                    '<a href="' + url + '" class="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">' +
                        'Read More <i class="fas fa-arrow-right ml-1.5 text-xs group-hover:translate-x-1 transition-transform"></i>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</article>';
    }

    grid.innerHTML = BLOG_ARTICLES.map(cardHtml).join('');
})();
